import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
} from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db } from '../utils/firebase';
import { normalizeEmail } from '../utils/validation';

const buildUserProfile = ({ uid, email }) => {
  const normalizedEmail = normalizeEmail(email);
  const currentDate = new Date();
  const month = currentDate.toLocaleString('default', { month: 'long' });
  const year = currentDate.getFullYear();

  return {
    id: uid,
    email: normalizedEmail,
    name: normalizedEmail.split('@')[0].replace(/[._-]/g, ' '),
    memberSince: `${month} ${year}`,
    joinedDate: `${currentDate.toLocaleString('default', { month: 'short' })} ${year}`,
    photo: `https://i.pravatar.cc/150?u=${encodeURIComponent(normalizedEmail)}`,
    communities: ['FEUP'],
    course: 'Informatics Engineering',
    phone: '+351 912 345 678',
    isPhonePublic: false,
    rating: 5.0,
    reviewsCount: 0,
    totalListings: 0,
    createdAt: currentDate.toISOString(),
  };
};

const getStoredUserProfile = async (uid) => {
  const snapshot = await getDoc(doc(db, 'users', uid));
  return snapshot.exists() ? snapshot.data() : null;
};

const mapAuthErrorToMessage = (error, fallbackMessage) => {
  switch (error.code) {
    case 'auth/email-already-in-use':
      return 'An account with this email already exists. Please log in instead.';
    case 'auth/invalid-email':
      return 'The email address is invalid.';
    case 'auth/weak-password':
      return 'The password is too weak.';
    case 'auth/invalid-credential':
    case 'auth/user-not-found':
    case 'auth/wrong-password':
      return 'We could not find an account with those credentials.';
    case 'auth/too-many-requests':
      return 'Too many failed attempts. Please try again later.';
    default:
      return fallbackMessage;
  }
};

const isSafeFirebaseAuthPhotoUrl = (photo) => (
  typeof photo === 'string' &&
  /^https?:\/\//i.test(photo) &&
  photo.length <= 2048
);

const buildFirebaseAuthUpdates = (cleanData) => {
  const authUpdates = {};

  if (cleanData.name) {
    authUpdates.displayName = cleanData.name;
  }

  // Firebase Auth photoURL is only for short web URLs.
  // Profile photos saved as Firestore data URIs are intentionally skipped here.
  if (isSafeFirebaseAuthPhotoUrl(cleanData.photo)) {
    authUpdates.photoURL = cleanData.photo;
  }

  return authUpdates;
};

export const registerUser = async ({ email, password }) => {
  try {
    const normalizedEmail = normalizeEmail(email);
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      normalizedEmail,
      password,
    );

    const newUserProfile = buildUserProfile({
      uid: userCredential.user.uid,
      email: normalizedEmail,
    });

    await setDoc(doc(db, 'users', userCredential.user.uid), newUserProfile);

    return newUserProfile;
  } catch (error) {
    throw new Error(
      mapAuthErrorToMessage(error, 'Could not create the account. Please try again.'),
    );
  }
};

export const loginUser = async ({ email, password }) => {
  try {
    const normalizedEmail = normalizeEmail(email);

    const userCredential = await signInWithEmailAndPassword(
      auth,
      normalizedEmail,
      password,
    );

    const firebaseUser = userCredential.user;
    const storedProfile = await getStoredUserProfile(firebaseUser.uid);

    return (
      storedProfile ??
      buildUserProfile({
        uid: firebaseUser.uid,
        email: firebaseUser.email ?? normalizedEmail,
      })
    );
  } catch (error) {
    throw new Error(
      mapAuthErrorToMessage(error, 'Could not log in. Please try again.'),
    );
  }
};

export const logoutUser = async () => {
  await signOut(auth);
};

export const subscribeToAuthState = (callback) =>
  onAuthStateChanged(auth, async (firebaseUser) => {
    if (!firebaseUser) {
      callback(null);
      return;
    }

    try {
      const storedProfile = await getStoredUserProfile(firebaseUser.uid);

      callback(
        storedProfile ??
          buildUserProfile({
            uid: firebaseUser.uid,
            email: firebaseUser.email ?? '',
          }),
      );
    } catch (error) {
      console.error('Fatal error while checking the saved user session:', error);
      await signOut(auth);
      callback(null);
    }
  });

export const updateUserAccount = async (userId, data) => {
  try {
    const userDocRef = doc(db, 'users', userId);

    const cleanData = Object.fromEntries(
      Object.entries(data).filter(([, value]) => value !== undefined),
    );

    if (auth.currentUser && auth.currentUser.uid === userId) {
      const authUpdates = buildFirebaseAuthUpdates(cleanData);

      if (Object.keys(authUpdates).length > 0) {
        try {
          await updateProfile(auth.currentUser, authUpdates);
        } catch (authErr) {
          console.warn(
            'Could not update Firebase Auth profile. Firestore profile data will still be saved:',
            authErr,
          );
        }
      }
    }

    await setDoc(userDocRef, cleanData, { merge: true });
  } catch (error) {
    console.error('Firebase Update Error:', error);
    throw new Error('Could not update profile information. Please try again.');
  }
};
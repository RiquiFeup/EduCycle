import { createUserWithEmailAndPassword, updateProfile, signInWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc, updateDoc, getDoc } from 'firebase/firestore';
import { auth, db } from '../utils/firebase';

/**
 * Registers a new user with Firebase Authentication and creates a user document in Firestore.
 * 
 * @param {Object} userData
 * @param {string} userData.email
 * @param {string} userData.password
 * @returns {Promise<Object>} The registered user data
 */
export const registerUser = async ({ email, password }) => {
  try {
    // 1. Create user in Firebase Authentication
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // 2. Prepare user document for Firestore
    const name = email.split('@')[0].replace(/[._-]/g, ' ');
    
    const currentDate = new Date();
    const month = currentDate.toLocaleString('default', { month: 'long' });
    const year = currentDate.getFullYear();
    const formattedDate = `${month} ${year}`;
    const shortDate = `${currentDate.toLocaleString('default', { month: 'short' })} ${year}`;

    const newUserProfile = {
      id: user.uid,
      email: email,
      name: name,
      memberSince: formattedDate,
      joinedDate: shortDate,
      photo: 'https://i.pravatar.cc/150?u=' + encodeURIComponent(email),
      communities: ['FEUP'],
      course: 'Informatics Engineering',
      phone: '+351 912 345 678',
      isPhonePublic: false,
      rating: 5.0,
      reviewsCount: 0,
      totalListings: 0,
      createdAt: currentDate.toISOString(),
    };

    // 3. Save user document to Firestore
    // We use the auth uid as the document ID for consistency
    const userDocRef = doc(db, 'users', user.uid);
    await setDoc(userDocRef, newUserProfile);

    return newUserProfile;

  } catch (error) {
    let errorMessage = 'Could not create the account. Please try again.';
    
    // Handle specific Firebase error codes if desired
    if (error.code === 'auth/email-already-in-use') {
      errorMessage = 'An account with this email already exists. Please log in instead.';
    } else if (error.code === 'auth/invalid-email') {
      errorMessage = 'The email address is invalid.';
    } else if (error.code === 'auth/weak-password') {
      errorMessage = 'The password is too weak.';
    } else {
       console.error("Firebase Auth Error:", error);
    }
    
    throw new Error(errorMessage);
  }
};

/**
 * Updates an existing user's profile information in Firestore and Firebase Auth (if applicable).
 * 
 * @param {string} userId The UID of the user
 * @param {Object} data The profile data to update
 * @returns {Promise<void>}
 */
export const updateUserAccount = async (userId, data) => {
  try {
    const userDocRef = doc(db, 'users', userId);
    
    // We can filter out undefined values just in case
    const cleanData = Object.fromEntries(
      Object.entries(data).filter(([_, v]) => v !== undefined)
    );
    
    // If name or photo changes, we also update it in Firebase auth
    // Note: auth.currentUser might be null if called from another context, but checking is safe
    if (auth.currentUser && auth.currentUser.uid === userId && (cleanData.name || cleanData.photo)) {
      const authUpdates = {};
      if (cleanData.name) authUpdates.displayName = cleanData.name;
      if (cleanData.photo) authUpdates.photoURL = cleanData.photo;
      try {
        await updateProfile(auth.currentUser, authUpdates);
      } catch (authErr) {
        console.warn("Could not update Firebase Auth profile (likely invalid local photo URI), updating Firestore anyway:", authErr);
      }
    }
    
    await updateDoc(userDocRef, cleanData);
  } catch (error) {
    console.error("Firebase Update Error:", error);
    throw new Error('Could not update profile information. Please try again.');
  }
};

/**
 * Logs in an existing user with Firebase Authentication and fetches their profile from Firestore.
 * 
 * @param {Object} userData
 * @param {string} userData.email
 * @param {string} userData.password
 * @returns {Promise<Object>} The fetched user profile data
 */
export const loginUser = async ({ email, password }) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    const userDocRef = doc(db, 'users', user.uid);
    const userDoc = await getDoc(userDocRef);

    if (!userDoc.exists()) {
      throw new Error("We could not find your profile information. Please contact support.");
    }

    return userDoc.data();
  } catch (error) {
    let errorMessage = 'We could not log you in. Please try again.';
    
    if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password' || error.code === 'auth/invalid-credential' || error.code === 'auth/invalid-email') {
      errorMessage = 'We could not find an account with those credentials.';
    } else {
      console.error("Firebase Login Error:", error);
    }
    
    throw new Error(errorMessage);
  }
};

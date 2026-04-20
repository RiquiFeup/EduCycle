import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
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

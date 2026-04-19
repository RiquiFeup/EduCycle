import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getAnalytics } from 'firebase/analytics';

// Replace these placeholders with your actual Firebase project configuration
const firebaseConfig = {

  apiKey: "AIzaSyBbvAuoZQNRN6uSrJAqK3DGHOJVbRewlUg",

  authDomain: "educycle-t3.firebaseapp.com",

  projectId: "educycle-t3",

  storageBucket: "educycle-t3.firebasestorage.app",

  messagingSenderId: "1001303684606",

  appId: "1:1001303684606:web:dc317bb025bca62b1a3caf",

  measurementId: "G-MCK1BT2WV8"

};


// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);

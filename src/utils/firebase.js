import { initializeApp } from 'firebase/app';
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: 'AIzaSyBbvAuoZQNRN6uSrJAqK3DGHOJVbRewlUg',
  authDomain: 'educycle-t3.firebaseapp.com',
  projectId: 'educycle-t3',
  storageBucket: 'educycle-t3.firebasestorage.app',
  messagingSenderId: '1001303684606',
  appId: '1:1001303684606:web:dc317bb025bca62b1a3caf',
  measurementId: 'G-MCK1BT2WV8',
};

const app = initializeApp(firebaseConfig);

export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});

export const db = getFirestore(app);
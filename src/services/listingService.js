import { collection, doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { ref, uploadString, getDownloadURL } from 'firebase/storage';
import { db, storage } from '../utils/firebase';

import * as FileSystem from 'expo-file-system/legacy';

export const createListing = async (listingData, sellerId, photoUris = []) => {
  try {
    // 1. Generate document reference to get listing ID
    const docRef = doc(collection(db, 'listings'));
    const listingId = docRef.id;

    // 2. Process photos (Bypass Firebase Storage -> Save Base64 to Firestore)
    const imageUrls = [];
    for (let i = 0; i < photoUris.length; i++) {
      const uri = photoUris[i];
      
      const base64File = await FileSystem.readAsStringAsync(uri, {
        encoding: 'base64',
      });
      
      // Store the base64 string as a Data URI so the Image component can render it directly
      const dataUri = `data:image/jpeg;base64,${base64File}`;
      imageUrls.push(dataUri);
    }

    // 3. Save listing data to Firestore
    await setDoc(docRef, {
      ...listingData,
      imageUrls,
      sellerId: sellerId,
      status: 'active',
      createdAt: serverTimestamp(),
    });

    return listingId;
  } catch (error) {
    console.error('Error creating listing:', error);
    throw new Error('Não foi possível publicar o anúncio.');
  }
};
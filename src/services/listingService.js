import { collection, doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '../utils/firebase';

export const createListing = async (listingData, sellerId, photoUris = []) => {
  try {
    // 1. Generate document reference to get listing ID
    const docRef = doc(collection(db, 'listings'));
    const listingId = docRef.id;

    // 2. Upload photos to Firebase Storage
    const imageUrls = [];
    for (let i = 0; i < photoUris.length; i++) {
      const uri = photoUris[i];
      const response = await fetch(uri);
      const blob = await response.blob();
      
      const imageRef = ref(storage, `listings/${listingId}/${Date.now()}_${i}`);
      await uploadBytes(imageRef, blob);
      const downloadURL = await getDownloadURL(imageRef);
      imageUrls.push(downloadURL);
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
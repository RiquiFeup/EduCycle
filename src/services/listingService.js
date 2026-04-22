import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../utils/firebase';

export const createListing = async (listingData, sellerId) => {
  try {
    const docRef = await addDoc(collection(db, 'listings'), {
      ...listingData,
      sellerId: sellerId,
      status: 'active',
      createdAt: serverTimestamp(),
    });
    return docRef.id;
  } catch (error) {
    throw new Error('Não foi possível publicar o anúncio.');
  }
};
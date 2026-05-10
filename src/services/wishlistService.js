import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
} from 'firebase/firestore';
import { db } from '../utils/firebase';

const wishlistCollectionRef = (userId) => collection(db, 'users', userId, 'wishlist');
const wishlistDocRef = (userId, listingId) => doc(db, 'users', userId, 'wishlist', listingId);

const cleanValue = (value, fallback = null) => (value === undefined ? fallback : value);

export const normalizeListingForWishlist = (listing) => {
  if (!listing?.id) {
    throw new Error('Invalid listing.');
  }

  return {
    id: String(listing.id),
    listingId: String(listing.id),
    title: cleanValue(listing.title, 'Anúncio sem título'),
    price: cleanValue(listing.price),
    mode: cleanValue(listing.mode ?? listing.listingType?.toLowerCase?.(), 'sell'),
    institution: cleanValue(listing.institution ?? listing.campus, ''),
    campus: cleanValue(listing.campus ?? listing.institution, ''),
    subject: cleanValue(listing.subject),
    isbn: cleanValue(listing.isbn),
    image: cleanValue(listing.image),
    description: cleanValue(listing.description, ''),
    sellerId: cleanValue(listing.sellerId),
    sellerName: cleanValue(listing.sellerName),
    sellerPhoto: cleanValue(listing.sellerPhoto),
    condition: cleanValue(listing.condition),
  };
};

export const getWishlistListings = async (userId) => {
  if (!userId) {
    return [];
  }

  try {
    const wishlistQuery = query(wishlistCollectionRef(userId), orderBy('savedAt', 'desc'));
    const snapshot = await getDocs(wishlistQuery);

    return snapshot.docs.map((wishlistDoc) => ({
      id: wishlistDoc.id,
      ...wishlistDoc.data(),
      isFavourited: true,
    }));
  } catch (error) {
    throw new Error('Não foi possível carregar a wishlist.');
  }
};

export const saveListingToWishlist = async (userId, listing) => {
  if (!userId) {
    throw new Error('Tens de iniciar sessão para guardar anúncios.');
  }

  const wishlistListing = normalizeListingForWishlist(listing);

  try {
    await setDoc(
      wishlistDocRef(userId, wishlistListing.id),
      {
        ...wishlistListing,
        savedAt: serverTimestamp(),
      },
      { merge: true },
    );

    return { ...wishlistListing, isFavourited: true };
  } catch (error) {
    throw new Error('Não foi possível guardar o anúncio na wishlist.');
  }
};

export const removeListingFromWishlist = async (userId, listingId) => {
  if (!userId) {
    throw new Error('Tens de iniciar sessão para alterar a wishlist.');
  }

  if (!listingId) {
    throw new Error('Anúncio inválido.');
  }

  try {
    await deleteDoc(wishlistDocRef(userId, String(listingId)));
  } catch (error) {
    throw new Error('Não foi possível remover o anúncio da wishlist.');
  }
};

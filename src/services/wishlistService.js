import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../utils/firebase';

const userDocRef = (userId) => doc(db, 'users', userId);

const cleanValue = (value, fallback = null) => (value === undefined ? fallback : value);

const getSavedAtValue = (savedAt) => {
  if (!savedAt) {
    return 0;
  }

  if (typeof savedAt?.toMillis === 'function') {
    return savedAt.toMillis();
  }

  if (typeof savedAt === 'number') {
    return savedAt;
  }

  const parsedDate = Date.parse(savedAt);
  return Number.isNaN(parsedDate) ? 0 : parsedDate;
};

const markAsFavourited = (listing) => ({
  ...listing,
  id: String(listing.id ?? listing.listingId),
  listingId: String(listing.listingId ?? listing.id),
  isFavourited: true,
});

const sortWishlist = (listings) =>
  [...listings].sort((a, b) => getSavedAtValue(b.savedAt) - getSavedAtValue(a.savedAt));

const readWishlistFromUserDocument = async (userId) => {
  const snapshot = await getDoc(userDocRef(userId));

  if (!snapshot.exists()) {
    return [];
  }

  const storedWishlist = snapshot.data()?.wishlistListings;

  if (!Array.isArray(storedWishlist)) {
    return [];
  }

  return sortWishlist(storedWishlist.map(markAsFavourited));
};

const updateWishlistInUserDocument = async (userId, updater) => {
  const snapshot = await getDoc(userDocRef(userId));
  const userData = snapshot.exists() ? snapshot.data() : {};
  const currentWishlist = Array.isArray(userData?.wishlistListings)
    ? userData.wishlistListings
    : [];
  const nextWishlist = updater(currentWishlist).map((listing) => ({
    ...listing,
    id: String(listing.id ?? listing.listingId),
    listingId: String(listing.listingId ?? listing.id),
  }));

  await setDoc(userDocRef(userId), { wishlistListings: nextWishlist }, { merge: true });
  return nextWishlist;
};

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

  return readWishlistFromUserDocument(userId);
};

export const saveListingToWishlist = async (userId, listing) => {
  if (!userId) {
    throw new Error('Tens de iniciar sessão para guardar anúncios.');
  }

  const wishlistListing = normalizeListingForWishlist(listing);
  const embeddedListing = {
    ...wishlistListing,
    savedAt: new Date().toISOString(),
  };

  try {
    await updateWishlistInUserDocument(userId, (currentWishlist) => [
      embeddedListing,
      ...currentWishlist.filter((item) => String(item.id ?? item.listingId) !== wishlistListing.id),
    ]);

    return { ...embeddedListing, isFavourited: true };
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

  const normalizedListingId = String(listingId);

  try {
    await updateWishlistInUserDocument(userId, (currentWishlist) =>
      currentWishlist.filter((item) => String(item.id ?? item.listingId) !== normalizedListingId),
    );
  } catch (error) {
    throw new Error('Não foi possível remover o anúncio da wishlist.');
  }
};

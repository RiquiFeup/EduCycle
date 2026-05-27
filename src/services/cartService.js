import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../utils/firebase';

const userDocRef = (userId) => doc(db, 'users', userId);

const cleanValue = (value, fallback = null) => (value === undefined ? fallback : value);

const normalizeImageUrls = (listing) => {
  if (Array.isArray(listing?.imageUrls)) {
    return listing.imageUrls.filter(Boolean);
  }

  if (listing?.image) {
    return [listing.image];
  }

  return [];
};

const getAddedAtValue = (addedAt) => {
  if (!addedAt) {
    return 0;
  }

  if (typeof addedAt?.toMillis === 'function') {
    return addedAt.toMillis();
  }

  const parsedDate = Date.parse(addedAt);
  return Number.isNaN(parsedDate) ? 0 : parsedDate;
};

const sortCart = (listings) =>
  [...listings].sort((a, b) => getAddedAtValue(b.addedAt) - getAddedAtValue(a.addedAt));

const updateCartInUserDocument = async (userId, updater) => {
  const snapshot = await getDoc(userDocRef(userId));
  const userData = snapshot.exists() ? snapshot.data() : {};
  const currentCart = Array.isArray(userData?.cartListings) ? userData.cartListings : [];
  const nextCart = updater(currentCart).map((listing) => ({
    ...listing,
    id: String(listing.id ?? listing.listingId),
    listingId: String(listing.listingId ?? listing.id),
  }));

  await setDoc(userDocRef(userId), { cartListings: nextCart }, { merge: true });
  return nextCart;
};

export const normalizeListingForCart = (listing) => {
  if (!listing?.id) {
    throw new Error('Anúncio inválido.');
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
    image: cleanValue(listing.image ?? listing.imageUrls?.[0]),
    imageUrls: normalizeImageUrls(listing),
    description: cleanValue(listing.description, ''),
    sellerId: cleanValue(listing.sellerId),
    sellerName: cleanValue(listing.sellerName),
    sellerPhoto: cleanValue(listing.sellerPhoto),
    condition: cleanValue(listing.condition),
    status: cleanValue(listing.status, 'active'),
  };
};

export const getCartListings = async (userId) => {
  if (!userId) {
    return [];
  }

  const snapshot = await getDoc(userDocRef(userId));

  if (!snapshot.exists()) {
    return [];
  }

  const storedCart = snapshot.data()?.cartListings;

  if (!Array.isArray(storedCart)) {
    return [];
  }

  return sortCart(storedCart.map((listing) => ({
    ...listing,
    id: String(listing.id ?? listing.listingId),
    listingId: String(listing.listingId ?? listing.id),
  })));
};

export const saveListingToCart = async (userId, listing) => {
  if (!userId) {
    throw new Error('Tens de iniciar sessão para adicionar anúncios ao carrinho.');
  }

  const cartListing = {
    ...normalizeListingForCart(listing),
    addedAt: new Date().toISOString(),
  };

  try {
    await updateCartInUserDocument(userId, (currentCart) => [
      cartListing,
      ...currentCart.filter((item) => String(item.id ?? item.listingId) !== cartListing.id),
    ]);

    return cartListing;
  } catch (error) {
    throw new Error('Não foi possível guardar o anúncio no carrinho.');
  }
};

export const removeListingFromCart = async (userId, listingId) => {
  if (!userId) {
    throw new Error('Tens de iniciar sessão para alterar o carrinho.');
  }

  if (!listingId) {
    throw new Error('Anúncio inválido.');
  }

  const normalizedListingId = String(listingId);

  try {
    await updateCartInUserDocument(userId, (currentCart) =>
      currentCart.filter((item) => String(item.id ?? item.listingId) !== normalizedListingId),
    );
  } catch (error) {
    throw new Error('Não foi possível remover o anúncio do carrinho.');
  }
};

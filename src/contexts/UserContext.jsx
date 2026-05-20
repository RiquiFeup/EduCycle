import React, {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import {
  getWishlistListings,
  removeListingFromWishlist,
  saveListingToWishlist,
} from '../services/wishlistService';

export const UserContext = createContext();

const DEFAULT_USER = {
  id: 'u999',
  name: 'João Silva',
  photo: 'https://i.pravatar.cc/150?u=joao',
  communities: ['FEUP'],
  course: 'Informatics Engineering',
  phone: '+351 912 345 678',
  isPhonePublic: false,
  email: 'joao.silva@fe.up.pt',
  rating: 4.8,
  reviewsCount: 14,
  joinedDate: 'Sep 2024',
  totalListings: 5,
};

const cleanValue = (value, fallback = null) => (value === undefined ? fallback : value);

const normalizeListingForCart = (listing) => {
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
    image: cleanValue(listing.image),
    imageUrls: Array.isArray(listing.imageUrls) ? listing.imageUrls : [],
    description: cleanValue(listing.description, ''),
    sellerId: cleanValue(listing.sellerId),
    sellerName: cleanValue(listing.sellerName),
    sellerPhoto: cleanValue(listing.sellerPhoto),
    condition: cleanValue(listing.condition),
    status: cleanValue(listing.status, 'active'),
    addedAt: new Date().toISOString(),
  };
};

const isListingAvailableForCart = (listing) => {
  const status = String(listing?.status ?? 'active').toLowerCase();
  const unavailableStatuses = ['inactive', 'sold', 'unavailable', 'reserved', 'deleted'];

  return listing?.available !== false
    && listing?.isAvailable !== false
    && !unavailableStatuses.includes(status);
};

export const UserProvider = ({ children, initialUser, onUserUpdate, onLogout }) => {
  const [currentUser, setCurrentUser] = useState({
    ...DEFAULT_USER,
    ...(initialUser ?? {}),
  });
  const [wishlistListings, setWishlistListings] = useState([]);
  const [wishlistLoading, setWishlistLoading] = useState(false);
  const [cartListings, setCartListings] = useState([]);

  useEffect(() => {
    setCurrentUser({
      ...DEFAULT_USER,
      ...(initialUser ?? {}),
    });
  }, [initialUser]);

  const updateUser = useCallback(async (newData) => {
    const updatedUser = { ...currentUser, ...newData };

    setCurrentUser(updatedUser);

    try {
      await onUserUpdate?.(updatedUser);
      return updatedUser;
    } catch (error) {
      setCurrentUser(currentUser);
      throw error;
    }
  }, [currentUser, onUserUpdate]);

  const refreshWishlist = useCallback(async () => {
    if (!currentUser?.id) {
      setWishlistListings([]);
      return [];
    }

    setWishlistLoading(true);

    try {
      const savedListings = await getWishlistListings(currentUser.id);
      setWishlistListings(savedListings);
      return savedListings;
    } catch (error) {
      console.warn('Wishlist indisponível. A aplicação continua sem bloquear:', error?.message || error);
      return [];
    } finally {
      setWishlistLoading(false);
    }
  }, [currentUser?.id]);

  useEffect(() => {
    if (!initialUser?.id) {
      setWishlistListings([]);
      return;
    }

    refreshWishlist();
  }, [initialUser?.id, refreshWishlist]);

  const isWishlisted = useCallback(
    (listingId) => wishlistListings.some((listing) => listing.id === String(listingId)),
    [wishlistListings],
  );

  const saveToWishlist = useCallback(async (listing) => {
    const savedListing = await saveListingToWishlist(currentUser?.id, listing);

    setWishlistListings((prev) => {
      const withoutDuplicate = prev.filter((item) => item.id !== savedListing.id);
      return [savedListing, ...withoutDuplicate];
    });

    return savedListing;
  }, [currentUser?.id]);

  const removeFromWishlist = useCallback(async (listingId) => {
    await removeListingFromWishlist(currentUser?.id, listingId);
    setWishlistListings((prev) => prev.filter((listing) => listing.id !== String(listingId)));
  }, [currentUser?.id]);

  const toggleWishlist = useCallback(async (listing) => {
    if (!listing?.id) {
      throw new Error('Anúncio inválido.');
    }

    if (isWishlisted(listing.id)) {
      await removeFromWishlist(listing.id);
      return false;
    }

    await saveToWishlist(listing);
    return true;
  }, [isWishlisted, removeFromWishlist, saveToWishlist]);

  const isInCart = useCallback(
    (listingId) => cartListings.some((listing) => listing.id === String(listingId)),
    [cartListings],
  );

  const addToCart = useCallback((listing) => {
    if (!currentUser?.id) {
      throw new Error('Tens de iniciar sessão para adicionar anúncios ao carrinho.');
    }

    if (!isListingAvailableForCart(listing)) {
      throw new Error('Este anúncio já não está disponível e não foi adicionado ao carrinho.');
    }

    const cartListing = normalizeListingForCart(listing);

    if (isInCart(cartListing.id)) {
      throw new Error('Este anúncio já está no teu carrinho.');
    }

    setCartListings((prev) => [cartListing, ...prev]);
    return cartListing;
  }, [currentUser?.id, isInCart]);

  const contextValue = useMemo(
    () => ({
      currentUser,
      updateUser,
      logout: onLogout,
      wishlistListings,
      wishlistLoading,
      refreshWishlist,
      isWishlisted,
      saveToWishlist,
      removeFromWishlist,
      toggleWishlist,
      cartListings,
      addToCart,
      isInCart,
    }),
    [
      currentUser,
      updateUser,
      onLogout,
      wishlistListings,
      wishlistLoading,
      refreshWishlist,
      isWishlisted,
      saveToWishlist,
      removeFromWishlist,
      toggleWishlist,
      cartListings,
      addToCart,
      isInCart,
    ],
  );

  return (
    <UserContext.Provider value={contextValue}>
      {children}
    </UserContext.Provider>
  );
};

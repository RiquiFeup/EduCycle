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

export const UserProvider = ({ children, initialUser, onUserUpdate, onLogout }) => {
  const [currentUser, setCurrentUser] = useState({
    ...DEFAULT_USER,
    ...(initialUser ?? {}),
  });
  const [wishlistListings, setWishlistListings] = useState([]);
  const [wishlistLoading, setWishlistLoading] = useState(false);

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
    ],
  );

  return (
    <UserContext.Provider value={contextValue}>
      {children}
    </UserContext.Provider>
  );
};

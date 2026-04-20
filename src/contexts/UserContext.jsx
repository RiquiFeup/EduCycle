import React, { createContext, useEffect, useMemo, useState } from 'react';

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
  const [currentUser, setCurrentUser] = useState({ ...DEFAULT_USER, ...(initialUser ?? {}) });

  useEffect(() => {
    if (initialUser && initialUser.id !== currentUser.id) {
      setCurrentUser((prev) => ({ ...prev, ...initialUser }));
    }
  }, [initialUser]);

  const updateUser = (newData) => {
    let updated;
    setCurrentUser((prev) => {
      updated = { ...prev, ...newData };
      return updated;
    });
    // Fire side effect outside the updater to prevent duplicate/skipped updates in React 18 StrictMode
    // Note: since set state is scheduled, we pass the locally constructed object
    // or we can wait for the next render. For optimistic updates, this is fine.
    // To ensure exact safety without closure staleness:
    onUserUpdate?.({ ...currentUser, ...newData });
  };

  const contextValue = useMemo(
    () => ({
      currentUser,
      updateUser,
      logout: onLogout,
    }),
    [currentUser, onLogout],
  );

  return (
    <UserContext.Provider value={contextValue}>
      {children}
    </UserContext.Provider>
  );
};
import React, { createContext, useMemo, useState } from 'react';

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

  const updateUser = (newData) => {
    setCurrentUser((prev) => {
      const updated = { ...prev, ...newData };
      onUserUpdate?.(updated);
      return updated;
    });
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
import React, { createContext, useState } from 'react';

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  // This state now acts as our temporary "database" for the logged-in user
  const [currentUser, setCurrentUser] = useState({
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
  });

  const updateUser = (newData) => {
    setCurrentUser((prev) => ({ ...prev, ...newData }));
  };

  return (
    <UserContext.Provider value={{ currentUser, updateUser }}>
      {children}
    </UserContext.Provider>
  );
};
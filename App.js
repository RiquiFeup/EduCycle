import React, { useState } from 'react';
import SignupScreen from './src/screens/SignupScreen';
import LoginScreen from './src/screens/LoginScreen';
import WelcomeScreen from './src/screens/WelcomeScreen';
import MainAppScreen from './src/screens/MainAppScreen';
import { normalizeEmail } from './src/utils/validation';
import { registerUser, updateUserAccount, loginUser } from './src/services/authService';

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export default function App() {
  const [screen, setScreen] = useState('welcome');
  const [registeredUsers, setRegisteredUsers] = useState([
    {
      id: 'test-user-1',
      email: 'test@fe.up.pt',
      password: 'password123',
      name: 'João Silva',
      memberSince: 'April 2026',
      joinedDate: 'Apr 2026',
      photo: 'https://i.pravatar.cc/150?u=joao',
      communities: ['FEUP'],
      course: 'Informatics Engineering',
      phone: '+351 912 345 678',
      isPhonePublic: false,
      rating: 5.0,
      reviewsCount: 1,
      totalListings: 2,
    },
  ]);
  const [currentUser, setCurrentUser] = useState(null);

  const handleSignupSuccess = async ({ email, password }) => {
    try {
      // Register with Firebase
      const newUser = await registerUser({ email, password });

      setRegisteredUsers((prev) => [...prev, newUser]);
      setCurrentUser(newUser);
      setScreen('app');
    } catch (error) {
      // Re-throw to be handled by SignupScreen UI
      throw error;
    }
  };

  const handleLoginSuccess = async ({ email, password }) => {
    try {
      const loggedUser = await loginUser({ email, password });
      
      // Optionally sync to local array if needed elsewhere, though real app should rely on DB
      setRegisteredUsers((prev) => {
        const exists = prev.find((u) => u.id === loggedUser.id);
        if (exists) return prev;
        return [...prev, loggedUser];
      });

      setCurrentUser(loggedUser);
      setScreen('app');
    } catch (error) {
      throw error;
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setScreen('welcome');
  };

  const handleUserUpdate = async (updatedUser) => {
    // 1. Optimistic local update
    setCurrentUser(updatedUser);
    setRegisteredUsers((prev) =>
      prev.map((user) => (user.email === updatedUser.email ? updatedUser : user)),
    );

    // 2. Update Firebase backend if it's a real created user (with a valid firebase UID)
    if (updatedUser.id && !updatedUser.id.startsWith('test-user')) {
      try {
        await updateUserAccount(updatedUser.id, {
          name: updatedUser.name,
          course: updatedUser.course,
          phone: updatedUser.phone,
          isPhonePublic: updatedUser.isPhonePublic,
          photo: updatedUser.photo,
        });
      } catch (error) {
        console.error("Failed to update user profile in Firebase", error);
      }
    }
  };

  if (screen === 'signup') {
    return (
      <SignupScreen
        onSignupSuccess={handleSignupSuccess}
        onBack={() => setScreen('welcome')}
        onNavigateToLogin={() => setScreen('login')}
      />
    );
  }

  if (screen === 'login') {
    return (
      <LoginScreen
        onLoginSuccess={handleLoginSuccess}
        onBack={() => setScreen('welcome')}
        onNavigateToSignup={() => setScreen('signup')}
      />
    );
  }

  if (screen === 'app' && currentUser) {
    return (
      <MainAppScreen
        user={currentUser}
        onUserUpdate={handleUserUpdate}
        onLogout={handleLogout}
      />
    );
  }

  return (
    <WelcomeScreen
      onGetStarted={() => setScreen('signup')}
      onLoginPress={() => setScreen('login')}
    />
  );
}
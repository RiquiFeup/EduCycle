import React, { useState } from 'react';
import SignupScreen from './src/screens/SignupScreen';
import LoginScreen from './src/screens/LoginScreen';
import WelcomeScreen from './src/screens/WelcomeScreen';
import MainAppScreen from './src/screens/MainAppScreen';
import { normalizeEmail } from './src/utils/validation';

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export default function App() {
  const [screen, setScreen] = useState('welcome');
  const [registeredUsers, setRegisteredUsers] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);

  const handleSignupSuccess = async ({ email, password }) => {
    await wait(300);

    const normalizedEmail = normalizeEmail(email);
    const existingUser = registeredUsers.find(
      (user) => user.email === normalizedEmail,
    );

    if (existingUser) {
      throw new Error('An account with this email already exists. Please log in instead.');
    }

    const newUser = {
      id: String(Date.now()),
      email: normalizedEmail,
      password,
      name: normalizedEmail.split('@')[0].replace(/[._-]/g, ' '),
      memberSince: 'April 2026',
      joinedDate: 'Apr 2026',
      photo: 'https://i.pravatar.cc/150?u=' + encodeURIComponent(normalizedEmail),
      communities: ['FEUP'],
      course: 'Informatics Engineering',
      phone: '+351 912 345 678',
      isPhonePublic: false,
      rating: 5.0,
      reviewsCount: 0,
      totalListings: 0,
    };

    setRegisteredUsers((prev) => [...prev, newUser]);
    setCurrentUser(newUser);
    setScreen('app');
  };

  const handleLoginSuccess = async ({ email, password }) => {
    await wait(300);

    const normalizedEmail = normalizeEmail(email);
    const matchedUser = registeredUsers.find(
      (user) => user.email === normalizedEmail && user.password === password,
    );

    if (!matchedUser) {
      throw new Error('We could not find an account with those credentials.');
    }

    setCurrentUser(matchedUser);
    setScreen('app');
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setScreen('welcome');
  };

  const handleUserUpdate = (updatedUser) => {
    setCurrentUser(updatedUser);
    setRegisteredUsers((prev) =>
      prev.map((user) => (user.email === updatedUser.email ? updatedUser : user)),
    );
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
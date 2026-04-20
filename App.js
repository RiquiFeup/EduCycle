import React, { useEffect, useState } from 'react';
import SignupScreen from './src/screens/SignupScreen';
import LoginScreen from './src/screens/LoginScreen';
import WelcomeScreen from './src/screens/WelcomeScreen';
import MainAppScreen from './src/screens/MainAppScreen';
import {
  registerUser,
  loginUser,
  logoutUser,
  subscribeToAuthState,
} from './src/services/authService';

export default function App() {
  const [screen, setScreen] = useState('welcome');
  const [currentUser, setCurrentUser] = useState(null);
  const [authReady, setAuthReady] = useState(false);

  useEffect(() => {
    const unsubscribe = subscribeToAuthState((user) => {
      setCurrentUser(user);
      setScreen(user ? 'app' : 'welcome');
      setAuthReady(true);
    });

    return unsubscribe;
  }, []);

  const handleSignupSuccess = async ({ email, password }) => {
    const newUser = await registerUser({ email, password });
    setCurrentUser(newUser);
    setScreen('app');
  };

  const handleLoginSuccess = async ({ email, password }) => {
    const loggedUser = await loginUser({ email, password });
    setCurrentUser(loggedUser);
    setScreen('app');
  };

  const handleLogout = async () => {
    await logoutUser();
    setCurrentUser(null);
    setScreen('welcome');
  };

  const handleUserUpdate = async (updatedUser) => {
    // 1. Optimistic local update
    setCurrentUser(updatedUser);
  };

  if (!authReady) {
    return null;
  }

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
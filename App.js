import React, { useEffect, useState } from 'react';
import SignupScreen from './src/screens/auth/SignupScreen';
import LoginScreen from './src/screens/auth/LoginScreen';
import WelcomeScreen from './src/screens/auth/WelcomeScreen';
import MainAppScreen from './src/screens/main/MainAppScreen';
import { ThemeProvider } from './src/contexts/ThemeContext';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import {
  registerUser,
  loginUser,
  logoutUser,
  subscribeToAuthState,
  updateUserAccount,
} from './src/services/authService';

function AppContent() {
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
    const previousUser = currentUser;

    setCurrentUser(updatedUser);

    if (updatedUser.id) {
      try {
        await updateUserAccount(updatedUser.id, {
          name: updatedUser.name,
          course: updatedUser.course,
          phone: updatedUser.phone,
          isPhonePublic: updatedUser.isPhonePublic,
          photo: updatedUser.photo,
        });
      } catch (error) {
        setCurrentUser(previousUser);
        console.error("Failed to update user profile in Firebase", error);
        throw error;
      }
    }
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

export default function App() {
  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <AppContent />
      </ThemeProvider>
    </SafeAreaProvider>
  );
}

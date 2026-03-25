import React, { useState } from 'react';
import SignupScreen from './src/screens/SignupScreen';
import HomeScreen from './src/screens/HomeScreen';

export default function App() {
  const [accountCreated, setAccountCreated] = useState(false);

  if (accountCreated) {
    return <HomeScreen />;
  }

  return <SignupScreen onSignupSuccess={() => setAccountCreated(true)} />;
}



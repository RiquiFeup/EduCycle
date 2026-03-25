import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Pressable,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';

export default function SignupScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const isValidEmail = (value) => /\S+@\S+\.\S+/.test(value);

  const canSubmit =
    isValidEmail(email.trim()) &&
    password.trim().length >= 6 &&
    !loading;

  const fakeSignUp = async () => {
    await new Promise((resolve) => setTimeout(resolve, 700));
  };

  const handleSignup = async () => {
    if (!canSubmit) return;

    setError('');
    setLoading(true);
    try {
      await fakeSignUp();
      navigation.replace('Home');
    } catch (e) {
      setError('Não foi possível criar a conta.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container} testID="signup-screen">

      <Text style={styles.title}>Criar conta</Text>

      <TextInput
        testID="signup-email-input"
        placeholder="Email"
        keyboardType="email-address"
        autoCapitalize="none"
        value={email}
        onChangeText={setEmail}
        style={styles.input}
      />

      <TextInput
        testID="signup-password-input"
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
        style={styles.input}
      />

      {error ? (
        <Text testID="signup-error-message" style={styles.error}>
          {error}
        </Text>
      ) : null}
      <Pressable
        testID="signup-submit-button"
        style={[styles.button, !canSubmit && styles.buttonDisabled]}
        onPress={handleSignup}
        disabled={!canSubmit}
      >
        {loading ? (
          <ActivityIndicator />
        ) : (
          <Text style={styles.buttonText}>Create account</Text>
        )}
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
    backgroundColor: '#fff',
  },title: {
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 24,
  },input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    padding: 12,
    marginBottom: 14,
  },button: {
    backgroundColor: '#1f6feb',
    padding: 14,
    borderRadius: 10,
    alignItems: 'center',
  },buttonDisabled: {
    opacity: 0.5,
  },buttonText: {
    color: '#fff',
    fontWeight: '700',
  },error: {
    color: 'red',
    marginBottom: 12,
  },
});
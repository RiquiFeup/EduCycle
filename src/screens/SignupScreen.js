import React, { useMemo, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Pressable,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';
import AuthCard from '../components/AuthCard';
import { validateSignupForm } from '../utils/validation';
import { COLORS, SPACING, RADIUS } from '../utils/theme';

export default function SignupScreen({
  onSignupSuccess,
  onBack,
  onNavigateToLogin,
}) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState('');
  const [loading, setLoading] = useState(false);

  const formValues = useMemo(() => ({ email, password }), [email, password]);

  const handleSignup = async () => {
    const validationErrors = validateSignupForm(formValues);
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      return;
    }

    setSubmitError('');
    setLoading(true);

    try {
      await onSignupSuccess({ email, password });
    } catch (error) {
      setSubmitError(error?.message || 'Could not create the account. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthCard
      title="Create account"
      subtitle="Create your account to start exchanging materials on EduCycle."
      footer={
        <View style={styles.footerLinks}>
          <Pressable testID="signup-back-button" onPress={onBack}>
            <Text style={styles.footerLink}>Back</Text>
          </Pressable>
          <Pressable testID="signup-go-to-login-button" onPress={onNavigateToLogin}>
            <Text style={styles.footerLink}>I already have an account</Text>
          </Pressable>
        </View>
      }
    >
      <View testID="signup-screen">
        <Text style={styles.label}>Email</Text>
        <TextInput
          testID="signup-email-input"
          placeholder="name@email.com"
          placeholderTextColor={COLORS.textMuted}
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
          value={email}
          onChangeText={setEmail}
          style={[styles.input, errors.email && styles.inputError]}
        />
        {errors.email ? (
          <Text testID="signup-email-input-error" style={styles.error}>
            {errors.email}
          </Text>
        ) : null}

        <Text style={styles.label}>Password</Text>
        <TextInput
          testID="signup-password-input"
          placeholder="At least 6 characters"
          placeholderTextColor={COLORS.textMuted}
          secureTextEntry
          value={password}
          onChangeText={setPassword}
          style={[styles.input, errors.password && styles.inputError]}
        />
        {errors.password ? (
          <Text testID="signup-password-input-error" style={styles.error}>
            {errors.password}
          </Text>
        ) : null}

        {submitError ? (
          <Text testID="signup-error-message" style={styles.error}>
            {submitError}
          </Text>
        ) : null}

        <Pressable
          testID="signup-submit-button"
          style={({ pressed }) => [
            styles.button,
            loading && styles.buttonDisabled,
            pressed && !loading && styles.pressed,
          ]}
          onPress={handleSignup}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <Text style={styles.buttonText}>Create account</Text>
          )}
        </Pressable>
      </View>
    </AuthCard>
  );
}

const styles = StyleSheet.create({
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 8,
  },
  input: {
    minHeight: 52,
    borderWidth: 1,
    borderColor: COLORS.borderDark,
    borderRadius: RADIUS.input,
    paddingHorizontal: 16,
    paddingVertical: 14,
    marginBottom: 10,
    backgroundColor: COLORS.cardInput,
    color: COLORS.text,
  },
  inputError: {
    borderColor: COLORS.danger,
  },
  button: {
    backgroundColor: COLORS.primary,
    minHeight: 52,
    borderRadius: RADIUS.button,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: SPACING.sm,
  },
  buttonDisabled: {
    opacity: 0.55,
  },
  buttonText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 16,
  },
  error: {
    color: COLORS.danger,
    marginBottom: 10,
    fontSize: 13,
    lineHeight: 18,
  },
  footerLinks: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: SPACING.md,
  },
  footerLink: {
    color: COLORS.primary,
    fontSize: 14,
    fontWeight: '600',
  },
  pressed: {
    opacity: 0.86,
  },
});
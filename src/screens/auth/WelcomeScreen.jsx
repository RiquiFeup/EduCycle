import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import AuthCard from '../../components/AuthCard';
import { COLORS, SPACING, RADIUS } from '../../utils/theme';

export default function WelcomeScreen({ onGetStarted, onLoginPress }) {
  return (
    <AuthCard
      subtitle="Your campus. Your materials. Circular."
      contentContainerStyle={styles.card}
      footer={
        <Text style={styles.terms}>
          By continuing you agree to our Terms
        </Text>
      }
    >
      <View style={styles.actions} testID="welcome-screen">
        <Pressable
          testID="welcome-get-started-button"
          style={({ pressed }) => [styles.primaryButton, pressed && styles.pressed]}
          onPress={onGetStarted}
        >
          <Text style={styles.primaryButtonText}>Get Started</Text>
        </Pressable>

        <Pressable
          testID="welcome-login-button"
          style={({ pressed }) => [styles.secondaryButton, pressed && styles.pressed]}
          onPress={onLoginPress}
        >
          <Text style={styles.secondaryButtonText}>I already have an account</Text>
        </Pressable>
      </View>
    </AuthCard>
  );
}

const styles = StyleSheet.create({
  card: {
    paddingTop: 48,
    paddingBottom: 28,
  },
  actions: {
    gap: SPACING.sm,
  },
  primaryButton: {
    backgroundColor: COLORS.primary,
    borderRadius: RADIUS.button,
    minHeight: 52,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
  secondaryButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: COLORS.primaryBorder,
    borderRadius: RADIUS.button,
    minHeight: 52,
    alignItems: 'center',
    justifyContent: 'center',
  },
  secondaryButtonText: {
    color: COLORS.primary,
    fontSize: 14,
    fontWeight: '600',
  },
  pressed: {
    opacity: 0.86,
  },
  terms: {
    textAlign: 'center',
    color: COLORS.textMuted,
    fontSize: 11,
    lineHeight: 16,
  },
});
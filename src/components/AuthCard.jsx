import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import EduCycleIcon from './EduCycleIcon';
import { COLORS, SPACING, RADIUS } from '../utils/theme';

export default function AuthCard({
  title,
  subtitle,
  children,
  footer,
  contentContainerStyle,
}) {
  return (
    <View style={styles.safeArea}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardDismissMode="on-drag"
        >
          <View style={[styles.card, contentContainerStyle]}>
            <EduCycleIcon />
            <Text style={styles.brand}>EduCycle</Text>
            {title ? <Text style={styles.title}>{title}</Text> : null}
            {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}

            <View style={styles.body}>{children}</View>
            {footer ? <View style={styles.footer}>{footer}</View> : null}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.page,
  },
  flex: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.xl,
  },
  card: {
    width: '100%',
    maxWidth: 430,
    alignSelf: 'center',
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.panel,
    paddingHorizontal: SPACING.xl,
    paddingVertical: 36,
    borderWidth: 1,
    borderColor: COLORS.borderSoft,
    shadowColor: '#000000',
    shadowOpacity: 0.04,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 10 },
    elevation: 2,
  },
  brand: {
    marginTop: 12,
    textAlign: 'center',
    color: COLORS.primary,
    fontSize: 30,
    fontWeight: '800',
    letterSpacing: -0.8,
  },
  title: {
    marginTop: SPACING.md,
    textAlign: 'center',
    color: COLORS.text,
    fontSize: 26,
    fontWeight: '700',
    letterSpacing: -0.5,
  },
  subtitle: {
    marginTop: SPACING.sm,
    textAlign: 'center',
    color: COLORS.textSecondary,
    fontSize: 14,
    lineHeight: 21,
  },
  body: {
    marginTop: 28,
  },
  footer: {
    marginTop: SPACING.lg,
  },
});
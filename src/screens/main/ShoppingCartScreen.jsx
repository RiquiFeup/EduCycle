import React, { useMemo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, StatusBar, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { SPACING, RADIUS } from '../../utils/theme';
import { useTheme } from '../../contexts/ThemeContext';

export default function ShoppingCartScreen({ navigate }) {
  const { colors, isDark } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} backgroundColor={colors.background} />
      
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigate('Home')}>
          <Text style={styles.backButtonText}>← Voltar</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Carrinho</Text>
      </View>

      <View style={styles.container}>
        <Text style={styles.emptyIcon}>🛒</Text>
        <Text style={styles.emptyTitle}>O teu carrinho está vazio</Text>
        <Text style={styles.emptyHint}>Adiciona itens para os comprares mais tarde.</Text>
      </View>
    </SafeAreaView>
  );
}

function createStyles(colors) {
  return StyleSheet.create({
    safeArea: { 
      flex: 1, 
      backgroundColor: colors.background,
      paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
    },
    header: {
      height: 60,
      backgroundColor: colors.background,
      borderBottomWidth: 1,
      borderBottomColor: colors.borderSoft,
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: SPACING.md,
    },
    backButton: {
      paddingRight: 15,
    },
    backButtonText: {
      color: colors.primary,
      fontSize: 16,
      fontWeight: '600',
    },
    headerTitle: {
      fontSize: 18,
      fontWeight: '700',
      color: colors.text,
      flex: 1,
      textAlign: 'center',
      marginRight: 60,
    },
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      paddingHorizontal: SPACING.lg,
    },
    emptyIcon: {
      fontSize: 60,
      marginBottom: SPACING.md,
    },
    emptyTitle: {
      fontSize: 20,
      fontWeight: '700',
      color: colors.text,
      marginBottom: SPACING.xs,
    },
    emptyHint: {
      fontSize: 15,
      color: colors.textMuted,
      textAlign: 'center',
    },
  });
}

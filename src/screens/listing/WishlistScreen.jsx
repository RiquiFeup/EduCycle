import React, { useContext, useMemo } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  StatusBar,
  Platform,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import ListingCard from '../../components/ListingCard';
import { UserContext } from '../../contexts/UserContext';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../contexts/ThemeContext';
import { SPACING, RADIUS } from '../../utils/theme';

export default function WishlistScreen({ navigate }) {
  const { colors, isDark } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);

  const wishlistContext = useContext(UserContext) ?? {};
  const {
    currentUser,
    wishlistListings = [],
    wishlistLoading = false,
    refreshWishlist = () => {},
  } = wishlistContext;

  const rows = [];
  for (let index = 0; index < wishlistListings.length; index += 2) {
    rows.push(wishlistListings.slice(index, index + 2));
  }

  if (!currentUser?.id) {
    return (
      <SafeAreaView style={styles.stateContainer} testID="wishlist-blocked-state">
        <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} backgroundColor={colors.background} />
        <Ionicons name="lock-closed-outline" size={36} color={colors.textMuted} style={{ marginBottom: SPACING.md }} />
        <Text style={styles.stateTitle}>Inicia sessão para veres a tua wishlist</Text>
        <Text style={styles.stateText}>
          Guardar anúncios é uma funcionalidade associada à tua conta. Anonimato aqui não ganha prémios, pelos vistos.
        </Text>
      </SafeAreaView>
    );
  }

  if (wishlistLoading && wishlistListings.length === 0) {
    return (
      <SafeAreaView style={styles.stateContainer} testID="wishlist-loading-state">
        <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} backgroundColor={colors.background} />
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={styles.stateText}>A carregar a tua wishlist...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea} testID="wishlist-screen">
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} backgroundColor={colors.background} />

      <View style={styles.header}>
        <Text style={styles.logo}>Wishlist</Text>
        <TouchableOpacity style={styles.refreshButton} onPress={refreshWishlist}>
          <Text style={styles.refreshText}>Atualizar</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={rows}
        keyExtractor={(_, index) => String(index)}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardDismissMode="on-drag"
        onRefresh={refreshWishlist}
        refreshing={wishlistLoading}
        ListHeaderComponent={
          <View style={styles.intro}>
            <Text style={styles.title}>A tua wishlist</Text>
            <Text style={styles.subtitle}>
              Os anúncios que guardares aparecem aqui para os encontrares mais tarde.
            </Text>
          </View>
        }
        renderItem={({ item: row }) => (
          <View style={styles.row}>
            {row.map((listing) => (
              <ListingCard
                key={listing.id}
                listing={{ ...listing, isFavourited: true }}
                onPress={() => navigate?.('ListingDetails', { listing })}
              />
            ))}
            {row.length === 1 ? <View style={styles.emptySlot} /> : null}
          </View>
        )}
        ListEmptyComponent={
          <View style={styles.empty} testID="wishlist-empty-state">
            <Ionicons name="heart-outline" size={44} color={colors.textMuted} style={{ marginBottom: 12 }} />
            <Text style={styles.emptyTitle}>Ainda não guardaste anúncios.</Text>
            <Text style={styles.emptyHint}>
              Toca no coração de um anúncio para o adicionar aqui. Tecnologia de ponta: uma lista.
            </Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}

function createStyles(colors) {
  return StyleSheet.create({
    safeArea: {
      flex: 1,
      backgroundColor: colors.background,
    },
    stateContainer: {
      flex: 1,
      backgroundColor: colors.background,
      justifyContent: 'center',
      alignItems: 'center',
      paddingHorizontal: SPACING.lg,
    },
    stateTitle: {
      color: colors.text,
      fontSize: 20,
      fontWeight: '800',
      textAlign: 'center',
      marginBottom: SPACING.sm,
    },
    stateText: {
      marginTop: SPACING.sm,
      color: colors.textMuted,
      fontSize: 15,
      textAlign: 'center',
      lineHeight: 22,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: SPACING.horizontal,
      paddingVertical: 12,
      backgroundColor: colors.background,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    logo: {
      fontSize: 22,
      fontWeight: '800',
      color: colors.primary,
      letterSpacing: -0.5,
    },
    refreshButton: {
      borderWidth: 1,
      borderColor: colors.primaryBorder,
      borderRadius: RADIUS.button,
      paddingHorizontal: SPACING.md,
      paddingVertical: 8,
      backgroundColor: colors.primarySoft,
    },
    refreshText: {
      color: colors.primary,
      fontSize: 13,
      fontWeight: '700',
    },
    scrollContent: {
      paddingBottom: SPACING.xl,
    },
    intro: {
      paddingHorizontal: SPACING.horizontal,
      paddingTop: SPACING.lg,
      paddingBottom: SPACING.md,
    },
    title: {
      color: colors.text,
      fontSize: 24,
      fontWeight: '800',
      marginBottom: SPACING.sm,
    },
    subtitle: {
      color: colors.textSecondary,
      fontSize: 14,
      lineHeight: 20,
    },
    row: {
      flexDirection: 'row',
      paddingHorizontal: SPACING.horizontal,
      gap: 12,
      marginBottom: 0,
    },
    emptySlot: {
      flex: 1,
    },
    empty: {
      alignItems: 'center',
      paddingTop: 48,
      paddingHorizontal: SPACING.lg,
    },
    emptyTitle: {
      color: colors.text,
      fontSize: 18,
      fontWeight: '800',
      textAlign: 'center',
      marginBottom: 6,
    },
    emptyHint: {
      color: colors.textMuted,
      fontSize: 14,
      lineHeight: 20,
      textAlign: 'center',
    },
  });
}

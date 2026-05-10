import React, { useContext } from 'react';
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
import ListingCard from '../components/ListingCard';
import { UserContext } from '../contexts/UserContext';
import { COLORS, SPACING, RADIUS } from '../utils/theme';

export default function WishlistScreen({ navigate }) {
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
        <StatusBar barStyle="dark-content" backgroundColor={COLORS.background} />
        <Text style={styles.stateIcon}>🔒</Text>
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
        <StatusBar barStyle="dark-content" backgroundColor={COLORS.background} />
        <ActivityIndicator size="large" color={COLORS.primary} />
        <Text style={styles.stateText}>A carregar a tua wishlist...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea} testID="wishlist-screen">
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.background} />

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
            <Text style={styles.emptyIcon}>♡</Text>
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

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  stateContainer: {
    flex: 1,
    backgroundColor: COLORS.background,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: SPACING.lg,
  },
  stateIcon: {
    fontSize: 36,
    marginBottom: SPACING.md,
  },
  stateTitle: {
    color: COLORS.text,
    fontSize: 20,
    fontWeight: '800',
    textAlign: 'center',
    marginBottom: SPACING.sm,
  },
  stateText: {
    marginTop: SPACING.sm,
    color: COLORS.textMuted,
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
    backgroundColor: COLORS.background,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  logo: {
    fontSize: 22,
    fontWeight: '800',
    color: COLORS.primary,
    letterSpacing: -0.5,
  },
  refreshButton: {
    borderWidth: 1,
    borderColor: COLORS.primaryBorder,
    borderRadius: RADIUS.button,
    paddingHorizontal: SPACING.md,
    paddingVertical: 8,
    backgroundColor: COLORS.primarySoft,
  },
  refreshText: {
    color: COLORS.primary,
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
    color: COLORS.text,
    fontSize: 24,
    fontWeight: '800',
    marginBottom: SPACING.sm,
  },
  subtitle: {
    color: COLORS.textSecondary,
    fontSize: 14,
    lineHeight: 20,
  },
  row: {
    flexDirection: 'row',
    paddingHorizontal: SPACING.horizontal,
    gap: SPACING.cardGap,
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
  emptyIcon: {
    fontSize: 44,
    color: COLORS.textMuted,
    marginBottom: 12,
  },
  emptyTitle: {
    color: COLORS.text,
    fontSize: 18,
    fontWeight: '800',
    textAlign: 'center',
    marginBottom: 6,
  },
  emptyHint: {
    color: COLORS.textMuted,
    fontSize: 14,
    lineHeight: 20,
    textAlign: 'center',
  },
});

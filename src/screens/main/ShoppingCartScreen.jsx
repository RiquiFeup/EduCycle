import React, { useContext, useMemo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, StatusBar, Platform, ScrollView, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { SPACING, RADIUS } from '../../utils/theme';
import { useTheme } from '../../contexts/ThemeContext';
import { UserContext } from '../../contexts/UserContext';

export default function ShoppingCartScreen({ navigate }) {
  const { colors, isDark } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const { cartListings = [] } = useContext(UserContext) ?? {};

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} backgroundColor={colors.background} />
      
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigate('Home')}>
          <Text style={styles.backButtonText}>← Voltar</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Carrinho</Text>
      </View>

      {cartListings.length === 0 ? (
        <View style={styles.container}>
          <Text style={styles.emptyIcon}>🛒</Text>
          <Text style={styles.emptyTitle}>O teu carrinho está vazio</Text>
          <Text style={styles.emptyHint}>Adiciona itens para os comprares mais tarde.</Text>
        </View>
      ) : (
        <ScrollView contentContainerStyle={styles.listContent}>
          {cartListings.map((listing) => (
            <View key={listing.id} style={styles.cartItem} testID={`cart-item-${listing.id}`}>
              {listing.image || listing.imageUrls?.[0] ? (
                <Image
                  source={{ uri: listing.image || listing.imageUrls[0] }}
                  style={styles.itemImage}
                  resizeMode="cover"
                />
              ) : (
                <View style={styles.itemImagePlaceholder} />
              )}

              <View style={styles.itemContent}>
                <Text style={styles.itemTitle} numberOfLines={2}>{listing.title}</Text>
                <Text style={styles.itemMeta} numberOfLines={1}>{listing.institution || listing.campus}</Text>
                {listing.price != null && listing.price !== '' ? (
                  <Text style={styles.itemPrice}>€ {Number(listing.price).toFixed(2)}</Text>
                ) : (
                  <Text style={styles.itemPriceMuted}>Preço a combinar</Text>
                )}
              </View>
            </View>
          ))}
        </ScrollView>
      )}
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
    listContent: {
      padding: SPACING.md,
      gap: SPACING.md,
    },
    cartItem: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.surface,
      borderRadius: RADIUS.input,
      borderWidth: 1,
      borderColor: colors.border,
      padding: SPACING.sm,
      gap: SPACING.sm,
    },
    itemImage: {
      width: 72,
      height: 72,
      borderRadius: RADIUS.input,
      backgroundColor: colors.border,
    },
    itemImagePlaceholder: {
      width: 72,
      height: 72,
      borderRadius: RADIUS.input,
      backgroundColor: colors.borderDark,
    },
    itemContent: {
      flex: 1,
      minWidth: 0,
    },
    itemTitle: {
      color: colors.text,
      fontSize: 15,
      fontWeight: '700',
    },
    itemMeta: {
      color: colors.textMuted,
      fontSize: 13,
      marginTop: 3,
    },
    itemPrice: {
      color: colors.primary,
      fontSize: 15,
      fontWeight: '800',
      marginTop: 6,
    },
    itemPriceMuted: {
      color: colors.textSecondary,
      fontSize: 13,
      fontWeight: '600',
      marginTop: 6,
    },
  });
}

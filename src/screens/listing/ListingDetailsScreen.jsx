import React, { useState, useEffect, useContext, useMemo } from 'react';
import { View, Text, Image, ScrollView, TouchableOpacity, StyleSheet, Dimensions, Alert } from 'react-native';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../utils/firebase';
import { SPACING, RADIUS } from '../../utils/theme';
import { useTheme } from '../../contexts/ThemeContext';
import { UserContext } from '../../contexts/UserContext';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const MODE_LABELS = {
  sell: '',
  swap: 'For Swap',
  lend: 'For Lend',
};

const MODE_COLORS = {
  swap: '#2E7D59',
  lend: '#1565C0',
};

export default function ListingDetailsScreen({ listing, navigate }) {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);

  const wishlistContext = useContext(UserContext) ?? {};
  const {
    currentUser,
    isWishlisted = () => false,
    toggleWishlist,
    addToCart,
    isInCart = () => false,
  } = wishlistContext;

  const type = listing?.mode || listing?.listingType?.toLowerCase();
  const badge = MODE_LABELS[type];
  const badgeColor = MODE_COLORS[type];

  const [seller, setSeller] = useState(null);
  const [isSavingWishlist, setIsSavingWishlist] = useState(false);
  const isSaved = Boolean(listing?.id && isWishlisted(listing.id));
  const isAlreadyInCart = Boolean(listing?.id && isInCart(listing.id));

  useEffect(() => {
    const fetchSeller = async () => {
      if (listing?.sellerId) {
        try {
          const docRef = doc(db, 'users', listing.sellerId);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            setSeller(docSnap.data());
          }
        } catch (error) {
          console.error("Erro a carregar vendedor:", error);
        }
      }
    };
    fetchSeller();
  }, [listing?.sellerId]);

  const displaySellerName = seller?.name || listing?.sellerName || 'Vendedor Anónimo';
  const displaySellerPhoto = seller?.photo || listing?.sellerPhoto;

  const handleWishlistPress = async () => {
    if (!listing?.id) {
      Alert.alert('Wishlist', 'Este anúncio não pode ser guardado.');
      return;
    }

    if (!currentUser?.id || !toggleWishlist) {
      Alert.alert('Login required', 'Log in to save listings to your wishlist.');
      return;
    }

    try {
      setIsSavingWishlist(true);
      await toggleWishlist(listing);
    } catch (error) {
      Alert.alert('Wishlist', error.message || 'Não foi possível atualizar a wishlist.');
    } finally {
      setIsSavingWishlist(false);
    }
  };

  const handleAddToCartPress = () => {
    if (!listing?.id) {
      Alert.alert('Carrinho', 'Este anúncio não pode ser adicionado ao carrinho.');
      return;
    }

    if (!currentUser?.id || !addToCart) {
      Alert.alert('Login required', 'Log in to add listings to your cart.');
      return;
    }

    try {
      addToCart(listing);
      Alert.alert('Carrinho', 'Anúncio adicionado ao carrinho.');
    } catch (error) {
      Alert.alert('Carrinho', error.message || 'Não foi possível adicionar o anúncio ao carrinho.');
    }
  };

  return (
    <View style={styles.mainContainer}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigate('Home')}>
          <Text style={styles.backButtonText}>← Voltar</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Detalhes do Produto</Text>
      </View>

      <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 40 }} keyboardDismissMode="on-drag">
        <View style={styles.imageContainer}>
          {listing?.imageUrls && listing.imageUrls.length > 0 ? (
            <ScrollView horizontal pagingEnabled showsHorizontalScrollIndicator={false}>
              {listing.imageUrls.map((uri, index) => (
                <Image key={index} source={{ uri }} style={[styles.image, { width: SCREEN_WIDTH }]} resizeMode="cover" />
              ))}
            </ScrollView>
          ) : listing?.image ? (
            <Image source={{ uri: listing.image }} style={styles.image} resizeMode="cover" />
          ) : (
            <View style={styles.imagePlaceholder} />
          )}
        </View>

        <View style={styles.content}>
          {badge ? (
            <View style={[styles.badge, { backgroundColor: badgeColor }]}>
              <Text style={styles.badgeText}>{badge}</Text>
            </View>
          ) : null}

          <Text style={styles.title}>{listing?.title}</Text>
          {listing?.price != null && listing?.price !== '' && (
            <Text style={styles.price}>€ {Number(listing.price).toFixed(2)}</Text>
          )}

          <View style={styles.institutionRow}>
            <View style={styles.locationDot} />
            <Text style={styles.institution}>{listing?.institution || listing?.campus}</Text>
          </View>

          {listing?.subject ? (
            <View style={styles.detailRow} testID="listing-subject">
              <Text style={styles.detailLabel}>Subject</Text>
              <View style={styles.subjectBadge}>
                <Text style={styles.subjectBadgeText}>{listing.subject}</Text>
              </View>
            </View>
          ) : null}

          {listing?.isbn ? (
            <View style={styles.detailRow} testID="listing-isbn">
              <Text style={styles.detailLabel}>ISBN</Text>
              <Text style={styles.detailValue}>{listing.isbn}</Text>
            </View>
          ) : null}

          {listing?.condition ? (
            <View style={styles.detailRow} testID="listing-condition">
              <Text style={styles.detailLabel}>Condition</Text>
              <View style={[styles.subjectBadge, { backgroundColor: colors.surface }]}>
                <Text style={[styles.subjectBadgeText, { color: colors.text }]}>{listing.condition}</Text>
              </View>
            </View>
          ) : null}

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Descrição</Text>
            <Text style={styles.description}>
              {listing?.description || "Sem descrição detalhada fornecida pelo vendedor para este artigo."}
            </Text>
          </View>

          <TouchableOpacity
            style={styles.vendorCard}
            onPress={() => navigate('PublicProfile', { sellerId: listing?.sellerId })}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
              {displaySellerPhoto ? (
                <Image source={{ uri: displaySellerPhoto }} style={{ width: 48, height: 48, borderRadius: 24, backgroundColor: colors.surface }} />
              ) : (
                <View style={{ width: 48, height: 48, borderRadius: 24, backgroundColor: colors.border }} />
              )}

              <View>
                <Text style={styles.vendorName}>{displaySellerName}</Text>
                <Text style={styles.vendorSubtext}>Ver Perfil Público →</Text>
              </View>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.wishlistButton, isSaved && styles.wishlistButtonActive]}
            onPress={handleWishlistPress}
            disabled={isSavingWishlist}
            testID="listing-save-button"
          >
            <Text style={[styles.wishlistButtonText, isSaved && styles.wishlistButtonTextActive]}>
              {isSavingWishlist
                ? 'A atualizar...'
                : isSaved
                  ? 'Guardado na wishlist'
                  : 'Guardar na wishlist'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.wishlistButton,
              isAlreadyInCart && styles.wishlistButtonActive,
              { marginBottom: SPACING.sm },
            ]}
            onPress={handleAddToCartPress}
            testID="listing-add-cart-button"
          >
            <Text style={[styles.wishlistButtonText, isAlreadyInCart && styles.wishlistButtonTextActive]}>
              {isAlreadyInCart ? 'No carrinho' : 'Adicionar ao Carrinho'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionButton} onPress={() => navigate('Chat', { conversationId: 'c1' })}>
            <Text style={styles.actionButtonText}>Enviar Mensagem</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

function createStyles(colors) {
  return StyleSheet.create({
    mainContainer: { flex: 1, backgroundColor: colors.background },
    header: { height: 60, backgroundColor: colors.background, borderBottomWidth: 1, borderBottomColor: colors.borderSoft, flexDirection: 'row', alignItems: 'center', paddingHorizontal: SPACING.md, paddingTop: 10 },
    backButton: { paddingRight: 15 },
    backButtonText: { color: colors.primary, fontSize: 16, fontWeight: '600' },
    headerTitle: { fontSize: 18, fontWeight: '700', color: colors.text, flex: 1, textAlign: 'center', marginRight: 60 },
    container: { flex: 1 },
    imageContainer: { width: '100%', height: SCREEN_WIDTH * 0.8, backgroundColor: colors.surface },
    image: { width: '100%', height: '100%' },
    imagePlaceholder: { flex: 1, backgroundColor: colors.borderDark },
    content: { padding: SPACING.lg },
    badge: { alignSelf: 'flex-start', borderRadius: 20, paddingHorizontal: 12, paddingVertical: 4, marginBottom: SPACING.sm },
    badgeText: { color: '#FFFFFF', fontSize: 12, fontWeight: '700' },
    title: { fontSize: 24, fontWeight: '700', color: colors.text, marginBottom: SPACING.sm },
    price: { fontSize: 22, fontWeight: '800', color: colors.primary, marginBottom: SPACING.md },
    institutionRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: SPACING.lg },
    locationDot: { width: 10, height: 10, borderRadius: 5, backgroundColor: '#E53E3E' },
    institution: { fontSize: 14, color: colors.textSecondary, fontWeight: '500' },
    section: { marginTop: SPACING.md, marginBottom: SPACING.lg },
    sectionTitle: { fontSize: 18, fontWeight: '700', color: colors.text, marginBottom: SPACING.sm },
    description: { fontSize: 16, color: colors.textSecondary, lineHeight: 24 },
    vendorCard: { backgroundColor: colors.surface, padding: SPACING.md, borderRadius: RADIUS.panel, marginBottom: SPACING.xl, borderWidth: 1, borderColor: colors.border },
    vendorName: { fontSize: 16, fontWeight: '700', color: colors.text },
    vendorSubtext: { fontSize: 14, color: colors.textMuted, marginTop: 4 },
    detailRow: { flexDirection: 'row', alignItems: 'center', marginBottom: SPACING.sm, gap: SPACING.sm },
    detailLabel: { fontSize: 14, fontWeight: '600', color: colors.textSecondary, minWidth: 60 },
    detailValue: { fontSize: 14, color: colors.text, fontWeight: '500' },
    subjectBadge: { backgroundColor: colors.primarySoft, borderRadius: 20, paddingHorizontal: 10, paddingVertical: 3 },
    subjectBadgeText: { fontSize: 13, fontWeight: '600', color: colors.primary },
    wishlistButton: { backgroundColor: colors.surface, paddingVertical: 16, borderRadius: RADIUS.button, alignItems: 'center', marginBottom: SPACING.sm, borderWidth: 1, borderColor: colors.primaryBorder },
    wishlistButtonActive: { backgroundColor: colors.primarySoft },
    wishlistButtonText: { color: colors.primary, fontSize: 16, fontWeight: '700' },
    wishlistButtonTextActive: { color: colors.text },
    actionButton: { backgroundColor: colors.primary, paddingVertical: 16, borderRadius: RADIUS.button, alignItems: 'center' },
    actionButtonText: { color: colors.background, fontSize: 16, fontWeight: '700' },
  });
}

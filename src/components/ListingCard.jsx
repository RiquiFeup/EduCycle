import React, { useContext, useMemo } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Alert,
} from 'react-native';
import { UserContext } from '../contexts/UserContext';
import { useTheme } from '../contexts/ThemeContext';

const CARD_GAP = 12;
const HORIZONTAL_PADDING = 16;
const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CARD_WIDTH = (SCREEN_WIDTH - HORIZONTAL_PADDING * 2 - CARD_GAP) / 2;
const IMAGE_HEIGHT = CARD_WIDTH * 0.72;

const MODE_LABELS = {
  sell: '',
  swap: 'For Swap',
  lend: 'For Lend',
};

const MODE_COLORS = {
  swap: '#2E7D59',
  lend: '#1565C0',
};

export default function ListingCard({ listing, onToggleFavourite, onPress }) {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);

  const wishlistContext = useContext(UserContext) ?? {};
  const {
    currentUser,
    isWishlisted = () => false,
    toggleWishlist,
  } = wishlistContext;

  const isSaved = Boolean(listing?.id && isWishlisted(listing.id)) || Boolean(listing?.isFavourited);

  const handleFav = async () => {
    if (!listing?.id) {
      return;
    }

    if (!currentUser?.id || !toggleWishlist) {
      Alert.alert('Login required', 'Log in to save listings to your wishlist.');
      return;
    }

    try {
      await toggleWishlist(listing);
      onToggleFavourite?.(listing.id, listing);
    } catch (error) {
      Alert.alert('Wishlist', error.message || 'Não foi possível atualizar a wishlist.');
    }
  };

  const badge = MODE_LABELS[listing.mode];
  const badgeColor = MODE_COLORS[listing.mode];
  const hasPrice = listing.price !== null && listing.price !== undefined && listing.price !== '';

  return (
    <TouchableOpacity
      style={styles.card}
      activeOpacity={onPress ? 0.8 : 1}
      onPress={onPress}
      disabled={!onPress}
    >
      <View style={styles.imageContainer}>
        {listing.imageUrls && listing.imageUrls.length > 0 ? (
          <Image source={{ uri: listing.imageUrls[0] }} style={styles.image} resizeMode="cover" />
        ) : listing.image ? (
          <Image source={{ uri: listing.image }} style={styles.image} resizeMode="cover" />
        ) : (
          <View style={styles.imagePlaceholder} />
        )}
      </View>

      <View style={styles.body}>
        {badge ? (
          <View style={[styles.badge, { backgroundColor: badgeColor }]}>
            <Text style={styles.badgeText}>{badge}</Text>
          </View>
        ) : null}

        <Text style={styles.title} numberOfLines={2}>
          {listing.title}
        </Text>

        {hasPrice ? (
          <Text style={styles.price}>€ {listing.price}</Text>
        ) : null}

        <View style={styles.footer}>
          <View style={styles.institutionRow}>
            <View style={styles.locationDot} />
            <Text style={styles.institution}>{listing.institution || listing.campus}</Text>
          </View>
          <TouchableOpacity
            onPress={handleFav}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            testID={`wishlist-toggle-${listing.id}`}
            accessibilityRole="button"
            accessibilityLabel={isSaved ? 'Remove from wishlist' : 'Save to wishlist'}
          >
            <Text style={[styles.heart, isSaved && styles.heartActive]}>
              {isSaved ? '♥' : '♡'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
}

function createStyles(colors) {
  return StyleSheet.create({
    card: {
      width: CARD_WIDTH,
      backgroundColor: colors.surface,
      borderRadius: 12,
      overflow: 'hidden',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.08,
      shadowRadius: 6,
      elevation: 3,
      marginBottom: CARD_GAP,
    },
    imageContainer: {
      width: '100%',
      height: IMAGE_HEIGHT,
      backgroundColor: colors.borderDark,
    },
    image: {
      width: '100%',
      height: '100%',
    },
    imagePlaceholder: {
      flex: 1,
      backgroundColor: colors.border,
    },
    body: {
      padding: 8,
      paddingBottom: 10,
    },
    badge: {
      alignSelf: 'flex-start',
      borderRadius: 20,
      paddingHorizontal: 8,
      paddingVertical: 2,
      marginBottom: 4,
    },
    badgeText: {
      color: '#FFFFFF',
      fontSize: 10,
      fontWeight: '700',
    },
    title: {
      fontSize: 12,
      fontWeight: '600',
      color: colors.text,
      lineHeight: 16,
      marginBottom: 4,
    },
    price: {
      fontSize: 14,
      fontWeight: '800',
      color: colors.text,
      marginBottom: 6,
    },
    footer: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    institutionRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 4,
    },
    locationDot: {
      width: 8,
      height: 8,
      borderRadius: 4,
      backgroundColor: '#E53E3E',
    },
    institution: {
      fontSize: 11,
      color: colors.textMuted,
      fontWeight: '500',
    },
    heart: {
      fontSize: 18,
      color: colors.borderDark,
    },
    heartActive: {
      color: '#E53E3E',
    },
  });
}

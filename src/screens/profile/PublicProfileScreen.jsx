import React, { useState, useEffect, useContext, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  Platform,
  TouchableOpacity,
  Image,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { doc, getDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../../utils/firebase';

import { Ionicons } from '@expo/vector-icons';
import ListingCard from '../../components/ListingCard';
import CommunityBadge from '../../components/CommunityBadge';
import SectionHeader from '../../components/SectionHeader';
import { SPACING, RADIUS } from '../../utils/theme';
import { useTheme } from '../../contexts/ThemeContext';
import { UserContext } from '../../contexts/UserContext';

export default function PublicProfileScreen({ isPreview, sellerId, navigate }) {
  const { colors, isDark } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);

  const { currentUser } = useContext(UserContext);

  const [displayedUser, setDisplayedUser] = useState(isPreview ? currentUser : null);
  const [loading, setLoading] = useState(true);
  const [userListings, setUserListings] = useState([]);

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        let targetUserId = sellerId;

        if (isPreview) {
          targetUserId = currentUser?.id;
          setDisplayedUser(currentUser);
        } else if (sellerId) {
          const docRef = doc(db, 'users', sellerId);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            setDisplayedUser(docSnap.data());
          }
        }

        if (targetUserId) {
          const q = query(collection(db, 'listings'), where('sellerId', '==', targetUserId));
          const querySnapshot = await getDocs(q);
          const realListings = querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          }));
          setUserListings(realListings);
        }
      } catch (error) {
        console.error("Erro ao carregar perfil e anúncios:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfileData();
  }, [sellerId, isPreview, currentUser]);

  const handleToggleFavourite = (id) => {
    setUserListings((prev) =>
      prev.map((listing) =>
        listing.id === id
          ? { ...listing, isFavourited: !listing.isFavourited }
          : listing,
      ),
    );
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.stateContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={styles.stateText}>A carregar perfil...</Text>
      </SafeAreaView>
    );
  }

  if (!displayedUser) {
    return (
      <SafeAreaView style={styles.stateContainer}>
        <Text style={styles.headerTitle}>Utilizador não encontrado.</Text>
        <TouchableOpacity style={styles.stateButton} onPress={() => navigate('Home')}>
          <Text style={styles.stateButtonText}>Voltar ao Início</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea} testID="public-profile-screen">
      <StatusBar
        barStyle={isDark ? 'light-content' : 'dark-content'}
        backgroundColor={colors.background}
      />

      {isPreview ? (
        <View style={[styles.header, styles.previewHeader]}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
            <Ionicons name="eye-outline" size={16} color={colors.text} />
            <Text style={styles.previewTitle}>Preview Mode</Text>
          </View>
          <TouchableOpacity
            style={styles.exitPreviewBtn}
            onPress={() => navigate('PrivateProfile')}
          >
            <Text style={styles.exitPreviewText}>Exit</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.header}>
          <TouchableOpacity style={styles.backBtn} onPress={() => navigate('Home')}>
            <Text style={styles.backIcon}>←</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Seller Profile</Text>
          <View style={styles.placeholder} />
        </View>
      )}

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardDismissMode="on-drag"
      >
        <View style={styles.profileHeaderContainer}>
          <View style={styles.topSection}>
            <Image source={{ uri: displayedUser.photo }} style={styles.profileImage} />
            <View style={styles.nameContainer}>
              <Text style={styles.userName}>{displayedUser.name}</Text>
              <Text style={styles.userCourse}>{displayedUser.course}</Text>

              <View style={styles.tagsContainer}>
                {displayedUser.communities?.map((community, index) => (
                  <CommunityBadge key={index} name={community} />
                ))}
              </View>
            </View>
          </View>

          {!isPreview ? (
            <View style={styles.actionsContainer}>
              <TouchableOpacity
                style={[styles.actionButton, styles.primaryButton]}
                onPress={() => navigate('Chat', { conversationId: 'conv-1' })}
              >
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                  <Ionicons name="chatbubble-outline" size={15} color={colors.background} />
                  <Text style={styles.primaryButtonText}>Message</Text>
                </View>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.actionButton, styles.secondaryButton]}
                onPress={() => Alert.alert('Email', `Email ${displayedUser.email} from your mail app later.`)}
              >
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                  <Ionicons name="mail-outline" size={15} color={colors.primary} />
                  <Text style={styles.secondaryButtonText}>Email</Text>
                </View>
              </TouchableOpacity>
            </View>
          ) : null}

          {(displayedUser.phone && (displayedUser.isPhonePublic || isPreview)) ? (
            <View style={styles.phoneContainer}>
              <Text style={styles.phoneLabel}>Public Contact:</Text>
              <Text style={styles.phoneValue}>{displayedUser.phone}</Text>
            </View>
          ) : null}

          <SectionHeader title="Active Listings" hasTopBorder />

          <View style={styles.row}>
            {userListings.length > 0 ? (
              userListings.map((listing) => (
                <ListingCard
                  key={listing.id}
                  listing={listing}
                  onToggleFavourite={handleToggleFavourite}
                  onPress={() => navigate?.('ListingDetails', { listing: listing })}
                />
              ))
            ) : (
              <Text style={{ color: colors.textMuted, marginTop: 10 }}>Este utilizador ainda não tem anúncios ativos.</Text>
            )}
            {userListings.length === 1 ? <View style={styles.emptySlot} /> : null}
          </View>
        </View>
      </ScrollView>
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
    stateContainer: {
      flex: 1,
      backgroundColor: colors.background,
      justifyContent: 'center',
      alignItems: 'center',
      paddingHorizontal: SPACING.lg,
    },
    stateText: {
      marginTop: SPACING.sm,
      color: colors.textMuted,
      fontSize: 15,
    },
    stateButton: {
      marginTop: SPACING.lg,
      paddingVertical: SPACING.sm,
      paddingHorizontal: SPACING.md,
      backgroundColor: colors.surface,
      borderRadius: RADIUS.button,
      borderWidth: 1,
      borderColor: colors.borderDark,
    },
    stateButtonText: {
      color: colors.primary,
      fontWeight: '600',
      fontSize: 15,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: SPACING.horizontal,
      paddingVertical: 12,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    backBtn: { padding: 4 },
    backIcon: { fontSize: 24, color: colors.text },
    headerTitle: { fontSize: 17, fontWeight: '700', color: colors.text },
    placeholder: { width: 32 },
    previewHeader: {
      backgroundColor: colors.primarySoft,
      borderBottomColor: colors.borderDark,
    },
    previewTitle: {
      fontSize: 16,
      fontWeight: '700',
      color: colors.text,
    },
    exitPreviewBtn: {
      backgroundColor: colors.text,
      paddingVertical: 6,
      paddingHorizontal: 16,
      borderRadius: 20,
    },
    exitPreviewText: {
      color: colors.background,
      fontWeight: '700',
      fontSize: 13,
    },
    scrollContent: { paddingBottom: SPACING.xl },
    profileHeaderContainer: { paddingTop: SPACING.lg },
    topSection: {
      flexDirection: 'row',
      paddingHorizontal: SPACING.horizontal,
      alignItems: 'center',
      marginBottom: 20,
    },
    profileImage: {
      width: 80,
      height: 80,
      borderRadius: 40,
      backgroundColor: colors.border,
    },
    nameContainer: { flex: 1, marginLeft: SPACING.horizontal },
    userName: {
      fontSize: 22,
      fontWeight: '800',
      color: colors.text,
      marginBottom: 4,
    },
    userCourse: {
      fontSize: 14,
      color: colors.textSecondary,
      marginBottom: 8,
      fontWeight: '500',
    },
    tagsContainer: { flexDirection: 'row', flexWrap: 'wrap', gap: SPACING.sm },
    actionsContainer: {
      flexDirection: 'row',
      paddingHorizontal: SPACING.horizontal,
      gap: 12,
      marginBottom: 20,
    },
    actionButton: {
      flex: 1,
      height: 44,
      borderRadius: 8,
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: 'row',
    },
    primaryButton: { backgroundColor: colors.primary },
    primaryButtonText: { color: colors.background, fontWeight: '600', fontSize: 15 },
    secondaryButton: {
      backgroundColor: colors.background,
      borderWidth: 1,
      borderColor: colors.primary,
    },
    secondaryButtonText: { color: colors.primary, fontWeight: '600', fontSize: 15 },
    phoneContainer: {
      flexDirection: 'row',
      paddingHorizontal: SPACING.horizontal,
      alignItems: 'center',
      marginBottom: SPACING.lg,
      gap: SPACING.sm,
    },
    phoneLabel: { fontSize: 14, color: colors.textMuted },
    phoneValue: { fontSize: 14, fontWeight: '600', color: colors.text },
    row: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      paddingHorizontal: SPACING.horizontal,
      gap: 12,
      marginBottom: SPACING.md,
    },
    emptySlot: { flex: 1 },
  });
}

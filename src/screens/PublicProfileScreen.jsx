import React, { useState, useContext } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  Platform,
  TouchableOpacity,
  Image,
  ScrollView,
  Alert,
} from 'react-native';
import ListingCard from '../components/ListingCard';
import CommunityBadge from '../components/CommunityBadge';
import SectionHeader from '../components/SectionHeader';
import { COLORS, SPACING } from '../utils/theme';
import { LISTINGS } from '../data/listings';
import { UserContext } from '../contexts/UserContext';

export default function PublicProfileScreen({ isPreview, navigate }) {
  const { currentUser } = useContext(UserContext);

  const [mockSeller] = useState({
    id: 'u123',
    name: 'Sofia Martins',
    photo: 'https://i.pravatar.cc/150?u=sofia',
    communities: ['Universidade do Porto'],
    course: 'Mechanical Engineering',
    publicPhone: '+351 900 000 000',
    email: 'sofia.martins@fe.up.pt',
    totalListings: 12,
  });

  const displayedUser = isPreview ? currentUser : mockSeller;
  const [userListings, setUserListings] = useState(LISTINGS.slice(0, 2));

  const handleToggleFavourite = (id) => {
    setUserListings((prev) =>
      prev.map((listing) =>
        listing.id === id
          ? { ...listing, isFavourited: !listing.isFavourited }
          : listing,
      ),
    );
  };

  return (
    <SafeAreaView style={styles.safeArea} testID="public-profile-screen">
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.background} />

      {isPreview ? (
        <View style={[styles.header, styles.previewHeader]}>
          <Text style={styles.previewTitle}>👁️ Preview Mode</Text>
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
      >
        <View style={styles.profileHeaderContainer}>
          <View style={styles.topSection}>
            <Image source={{ uri: displayedUser.photo }} style={styles.profileImage} />
            <View style={styles.nameContainer}>
              <Text style={styles.userName}>{displayedUser.name}</Text>
              <Text style={styles.userCourse}>{displayedUser.course}</Text>

              <View style={styles.tagsContainer}>
                {displayedUser.communities.map((community, index) => (
                  <CommunityBadge key={index} name={community} />
                ))}
              </View>
            </View>
          </View>

          {!isPreview ? (
            <View style={styles.actionsContainer}>
              <TouchableOpacity
                style={[styles.actionButton, styles.primaryButton]}
                onPress={() => Alert.alert('Messages', 'Messaging flow coming soon!')}
              >
                <Text style={styles.primaryButtonText}>💬 Message</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.actionButton, styles.secondaryButton]}
                onPress={() => Alert.alert('Email', `Email ${displayedUser.email} from your mail app later.`)}
              >
                <Text style={styles.secondaryButtonText}>✉️ Email</Text>
              </TouchableOpacity>
            </View>
          ) : null}

          {(displayedUser.publicPhone || (isPreview && displayedUser.isPhonePublic)) ? (
            <View style={styles.phoneContainer}>
              <Text style={styles.phoneLabel}>Public Contact:</Text>
              <Text style={styles.phoneValue}>
                {isPreview ? displayedUser.phone : displayedUser.publicPhone}
              </Text>
            </View>
          ) : null}

          <SectionHeader title="Active Listings" hasTopBorder />

          <View style={styles.row}>
            {userListings.map((listing) => (
              <ListingCard
                key={listing.id}
                listing={listing}
                onToggleFavourite={handleToggleFavourite}
              />
            ))}
            {userListings.length === 1 ? <View style={styles.emptySlot} /> : null}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.horizontal,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  backBtn: { padding: 4 },
  backIcon: { fontSize: 24, color: COLORS.text },
  headerTitle: { fontSize: 17, fontWeight: '700', color: COLORS.text },
  placeholder: { width: 32 },
  previewHeader: {
    backgroundColor: '#F0F4F8',
    borderBottomColor: '#D9E2EC',
  },
  previewTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#486581',
  },
  exitPreviewBtn: {
    backgroundColor: COLORS.text,
    paddingVertical: 6,
    paddingHorizontal: 16,
    borderRadius: 20,
  },
  exitPreviewText: {
    color: COLORS.background,
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
    backgroundColor: COLORS.border,
  },
  nameContainer: { flex: 1, marginLeft: SPACING.horizontal },
  userName: {
    fontSize: 22,
    fontWeight: '800',
    color: COLORS.text,
    marginBottom: 4,
  },
  userCourse: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginBottom: 8,
    fontWeight: '500',
  },
  tagsContainer: { flexDirection: 'row', flexWrap: 'wrap', gap: SPACING.sm },
  actionsContainer: {
    flexDirection: 'row',
    paddingHorizontal: SPACING.horizontal,
    gap: SPACING.cardGap,
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
  primaryButton: { backgroundColor: COLORS.primary },
  primaryButtonText: { color: COLORS.background, fontWeight: '600', fontSize: 15 },
  secondaryButton: {
    backgroundColor: COLORS.background,
    borderWidth: 1,
    borderColor: COLORS.primary,
  },
  secondaryButtonText: { color: COLORS.primary, fontWeight: '600', fontSize: 15 },
  phoneContainer: {
    flexDirection: 'row',
    paddingHorizontal: SPACING.horizontal,
    alignItems: 'center',
    marginBottom: SPACING.lg,
    gap: SPACING.sm,
  },
  phoneLabel: { fontSize: 14, color: COLORS.textMuted },
  phoneValue: { fontSize: 14, fontWeight: '600', color: COLORS.text },
  row: {
    flexDirection: 'row',
    paddingHorizontal: SPACING.horizontal,
    gap: SPACING.cardGap,
    marginBottom: SPACING.md,
  },
  emptySlot: { flex: 1 },
});
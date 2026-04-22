import React, { useEffect, useState, useContext } from 'react';
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  Platform,
  TouchableOpacity,
  Image,
  ScrollView,
  Switch,
  Modal,
  TextInput,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as ImagePicker from 'expo-image-picker';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../utils/firebase';
import ListingCard from '../components/ListingCard';
import CommunityBadge from '../components/CommunityBadge';
import SectionHeader from '../components/SectionHeader';
import { COLORS, SPACING } from '../utils/theme';
import { UserContext } from '../contexts/UserContext';

export default function PrivateProfileScreen({ navigate }) {
  const { currentUser, updateUser, logout } = useContext(UserContext);
  
  const [myListings, setMyListings] = useState([]);
  const [loadingListings, setLoadingListings] = useState(true);

  const [isEditModalVisible, setEditModalVisible] = useState(false);
  const [editForm, setEditForm] = useState({
    name: currentUser.name,
    course: currentUser.course,
    phone: currentUser.phone,
  });

  useEffect(() => {
    setEditForm({
      name: currentUser.name,
      course: currentUser.course,
      phone: currentUser.phone,
    });
  }, [currentUser]);

  useEffect(() => {
    const fetchMyListings = async () => {
      if (currentUser?.id) {
        try {
          const q = query(collection(db, 'listings'), where('sellerId', '==', currentUser.id));
          const querySnapshot = await getDocs(q);
          const realListings = querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          }));
          setMyListings(realListings);
        } catch (error) {
          console.error("Erro a carregar os meus anúncios:", error);
        } finally {
          setLoadingListings(false);
        }
      }
    };
    fetchMyListings();
  }, [currentUser?.id]);

  const handleNameChange = (text) => {
    if (/^[a-zA-ZÀ-ÿ\s]*$/.test(text)) {
      setEditForm((prev) => ({ ...prev, name: text }));
    }
  };

  const handleCourseChange = (text) => {
    if (/^[a-zA-Z0-9À-ÿ\s]*$/.test(text)) {
      setEditForm((prev) => ({ ...prev, course: text }));
    }
  };

  const handlePhoneChange = (text) => {
    if (/^\+?[0-9]*$/.test(text)) {
      setEditForm((prev) => ({ ...prev, phone: text }));
    }
  };

  const handleSaveProfile = () => {
    updateUser(editForm);
    setEditModalVisible(false);
  };

  const pickImage = async (useCamera = false) => {
    let result;

    if (useCamera) {
      const permission = await ImagePicker.requestCameraPermissionsAsync();
      if (!permission.granted) {
        Alert.alert('Permission required', 'Camera access is needed to take a photo.');
        return;
      }

      result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.5,
      });
    } else {
      const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!permission.granted) {
        Alert.alert('Permission required', 'Gallery access is needed to pick a photo.');
        return;
      }

      result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.5,
      });
    }

    if (!result.canceled) {
      updateUser({ photo: result.assets[0].uri });
    }
  };

  const handleChangePhotoAlert = () => {
    Alert.alert('Update Profile Photo', 'Choose where to get your new picture', [
      { text: 'Camera', onPress: () => pickImage(true) },
      { text: 'Gallery', onPress: () => pickImage(false) },
      { text: 'Cancel', style: 'cancel' },
    ]);
  };

  const togglePhoneVisibility = () => {
    updateUser({ isPhonePublic: !currentUser.isPhonePublic });
  };

  const handleLogout = () => {
    Alert.alert('Log Out', 'Are you sure you want to log out of EduCycle?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Log Out', style: 'destructive', onPress: () => logout?.() },
    ]);
  };

  return (
    <SafeAreaView style={styles.safeArea} testID="private-profile-screen">
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.background} />

      <View style={styles.header}>
        <Text style={styles.logo}>EduCycle</Text>
        <TouchableOpacity
          style={styles.settingsBtn}
          onPress={() => Alert.alert('Settings', 'Settings screen coming soon!')}
        >
          <Text style={styles.settingsIcon}>⚙️</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.profileHeaderContainer}>
          <View style={styles.topSection}>
            <Image source={{ uri: currentUser.photo }} style={styles.profileImage} />
            <View style={styles.nameContainer}>
              <Text style={styles.userName}>{currentUser.name}</Text>
              <Text style={styles.userEmail}>{currentUser.email}</Text>

              <View style={styles.statsRow}>
                <Text style={styles.ratingText}>
                  ⭐ {currentUser.rating} ({currentUser.reviewsCount})
                </Text>
                <Text style={styles.bulletPoint}>•</Text>
                <Text style={styles.joinedText}>Joined {currentUser.joinedDate}</Text>
              </View>

              <Text style={styles.userCourse}>{currentUser.course}</Text>

              <View style={styles.tagsContainer}>
                {currentUser.communities?.map((community, index) => (
                  <CommunityBadge key={index} name={community} />
                ))}
              </View>
            </View>
          </View>

          <View style={styles.actionsContainer}>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => setEditModalVisible(true)}
            >
              <Text style={styles.actionButtonText}>Edit Profile</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.actionButton, { backgroundColor: COLORS.buttonGray }]}
              onPress={() => navigate('PublicProfile', { isPreview: true })}
            >
              <Text style={styles.actionButtonText}>👁️ Preview Public</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.preferencesContainer}>
            <Text style={styles.preferencesTitle}>Privacy Settings</Text>
            <View style={styles.settingRow}>
              <View style={styles.settingTextContent}>
                <Text style={styles.settingLabel}>Public Phone Number</Text>
                <Text style={styles.settingDescription}>
                  {currentUser.phone} will be visible to buyers.
                </Text>
              </View>

              <Switch
                trackColor={{ false: COLORS.borderDark, true: COLORS.toggleActive }}
                thumbColor={currentUser.isPhonePublic ? COLORS.primary : COLORS.toggleInactive}
                ios_backgroundColor={COLORS.borderDark}
                onValueChange={togglePhoneVisibility}
                value={currentUser.isPhonePublic}
              />
            </View>
          </View>

          <SectionHeader title="My Active Listings" hasTopBorder />

          {loadingListings ? (
            <ActivityIndicator size="small" color={COLORS.primary} style={{ marginTop: 20 }} />
          ) : (
            <View style={styles.row}>
              {myListings.length > 0 ? (
                myListings.map((listing) => (
                  <ListingCard
                    key={listing.id}
                    listing={listing}
                    onToggleFavourite={() => {}}
                    onPress={() => navigate('ListingDetails', { listing })}
                  />
                ))
              ) : (
                <Text style={{ color: COLORS.textMuted, marginTop: 10 }}>Ainda não tens anúncios ativos.</Text>
              )}
              {myListings.length === 1 ? <View style={styles.emptySlot} /> : null}
            </View>
          )}

          <TouchableOpacity
            style={styles.logoutButton}
            onPress={handleLogout}
            testID="logout-button"
          >
            <Text style={styles.logoutText}>Log Out</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      <Modal
        visible={isEditModalVisible}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Edit Profile</Text>
            <TouchableOpacity onPress={() => setEditModalVisible(false)}>
              <Text style={styles.modalClose}>Cancel</Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalBody} showsVerticalScrollIndicator={false}>
            <View style={styles.editPhotoContainer}>
              <Image source={{ uri: currentUser.photo }} style={styles.editPhoto} />
              <TouchableOpacity
                style={styles.changePhotoBtn}
                onPress={handleChangePhotoAlert}
              >
                <Text style={styles.changePhotoText}>Change Photo</Text>
              </TouchableOpacity>
            </View>

            <Text style={styles.inputLabel}>Full Name (Max 50 chars)</Text>
            <TextInput
              style={styles.textInput}
              value={editForm.name}
              onChangeText={handleNameChange}
              maxLength={50}
              placeholder="e.g. João Silva"
            />

            <Text style={styles.inputLabel}>Course (Max 50 chars)</Text>
            <TextInput
              style={styles.textInput}
              value={editForm.course}
              onChangeText={handleCourseChange}
              maxLength={50}
              placeholder="e.g. Informatics Engineering"
            />

            <Text style={styles.inputLabel}>Phone Number (Max 15 chars)</Text>
            <TextInput
              style={styles.textInput}
              value={editForm.phone}
              keyboardType="phone-pad"
              onChangeText={handlePhoneChange}
              maxLength={15}
              placeholder="e.g. +351912345678"
            />

            <TouchableOpacity style={styles.saveButton} onPress={handleSaveProfile}>
              <Text style={styles.saveButtonText}>Save Changes</Text>
            </TouchableOpacity>

            <View style={{ height: 40 }} />
          </ScrollView>
        </SafeAreaView>
      </Modal>
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
  logo: {
    fontSize: 22,
    fontWeight: '800',
    color: COLORS.primary,
    letterSpacing: -0.5,
  },
  settingsBtn: { padding: 4 },
  settingsIcon: { fontSize: 22 },
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
    marginBottom: 2,
  },
  userEmail: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginBottom: 6,
  },
  statsRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 4, gap: 6 },
  ratingText: { fontSize: 13, fontWeight: '600', color: COLORS.text },
  bulletPoint: { color: '#CCCCCC', fontSize: 12 },
  joinedText: { fontSize: 13, color: COLORS.textMuted },
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
    marginBottom: SPACING.lg,
  },
  actionButton: {
    flex: 1,
    height: 44,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.background,
    borderWidth: 1,
    borderColor: COLORS.borderDark,
  },
  actionButtonText: { color: COLORS.text, fontWeight: '600', fontSize: 14 },
  preferencesContainer: { paddingHorizontal: SPACING.horizontal, marginBottom: SPACING.lg },
  preferencesTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 12,
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 8,
  },
  settingTextContent: { flex: 1, paddingRight: SPACING.horizontal },
  settingLabel: { fontSize: 16, fontWeight: '600', color: COLORS.text, marginBottom: 4 },
  settingDescription: { fontSize: 13, color: COLORS.textMuted },
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: SPACING.horizontal,
    gap: SPACING.cardGap,
    marginBottom: SPACING.md,
  },
  emptySlot: { flex: 1 },
  logoutButton: {
    marginHorizontal: SPACING.horizontal,
    marginTop: 20,
    paddingVertical: 14,
    borderRadius: 8,
    backgroundColor: COLORS.dangerBackground,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.dangerBorder,
  },
  logoutText: { color: COLORS.danger, fontWeight: '700', fontSize: 15 },
  modalContainer: { flex: 1, backgroundColor: COLORS.background },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: SPACING.horizontal,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  modalTitle: { fontSize: 18, fontWeight: '700', color: COLORS.text },
  modalClose: { fontSize: 16, color: COLORS.primary, fontWeight: '600' },
  modalBody: { padding: SPACING.horizontal, paddingTop: SPACING.lg },
  editPhotoContainer: { alignItems: 'center', marginBottom: 24 },
  editPhoto: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: COLORS.border,
    marginBottom: 12,
  },
  changePhotoBtn: {
    paddingVertical: 6,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: COLORS.badgeBackground,
    borderWidth: 1,
    borderColor: COLORS.borderDark,
  },
  changePhotoText: { color: COLORS.text, fontWeight: '600', fontSize: 13 },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.textSecondary,
    marginBottom: 8,
  },
  textInput: {
    borderWidth: 1,
    borderColor: COLORS.borderDark,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginBottom: 20,
    color: COLORS.text,
  },
  saveButton: {
    backgroundColor: COLORS.primary,
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  saveButtonText: { color: COLORS.background, fontSize: 16, fontWeight: '700' },
});
import React, { useEffect, useState, useContext, useMemo } from 'react';
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
import { db } from '../../utils/firebase';
import ListingCard from '../../components/ListingCard';
import CommunityBadge from '../../components/CommunityBadge';
import SectionHeader from '../../components/SectionHeader';
import { SPACING } from '../../utils/theme';
import { UserContext } from '../../contexts/UserContext';
import { useTheme } from '../../contexts/ThemeContext';
import { uploadProfilePhoto } from '../../services/profileService';
import { validateProfileDisplayName } from '../../utils/validation';

export default function PrivateProfileScreen({ navigate }) {
  const { currentUser, updateUser, logout } = useContext(UserContext);
  const { colors, isDark, toggleTheme } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);

  const [myListings, setMyListings] = useState([]);
  const [loadingListings, setLoadingListings] = useState(true);
  const [isSavingProfile, setSavingProfile] = useState(false);
  const [isUploadingPhoto, setUploadingPhoto] = useState(false);

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
          console.error("Failed to load my listings:", error);
        } finally {
          setLoadingListings(false);
        }
      }
    };
    fetchMyListings();
  }, [currentUser?.id]);

  const handleNameChange = (text) => {
    setEditForm((prev) => ({ ...prev, name: text }));
  };

  const isValidCourseInput = (text) => Array.from(text).every((char) => {
    const code = char.codePointAt(0);

    return (
      char === ' ' ||
      (code >= 48 && code <= 57) ||
      (code >= 65 && code <= 90) ||
      (code >= 97 && code <= 122) ||
      (code >= 192 && code <= 214) ||
      (code >= 216 && code <= 246) ||
      (code >= 248 && code <= 255)
    );
  });

  const handleCourseChange = (text) => {
    if (isValidCourseInput(text)) {
      setEditForm((prev) => ({ ...prev, course: text }));
    }
  };

  const handlePhoneChange = (text) => {
    if (/^\+?[0-9]*$/.test(text)) {
      setEditForm((prev) => ({ ...prev, phone: text }));
    }
  };

  const handleSaveProfile = async () => {
    const sanitizedForm = {
      name: editForm.name.trim(),
      course: editForm.course.trim(),
      phone: editForm.phone.trim(),
    };
    const displayNameError = validateProfileDisplayName(sanitizedForm.name);

    if (displayNameError) {
      Alert.alert('Invalid name', displayNameError);
      return;
    }

    try {
      setSavingProfile(true);
      await updateUser(sanitizedForm);
      setEditModalVisible(false);
    } catch (error) {
      Alert.alert(
        'Profile not updated',
        error.message || 'Could not save the profile changes. Please try again.',
      );
    } finally {
      setSavingProfile(false);
    }
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
        mediaTypes: ['images'],
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.45,
        base64: true,
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
        quality: 0.45,
        base64: true,
        selectionLimit: 1,
      });
    }

    if (!result.canceled) {
      const selectedAsset = result.assets?.[0];

      try {
        setUploadingPhoto(true);
        const photoUrl = await uploadProfilePhoto(currentUser.id, selectedAsset);
        await updateUser({ photo: photoUrl });
      } catch (error) {
        Alert.alert(
          'Profile photo not updated',
          error.message || 'Choose a valid image and try again.',
        );
      } finally {
        setUploadingPhoto(false);
      }
    }
  };

  const handleChangePhotoAlert = () => {
    Alert.alert('Update Profile Photo', 'Choose where to get your new picture', [
      { text: 'Camera', onPress: () => pickImage(true) },
      { text: 'Gallery', onPress: () => pickImage(false) },
      { text: 'Cancel', style: 'cancel' },
    ]);
  };

  const togglePhoneVisibility = async () => {
    try {
      await updateUser({ isPhonePublic: !currentUser.isPhonePublic });
    } catch (error) {
      Alert.alert(
        'Privacy setting not updated',
        error.message || 'Could not update your privacy setting. Please try again.',
      );
    }
  };

  const handleLogout = () => {
    Alert.alert('Log Out', 'Are you sure you want to log out of EduCycle?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Log Out', style: 'destructive', onPress: () => logout?.() },
    ]);
  };

  return (
    <SafeAreaView style={styles.safeArea} testID="private-profile-screen">
      <StatusBar
        barStyle={isDark ? 'light-content' : 'dark-content'}
        backgroundColor={colors.background}
      />

      <View style={styles.header}>
        <Text style={styles.logo}>EduCycle</Text>
        <TouchableOpacity style={styles.themeToggleBtn} onPress={toggleTheme}>
          <Text style={styles.themeToggleIcon}>{isDark ? '☀️' : '🌙'}</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardDismissMode="on-drag"
      >
        <View style={styles.profileHeaderContainer}>
          <View style={styles.topSection}>
            <Image source={{ uri: currentUser.photo }} style={styles.profileImage} />
            <View style={styles.nameContainer}>
              <Text style={styles.userName}>{currentUser.name}</Text>
              <Text style={styles.userEmail}>{currentUser.email}</Text>

              <View style={styles.statsRow}>
                <Text style={styles.ratingText}>
                  {String.fromCodePoint(0x2B50)} {currentUser.rating} ({currentUser.reviewsCount})
                </Text>
                <Text style={styles.bulletPoint}>{'•'}</Text>
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
              testID="edit-profile-button"
            >
              <Text style={styles.actionButtonText}>Edit Profile</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.actionButton, { backgroundColor: colors.buttonGray }]}
              onPress={() => navigate('PublicProfile', { isPreview: true })}
            >
              <Text style={styles.actionButtonText}>{String.fromCodePoint(0x1F441, 0xFE0F)} Preview Public</Text>
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
                trackColor={{ false: colors.borderDark, true: colors.toggleActive }}
                thumbColor={currentUser.isPhonePublic ? colors.primary : colors.toggleInactive}
                ios_backgroundColor={colors.borderDark}
                onValueChange={togglePhoneVisibility}
                value={currentUser.isPhonePublic}
              />
            </View>
          </View>

          <SectionHeader title="My Active Listings" hasTopBorder />

          {loadingListings ? (
            <ActivityIndicator size="small" color={colors.primary} style={{ marginTop: 20 }} />
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
                <Text style={{ color: colors.textMuted, marginTop: 10 }}>You do not have active listings yet.</Text>
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

          <ScrollView style={styles.modalBody} showsVerticalScrollIndicator={false} keyboardDismissMode="on-drag">
            <View style={styles.editPhotoContainer}>
              <View style={styles.editPhotoWrapper}>
                <Image source={{ uri: currentUser.photo }} style={styles.editPhoto} />
                {isUploadingPhoto ? (
                  <View style={styles.photoLoadingOverlay} testID="profile-photo-uploading">
                    <ActivityIndicator size="small" color={colors.background} />
                  </View>
                ) : null}
              </View>
              <TouchableOpacity
                style={[styles.changePhotoBtn, isUploadingPhoto && styles.disabledButton]}
                onPress={handleChangePhotoAlert}
                disabled={isUploadingPhoto || isSavingProfile}
                testID="change-profile-photo-button"
              >
                <Text style={styles.changePhotoText}>
                  {isUploadingPhoto ? 'Uploading...' : 'Change Photo'}
                </Text>
              </TouchableOpacity>
            </View>

            <Text style={styles.inputLabel}>Display name (Max 50 chars)</Text>
            <TextInput
              style={styles.textInput}
              value={editForm.name}
              testID="input-display-name"
              onChangeText={handleNameChange}
              maxLength={50}
              placeholder="e.g. 02May02"
              placeholderTextColor={colors.textMuted}
            />

            <Text style={styles.inputLabel}>Course (Max 50 chars)</Text>
            <TextInput
              style={styles.textInput}
              value={editForm.course}
              testID="input-course"
              onChangeText={handleCourseChange}
              maxLength={50}
              placeholder="e.g. Informatics Engineering"
              placeholderTextColor={colors.textMuted}
            />

            <Text style={styles.inputLabel}>Phone Number (Max 15 chars)</Text>
            <TextInput
              style={styles.textInput}
              value={editForm.phone}
              testID="input-phone"
              keyboardType="phone-pad"
              onChangeText={handlePhoneChange}
              maxLength={15}
              placeholder="e.g. +351912345678"
              placeholderTextColor={colors.textMuted}
            />

            <TouchableOpacity
              style={[styles.saveButton, isSavingProfile && styles.disabledButton]}
              onPress={handleSaveProfile}
              disabled={isSavingProfile || isUploadingPhoto}
              testID="save-profile-button"
            >
              {isSavingProfile ? (
                <ActivityIndicator size="small" color={colors.background} />
              ) : (
                <Text style={styles.saveButtonText}>Save Changes</Text>
              )}
            </TouchableOpacity>

            <View style={{ height: 40 }} />
          </ScrollView>
        </SafeAreaView>
      </Modal>
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
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: SPACING.horizontal,
      paddingVertical: 12,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    logo: {
      fontSize: 22,
      fontWeight: '800',
      color: colors.primary,
      letterSpacing: -0.5,
    },
    themeToggleBtn: {
      padding: 6,
      borderRadius: 20,
      backgroundColor: colors.surface,
      borderWidth: 1,
      borderColor: colors.border,
    },
    themeToggleIcon: { fontSize: 18 },
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
      marginBottom: 2,
    },
    userEmail: {
      fontSize: 14,
      color: colors.textSecondary,
      marginBottom: 6,
    },
    statsRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 4, gap: 6 },
    ratingText: { fontSize: 13, fontWeight: '600', color: colors.text },
    bulletPoint: { color: colors.borderDark, fontSize: 12 },
    joinedText: { fontSize: 13, color: colors.textMuted },
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
      marginBottom: SPACING.lg,
    },
    actionButton: {
      flex: 1,
      height: 44,
      borderRadius: 8,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: colors.background,
      borderWidth: 1,
      borderColor: colors.borderDark,
    },
    actionButtonText: { color: colors.text, fontWeight: '600', fontSize: 14 },
    preferencesContainer: { paddingHorizontal: SPACING.horizontal, marginBottom: SPACING.lg },
    preferencesTitle: {
      fontSize: 14,
      fontWeight: '700',
      color: colors.textMuted,
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
    settingLabel: { fontSize: 16, fontWeight: '600', color: colors.text, marginBottom: 4 },
    settingDescription: { fontSize: 13, color: colors.textMuted },
    row: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      paddingHorizontal: SPACING.horizontal,
      gap: 12,
      marginBottom: SPACING.md,
    },
    emptySlot: { flex: 1 },
    logoutButton: {
      marginHorizontal: SPACING.horizontal,
      marginTop: 20,
      paddingVertical: 14,
      borderRadius: 8,
      backgroundColor: colors.dangerBackground,
      alignItems: 'center',
      borderWidth: 1,
      borderColor: colors.dangerBorder,
    },
    logoutText: { color: colors.danger, fontWeight: '700', fontSize: 15 },
    modalContainer: { flex: 1, backgroundColor: colors.background },
    modalHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: SPACING.horizontal,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    modalTitle: { fontSize: 18, fontWeight: '700', color: colors.text },
    modalClose: { fontSize: 16, color: colors.primary, fontWeight: '600' },
    modalBody: { padding: SPACING.horizontal, paddingTop: SPACING.lg },
    editPhotoContainer: { alignItems: 'center', marginBottom: 24 },
    editPhotoWrapper: {
      width: 100,
      height: 100,
      borderRadius: 50,
      marginBottom: 12,
      overflow: 'hidden',
    },
    editPhoto: {
      width: 100,
      height: 100,
      borderRadius: 50,
      backgroundColor: colors.border,
    },
    photoLoadingOverlay: {
      ...StyleSheet.absoluteFillObject,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: 'rgba(0, 0, 0, 0.45)',
    },
    changePhotoBtn: {
      paddingVertical: 6,
      paddingHorizontal: 16,
      borderRadius: 20,
      backgroundColor: colors.badgeBackground,
      borderWidth: 1,
      borderColor: colors.borderDark,
    },
    changePhotoText: { color: colors.text, fontWeight: '600', fontSize: 13 },
    inputLabel: {
      fontSize: 14,
      fontWeight: '600',
      color: colors.textSecondary,
      marginBottom: 8,
    },
    textInput: {
      borderWidth: 1,
      borderColor: colors.borderDark,
      borderRadius: 8,
      padding: 12,
      fontSize: 16,
      marginBottom: 20,
      color: colors.text,
      backgroundColor: colors.cardInput,
    },
    saveButton: {
      backgroundColor: colors.primary,
      padding: 16,
      borderRadius: 8,
      alignItems: 'center',
      marginTop: 10,
    },
    disabledButton: { opacity: 0.6 },
    saveButtonText: { color: colors.background, fontSize: 16, fontWeight: '700' },
  });
}

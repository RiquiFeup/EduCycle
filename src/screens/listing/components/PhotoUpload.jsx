import React from 'react';
import { View, Text, TouchableOpacity, Image, ScrollView, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import styles from '../styles';

export default function PhotoUpload({ photos = [], setPhotos, error }) {
  const pickImages = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission Denied', 'Sorry, we need camera roll permissions to make this work!');
      return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsMultipleSelection: true,
      selectionLimit: 5,
      quality: 0.1,
    });

    if (!result.canceled) {
      const selected = result.assets.map(asset => asset.uri);
      const newPhotos = [...photos, ...selected].slice(0, 5); // Max 5
      setPhotos(newPhotos);
    }
  };

  const removePhoto = (index) => {
    const newPhotos = [...photos];
    newPhotos.splice(index, 1);
    setPhotos(newPhotos);
  };

  return (
    <View>
      {photos.length > 0 ? (
        <ScrollView horizontal style={styles.thumbnailContainer} showsHorizontalScrollIndicator={false}>
          {photos.map((uri, index) => (
            <View key={index} testID={`photo-upload-added-${index}`} style={styles.thumbnailWrapper}>
              <Image source={{ uri }} style={styles.thumbnail} />
              <TouchableOpacity testID={`remove-photo-${index}`} style={styles.removeBtn} onPress={() => removePhoto(index)}>
                <Text style={styles.removeBtnText}>X</Text>
              </TouchableOpacity>
            </View>
          ))}
          {photos.length < 5 && (
            <TouchableOpacity testID="photo-upload-area" style={styles.addMoreBtn} onPress={pickImages}>
              <Text style={styles.addMoreIcon}>+</Text>
            </TouchableOpacity>
          )}
        </ScrollView>
      ) : (
        <TouchableOpacity
          testID="photo-upload-area"
          style={styles.photoArea}
          onPress={pickImages}
          accessibilityLabel="Tap to add photos"
        >
          <Text style={styles.photoIcon}>📷</Text>
          <Text
            testID="photo-upload-empty"
            style={styles.photoLabel}
          >
            Tap to add photos
          </Text>
        </TouchableOpacity>
      )}
      {error && (
        <Text testID="error-photo" style={styles.error}>{error}</Text>
      )}
    </View>
  );
}

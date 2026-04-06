import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import styles from '../styles';

export default function PhotoUpload({ hasPhoto, setHasPhoto, error }) {
  return (
    <View>
      <TouchableOpacity
        testID="photo-upload-area"
        style={[styles.photoArea, hasPhoto && styles.photoAreaFilled]}
        onPress={() => setHasPhoto(true)}
        accessibilityLabel="Tap to add photos"
      >
        <Text style={styles.photoIcon}>📷</Text>
        <Text
          testID={hasPhoto ? 'photo-upload-added' : 'photo-upload-empty'}
          style={styles.photoLabel}
        >
          {hasPhoto ? '✓ Photo added' : 'Tap to add photos'}
        </Text>
      </TouchableOpacity>
      {error && (
        <Text testID="error-photo" style={styles.error}>{error}</Text>
      )}
    </View>
  );
}

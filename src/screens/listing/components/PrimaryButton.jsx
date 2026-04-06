import React from 'react';
import { TouchableOpacity, Text } from 'react-native';
import styles from '../styles';

export default function PrimaryButton({
  title,
  onPress,
  testID,
  accessibilityLabel
}) {
  return (
    <TouchableOpacity
      testID={testID}
      style={styles.btnPublish}
      onPress={onPress}
      accessibilityLabel={accessibilityLabel}
    >
      <Text style={styles.btnPublishText}>{title}</Text>
    </TouchableOpacity>
  );
}

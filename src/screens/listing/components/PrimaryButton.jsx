import React, { useMemo } from 'react';
import { TouchableOpacity, Text } from 'react-native';
import { useTheme } from '../../../contexts/ThemeContext';
import createStyles from '../styles';

export default function PrimaryButton({
  title,
  onPress,
  testID,
  accessibilityLabel
}) {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);

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

import React, { useMemo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '../contexts/ThemeContext';

export default function CommunityBadge({ name }) {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);

  return (
    <View style={styles.badge}>
      <Text style={styles.text}>📍 {name}</Text>
    </View>
  );
}

function createStyles(colors) {
  return StyleSheet.create({
    badge: {
      backgroundColor: colors.badgeBackground,
      paddingVertical: 4,
      paddingHorizontal: 8,
      borderRadius: 6,
      borderWidth: 1,
      borderColor: colors.borderDark,
    },
    text: {
      fontSize: 12,
      color: colors.textSecondary,
      fontWeight: '600',
    },
  });
}

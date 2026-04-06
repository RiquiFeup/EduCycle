import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS } from '../utils/theme';

export default function CommunityBadge({ name }) {
  return (
    <View style={styles.badge}>
      <Text style={styles.text}>📍 {name}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    backgroundColor: COLORS.badgeBackground,
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: COLORS.borderDark,
  },
  text: {
    fontSize: 12,
    color: COLORS.textSecondary,
    fontWeight: '600',
  },
});
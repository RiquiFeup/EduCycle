import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { useTheme } from '../contexts/ThemeContext';

export default function SearchBar({ value, onChangeText, placeholder, testID, onFilterPress }) {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const [focused, setFocused] = useState(false);

  return (
    <View style={[styles.wrapper, focused && styles.wrapperFocused]}>
      <Text style={styles.icon}>🔍</Text>
      <TextInput
        style={styles.input}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder ?? 'Search books, calculators, notes...'}
        placeholderTextColor={colors.textMuted}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        returnKeyType="search"
        testID={testID ?? 'search-input'}
      />
      <TouchableOpacity style={styles.filterBtn} onPress={onFilterPress}>
        <Text style={styles.filterIcon}>⚙</Text>
      </TouchableOpacity>
    </View>
  );
}

function createStyles(colors) {
  return StyleSheet.create({
    wrapper: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.surface,
      borderRadius: 12,
      paddingHorizontal: 12,
      paddingVertical: 8,
      borderWidth: 1.5,
      borderColor: 'transparent',
    },
    wrapperFocused: {
      borderColor: colors.primary,
      backgroundColor: colors.cardInput,
    },
    icon: {
      fontSize: 16,
      marginRight: 8,
      color: colors.textMuted,
    },
    input: {
      flex: 1,
      fontSize: 14,
      color: colors.text,
    },
    filterBtn: {
      marginLeft: 8,
      padding: 4,
    },
    filterIcon: {
      fontSize: 18,
      color: colors.textSecondary,
    },
  });
}

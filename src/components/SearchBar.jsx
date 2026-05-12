import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';

export default function SearchBar({ value, onChangeText, placeholder, testID, onFilterPress }) {
  const [focused, setFocused] = useState(false);

  return (
    <View style={[styles.wrapper, focused && styles.wrapperFocused]}>
      {/* Search icon */}
      <Text style={styles.icon}>🔍</Text>
      <TextInput
        style={styles.input}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder ?? 'Search books, calculators, notes...'}
        placeholderTextColor="#AAAAAA"
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        returnKeyType="search"
        testID={testID ?? 'search-input'}
      />
      {/* Filter button */}
      <TouchableOpacity style={styles.filterBtn} onPress={onFilterPress}>
        <Text style={styles.filterIcon}>⚙</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderWidth: 1.5,
    borderColor: 'transparent',
  },
  wrapperFocused: {
    borderColor: '#2E8B57',
    backgroundColor: '#FFFFFF',
  },
  icon: {
    fontSize: 16,
    marginRight: 8,
    color: '#AAAAAA',
  },
  input: {
    flex: 1,
    fontSize: 14,
    color: '#1A1A1A',
  },
  filterBtn: {
    marginLeft: 8,
    padding: 4,
  },
  filterIcon: {
    fontSize: 18,
    color: '#555555',
  },
});

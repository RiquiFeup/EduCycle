import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import styles from '../styles';

export default function DropdownField({
  label,
  options,
  selectedValue,
  onSelect,
  testIDPrefix,
  error,
  placeholder,
  isRequired = false,
  isCampus = false,
}) {
  return (
    <View>
      <Text style={styles.label}>
        {label} {isRequired && <Text style={styles.required}>*</Text>}
      </Text>
      <View
        testID={`dropdown-${testIDPrefix}`}
        style={[styles.dropdown, isCampus && styles.campusDropdown, error && styles.inputError]}
      >
        {options.map(item => (
          <TouchableOpacity
            key={item}
            testID={`${testIDPrefix}-option-${item}`}
            onPress={() => onSelect(item)}
            style={[styles.option, selectedValue === item && styles.optionSelected]}
          >
            <Text style={selectedValue === item ? styles.optionTextSelected : styles.optionText}>
              {item}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
      {selectedValue === '' && (
        <Text style={styles.placeholder}>{placeholder}</Text>
      )}
      {selectedValue !== '' && (
        <Text testID={`selected-${testIDPrefix}`} style={styles.selectedValue}>{selectedValue}</Text>
      )}
      {error && (
        <Text testID={`error-${testIDPrefix}`} style={styles.error}>{error}</Text>
      )}
    </View>
  );
}

import React, { useState, useMemo } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useTheme } from '../../../contexts/ThemeContext';
import createStyles from '../styles';

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
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const [isOpen, setIsOpen] = useState(false);

  return (
    <View>
      <Text style={styles.label}>
        {label} {isRequired && <Text style={styles.required}>*</Text>}
      </Text>
      
      {/* Clickable Header Area to open/close the dropdown */}
      <TouchableOpacity
        testID={`dropdown-header-${testIDPrefix}`}
        onPress={() => setIsOpen(!isOpen)}
        style={[
          styles.dropdown, 
          isCampus && styles.campusDropdown, 
          error && styles.inputError
        ]}
      >
        <Text style={selectedValue !== '' ? styles.selectedValue : styles.placeholder}>
          {selectedValue !== '' ? selectedValue : placeholder}
        </Text>
      </TouchableOpacity>

      {/* Conditionally rendering options container based on state */}
      {isOpen && (
        <View
          testID={`dropdown-${testIDPrefix}`}
          style={[styles.dropdown, isCampus && styles.campusDropdown, { marginTop: 5 }]}
        >
          {options.map(item => (
            <TouchableOpacity
              key={item}
              testID={`${testIDPrefix}-option-${item}`}
              onPress={() => {
                onSelect(item);
                setIsOpen(false);
              }}
              style={[styles.option, selectedValue === item && styles.optionSelected]}
            >
              <Text style={selectedValue === item ? styles.optionTextSelected : styles.optionText}>
                {item}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      )}

      {error && (
        <Text testID={`error-${testIDPrefix}`} style={styles.error}>{error}</Text>
      )}
    </View>
  );
}
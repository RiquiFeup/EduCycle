import React from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import styles from '../styles';

export default function InputField({
  label,
  value,
  onChangeText,
  placeholder,
  error,
  testID,
  isRequired = false,
  keyboardType = 'default',
  hint,
  accessibilityLabel
}) {
  return (
    <View>
      <Text style={styles.label}>
        {label} {isRequired && <Text style={styles.required}>*</Text>}
      </Text>
      <TextInput
        testID={testID}
        style={[styles.input, error && styles.inputError]}
        placeholder={placeholder}
        keyboardType={keyboardType}
        value={value}
        onChangeText={onChangeText}
        accessibilityLabel={accessibilityLabel || label}
      />
      {hint && <Text style={styles.hint}>{hint}</Text>}
      {error && <Text testID={`error-${testID.replace('input-', '')}`} style={styles.error}>{error}</Text>}
    </View>
  );
}

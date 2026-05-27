import React, { useMemo } from 'react';
import { View, Text, TextInput } from 'react-native';
import { useTheme } from '../../../contexts/ThemeContext';
import createStyles from '../styles';

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
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);

  return (
    <View>
      <Text style={styles.label}>
        {label} {isRequired && <Text style={styles.required}>*</Text>}
      </Text>
      <TextInput
        testID={testID}
        style={[styles.input, error && styles.inputError]}
        placeholder={placeholder}
        placeholderTextColor={colors.textMuted}
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

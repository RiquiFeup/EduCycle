import React, { useMemo } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../../contexts/ThemeContext';
import createStyles from '../styles';

export default function SegmentedControl({
  label,
  options,
  selectedValue,
  onSelect,
}) {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);

  return (
    <View>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.segmentedControl}>
        {options.map(type => (
          <TouchableOpacity
            key={type}
            testID={`listing-type-${type.toLowerCase()}`}
            style={[
              styles.segment,
              selectedValue === type && styles.segmentActive,
            ]}
            onPress={() => onSelect(type)}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
              <Ionicons
                name={type === 'Sell' ? 'cash-outline' : 'swap-horizontal-outline'}
                size={14}
                color={selectedValue === type ? '#fff' : colors.textMuted}
              />
              <Text style={[
                styles.segmentText,
                selectedValue === type && styles.segmentTextActive,
              ]}>
                {type}
              </Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

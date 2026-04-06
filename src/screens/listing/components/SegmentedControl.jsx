import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import styles from '../styles';

export default function SegmentedControl({
  label,
  options,
  selectedValue,
  onSelect,
}) {
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
            <Text style={[
              styles.segmentText,
              selectedValue === type && styles.segmentTextActive,
            ]}>
              {type === 'Sell' ? '💰 Sell' : '🔄 Swap'}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

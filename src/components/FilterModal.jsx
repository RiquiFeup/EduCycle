import React from 'react';
import {
  View,
  Text,
  Modal,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS, SPACING } from '../utils/theme';

const SUBJECTS = ['Mathematics', 'Physics', 'Portuguese', 'History', 'Chemistry', 'Biology'];
const CAMPUSES = ['FEUP', 'ISEP', 'UP Law', 'Colégio Dom Dinis', 'Other'];

export default function FilterModal({
  visible,
  onClose,
  filters,
  setFilters,
  onApply,
}) {
  const toggleCategory = (category) => {
    setFilters((prev) => ({
      ...prev,
      category: prev.category === category ? '' : category,
    }));
  };

  const toggleCampus = (campus) => {
    setFilters((prev) => ({
      ...prev,
      academicLevel: prev.academicLevel === campus ? '' : campus,
    }));
  };

  const clearFilters = () => {
    setFilters({
      category: '',
      academicLevel: '',
      minPrice: '',
      maxPrice: '',
    });
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
            <Text style={styles.closeIcon}>✕</Text>
          </TouchableOpacity>
          <Text style={styles.title}>Filters</Text>
          <TouchableOpacity onPress={clearFilters}>
            <Text style={styles.clearText}>Clear</Text>
          </TouchableOpacity>
        </View>

        <ScrollView contentContainerStyle={styles.content}>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Category (Subject)</Text>
            <View style={styles.chipsContainer}>
              {SUBJECTS.map((subject) => (
                <TouchableOpacity
                  key={subject}
                  style={[
                    styles.chip,
                    filters.category === subject && styles.chipActive,
                  ]}
                  onPress={() => toggleCategory(subject)}
                >
                  <Text
                    style={[
                      styles.chipText,
                      filters.category === subject && styles.chipTextActive,
                    ]}
                  >
                    {subject}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Academic Level (Campus)</Text>
            <View style={styles.chipsContainer}>
              {CAMPUSES.map((campus) => (
                <TouchableOpacity
                  key={campus}
                  style={[
                    styles.chip,
                    filters.academicLevel === campus && styles.chipActive,
                  ]}
                  onPress={() => toggleCampus(campus)}
                >
                  <Text
                    style={[
                      styles.chipText,
                      filters.academicLevel === campus && styles.chipTextActive,
                    ]}
                  >
                    {campus}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Price Range (€)</Text>
            <View style={styles.priceRow}>
              <TextInput
                style={styles.priceInput}
                placeholder="Min"
                keyboardType="numeric"
                value={filters.minPrice}
                onChangeText={(val) => setFilters((prev) => ({ ...prev, minPrice: val }))}
              />
              <Text style={styles.priceSeparator}>-</Text>
              <TextInput
                style={styles.priceInput}
                placeholder="Max"
                keyboardType="numeric"
                value={filters.maxPrice}
                onChangeText={(val) => setFilters((prev) => ({ ...prev, maxPrice: val }))}
              />
            </View>
          </View>
        </ScrollView>

        <View style={styles.footer}>
          <TouchableOpacity style={styles.applyBtn} onPress={onApply}>
            <Text style={styles.applyBtnText}>Apply Filters</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: SPACING.horizontal,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  closeBtn: {
    padding: 4,
  },
  closeIcon: {
    fontSize: 20,
    color: COLORS.text,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.text,
  },
  clearText: {
    fontSize: 16,
    color: COLORS.primary,
    fontWeight: '500',
  },
  content: {
    padding: SPACING.horizontal,
    paddingBottom: SPACING.xl,
  },
  section: {
    marginBottom: SPACING.lg,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: SPACING.sm,
  },
  chipsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.sm,
  },
  chip: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
    backgroundColor: '#F0F0F0',
    borderWidth: 1,
    borderColor: 'transparent',
  },
  chipActive: {
    backgroundColor: '#E6F4EA',
    borderColor: COLORS.primary,
  },
  chipText: {
    fontSize: 14,
    color: COLORS.text,
  },
  chipTextActive: {
    color: COLORS.primary,
    fontWeight: '600',
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  priceInput: {
    flex: 1,
    height: 44,
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    paddingHorizontal: 12,
    fontSize: 16,
  },
  priceSeparator: {
    fontSize: 18,
    color: COLORS.textMuted,
  },
  footer: {
    padding: SPACING.horizontal,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    paddingBottom: SPACING.lg,
  },
  applyBtn: {
    backgroundColor: COLORS.primary,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  applyBtnText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },
});

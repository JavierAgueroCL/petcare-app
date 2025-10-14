/**
 * PetCare Mobile - Componente Select
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { COLORS, SPACING, FONTS, BORDER_RADIUS } from '../constants/theme';

const Select = ({
  label,
  value,
  onValueChange,
  items = [],
  error,
  style,
  ...props
}) => {
  return (
    <View style={[styles.container, style]}>
      {label && <Text style={styles.label}>{label}</Text>}
      <View style={[styles.pickerContainer, error && styles.pickerError]}>
        <Picker
          selectedValue={value}
          onValueChange={onValueChange}
          style={styles.picker}
          {...props}
        >
          {items.map((item, index) => (
            <Picker.Item
              key={index}
              label={item.label}
              value={item.value}
            />
          ))}
        </Picker>
      </View>
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: SPACING.md,
  },
  label: {
    fontSize: FONTS.sizes.sm,
    fontWeight: FONTS.weights.medium,
    color: COLORS.textPrimary,
    marginBottom: SPACING.xs,
  },
  pickerContainer: {
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    overflow: 'hidden',
  },
  pickerError: {
    borderColor: COLORS.error,
  },
  picker: {
    height: 50,
  },
  errorText: {
    fontSize: FONTS.sizes.xs,
    color: COLORS.error,
    marginTop: SPACING.xs,
  },
});

export default Select;

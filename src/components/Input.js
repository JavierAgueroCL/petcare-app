/**
 * PetCare Mobile - Componente Input
 */

import React from 'react';
import { View, TextInput, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING, FONTS, BORDER_RADIUS } from '../constants/theme';

const Input = ({
  label,
  value,
  onChangeText,
  placeholder,
  secureTextEntry = false,
  keyboardType = 'default',
  autoCapitalize = 'sentences',
  error,
  leftIcon,
  rightIcon,
  multiline = false,
  numberOfLines = 1,
  editable = true,
  style,
  ...props
}) => {
  return (
    <View style={[styles.container, style]}>
      {label && <Text style={styles.label}>{label}</Text>}

      <View style={[styles.inputContainer, error && styles.inputContainer_error]}>
        {leftIcon && (
          <Ionicons
            name={leftIcon}
            size={20}
            color={COLORS.textSecondary}
            style={styles.leftIcon}
          />
        )}

        <TextInput
          style={[
            styles.input,
            leftIcon && styles.input_withLeftIcon,
            rightIcon && styles.input_withRightIcon,
            multiline && styles.input_multiline,
            !editable && styles.input_disabled,
          ]}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={COLORS.textDisabled}
          secureTextEntry={secureTextEntry}
          keyboardType={keyboardType}
          autoCapitalize={autoCapitalize}
          multiline={multiline}
          numberOfLines={numberOfLines}
          editable={editable}
          {...props}
        />

        {rightIcon && (
          <Ionicons
            name={rightIcon}
            size={20}
            color={COLORS.textSecondary}
            style={styles.rightIcon}
          />
        )}
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
    fontSize: FONTS.sizes.md,
    fontWeight: FONTS.weights.medium,
    color: COLORS.textPrimary,
    marginBottom: SPACING.xs,
  },

  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: BORDER_RADIUS.md,
    paddingHorizontal: SPACING.md,
  },

  inputContainer_error: {
    borderColor: COLORS.error,
  },

  input: {
    flex: 1,
    fontSize: FONTS.sizes.md,
    color: COLORS.textPrimary,
    paddingVertical: SPACING.md,
  },

  input_withLeftIcon: {
    paddingLeft: SPACING.xs,
  },

  input_withRightIcon: {
    paddingRight: SPACING.xs,
  },

  input_multiline: {
    minHeight: 100,
    textAlignVertical: 'top',
    paddingTop: SPACING.md,
  },

  input_disabled: {
    backgroundColor: COLORS.background,
    color: COLORS.textDisabled,
  },

  leftIcon: {
    marginRight: SPACING.xs,
  },

  rightIcon: {
    marginLeft: SPACING.xs,
  },

  errorText: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.error,
    marginTop: SPACING.xs,
  },
});

export default Input;

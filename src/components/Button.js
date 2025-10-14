/**
 * PetCare Mobile - Componente Button
 */

import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { COLORS, SPACING, FONTS, BORDER_RADIUS, SHADOWS } from '../constants/theme';

const Button = ({
  title,
  onPress,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  loading = false,
  icon,
  style,
  textStyle,
}) => {
  const buttonStyles = [
    styles.button,
    styles[`button_${variant}`],
    styles[`button_${size}`],
    disabled && styles.button_disabled,
    style,
  ];

  const textStyles = [
    styles.text,
    styles[`text_${variant}`],
    styles[`text_${size}`],
    disabled && styles.text_disabled,
    textStyle,
  ];

  return (
    <TouchableOpacity
      style={buttonStyles}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.7}
    >
      {loading ? (
        <ActivityIndicator
          color={variant === 'primary' ? COLORS.textWhite : COLORS.primary}
        />
      ) : (
        <>
          {icon && <>{icon}</>}
          <Text style={textStyles}>{title}</Text>
        </>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: BORDER_RADIUS.md,
    ...SHADOWS.small,
  },

  // Variants
  button_primary: {
    backgroundColor: COLORS.primary,
  },
  button_secondary: {
    backgroundColor: COLORS.secondary,
  },
  button_outline: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: COLORS.primary,
  },
  button_ghost: {
    backgroundColor: 'transparent',
  },
  button_danger: {
    backgroundColor: COLORS.error,
  },

  // Sizes
  button_small: {
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.md,
  },
  button_medium: {
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.lg,
  },
  button_large: {
    paddingVertical: SPACING.lg,
    paddingHorizontal: SPACING.xl,
  },

  // Disabled state
  button_disabled: {
    backgroundColor: COLORS.textDisabled,
    opacity: 0.6,
  },

  // Text styles
  text: {
    fontWeight: FONTS.weights.semibold,
    textAlign: 'center',
  },

  // Text variants
  text_primary: {
    color: COLORS.textWhite,
  },
  text_secondary: {
    color: COLORS.textWhite,
  },
  text_outline: {
    color: COLORS.primary,
  },
  text_ghost: {
    color: COLORS.primary,
  },
  text_danger: {
    color: COLORS.textWhite,
  },

  // Text sizes
  text_small: {
    fontSize: FONTS.sizes.sm,
  },
  text_medium: {
    fontSize: FONTS.sizes.md,
  },
  text_large: {
    fontSize: FONTS.sizes.lg,
  },

  // Text disabled
  text_disabled: {
    color: COLORS.textWhite,
  },
});

export default Button;

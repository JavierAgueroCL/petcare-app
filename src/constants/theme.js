/**
 * PetCare Mobile - Tema y estilos
 */

export const COLORS = {
  // Colores principales
  primary: '#FF6B6B',
  primaryDark: '#E85555',
  primaryLight: '#FF9999',

  secondary: '#4ECDC4',
  secondaryDark: '#3DB5AD',
  secondaryLight: '#7EDDD7',

  // Colores de estado
  success: '#51CF66',
  warning: '#FFD93D',
  error: '#FF6B6B',
  info: '#4DABF7',

  // Colores de fondo
  background: '#F8F9FA',
  surface: '#FFFFFF',
  card: '#FFFFFF',

  // Colores de texto
  textPrimary: '#212529',
  textSecondary: '#6C757D',
  textDisabled: '#ADB5BD',
  textWhite: '#FFFFFF',

  // Bordes y divisores
  border: '#DEE2E6',
  divider: '#E9ECEF',

  // Transparencias
  overlay: 'rgba(0, 0, 0, 0.5)',
  backdrop: 'rgba(0, 0, 0, 0.3)',
};

export const SPACING = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const FONTS = {
  regular: 'System',
  medium: 'System',
  bold: 'System',

  sizes: {
    xs: 12,
    sm: 14,
    md: 16,
    lg: 18,
    xl: 20,
    xxl: 24,
    xxxl: 32,
  },

  weights: {
    regular: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
  },
};

export const SHADOWS = {
  small: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  medium: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 4,
  },
  large: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 8,
  },
};

export const BORDER_RADIUS = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  round: 9999,
};

export const LAYOUT = {
  screenPadding: SPACING.md,
  cardPadding: SPACING.md,
  headerHeight: 60,
  tabBarHeight: 60,
};

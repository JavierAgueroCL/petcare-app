/**
 * PetCare Mobile - Configuración
 */

export const API_CONFIG = {
  BASE_URL: process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000/api',
  TIMEOUT: parseInt(process.env.EXPO_PUBLIC_API_TIMEOUT || '30000', 10),
};

export const APP_CONFIG = {
  name: 'PetCare',
  version: '1.0.0',
  environment: process.env.EXPO_PUBLIC_ENV || 'development',
};

export const IMAGE_CONFIG = {
  maxSize: 10 * 1024 * 1024, // 10MB
  quality: 0.8,
  allowedTypes: ['image/jpeg', 'image/png', 'image/jpg'],
};

export const PAGINATION = {
  defaultLimit: 20,
  maxLimit: 100,
};

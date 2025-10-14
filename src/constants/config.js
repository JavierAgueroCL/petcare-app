/**
 * PetCare Mobile - Configuración
 */

export const API_CONFIG = {
  BASE_URL: 'http://localhost:3000/api',
  TIMEOUT: 30000,
};

export const AUTH0_CONFIG = {
  domain: process.env.EXPO_PUBLIC_AUTH0_DOMAIN || 'your-domain.auth0.com',
  clientId: process.env.EXPO_PUBLIC_AUTH0_CLIENT_ID || 'your-client-id',
  audience: process.env.EXPO_PUBLIC_AUTH0_AUDIENCE || 'https://api.petcare.cl',
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

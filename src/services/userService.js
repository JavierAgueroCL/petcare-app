/**
 * PetCare Mobile - Servicio de Usuario
 */

import { get, put } from './api';

// =====================================================
// PERFIL DE USUARIO / USER PROFILE
// =====================================================

/**
 * Obtener perfil del usuario
 */
export const getUserProfile = async () => {
  return await get('/users/me');
};

// =====================================================
// CONFIGURACIONES DE USUARIO / USER SETTINGS
// =====================================================

/**
 * Obtener configuración de notificaciones
 */
export const getNotificationSettings = async () => {
  return await get('/users/settings/notifications');
};

/**
 * Actualizar configuración de notificaciones
 */
export const updateNotificationSettings = async (settings) => {
  return await put('/users/settings/notifications', settings);
};

/**
 * Obtener preferencias del usuario
 */
export const getPreferences = async () => {
  return await get('/users/settings/preferences');
};

/**
 * Actualizar preferencias del usuario
 */
export const updatePreferences = async (preferences) => {
  return await put('/users/settings/preferences', preferences);
};

/**
 * Actualizar idioma del usuario
 */
export const updateLanguage = async (language) => {
  return await put('/users/settings/language', { language });
};

export default {
  getUserProfile,
  getNotificationSettings,
  updateNotificationSettings,
  getPreferences,
  updatePreferences,
  updateLanguage,
};

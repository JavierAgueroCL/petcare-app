/**
 * PetCare Mobile - Servicio de Autenticación
 */

import { post, get } from './api';
import { saveAuthToken, saveUserData, removeAuthToken, removeUserData } from '../utils/storage';

/**
 * Login de usuario
 */
export const login = async (email, password) => {
  const response = await post('/auth/login', { email, password });

  // Si el servidor respondió con éxito
  if (response.success && response.data) {
    await saveSession(response.data.token, response.data.user);
    return {
      success: true,
      user: response.data.user,
      token: response.data.token,
    };
  }

  // Si el servidor respondió con error
  return {
    success: false,
    message: response.message || 'Error al iniciar sesión',
    error: response.error || 'Error desconocido',
  };
};

/**
 * Registro de usuario
 */
export const register = async (userData) => {
  const response = await post('/auth/register', userData);

  // Si el servidor respondió con éxito
  if (response.success && response.data) {
    await saveSession(response.data.token, response.data.user);
    return {
      success: true,
      user: response.data.user,
      token: response.data.token,
    };
  }

  // Si el servidor respondió con error
  return {
    success: false,
    message: response.message || 'Error al registrar usuario',
    error: response.error || 'Error desconocido',
  };
};

/**
 * Validar token actual
 */
export const validateToken = async () => {
  const response = await get('/auth/validate');
  return response.success === true;
};

/**
 * Guardar sesión del usuario
 */
export const saveSession = async (token, userData) => {
  await saveAuthToken(token);
  await saveUserData(userData);
};

/**
 * Cerrar sesión
 */
export const clearSession = async () => {
  await removeAuthToken();
  await removeUserData();
};

/**
 * Obtener perfil del usuario
 */
export const getProfile = async () => {
  return await get('/users/me');
};

/**
 * Actualizar perfil del usuario
 */
export const updateProfile = async (profileData) => {
  return await post('/users/me', profileData);
};

/**
 * Subir foto de perfil
 */
export const uploadProfileImage = async (imageUri, onProgress) => {
  const formData = new FormData();
  formData.append('image', {
    uri: imageUri,
    type: 'image/jpeg',
    name: 'profile.jpg',
  });

  return await post('/users/me/image', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
    onUploadProgress: onProgress,
  });
};

/**
 * Eliminar foto de perfil
 */
export const deleteProfileImage = async () => {
  return await post('/users/me/image', {});
};

export default {
  login,
  register,
  validateToken,
  saveSession,
  clearSession,
  getProfile,
  updateProfile,
  uploadProfileImage,
  deleteProfileImage,
};

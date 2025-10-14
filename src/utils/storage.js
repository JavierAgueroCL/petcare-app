/**
 * PetCare Mobile - Almacenamiento local
 */

import AsyncStorage from '@react-native-async-storage/async-storage';

const KEYS = {
  AUTH_TOKEN: '@petcare_auth_token',
  USER_DATA: '@petcare_user_data',
  REFRESH_TOKEN: '@petcare_refresh_token',
  LAST_SYNC: '@petcare_last_sync',
};

/**
 * Guardar datos en AsyncStorage
 */
export const setItem = async (key, value) => {
  try {
    const jsonValue = JSON.stringify(value);
    await AsyncStorage.setItem(key, jsonValue);
    return true;
  } catch (error) {
    console.error('Error saving data:', error);
    return false;
  }
};

/**
 * Obtener datos de AsyncStorage
 */
export const getItem = async (key) => {
  try {
    const jsonValue = await AsyncStorage.getItem(key);
    return jsonValue != null ? JSON.parse(jsonValue) : null;
  } catch (error) {
    console.error('Error reading data:', error);
    return null;
  }
};

/**
 * Eliminar datos de AsyncStorage
 */
export const removeItem = async (key) => {
  try {
    await AsyncStorage.removeItem(key);
    return true;
  } catch (error) {
    console.error('Error removing data:', error);
    return false;
  }
};

/**
 * Limpiar todos los datos
 */
export const clearAll = async () => {
  try {
    await AsyncStorage.clear();
    return true;
  } catch (error) {
    console.error('Error clearing data:', error);
    return false;
  }
};

// Funciones específicas para autenticación
export const saveAuthToken = (token) => setItem(KEYS.AUTH_TOKEN, token);
export const getAuthToken = () => getItem(KEYS.AUTH_TOKEN);
export const removeAuthToken = () => removeItem(KEYS.AUTH_TOKEN);

export const saveUserData = (userData) => setItem(KEYS.USER_DATA, userData);
export const getUserData = () => getItem(KEYS.USER_DATA);
export const removeUserData = () => removeItem(KEYS.USER_DATA);

export const saveRefreshToken = (token) => setItem(KEYS.REFRESH_TOKEN, token);
export const getRefreshToken = () => getItem(KEYS.REFRESH_TOKEN);
export const removeRefreshToken = () => removeItem(KEYS.REFRESH_TOKEN);

export default {
  setItem,
  getItem,
  removeItem,
  clearAll,
  saveAuthToken,
  getAuthToken,
  removeAuthToken,
  saveUserData,
  getUserData,
  removeUserData,
  saveRefreshToken,
  getRefreshToken,
  removeRefreshToken,
};

/**
 * PetCare Mobile - Cliente API
 */

import axios from 'axios';
import { API_CONFIG } from '../constants/config';
import { getAuthToken, removeAuthToken, removeUserData } from '../utils/storage';

// Crear instancia de axios
const api = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  timeout: API_CONFIG.TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor de requests - agregar token
api.interceptors.request.use(
  async (config) => {
    const token = await getAuthToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor de responses - manejar errores
api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    if (error.response) {
      // El servidor respondió con un código de error
      const { status } = error.response;

      if (status === 401) {
        // Token inválido o expirado - limpiar sesión
        await removeAuthToken();
        await removeUserData();
        // Aquí podrías emitir un evento para redirigir al login
      }

      return Promise.reject({
        status,
        message: error.response.data?.message || 'Error en la petición',
        data: error.response.data,
      });
    } else if (error.request) {
      // La petición se hizo pero no hubo respuesta
      return Promise.reject({
        status: 0,
        message: 'No se pudo conectar con el servidor',
        data: null,
      });
    } else {
      // Error al configurar la petición
      return Promise.reject({
        status: -1,
        message: error.message || 'Error desconocido',
        data: null,
      });
    }
  }
);

/**
 * Peticiones GET
 */
export const get = async (url, params = {}, config = {}) => {
  try {
    const response = await api.get(url, { params, ...config });
    return response.data;
  } catch (error) {
    // El interceptor ya formateó el error con toda la información del servidor
    // Retornar los datos del servidor si existen, o el mensaje de error
    if (error.data) {
      return {
        success: false,
        ...error.data,
      };
    }
    // Si no, retornar formato de error básico
    return {
      success: false,
      message: error.message || 'Error en la petición',
    };
  }
};

/**
 * Peticiones POST
 */
export const post = async (url, data = {}, config = {}) => {
  try {
    const response = await api.post(url, data, config);
    return response.data;
  } catch (error) {
    // El interceptor ya formateó el error con toda la información del servidor
    // Retornar los datos del servidor si existen, o el mensaje de error
    if (error.data) {
      return {
        success: false,
        ...error.data,
      };
    }
    // Si no, retornar formato de error básico
    return {
      success: false,
      message: error.message || 'Error en la petición',
    };
  }
};

/**
 * Peticiones PUT
 */
export const put = async (url, data = {}, config = {}) => {
  try {
    const response = await api.put(url, data, config);
    return response.data;
  } catch (error) {
    // El interceptor ya formateó el error con toda la información del servidor
    // Retornar los datos del servidor si existen, o el mensaje de error
    if (error.data) {
      return {
        success: false,
        ...error.data,
      };
    }
    // Si no, retornar formato de error básico
    return {
      success: false,
      message: error.message || 'Error en la petición',
    };
  }
};

/**
 * Peticiones DELETE
 */
export const del = async (url, config = {}) => {
  try {
    const response = await api.delete(url, config);
    return response.data;
  } catch (error) {
    // El interceptor ya formateó el error con toda la información del servidor
    // Retornar los datos del servidor si existen, o el mensaje de error
    if (error.data) {
      return {
        success: false,
        ...error.data,
      };
    }
    // Si no, retornar formato de error básico
    return {
      success: false,
      message: error.message || 'Error en la petición',
    };
  }
};

/**
 * Upload de archivos (multipart/form-data)
 */
export const upload = async (url, formData, onProgress) => {
  try {
    const config = {
      headers: {
        // Eliminar el Content-Type de application/json del config global
        // y dejar que axios configure multipart/form-data automáticamente
        'Content-Type': undefined,
      },
    };

    if (onProgress) {
      config.onUploadProgress = (progressEvent) => {
        const percentCompleted = Math.round(
          (progressEvent.loaded * 100) / progressEvent.total
        );
        onProgress(percentCompleted);
      };
    }

    const response = await api.post(url, formData, config);
    return response.data;
  } catch (error) {
    // El interceptor ya formateó el error con toda la información del servidor
    // Retornar los datos del servidor si existen, o el mensaje de error
    if (error.data) {
      return {
        success: false,
        ...error.data,
      };
    }
    // Si no, retornar formato de error básico
    return {
      success: false,
      message: error.message || 'Error en la petición',
    };
  }
};

export default {
  get,
  post,
  put,
  delete: del,
  upload,
};

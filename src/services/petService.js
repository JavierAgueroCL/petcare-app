/**
 * PetCare Mobile - Servicio de Mascotas
 */

import { get, post, put, del, upload } from './api';

/**
 * Obtener todas las mascotas del usuario
 */
export const getMyPets = async (params = {}) => {
  return await get('/pets', params);
};

/**
 * Obtener una mascota por ID
 */
export const getPetById = async (petId) => {
  return await get(`/pets/${petId}`);
};

/**
 * Crear nueva mascota
 */
export const createPet = async (petData) => {
  return await post('/pets', petData);
};

/**
 * Actualizar mascota
 */
export const updatePet = async (petId, petData) => {
  return await put(`/pets/${petId}`, petData);
};

/**
 * Eliminar mascota
 */
export const deletePet = async (petId) => {
  return await del(`/pets/${petId}`);
};

/**
 * Subir imagen de mascota
 */
export const uploadPetImage = async (petId, imageUri, onProgress) => {
  const formData = new FormData();

  // Determinar el tipo de archivo basado en la extensión o URI
  let mimeType = 'image/jpeg';
  let extension = 'jpg';

  if (imageUri.toLowerCase().endsWith('.png')) {
    mimeType = 'image/png';
    extension = 'png';
  } else if (imageUri.toLowerCase().endsWith('.jpg') || imageUri.toLowerCase().endsWith('.jpeg')) {
    mimeType = 'image/jpeg';
    extension = 'jpg';
  }

  const fileName = `pet-${petId}-${Date.now()}.${extension}`;

  // Verificar si estamos en Web (blob:) o en React Native nativo (file:)
  if (imageUri.startsWith('blob:')) {
    // En Web, necesitamos convertir el blob URI a un File/Blob real
    try {
      const response = await fetch(imageUri);
      const blob = await response.blob();
      formData.append('image', blob, fileName);
    } catch (error) {
      console.error('Error al convertir blob a File:', error);
      throw new Error('No se pudo procesar la imagen');
    }
  } else {
    // En React Native móvil, usar el formato nativo
    const file = {
      uri: imageUri,
      type: mimeType,
      name: fileName,
    };
    formData.append('image', file, fileName);
  }

  // Indicar que es la imagen principal (perfil)
  formData.append('is_primary', 'true');

  return await upload(`/pets/${petId}/images`, formData, onProgress);
};

/**
 * Subir múltiples imágenes de mascota
 */
export const uploadMultiplePetImages = async (petId, imageUris, onProgress) => {
  const formData = new FormData();

  imageUris.forEach((uri, index) => {
    formData.append('images', {
      uri,
      type: 'image/jpeg',
      name: `pet-${petId}-${Date.now()}-${index}.jpg`,
    });
  });

  return await upload(`/pets/${petId}/images/multiple`, formData, onProgress);
};

/**
 * Eliminar imagen de mascota
 */
export const deletePetImage = async (petId, imageId) => {
  return await del(`/pets/${petId}/images/${imageId}`);
};

/**
 * Reportar mascota perdida
 */
export const reportLostPet = async (petId, lostData) => {
  return await post(`/pets/${petId}/lost`, lostData);
};

/**
 * Marcar mascota como encontrada
 */
export const markPetAsFound = async (petId) => {
  return await post(`/pets/${petId}/found`);
};

/**
 * Obtener historial médico de mascota
 */
export const getPetMedicalHistory = async (petId, params = {}) => {
  return await get(`/pets/${petId}/medical-history`, params);
};

/**
 * Obtener vacunas de mascota
 */
export const getPetVaccines = async (petId, params = {}) => {
  return await get(`/pets/${petId}/vaccines`, params);
};

/**
 * Descargar código QR de mascota
 */
export const downloadPetQR = async (petId) => {
  return await get(`/pets/${petId}/qr/download`);
};

export default {
  getMyPets,
  getPetById,
  createPet,
  updatePet,
  deletePet,
  uploadPetImage,
  uploadMultiplePetImages,
  deletePetImage,
  reportLostPet,
  markPetAsFound,
  getPetMedicalHistory,
  getPetVaccines,
  downloadPetQR,
};

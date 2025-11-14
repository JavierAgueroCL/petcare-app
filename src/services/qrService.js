/**
 * PetCare Mobile - Servicio de Códigos QR
 */

import { get, post } from './api';

/**
 * Escanear código QR (público)
 */
export const scanQR = async (code) => {
  return await get(`/qr/${code}`);
};

/**
 * Regenerar código QR de mascota
 */
export const regenerateQR = async (petId, reason) => {
  return await post(`/qr/pets/${petId}/regenerate`, { reason });
};

/**
 * Obtener historial de escaneos
 */
export const getQRScans = async (petId, params = {}) => {
  return await get(`/qr/pets/${petId}/scans`, params);
};

/**
 * Generar o obtener QR de una mascota
 */
export const generatePetQR = async (petId) => {
  return await post(`/qr/pets/${petId}/generate`);
};

/**
 * Descargar QR como imagen (base64)
 */
export const downloadPetQR = async (petId) => {
  return await get(`/qr/pets/${petId}/download`);
};

/**
 * Obtener información pública de una mascota por ID
 */
export const getPetByIdPublic = async (petId) => {
  return await get(`/qr/pet/${petId}`);
};

export default {
  scanQR,
  regenerateQR,
  getQRScans,
  generatePetQR,
  downloadPetQR,
  getPetByIdPublic,
};

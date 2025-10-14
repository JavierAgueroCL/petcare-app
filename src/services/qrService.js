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

export default {
  scanQR,
  regenerateQR,
  getQRScans,
};

/**
 * PetCare Mobile - Servicio de Veterinarias
 */

import { get } from './api';

// =====================================================
// VETERINARIAS / VETERINARIES
// =====================================================

/**
 * Obtener todas las veterinarias activas
 * @param {Object} params - Parámetros de filtro (city, emergency_available, search)
 */
export const getVeterinaries = async (params = {}) => {
  return await get('/veterinaries', params);
};

/**
 * Obtener una veterinaria específica
 */
export const getVeterinary = async (veterinaryId) => {
  return await get(`/veterinaries/${veterinaryId}`);
};

export default {
  getVeterinaries,
  getVeterinary,
};

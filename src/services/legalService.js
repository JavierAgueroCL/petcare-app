/**
 * PetCare Mobile - Servicio de Contenido Legal
 */

import { get } from './api';

/**
 * Obtener los términos y condiciones activos
 */
export const getTerms = async () => {
  return await get('/legal/terms');
};

/**
 * Obtener la política de privacidad activa
 */
export const getPrivacyPolicy = async () => {
  return await get('/legal/privacy');
};

export default {
  getTerms,
  getPrivacyPolicy,
};

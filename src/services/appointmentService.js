/**
 * PetCare Mobile - Servicio de Citas
 */

import { get, post, put, del } from './api';

// =====================================================
// CITAS / APPOINTMENTS
// =====================================================

/**
 * Crear una cita
 */
export const createAppointment = async (appointmentData) => {
  return await post('/appointments', appointmentData);
};

/**
 * Obtener todas las citas del usuario
 * @param {Object} params - Parámetros de filtro (filter: 'all'|'upcoming'|'past', status: 'scheduled'|'confirmed'|'completed'|'cancelled')
 */
export const getUserAppointments = async (params = {}) => {
  return await get('/appointments', params);
};

/**
 * Contar citas futuras del usuario
 */
export const countUpcomingAppointments = async () => {
  return await get('/appointments/count');
};

/**
 * Contar citas de vacunación futuras del usuario
 */
export const countUpcomingVaccineAppointments = async () => {
  return await get('/appointments/count-vaccines');
};

/**
 * Obtener una cita específica
 */
export const getAppointment = async (appointmentId) => {
  return await get(`/appointments/${appointmentId}`);
};

/**
 * Actualizar una cita
 */
export const updateAppointment = async (appointmentId, appointmentData) => {
  return await put(`/appointments/${appointmentId}`, appointmentData);
};

/**
 * Cancelar una cita
 */
export const cancelAppointment = async (appointmentId) => {
  return await put(`/appointments/${appointmentId}/cancel`, {});
};

/**
 * Eliminar una cita
 */
export const deleteAppointment = async (appointmentId) => {
  return await del(`/appointments/${appointmentId}`);
};

export default {
  createAppointment,
  getUserAppointments,
  countUpcomingAppointments,
  countUpcomingVaccineAppointments,
  getAppointment,
  updateAppointment,
  cancelAppointment,
  deleteAppointment,
};

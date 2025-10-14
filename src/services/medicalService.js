/**
 * PetCare Mobile - Servicio de Registros Médicos y Vacunas
 */

import { get, post, put, del, upload } from './api';

// =====================================================
// REGISTROS MÉDICOS
// =====================================================

/**
 * Obtener registros médicos de una mascota
 */
export const getPetMedicalRecords = async (petId) => {
  return await get(`/medical-records/pets/${petId}/medical-records`);
};

/**
 * Crear registro médico
 */
export const createMedicalRecord = async (petId, recordData) => {
  return await post(`/medical-records/pets/${petId}/medical-records`, recordData);
};

/**
 * Obtener registro médico por ID
 */
export const getMedicalRecord = async (recordId) => {
  return await get(`/medical-records/${recordId}`);
};

/**
 * Actualizar registro médico
 */
export const updateMedicalRecord = async (recordId, recordData) => {
  return await put(`/medical-records/${recordId}`, recordData);
};

/**
 * Eliminar registro médico
 */
export const deleteMedicalRecord = async (recordId) => {
  return await del(`/medical-records/${recordId}`);
};

/**
 * Subir documento médico
 */
export const uploadMedicalDocument = async (recordId, documentUri, onProgress) => {
  const formData = new FormData();
  formData.append('document', {
    uri: documentUri,
    type: 'application/pdf',
    name: `medical-${recordId}-${Date.now()}.pdf`,
  });

  return await upload(`/medical-records/${recordId}/document`, formData, onProgress);
};

// =====================================================
// VACUNAS
// =====================================================

/**
 * Crear vacuna
 */
export const createVaccine = async (petId, vaccineData) => {
  return await post(`/vaccines/pets/${petId}/vaccines`, vaccineData);
};

/**
 * Obtener vacuna por ID
 */
export const getVaccine = async (vaccineId) => {
  return await get(`/vaccines/${vaccineId}`);
};

/**
 * Actualizar vacuna
 */
export const updateVaccine = async (vaccineId, vaccineData) => {
  return await put(`/vaccines/${vaccineId}`, vaccineData);
};

/**
 * Eliminar vacuna
 */
export const deleteVaccine = async (vaccineId) => {
  return await del(`/vaccines/${vaccineId}`);
};

/**
 * Obtener próximas vacunas
 */
export const getUpcomingVaccines = async (params = {}) => {
  return await get('/vaccines/upcoming', params);
};

export default {
  // Medical Records
  getPetMedicalRecords,
  createMedicalRecord,
  getMedicalRecord,
  updateMedicalRecord,
  deleteMedicalRecord,
  uploadMedicalDocument,

  // Vaccines
  createVaccine,
  getVaccine,
  updateVaccine,
  deleteVaccine,
  getUpcomingVaccines,
};

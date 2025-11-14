/**
 * Servicio para gestionar fotos de registros médicos
 */
import { get, post, put, del } from './api';

/**
 * Obtener todas las fotos de un registro médico
 */
export const getAttachments = async (medicalRecordId) => {
  return await get(`/medical-records/${medicalRecordId}/photos`);
};

/**
 * Agregar una foto a un registro médico
 */
export const addAttachment = async (medicalRecordId, formData) => {
  return await post(`/medical-records/${medicalRecordId}/photos`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

/**
 * Actualizar información de una foto
 */
export const updateAttachment = async (attachmentId, data) => {
  return await put(`/photos/${attachmentId}`, data);
};

/**
 * Eliminar una foto
 */
export const deleteAttachment = async (attachmentId) => {
  return await del(`/photos/${attachmentId}`);
};

/**
 * Reordenar fotos
 */
export const reorderAttachments = async (medicalRecordId, attachments) => {
  return await post(`/medical-records/${medicalRecordId}/photos/reorder`, {
    attachments,
  });
};

/**
 * Servicio para gestionar notificaciones y recordatorios
 */
import { get, post, put, del } from './api';

/**
 * Obtener todas las notificaciones del usuario
 */
export const getNotifications = async (params = {}) => {
  return await get('/notifications', params);
};

/**
 * Obtener contador de notificaciones no leídas
 */
export const getUnreadCount = async () => {
  return await get('/notifications/unread-count');
};

/**
 * Marcar una notificación como leída
 */
export const markAsRead = async (notificationId) => {
  return await put(`/notifications/${notificationId}/read`);
};

/**
 * Marcar todas las notificaciones como leídas
 */
export const markAllAsRead = async () => {
  return await post('/notifications/mark-all-read');
};

/**
 * Eliminar una notificación
 */
export const deleteNotification = async (notificationId) => {
  return await del(`/notifications/${notificationId}`);
};

/**
 * Crear un recordatorio manual
 */
export const createReminder = async (data) => {
  return await post('/notifications', data);
};

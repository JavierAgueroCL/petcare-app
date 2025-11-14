/**
 * PetCare Mobile - Pantalla de Notificaciones y Recordatorios
 */

import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  Alert,
  ActivityIndicator,
  Platform,
  Modal,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import * as notificationService from '../services/notificationService';
import * as petService from '../services/petService';
import { COLORS, SPACING, FONTS, BORDER_RADIUS, SHADOWS, LAYOUT } from '../constants/theme';

const UserNotificationsScreen = ({ navigation }) => {
  const [notifications, setNotifications] = useState([]);
  const [filteredNotifications, setFilteredNotifications] = useState([]);
  const [pets, setPets] = useState([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [filter, setFilter] = useState('all'); // 'all' o 'unread'
  const [selectedPet, setSelectedPet] = useState(null);
  const [selectedType, setSelectedType] = useState(null);
  const [sortOrder, setSortOrder] = useState('desc'); // 'asc' o 'desc'
  const [showFilterModal, setShowFilterModal] = useState(false);

  useFocusEffect(
    useCallback(() => {
      loadPets();
      loadNotifications();
    }, [])
  );

  React.useEffect(() => {
    applyFilters();
  }, [notifications, filter, selectedPet, selectedType, sortOrder]);

  const loadPets = async () => {
    const result = await petService.getMyPets();
    if (result.success) {
      setPets(result.data || []);
    }
  };

  const loadNotifications = async () => {
    setLoading(true);
    const params = filter === 'unread' ? { unread_only: true } : {};
    const result = await notificationService.getNotifications(params);
    setLoading(false);

    if (result.success) {
      const data = result.data || [];
      setNotifications(data);
      applyFiltersToData(data);
    } else {
      Alert.alert('Error', 'No se pudieron cargar las notificaciones');
    }
  };

  const applyFilters = () => {
    applyFiltersToData(notifications);
  };

  const applyFiltersToData = (data) => {
    let filtered = [...data];

    // Filtrar por mascota
    if (selectedPet) {
      filtered = filtered.filter((n) => n.pet_id === selectedPet.id);
    }

    // Filtrar por tipo
    if (selectedType) {
      filtered = filtered.filter((n) => n.type === selectedType);
    }

    // Ordenar por fecha
    filtered.sort((a, b) => {
      const dateA = new Date(a.scheduled_date);
      const dateB = new Date(b.scheduled_date);
      return sortOrder === 'desc' ? dateB - dateA : dateA - dateB;
    });

    setFilteredNotifications(filtered);
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadNotifications();
    setRefreshing(false);
  };

  const handleNotificationPress = async (notification) => {
    // Marcar como leída si no lo está
    if (!notification.is_read) {
      await notificationService.markAsRead(notification.id);
      loadNotifications();
    }

    // Navegar al recurso relacionado si existe
    if (notification.related_type === 'pet' && notification.pet_id) {
      navigation.navigate('PetDetail', { petId: notification.pet_id });
    } else if (notification.related_type === 'appointment') {
      navigation.navigate('Appointments');
    } else if (notification.related_type === 'medical_record') {
      navigation.navigate('MedicalRecords');
    }
  };

  const handleDeleteNotification = async (notificationId) => {
    const confirmDelete = () => {
      Alert.alert(
        'Eliminar Notificación',
        '¿Estás seguro de que deseas eliminar esta notificación?',
        [
          { text: 'Cancelar', style: 'cancel' },
          {
            text: 'Eliminar',
            style: 'destructive',
            onPress: async () => {
              const result = await notificationService.deleteNotification(notificationId);
              if (result.success) {
                loadNotifications();
              }
            },
          },
        ]
      );
    };

    if (Platform.OS === 'web') {
      if (window.confirm('¿Estás seguro de que deseas eliminar esta notificación?')) {
        const result = await notificationService.deleteNotification(notificationId);
        if (result.success) {
          loadNotifications();
        }
      }
    } else {
      confirmDelete();
    }
  };

  const handleMarkAllAsRead = async () => {
    const result = await notificationService.markAllAsRead();
    if (result.success) {
      if (Platform.OS === 'web') {
        window.alert('Todas las notificaciones marcadas como leídas');
      } else {
        Alert.alert('Éxito', 'Todas las notificaciones marcadas como leídas');
      }
      loadNotifications();
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMs = now - date;
    const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
    const diffInDays = Math.floor(diffInHours / 24);

    if (diffInHours < 1) {
      return 'Hace unos minutos';
    } else if (diffInHours < 24) {
      return `Hace ${diffInHours} hora${diffInHours > 1 ? 's' : ''}`;
    } else if (diffInDays < 7) {
      return `Hace ${diffInDays} día${diffInDays > 1 ? 's' : ''}`;
    } else {
      return date.toLocaleDateString('es-CL', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      });
    }
  };

  const getNotificationIcon = (type) => {
    const icons = {
      vaccine_reminder: 'medical',
      deworming_reminder: 'bug',
      appointment_reminder: 'calendar',
      medical_record: 'document-text',
      general: 'notifications',
      system: 'information-circle',
    };
    return icons[type] || 'notifications';
  };

  const getNotificationColor = (type, priority) => {
    if (priority === 'urgent') return COLORS.error;
    if (priority === 'high') return COLORS.warning;

    const colors = {
      vaccine_reminder: COLORS.success,
      deworming_reminder: COLORS.warning,
      appointment_reminder: COLORS.primary,
      medical_record: COLORS.info,
      general: COLORS.textSecondary,
      system: COLORS.info,
    };
    return colors[type] || COLORS.textSecondary;
  };

  const NotificationCard = ({ notification }) => {
    const iconColor = getNotificationColor(notification.type, notification.priority);

    return (
      <TouchableOpacity
        style={[
          styles.notificationCard,
          !notification.is_read && styles.notificationCardUnread,
        ]}
        onPress={() => handleNotificationPress(notification)}
        activeOpacity={0.7}
      >
        <View style={[styles.notificationIcon, { backgroundColor: iconColor + '20' }]}>
          <Ionicons
            name={getNotificationIcon(notification.type)}
            size={24}
            color={iconColor}
          />
        </View>

        <View style={styles.notificationContent}>
          <View style={styles.notificationHeader}>
            <Text style={[styles.notificationTitle, !notification.is_read && styles.textBold]}>
              {notification.title}
            </Text>
            {!notification.is_read && <View style={styles.unreadBadge} />}
          </View>

          <Text style={styles.notificationMessage} numberOfLines={2}>
            {notification.message}
          </Text>

          {notification.pet && (
            <View style={styles.petInfo}>
              <Ionicons name="paw" size={14} color={COLORS.textSecondary} />
              <Text style={styles.petName}>{notification.pet.name}</Text>
            </View>
          )}

          <Text style={styles.notificationDate}>{formatDate(notification.scheduled_date)}</Text>
        </View>

        <TouchableOpacity
          style={styles.deleteButton}
          onPress={() => handleDeleteNotification(notification.id)}
        >
          <Ionicons name="trash-outline" size={20} color={COLORS.error} />
        </TouchableOpacity>
      </TouchableOpacity>
    );
  };

  const EmptyState = () => (
    <View style={styles.emptyState}>
      <Ionicons name="notifications-off-outline" size={64} color={COLORS.textDisabled} />
      <Text style={styles.emptyStateTitle}>
        {filter === 'unread' ? 'No tienes notificaciones sin leer' : 'No tienes notificaciones'}
      </Text>
      <Text style={styles.emptyStateText}>
        {filter === 'unread'
          ? 'Todas tus notificaciones están al día'
          : 'Aquí aparecerán los recordatorios de vacunas, citas y más'}
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Botón flotante para crear recordatorio */}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => navigation.navigate('CreateReminder')}
      >
        <Ionicons name="add" size={28} color={COLORS.surface} />
      </TouchableOpacity>

      {/* Filtros y acciones */}
      <View style={styles.header}>
        <View style={styles.filterContainer}>
          <TouchableOpacity
            style={[styles.filterButton, filter === 'all' && styles.filterButtonActive]}
            onPress={() => setFilter('all')}
          >
            <Text
              style={[
                styles.filterButtonText,
                filter === 'all' && styles.filterButtonTextActive,
              ]}
            >
              Todas
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.filterButton, filter === 'unread' && styles.filterButtonActive]}
            onPress={() => setFilter('unread')}
          >
            <Text
              style={[
                styles.filterButtonText,
                filter === 'unread' && styles.filterButtonTextActive,
              ]}
            >
              No leídas
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.filterIconButton}
            onPress={() => setShowFilterModal(true)}
          >
            <Ionicons name="filter" size={20} color={COLORS.primary} />
            {(selectedPet || selectedType) && <View style={styles.filterBadge} />}
          </TouchableOpacity>
        </View>

        {notifications.some((n) => !n.is_read) && (
          <TouchableOpacity style={styles.markAllButton} onPress={handleMarkAllAsRead}>
            <Ionicons name="checkmark-done" size={20} color={COLORS.primary} />
            <Text style={styles.markAllButtonText}>Marcar todas</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Lista de notificaciones */}
      {loading && notifications.length === 0 ? (
        <ActivityIndicator size="large" color={COLORS.primary} style={styles.loader} />
      ) : (
        <FlatList
          data={filteredNotifications}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => <NotificationCard notification={item} />}
          contentContainerStyle={[
            styles.listContainer,
            filteredNotifications.length === 0 && styles.listContainerEmpty,
          ]}
          ListEmptyComponent={<EmptyState />}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        />
      )}

      {/* Modal de filtros avanzados */}
      <Modal
        visible={showFilterModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowFilterModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Filtros</Text>
              <TouchableOpacity onPress={() => setShowFilterModal(false)}>
                <Ionicons name="close" size={24} color={COLORS.textPrimary} />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalBody}>
              {/* Filtro por mascota */}
              <Text style={styles.filterSectionTitle}>Mascota</Text>
              <TouchableOpacity
                style={[
                  styles.filterOption,
                  !selectedPet && styles.filterOptionActive,
                ]}
                onPress={() => setSelectedPet(null)}
              >
                <Text
                  style={[
                    styles.filterOptionText,
                    !selectedPet && styles.filterOptionTextActive,
                  ]}
                >
                  Todas las mascotas
                </Text>
                {!selectedPet && <Ionicons name="checkmark" size={20} color={COLORS.primary} />}
              </TouchableOpacity>
              {pets.map((pet) => (
                <TouchableOpacity
                  key={pet.id}
                  style={[
                    styles.filterOption,
                    selectedPet?.id === pet.id && styles.filterOptionActive,
                  ]}
                  onPress={() => setSelectedPet(pet)}
                >
                  <View style={styles.filterOptionContent}>
                    <Ionicons name="paw" size={16} color={COLORS.textSecondary} />
                    <Text
                      style={[
                        styles.filterOptionText,
                        selectedPet?.id === pet.id && styles.filterOptionTextActive,
                      ]}
                    >
                      {pet.name}
                    </Text>
                  </View>
                  {selectedPet?.id === pet.id && (
                    <Ionicons name="checkmark" size={20} color={COLORS.primary} />
                  )}
                </TouchableOpacity>
              ))}

              {/* Filtro por tipo */}
              <Text style={[styles.filterSectionTitle, { marginTop: SPACING.lg }]}>
                Tipo de notificación
              </Text>
              {[
                { value: null, label: 'Todos los tipos', icon: 'notifications' },
                { value: 'vaccine_reminder', label: 'Vacunas', icon: 'medical' },
                { value: 'deworming_reminder', label: 'Desparasitación', icon: 'bug' },
                { value: 'appointment_reminder', label: 'Citas', icon: 'calendar' },
                { value: 'medical_record', label: 'Registros médicos', icon: 'document-text' },
                { value: 'general', label: 'General', icon: 'notifications' },
              ].map((type) => (
                <TouchableOpacity
                  key={type.value || 'all'}
                  style={[
                    styles.filterOption,
                    selectedType === type.value && styles.filterOptionActive,
                  ]}
                  onPress={() => setSelectedType(type.value)}
                >
                  <View style={styles.filterOptionContent}>
                    <Ionicons name={type.icon} size={16} color={COLORS.textSecondary} />
                    <Text
                      style={[
                        styles.filterOptionText,
                        selectedType === type.value && styles.filterOptionTextActive,
                      ]}
                    >
                      {type.label}
                    </Text>
                  </View>
                  {selectedType === type.value && (
                    <Ionicons name="checkmark" size={20} color={COLORS.primary} />
                  )}
                </TouchableOpacity>
              ))}

              {/* Ordenamiento */}
              <Text style={[styles.filterSectionTitle, { marginTop: SPACING.lg }]}>
                Ordenar por fecha
              </Text>
              <TouchableOpacity
                style={[
                  styles.filterOption,
                  sortOrder === 'desc' && styles.filterOptionActive,
                ]}
                onPress={() => setSortOrder('desc')}
              >
                <View style={styles.filterOptionContent}>
                  <Ionicons name="arrow-down" size={16} color={COLORS.textSecondary} />
                  <Text
                    style={[
                      styles.filterOptionText,
                      sortOrder === 'desc' && styles.filterOptionTextActive,
                    ]}
                  >
                    Más recientes primero
                  </Text>
                </View>
                {sortOrder === 'desc' && (
                  <Ionicons name="checkmark" size={20} color={COLORS.primary} />
                )}
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.filterOption,
                  sortOrder === 'asc' && styles.filterOptionActive,
                ]}
                onPress={() => setSortOrder('asc')}
              >
                <View style={styles.filterOptionContent}>
                  <Ionicons name="arrow-up" size={16} color={COLORS.textSecondary} />
                  <Text
                    style={[
                      styles.filterOptionText,
                      sortOrder === 'asc' && styles.filterOptionTextActive,
                    ]}
                  >
                    Más antiguas primero
                  </Text>
                </View>
                {sortOrder === 'asc' && (
                  <Ionicons name="checkmark" size={20} color={COLORS.primary} />
                )}
              </TouchableOpacity>
            </ScrollView>

            <View style={styles.modalFooter}>
              <TouchableOpacity
                style={styles.clearFiltersButton}
                onPress={() => {
                  setSelectedPet(null);
                  setSelectedType(null);
                  setSortOrder('desc');
                }}
              >
                <Text style={styles.clearFiltersText}>Limpiar filtros</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.applyFiltersButton}
                onPress={() => setShowFilterModal(false)}
              >
                <Text style={styles.applyFiltersText}>Aplicar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  fab: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
    elevation: 8,
    ...SHADOWS.large,
  },
  header: {
    backgroundColor: COLORS.surface,
    paddingHorizontal: LAYOUT.screenPadding,
    paddingVertical: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.divider,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    ...SHADOWS.small,
  },
  filterContainer: {
    flexDirection: 'row',
  },
  filterButton: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: BORDER_RADIUS.md,
    marginRight: SPACING.sm,
    backgroundColor: COLORS.background,
  },
  filterButtonActive: {
    backgroundColor: COLORS.primary,
  },
  filterButtonText: {
    fontSize: FONTS.sizes.md,
    fontWeight: FONTS.weights.medium,
    color: COLORS.textSecondary,
  },
  filterButtonTextActive: {
    color: COLORS.surface,
  },
  markAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  markAllButtonText: {
    fontSize: FONTS.sizes.sm,
    fontWeight: FONTS.weights.medium,
    color: COLORS.primary,
    marginLeft: SPACING.xs,
  },
  loader: {
    marginTop: SPACING.xxl,
  },
  listContainer: {
    padding: LAYOUT.screenPadding,
  },
  listContainerEmpty: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  notificationCard: {
    flexDirection: 'row',
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
    marginBottom: SPACING.md,
    ...SHADOWS.medium,
  },
  notificationCardUnread: {
    borderLeftWidth: 4,
    borderLeftColor: COLORS.primary,
  },
  notificationIcon: {
    width: 48,
    height: 48,
    borderRadius: BORDER_RADIUS.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SPACING.md,
  },
  notificationContent: {
    flex: 1,
  },
  notificationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.xs,
  },
  notificationTitle: {
    fontSize: FONTS.sizes.md,
    color: COLORS.textPrimary,
    flex: 1,
  },
  textBold: {
    fontWeight: FONTS.weights.bold,
  },
  unreadBadge: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.primary,
    marginLeft: SPACING.xs,
  },
  notificationMessage: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.textSecondary,
    lineHeight: 18,
    marginBottom: SPACING.xs,
  },
  petInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.xs,
  },
  petName: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.textSecondary,
    marginLeft: SPACING.xs,
    fontWeight: FONTS.weights.medium,
  },
  notificationDate: {
    fontSize: FONTS.sizes.xs,
    color: COLORS.textDisabled,
  },
  deleteButton: {
    padding: SPACING.sm,
    marginLeft: SPACING.sm,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: SPACING.xxl,
  },
  emptyStateTitle: {
    fontSize: FONTS.sizes.lg,
    fontWeight: FONTS.weights.bold,
    color: COLORS.textPrimary,
    marginTop: SPACING.md,
    textAlign: 'center',
  },
  emptyStateText: {
    fontSize: FONTS.sizes.md,
    color: COLORS.textSecondary,
    marginTop: SPACING.sm,
    textAlign: 'center',
  },
  filterIconButton: {
    padding: SPACING.sm,
    marginLeft: SPACING.sm,
    position: 'relative',
  },
  filterBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.error,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: COLORS.surface,
    borderTopLeftRadius: BORDER_RADIUS.xl,
    borderTopRightRadius: BORDER_RADIUS.xl,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: SPACING.lg,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.divider,
  },
  modalTitle: {
    fontSize: FONTS.sizes.xl,
    fontWeight: FONTS.weights.bold,
    color: COLORS.textPrimary,
  },
  modalBody: {
    padding: SPACING.lg,
  },
  filterSectionTitle: {
    fontSize: FONTS.sizes.md,
    fontWeight: FONTS.weights.semibold,
    color: COLORS.textPrimary,
    marginBottom: SPACING.sm,
  },
  filterOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: COLORS.background,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
    marginBottom: SPACING.sm,
    borderWidth: 1,
    borderColor: COLORS.divider,
  },
  filterOptionActive: {
    borderColor: COLORS.primary,
    backgroundColor: COLORS.primary + '10',
  },
  filterOptionContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  filterOptionText: {
    fontSize: FONTS.sizes.md,
    color: COLORS.textPrimary,
    marginLeft: SPACING.sm,
  },
  filterOptionTextActive: {
    fontWeight: FONTS.weights.semibold,
    color: COLORS.primary,
  },
  modalFooter: {
    flexDirection: 'row',
    padding: SPACING.lg,
    borderTopWidth: 1,
    borderTopColor: COLORS.divider,
    gap: SPACING.md,
  },
  clearFiltersButton: {
    flex: 1,
    backgroundColor: COLORS.background,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.divider,
  },
  clearFiltersText: {
    fontSize: FONTS.sizes.md,
    fontWeight: FONTS.weights.medium,
    color: COLORS.textSecondary,
  },
  applyFiltersButton: {
    flex: 1,
    backgroundColor: COLORS.primary,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
    alignItems: 'center',
  },
  applyFiltersText: {
    fontSize: FONTS.sizes.md,
    fontWeight: FONTS.weights.semibold,
    color: COLORS.surface,
  },
});

export default UserNotificationsScreen;

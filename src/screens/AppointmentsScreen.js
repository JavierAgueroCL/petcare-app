/**
 * PetCare Mobile - Pantalla de Citas
 */

import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  Alert,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import * as appointmentService from '../services/appointmentService';
import { COLORS, SPACING, FONTS, BORDER_RADIUS, SHADOWS, LAYOUT } from '../constants/theme';

const AppointmentsScreen = () => {
  const [appointments, setAppointments] = useState([]);
  const [filter, setFilter] = useState('upcoming'); // 'all', 'upcoming', 'past'
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  useFocusEffect(
    useCallback(() => {
      loadAppointments();
    }, [filter])
  );

  const loadAppointments = async () => {
    setLoading(true);
    const result = await appointmentService.getUserAppointments({ filter });
    setLoading(false);

    if (result.success) {
      setAppointments(result.data || []);
    } else {
      Alert.alert('Error', 'No se pudieron cargar las citas');
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadAppointments();
    setRefreshing(false);
  };

  const getAppointmentTypeLabel = (type) => {
    const types = {
      checkup: 'Control Veterinario',
      vaccine: 'Vacunación',
      grooming: 'Peluquería',
      emergency: 'Emergencia',
      surgery: 'Cirugía',
      other: 'Otro',
    };
    return types[type] || type;
  };

  const getAppointmentTypeIcon = (type) => {
    const icons = {
      checkup: 'medical',
      vaccine: 'shield-checkmark',
      grooming: 'cut',
      emergency: 'alert-circle',
      surgery: 'medkit',
      other: 'ellipsis-horizontal',
    };
    return icons[type] || 'calendar';
  };

  const getAppointmentTypeColor = (type) => {
    const colors = {
      checkup: COLORS.info,
      vaccine: COLORS.success,
      grooming: COLORS.secondary,
      emergency: COLORS.error,
      surgery: COLORS.warning,
      other: COLORS.textSecondary,
    };
    return colors[type] || COLORS.textSecondary;
  };

  const getStatusLabel = (status) => {
    const statuses = {
      scheduled: 'Agendada',
      confirmed: 'Confirmada',
      completed: 'Completada',
      cancelled: 'Cancelada',
    };
    return statuses[status] || status;
  };

  const getStatusColor = (status) => {
    const colors = {
      scheduled: COLORS.warning,
      confirmed: COLORS.success,
      completed: COLORS.textSecondary,
      cancelled: COLORS.error,
    };
    return colors[status] || COLORS.textSecondary;
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-CL', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    });
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('es-CL', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const FilterButton = ({ label, value, count }) => (
    <TouchableOpacity
      style={[
        styles.filterButton,
        filter === value && styles.filterButtonActive,
      ]}
      onPress={() => setFilter(value)}
    >
      <Text
        style={[
          styles.filterButtonText,
          filter === value && styles.filterButtonTextActive,
        ]}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );

  const AppointmentCard = ({ appointment }) => {
    const typeColor = getAppointmentTypeColor(appointment.appointment_type);
    const statusColor = getStatusColor(appointment.status);

    return (
      <View style={styles.appointmentCard}>
        <View style={[styles.appointmentIcon, { backgroundColor: typeColor + '20' }]}>
          <Ionicons
            name={getAppointmentTypeIcon(appointment.appointment_type)}
            size={28}
            color={typeColor}
          />
        </View>

        <View style={styles.appointmentContent}>
          <View style={styles.appointmentHeader}>
            <View style={styles.appointmentTitleRow}>
              <Text style={styles.appointmentType}>
                {getAppointmentTypeLabel(appointment.appointment_type)}
              </Text>
              <View style={[styles.statusBadge, { backgroundColor: statusColor + '20' }]}>
                <Text style={[styles.statusText, { color: statusColor }]}>
                  {getStatusLabel(appointment.status)}
                </Text>
              </View>
            </View>
          </View>

          {/* Mascota */}
          {appointment.pet && (
            <View style={styles.petInfo}>
              <View style={styles.petImageContainer}>
                {appointment.pet.profile_image_url ? (
                  <Image
                    source={{ uri: appointment.pet.profile_image_url }}
                    style={styles.petImage}
                    resizeMode="cover"
                  />
                ) : (
                  <View style={styles.petPlaceholder}>
                    <Ionicons name="paw" size={16} color={COLORS.textDisabled} />
                  </View>
                )}
              </View>
              <Text style={styles.petName}>{appointment.pet.name}</Text>
            </View>
          )}

          {/* Fecha y Hora */}
          <View style={styles.dateTimeRow}>
            <View style={styles.dateTimeItem}>
              <Ionicons name="calendar-outline" size={16} color={COLORS.textSecondary} />
              <Text style={styles.dateTimeText}>{formatDate(appointment.appointment_datetime)}</Text>
            </View>
            <View style={styles.dateTimeItem}>
              <Ionicons name="time-outline" size={16} color={COLORS.textSecondary} />
              <Text style={styles.dateTimeText}>{formatTime(appointment.appointment_datetime)}</Text>
            </View>
          </View>

          {/* Clínica */}
          {appointment.clinic_name && (
            <View style={styles.infoRow}>
              <Ionicons name="business-outline" size={16} color={COLORS.textSecondary} />
              <Text style={styles.infoText}>{appointment.clinic_name}</Text>
            </View>
          )}

          {/* Veterinario */}
          {appointment.veterinarian_name && (
            <View style={styles.infoRow}>
              <Ionicons name="person-outline" size={16} color={COLORS.textSecondary} />
              <Text style={styles.infoText}>Dr. {appointment.veterinarian_name}</Text>
            </View>
          )}

          {/* Notas */}
          {appointment.notes && (
            <View style={styles.notesSection}>
              <Text style={styles.notesLabel}>Notas:</Text>
              <Text style={styles.notesText} numberOfLines={2}>
                {appointment.notes}
              </Text>
            </View>
          )}
        </View>
      </View>
    );
  };

  const EmptyState = () => (
    <View style={styles.emptyState}>
      <Ionicons name="calendar-outline" size={64} color={COLORS.textDisabled} />
      <Text style={styles.emptyStateTitle}>Sin citas</Text>
      <Text style={styles.emptyStateText}>
        {filter === 'upcoming'
          ? 'No tienes citas próximas agendadas'
          : filter === 'past'
          ? 'No tienes citas pasadas'
          : 'No tienes citas agendadas'}
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Filtros */}
      <View style={styles.filtersContainer}>
        <FilterButton label="Próximas" value="upcoming" />
        <FilterButton label="Pasadas" value="past" />
        <FilterButton label="Todas" value="all" />
      </View>

      {/* Lista de Citas */}
      <FlatList
        data={appointments}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => <AppointmentCard appointment={item} />}
        contentContainerStyle={[
          styles.list,
          appointments.length === 0 && styles.listEmpty,
        ]}
        ListEmptyComponent={!loading && <EmptyState />}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },

  filtersContainer: {
    flexDirection: 'row',
    backgroundColor: COLORS.surface,
    padding: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.divider,
    ...SHADOWS.small,
  },

  filterButton: {
    flex: 1,
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.md,
    marginHorizontal: SPACING.xs,
    borderRadius: BORDER_RADIUS.md,
    backgroundColor: COLORS.background,
    borderWidth: 1,
    borderColor: COLORS.divider,
    alignItems: 'center',
  },

  filterButtonActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },

  filterButtonText: {
    fontSize: FONTS.sizes.sm,
    fontWeight: FONTS.weights.medium,
    color: COLORS.textPrimary,
  },

  filterButtonTextActive: {
    color: COLORS.textWhite,
  },

  list: {
    padding: LAYOUT.screenPadding,
  },

  listEmpty: {
    flexGrow: 1,
    justifyContent: 'center',
  },

  appointmentCard: {
    flexDirection: 'row',
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
    marginBottom: SPACING.md,
    ...SHADOWS.medium,
  },

  appointmentIcon: {
    width: 56,
    height: 56,
    borderRadius: BORDER_RADIUS.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SPACING.md,
  },

  appointmentContent: {
    flex: 1,
  },

  appointmentHeader: {
    marginBottom: SPACING.sm,
  },

  appointmentTitleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  appointmentType: {
    fontSize: FONTS.sizes.lg,
    fontWeight: FONTS.weights.bold,
    color: COLORS.textPrimary,
    flex: 1,
  },

  statusBadge: {
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    borderRadius: BORDER_RADIUS.sm,
  },

  statusText: {
    fontSize: FONTS.sizes.xs,
    fontWeight: FONTS.weights.semibold,
  },

  petInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },

  petImageContainer: {
    marginRight: SPACING.xs,
  },

  petImage: {
    width: 24,
    height: 24,
    borderRadius: 12,
  },

  petPlaceholder: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: COLORS.background,
    alignItems: 'center',
    justifyContent: 'center',
  },

  petName: {
    fontSize: FONTS.sizes.sm,
    fontWeight: FONTS.weights.medium,
    color: COLORS.textPrimary,
  },

  dateTimeRow: {
    flexDirection: 'row',
    marginBottom: SPACING.sm,
  },

  dateTimeItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: SPACING.md,
  },

  dateTimeText: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.textSecondary,
    marginLeft: SPACING.xs,
  },

  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.xs,
  },

  infoText: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.textSecondary,
    marginLeft: SPACING.xs,
  },

  notesSection: {
    marginTop: SPACING.sm,
    paddingTop: SPACING.sm,
    borderTopWidth: 1,
    borderTopColor: COLORS.divider,
  },

  notesLabel: {
    fontSize: FONTS.sizes.xs,
    fontWeight: FONTS.weights.semibold,
    color: COLORS.textSecondary,
    marginBottom: SPACING.xs,
  },

  notesText: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.textPrimary,
    lineHeight: 18,
  },

  emptyState: {
    alignItems: 'center',
    padding: LAYOUT.screenPadding * 2,
  },

  emptyStateTitle: {
    fontSize: FONTS.sizes.xl,
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
});

export default AppointmentsScreen;

/**
 * PetCare Mobile - Pantalla de Notificaciones
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Switch,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING, FONTS, BORDER_RADIUS, LAYOUT } from '../constants/theme';
import * as userService from '../services/userService';

const NotificationsScreen = () => {
  const [notifications, setNotifications] = useState({
    pushEnabled: true,
    emailEnabled: true,
    vaccineReminders: true,
    appointmentReminders: true,
    medicalRecords: false,
    lostPetAlerts: true,
    marketingEmails: false,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadNotificationSettings();
  }, []);

  const loadNotificationSettings = async () => {
    setLoading(true);
    const result = await userService.getNotificationSettings();
    if (result.success && result.data) {
      setNotifications(result.data);
    }
    setLoading(false);
  };

  const toggleNotification = async (key) => {
    const updatedNotifications = { ...notifications, [key]: !notifications[key] };
    setNotifications(updatedNotifications);

    // Guardar en el backend
    await userService.updateNotificationSettings(updatedNotifications);
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  const NotificationItem = ({ title, description, value, onToggle }) => (
    <View style={styles.notificationItem}>
      <View style={styles.notificationContent}>
        <Text style={styles.notificationTitle}>{title}</Text>
        <Text style={styles.notificationDescription}>{description}</Text>
      </View>
      <Switch
        value={value}
        onValueChange={onToggle}
        trackColor={{ false: COLORS.divider, true: COLORS.primary + '80' }}
        thumbColor={value ? COLORS.primary : COLORS.textDisabled}
      />
    </View>
  );

  return (
    <ScrollView style={styles.container}>
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Ionicons name="notifications" size={24} color={COLORS.primary} />
          <Text style={styles.sectionTitle}>Notificaciones Push</Text>
        </View>
        <NotificationItem
          title="Activar notificaciones push"
          description="Recibe notificaciones en tiempo real"
          value={notifications.pushEnabled}
          onToggle={() => toggleNotification('pushEnabled')}
        />
      </View>

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Ionicons name="mail" size={24} color={COLORS.primary} />
          <Text style={styles.sectionTitle}>Notificaciones por Email</Text>
        </View>
        <NotificationItem
          title="Activar emails"
          description="Recibe notificaciones por correo electrónico"
          value={notifications.emailEnabled}
          onToggle={() => toggleNotification('emailEnabled')}
        />
      </View>

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Ionicons name="paw" size={24} color={COLORS.primary} />
          <Text style={styles.sectionTitle}>Recordatorios de Mascotas</Text>
        </View>
        <NotificationItem
          title="Recordatorios de vacunas"
          description="Te avisaremos cuando sea momento de vacunar"
          value={notifications.vaccineReminders}
          onToggle={() => toggleNotification('vaccineReminders')}
        />
        <NotificationItem
          title="Recordatorios de citas"
          description="Notificaciones sobre próximas citas médicas"
          value={notifications.appointmentReminders}
          onToggle={() => toggleNotification('appointmentReminders')}
        />
        <NotificationItem
          title="Actualizaciones de registros médicos"
          description="Te avisaremos cuando se actualice el registro médico"
          value={notifications.medicalRecords}
          onToggle={() => toggleNotification('medicalRecords')}
        />
      </View>

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Ionicons name="alert-circle" size={24} color={COLORS.warning} />
          <Text style={styles.sectionTitle}>Alertas</Text>
        </View>
        <NotificationItem
          title="Alertas de mascotas perdidas"
          description="Recibe notificaciones sobre mascotas perdidas en tu área"
          value={notifications.lostPetAlerts}
          onToggle={() => toggleNotification('lostPetAlerts')}
        />
      </View>

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Ionicons name="megaphone" size={24} color={COLORS.info} />
          <Text style={styles.sectionTitle}>Marketing</Text>
        </View>
        <NotificationItem
          title="Emails promocionales"
          description="Recibe ofertas y novedades de PetCare"
          value={notifications.marketingEmails}
          onToggle={() => toggleNotification('marketingEmails')}
        />
      </View>

      <View style={styles.infoBox}>
        <Ionicons name="information-circle" size={20} color={COLORS.info} />
        <Text style={styles.infoText}>
          Puedes cambiar estas configuraciones en cualquier momento. Algunas notificaciones críticas no se pueden desactivar.
        </Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.background,
  },
  section: {
    backgroundColor: COLORS.surface,
    marginBottom: SPACING.md,
    paddingVertical: SPACING.md,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: LAYOUT.screenPadding,
    paddingBottom: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.divider,
    marginBottom: SPACING.sm,
  },
  sectionTitle: {
    fontSize: FONTS.sizes.md,
    fontWeight: FONTS.weights.semibold,
    color: COLORS.textPrimary,
    marginLeft: SPACING.sm,
  },
  notificationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: LAYOUT.screenPadding,
    paddingVertical: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.divider,
  },
  notificationContent: {
    flex: 1,
    marginRight: SPACING.md,
  },
  notificationTitle: {
    fontSize: FONTS.sizes.md,
    fontWeight: FONTS.weights.medium,
    color: COLORS.textPrimary,
    marginBottom: SPACING.xs,
  },
  notificationDescription: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.textSecondary,
  },
  infoBox: {
    flexDirection: 'row',
    backgroundColor: COLORS.info + '15',
    padding: SPACING.md,
    marginHorizontal: LAYOUT.screenPadding,
    marginVertical: SPACING.md,
    borderRadius: BORDER_RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.info + '30',
  },
  infoText: {
    flex: 1,
    fontSize: FONTS.sizes.sm,
    color: COLORS.textSecondary,
    marginLeft: SPACING.sm,
  },
});

export default NotificationsScreen;

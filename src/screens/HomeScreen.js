/**
 * PetCare Mobile - Pantalla de Inicio
 */

import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../contexts/AuthContext';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import * as petService from '../services/petService';
import * as medicalService from '../services/medicalService';
import * as appointmentService from '../services/appointmentService';
import { COLORS, SPACING, FONTS, BORDER_RADIUS, SHADOWS, LAYOUT } from '../constants/theme';

const HomeScreen = () => {
  const { user } = useAuth();
  const navigation = useNavigation();
  const [pets, setPets] = useState([]);
  const [upcomingVaccines, setUpcomingVaccines] = useState([]);
  const [vaccinesCount, setVaccinesCount] = useState(0);
  const [appointmentsCount, setAppointmentsCount] = useState(0);
  const [loading, setLoading] = useState(false);

  // Cargar datos cuando la pantalla entra en foco
  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [])
  );

  const loadData = async () => {
    setLoading(true);

    // Cargar mascotas
    const petsResult = await petService.getMyPets();
    if (petsResult.success) {
      setPets(petsResult.data || []);
    }

    // Cargar próximas vacunas del registro médico
    const vaccinesResult = await medicalService.getUpcomingVaccines({ days: 30 });
    const medicalVaccinesCount = vaccinesResult.success ? (vaccinesResult.data || []).length : 0;
    setUpcomingVaccines(vaccinesResult.data || []);

    // Cargar citas de vacunación futuras
    const vaccineAppointmentsResult = await appointmentService.countUpcomingVaccineAppointments();
    const appointmentVaccinesCount = vaccineAppointmentsResult.success ? (vaccineAppointmentsResult.data.count || 0) : 0;

    // Sumar ambos contadores para el total de vacunas
    setVaccinesCount(medicalVaccinesCount + appointmentVaccinesCount);

    // Cargar contador de citas
    const appointmentsResult = await appointmentService.countUpcomingAppointments();
    if (appointmentsResult.success) {
      setAppointmentsCount(appointmentsResult.data.count || 0);
    }

    setLoading(false);
  };

  const QuickActionCard = ({ icon, title, onPress, color = COLORS.primary }) => (
    <TouchableOpacity style={styles.quickActionCard} onPress={onPress}>
      <View style={[styles.quickActionIcon, { backgroundColor: color }]}>
        <Ionicons name={icon} size={24} color={COLORS.textWhite} />
      </View>
      <Text style={styles.quickActionText}>{title}</Text>
    </TouchableOpacity>
  );

  const StatCard = ({ icon, value, label, color = COLORS.primary }) => (
    <View style={styles.statCard}>
      <Ionicons name={icon} size={32} color={color} />
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      refreshControl={
        <RefreshControl refreshing={loading} onRefresh={loadData} />
      }
    >
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Hola, {user?.firstName || 'Usuario'}</Text>
          <Text style={styles.subtitle}>Bienvenido a PetCare</Text>
        </View>
      </View>

      {/* Stats */}
      <View style={styles.statsContainer}>
        <TouchableOpacity
          style={styles.statCard}
          onPress={() => navigation.navigate('Pets')}
          activeOpacity={0.7}
        >
          <Ionicons name="paw" size={32} color={COLORS.primary} />
          <Text style={styles.statValue}>{pets.length}</Text>
          <Text style={styles.statLabel}>Mascotas</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.statCard}
          onPress={() => navigation.navigate('Notifications')}
          activeOpacity={0.7}
        >
          <Ionicons name="medical" size={32} color={COLORS.warning} />
          <Text style={styles.statValue}>{vaccinesCount}</Text>
          <Text style={styles.statLabel}>Próximas vacunas</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.statCard}
          onPress={() => navigation.navigate('Appointments')}
          activeOpacity={0.7}
        >
          <Ionicons name="calendar" size={32} color={COLORS.info} />
          <Text style={styles.statValue}>{appointmentsCount}</Text>
          <Text style={styles.statLabel}>Citas</Text>
        </TouchableOpacity>
      </View>

      {/* Quick Actions */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Acciones rápidas</Text>
        <View style={styles.quickActionsGrid}>
          <QuickActionCard
            icon="add-circle"
            title="Agregar Mascota"
            onPress={() => navigation.navigate('AddPet')}
            color={COLORS.primary}
          />
          <QuickActionCard
            icon="qr-code"
            title="Escanear QR"
            onPress={() => navigation.navigate('QRScanner')}
            color={COLORS.secondary}
          />
          <QuickActionCard
            icon="medical"
            title="Registro Médico"
            onPress={() => navigation.navigate('MedicalRecords')}
            color={COLORS.success}
          />
          <QuickActionCard
            icon="calendar"
            title="Agendar Cita"
            onPress={() => navigation.navigate('BookAppointment')}
            color={COLORS.info}
          />
        </View>
      </View>

      {/* Upcoming Vaccines */}
      {upcomingVaccines.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Próximas vacunas</Text>
          {upcomingVaccines.slice(0, 3).map((vaccine, index) => (
            <View key={index} style={styles.vaccineCard}>
              <View style={styles.vaccineIcon}>
                <Ionicons name="medical" size={20} color={COLORS.warning} />
              </View>
              <View style={styles.vaccineInfo}>
                <Text style={styles.vaccineName}>{vaccine.name}</Text>
                <Text style={styles.vaccineDate}>
                  {new Date(vaccine.nextDoseDate).toLocaleDateString('es-CL')}
                </Text>
              </View>
            </View>
          ))}
        </View>
      )}

      {/* Recent Pets */}
      {pets.length > 0 && (
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Mis mascotas</Text>
            <TouchableOpacity onPress={() => navigation.navigate('Pets')}>
              <Text style={styles.seeAll}>Ver todas</Text>
            </TouchableOpacity>
          </View>
          {pets.slice(0, 3).map((pet) => (
            <TouchableOpacity
              key={pet.id}
              style={styles.petItem}
              onPress={() => navigation.navigate('PetDetail', { petId: pet.id })}
            >
              <Ionicons name="paw" size={24} color={COLORS.primary} />
              <Text style={styles.petName}>{pet.name}</Text>
              <Ionicons name="chevron-forward" size={20} color={COLORS.textSecondary} />
            </TouchableOpacity>
          ))}
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },

  content: {
    padding: LAYOUT.screenPadding,
  },

  header: {
    marginBottom: SPACING.lg,
  },

  greeting: {
    fontSize: FONTS.sizes.xxl,
    fontWeight: FONTS.weights.bold,
    color: COLORS.textPrimary,
  },

  subtitle: {
    fontSize: FONTS.sizes.md,
    color: COLORS.textSecondary,
    marginTop: SPACING.xs,
  },

  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: SPACING.lg,
  },

  statCard: {
    flex: 1,
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
    marginHorizontal: SPACING.xs,
    alignItems: 'center',
    ...SHADOWS.medium,
  },

  statValue: {
    fontSize: FONTS.sizes.xxl,
    fontWeight: FONTS.weights.bold,
    color: COLORS.textPrimary,
    marginTop: SPACING.xs,
  },

  statLabel: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.textSecondary,
    textAlign: 'center',
  },

  section: {
    marginBottom: SPACING.xl,
  },

  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },

  sectionTitle: {
    fontSize: FONTS.sizes.lg,
    fontWeight: FONTS.weights.bold,
    color: COLORS.textPrimary,
    marginBottom: SPACING.md,
  },

  seeAll: {
    fontSize: FONTS.sizes.md,
    color: COLORS.primary,
    fontWeight: FONTS.weights.medium,
  },

  quickActionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },

  quickActionCard: {
    width: '48%',
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
    alignItems: 'center',
    marginBottom: SPACING.md,
    ...SHADOWS.small,
  },

  quickActionIcon: {
    width: 56,
    height: 56,
    borderRadius: BORDER_RADIUS.round,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.sm,
  },

  quickActionText: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.textPrimary,
    textAlign: 'center',
    fontWeight: FONTS.weights.medium,
  },

  vaccineCard: {
    flexDirection: 'row',
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
    marginBottom: SPACING.sm,
    alignItems: 'center',
    ...SHADOWS.small,
  },

  vaccineIcon: {
    width: 40,
    height: 40,
    borderRadius: BORDER_RADIUS.round,
    backgroundColor: COLORS.warning + '20',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SPACING.md,
  },

  vaccineInfo: {
    flex: 1,
  },

  vaccineName: {
    fontSize: FONTS.sizes.md,
    fontWeight: FONTS.weights.medium,
    color: COLORS.textPrimary,
  },

  vaccineDate: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.textSecondary,
    marginTop: SPACING.xs,
  },

  petItem: {
    flexDirection: 'row',
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
    marginBottom: SPACING.sm,
    alignItems: 'center',
    ...SHADOWS.small,
  },

  petName: {
    flex: 1,
    fontSize: FONTS.sizes.md,
    color: COLORS.textPrimary,
    marginLeft: SPACING.md,
    fontWeight: FONTS.weights.medium,
  },
});

export default HomeScreen;

/**
 * PetCare Mobile - Pantalla de Registros Médicos
 */

import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
  RefreshControl,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import * as petService from '../services/petService';
import * as medicalService from '../services/medicalService';
import { COLORS, SPACING, FONTS, BORDER_RADIUS, SHADOWS, LAYOUT } from '../constants/theme';

const MedicalRecordsScreen = () => {
  const [pets, setPets] = useState([]);
  const [selectedPet, setSelectedPet] = useState(null);
  const [medicalRecords, setMedicalRecords] = useState([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  useFocusEffect(
    useCallback(() => {
      loadPets();
    }, [])
  );

  useEffect(() => {
    if (selectedPet) {
      loadMedicalRecords(selectedPet.id);
    }
  }, [selectedPet]);

  const loadPets = async () => {
    setLoading(true);
    const result = await petService.getMyPets();
    setLoading(false);

    if (result.success) {
      const petsList = result.data || [];
      setPets(petsList);

      if (petsList.length > 0 && !selectedPet) {
        setSelectedPet(petsList[0]);
      }
    } else {
      Alert.alert('Error', 'No se pudieron cargar las mascotas');
    }
  };

  const loadMedicalRecords = async (petId) => {
    setLoading(true);
    const result = await medicalService.getPetMedicalRecords(petId);
    setLoading(false);

    if (result.success) {
      setMedicalRecords(result.data || []);
    } else {
      Alert.alert('Error', 'No se pudieron cargar los registros médicos');
      setMedicalRecords([]);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadPets();
    if (selectedPet) {
      await loadMedicalRecords(selectedPet.id);
    }
    setRefreshing(false);
  };

  const handlePetSelect = (pet) => {
    setSelectedPet(pet);
  };

  const getRecordTypeLabel = (type) => {
    const types = {
      consultation: 'Consulta',
      surgery: 'Cirugía',
      emergency: 'Emergencia',
      vaccination: 'Vacunación',
      checkup: 'Chequeo',
      other: 'Otro',
    };
    return types[type] || type;
  };

  const getRecordTypeIcon = (type) => {
    const icons = {
      consultation: 'medical',
      surgery: 'cut',
      emergency: 'warning',
      vaccination: 'shield-checkmark',
      checkup: 'checkmark-circle',
      other: 'document-text',
    };
    return icons[type] || 'document-text';
  };

  const getRecordTypeColor = (type) => {
    const colors = {
      consultation: COLORS.info,
      surgery: COLORS.error,
      emergency: COLORS.warning,
      vaccination: COLORS.success,
      checkup: COLORS.primary,
      other: COLORS.textSecondary,
    };
    return colors[type] || COLORS.textSecondary;
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-CL', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    });
  };

  const getSpeciesIcon = (species) => {
    return 'paw';
  };

  const getSpeciesLabel = (species) => {
    switch (species) {
      case 'dog':
        return 'Perro';
      case 'cat':
        return 'Gato';
      default:
        return species;
    }
  };

  const getAge = (pet) => {
    if (pet.date_of_birth) {
      const birthDate = new Date(pet.date_of_birth);
      const today = new Date();
      const ageInMonths = Math.floor((today - birthDate) / (1000 * 60 * 60 * 24 * 30));

      if (ageInMonths < 12) {
        return `${ageInMonths} meses`;
      } else {
        const years = Math.floor(ageInMonths / 12);
        return `${years} ${years === 1 ? 'año' : 'años'}`;
      }
    } else if (pet.estimated_age_months) {
      if (pet.estimated_age_months < 12) {
        return `~${pet.estimated_age_months} meses`;
      } else {
        const years = Math.floor(pet.estimated_age_months / 12);
        return `~${years} ${years === 1 ? 'año' : 'años'}`;
      }
    }
    return 'Edad desconocida';
  };

  const PetSelectorCard = ({ pet }) => (
    <TouchableOpacity
      style={[
        styles.petCard,
        selectedPet?.id === pet.id && styles.petCardSelected,
      ]}
      onPress={() => handlePetSelect(pet)}
      activeOpacity={0.7}
    >
      <View style={styles.petImageContainer}>
        {pet.profile_image_url ? (
          <Image
            source={{ uri: pet.profile_image_url }}
            style={styles.petImage}
            resizeMode="cover"
          />
        ) : (
          <View style={styles.petPlaceholderImage}>
            <Ionicons name={getSpeciesIcon(pet.species)} size={32} color={COLORS.textDisabled} />
          </View>
        )}
      </View>

      <View style={styles.petContent}>
        <Text style={styles.petName}>{pet.name}</Text>

        <View style={styles.petInfoRow}>
          <Ionicons name={getSpeciesIcon(pet.species)} size={14} color={COLORS.textSecondary} />
          <Text style={styles.petInfoText}>{getSpeciesLabel(pet.species)}</Text>

          {pet.breed && (
            <>
              <View style={styles.petSeparator} />
              <Text style={styles.petInfoText}>{pet.breed}</Text>
            </>
          )}
        </View>

        <View style={styles.petInfoRow}>
          <Ionicons name="calendar-outline" size={14} color={COLORS.textSecondary} />
          <Text style={styles.petInfoText}>{getAge(pet)}</Text>

          {pet.gender && (
            <>
              <View style={styles.petSeparator} />
              <Ionicons
                name={pet.gender === 'male' ? 'male' : 'female'}
                size={14}
                color={pet.gender === 'male' ? COLORS.info : COLORS.primary}
              />
            </>
          )}
        </View>
      </View>

      {selectedPet?.id === pet.id && (
        <Ionicons name="checkmark-circle" size={24} color={COLORS.success} />
      )}
    </TouchableOpacity>
  );

  const MedicalRecordCard = ({ record }) => {
    const typeColor = getRecordTypeColor(record.record_type);

    return (
      <View style={styles.recordCard}>
        <View style={[styles.recordIcon, { backgroundColor: typeColor + '20' }]}>
          <Ionicons
            name={getRecordTypeIcon(record.record_type)}
            size={24}
            color={typeColor}
          />
        </View>

        <View style={styles.recordContent}>
          <View style={styles.recordHeader}>
            <Text style={styles.recordType}>
              {getRecordTypeLabel(record.record_type)}
            </Text>
            <Text style={styles.recordDate}>{formatDate(record.date)}</Text>
          </View>

          {record.diagnosis && (
            <View style={styles.recordSection}>
              <Text style={styles.recordLabel}>Diagnóstico:</Text>
              <Text style={styles.recordText} numberOfLines={2}>
                {record.diagnosis}
              </Text>
            </View>
          )}

          {record.treatment && (
            <View style={styles.recordSection}>
              <Text style={styles.recordLabel}>Tratamiento:</Text>
              <Text style={styles.recordText} numberOfLines={2}>
                {record.treatment}
              </Text>
            </View>
          )}

          {record.prescriptions && (
            <View style={styles.recordSection}>
              <Text style={styles.recordLabel}>Prescripciones:</Text>
              <Text style={styles.recordText} numberOfLines={2}>
                {record.prescriptions}
              </Text>
            </View>
          )}

          {record.weight_kg && (
            <View style={styles.recordStats}>
              <View style={styles.recordStat}>
                <Ionicons name="scale" size={16} color={COLORS.textSecondary} />
                <Text style={styles.recordStatText}>{record.weight_kg} kg</Text>
              </View>
              {record.temperature_celsius && (
                <View style={styles.recordStat}>
                  <Ionicons name="thermometer" size={16} color={COLORS.textSecondary} />
                  <Text style={styles.recordStatText}>{record.temperature_celsius}°C</Text>
                </View>
              )}
              {record.heart_rate && (
                <View style={styles.recordStat}>
                  <Ionicons name="heart" size={16} color={COLORS.textSecondary} />
                  <Text style={styles.recordStatText}>{record.heart_rate} bpm</Text>
                </View>
              )}
            </View>
          )}

          {record.notes && (
            <View style={styles.recordSection}>
              <Text style={styles.recordLabel}>Notas:</Text>
              <Text style={styles.recordText} numberOfLines={2}>
                {record.notes}
              </Text>
            </View>
          )}
        </View>
      </View>
    );
  };

  const EmptyStateNoPets = () => (
    <View style={styles.emptyState}>
      <Ionicons name="paw-outline" size={64} color={COLORS.textDisabled} />
      <Text style={styles.emptyStateTitle}>No tienes mascotas registradas</Text>
      <Text style={styles.emptyStateText}>
        Agrega tu primera mascota para ver sus registros médicos
      </Text>
    </View>
  );

  const EmptyStateNoRecords = () => (
    <View style={styles.emptyState}>
      <Ionicons name="medical-outline" size={64} color={COLORS.textDisabled} />
      <Text style={styles.emptyStateTitle}>Sin registros médicos</Text>
      <Text style={styles.emptyStateText}>
        {selectedPet
          ? `${selectedPet.name} no tiene registros médicos aún`
          : 'Selecciona una mascota para ver sus registros'}
      </Text>
    </View>
  );

  if (pets.length === 0 && !loading) {
    return (
      <View style={styles.container}>
        <EmptyStateNoPets />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Lista de Mascotas */}
      <View style={styles.petsSection}>
        <Text style={styles.sectionTitle}>Selecciona una mascota:</Text>
        <FlatList
          horizontal
          data={pets}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => <PetSelectorCard pet={item} />}
          contentContainerStyle={styles.petsList}
          showsHorizontalScrollIndicator={false}
        />
      </View>

      {/* Registros Médicos */}
      <View style={styles.recordsSection}>
        <FlatList
          data={medicalRecords}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => <MedicalRecordCard record={item} />}
          contentContainerStyle={[
            styles.recordsList,
            medicalRecords.length === 0 && styles.recordsListEmpty,
          ]}
          ListEmptyComponent={!loading && <EmptyStateNoRecords />}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },

  petsSection: {
    backgroundColor: COLORS.surface,
    paddingVertical: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.divider,
    ...SHADOWS.small,
  },

  sectionTitle: {
    fontSize: FONTS.sizes.md,
    fontWeight: FONTS.weights.semibold,
    color: COLORS.textPrimary,
    marginHorizontal: LAYOUT.screenPadding,
    marginBottom: SPACING.sm,
  },

  petsList: {
    paddingHorizontal: LAYOUT.screenPadding,
  },

  petCard: {
    flexDirection: 'row',
    backgroundColor: COLORS.background,
    borderRadius: BORDER_RADIUS.md,
    borderWidth: 2,
    borderColor: COLORS.divider,
    padding: SPACING.sm,
    marginRight: SPACING.md,
    alignItems: 'center',
    width: 220,
    ...SHADOWS.small,
  },

  petCardSelected: {
    borderColor: COLORS.success,
    backgroundColor: COLORS.success + '10',
  },

  petImageContainer: {
    marginRight: SPACING.sm,
  },

  petImage: {
    width: 60,
    height: 60,
    borderRadius: BORDER_RADIUS.md,
  },

  petPlaceholderImage: {
    width: 60,
    height: 60,
    borderRadius: BORDER_RADIUS.md,
    backgroundColor: COLORS.background,
    alignItems: 'center',
    justifyContent: 'center',
  },

  petContent: {
    flex: 1,
  },

  petName: {
    fontSize: FONTS.sizes.md,
    fontWeight: FONTS.weights.bold,
    color: COLORS.textPrimary,
    marginBottom: SPACING.xs,
  },

  petInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.xs,
  },

  petInfoText: {
    fontSize: FONTS.sizes.xs,
    color: COLORS.textSecondary,
    marginLeft: SPACING.xs,
  },

  petSeparator: {
    width: 1,
    height: 10,
    backgroundColor: COLORS.divider,
    marginHorizontal: SPACING.xs,
  },

  recordsSection: {
    flex: 1,
  },

  recordsList: {
    padding: LAYOUT.screenPadding,
  },

  recordsListEmpty: {
    flexGrow: 1,
    justifyContent: 'center',
  },

  recordCard: {
    flexDirection: 'row',
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
    marginBottom: SPACING.md,
    ...SHADOWS.medium,
  },

  recordIcon: {
    width: 48,
    height: 48,
    borderRadius: BORDER_RADIUS.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SPACING.md,
  },

  recordContent: {
    flex: 1,
  },

  recordHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },

  recordType: {
    fontSize: FONTS.sizes.lg,
    fontWeight: FONTS.weights.bold,
    color: COLORS.textPrimary,
  },

  recordDate: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.textSecondary,
  },

  recordSection: {
    marginTop: SPACING.sm,
  },

  recordLabel: {
    fontSize: FONTS.sizes.sm,
    fontWeight: FONTS.weights.semibold,
    color: COLORS.textSecondary,
    marginBottom: SPACING.xs,
  },

  recordText: {
    fontSize: FONTS.sizes.md,
    color: COLORS.textPrimary,
    lineHeight: 20,
  },

  recordStats: {
    flexDirection: 'row',
    marginTop: SPACING.sm,
    paddingTop: SPACING.sm,
    borderTopWidth: 1,
    borderTopColor: COLORS.divider,
  },

  recordStat: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: SPACING.md,
  },

  recordStatText: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.textSecondary,
    marginLeft: SPACING.xs,
  },

  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: LAYOUT.screenPadding * 2,
    marginTop: SPACING.xxl,
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

export default MedicalRecordsScreen;

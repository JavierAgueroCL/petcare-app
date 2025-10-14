/**
 * PetCare Mobile - Pantalla de Agendar Cita
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Button from '../components/Button';
import Input from '../components/Input';
import DateInput from '../components/DateInput';
import { COLORS, SPACING, FONTS, LAYOUT, BORDER_RADIUS, SHADOWS } from '../constants/theme';
import * as petService from '../services/petService';
import * as appointmentService from '../services/appointmentService';

const BookAppointmentScreen = ({ navigation }) => {
  const [pets, setPets] = useState([]);
  const [selectedPet, setSelectedPet] = useState(null);
  const [appointmentType, setAppointmentType] = useState('');
  const [date, setDate] = useState(new Date());
  const [time, setTime] = useState(new Date());
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null); // { type: 'success' | 'error', text: string }

  const appointmentTypes = [
    { id: 'checkup', name: 'Control Veterinario', icon: 'medical' },
    { id: 'vaccine', name: 'Vacunación', icon: 'shield-checkmark' },
    { id: 'grooming', name: 'Peluquería', icon: 'cut' },
    { id: 'emergency', name: 'Emergencia', icon: 'alert-circle' },
    { id: 'surgery', name: 'Cirugía', icon: 'medkit' },
    { id: 'other', name: 'Otro', icon: 'ellipsis-horizontal' },
  ];

  useEffect(() => {
    loadPets();
  }, []);

  const loadPets = async () => {
    const result = await petService.getMyPets();
    if (result.success && result.data) {
      setPets(result.data);
    }
  };


  const handleSubmit = async () => {
    // Validaciones
    if (!selectedPet) {
      Alert.alert('Error', 'Por favor selecciona una mascota');
      return;
    }

    if (!appointmentType) {
      Alert.alert('Error', 'Por favor selecciona el tipo de cita');
      return;
    }

    setLoading(true);

    // Combinar fecha y hora
    const appointmentDateTime = new Date(date);
    appointmentDateTime.setHours(time.getHours());
    appointmentDateTime.setMinutes(time.getMinutes());

    const formatDate = (date) => {
      const day = date.getDate().toString().padStart(2, '0');
      const month = (date.getMonth() + 1).toString().padStart(2, '0');
      const year = date.getFullYear();
      return `${day}/${month}/${year}`;
    };

    const formatTime = (time) => {
      const hours = time.getHours().toString().padStart(2, '0');
      const minutes = time.getMinutes().toString().padStart(2, '0');
      return `${hours}:${minutes}`;
    };

    // Crear la cita
    const result = await appointmentService.createAppointment({
      pet_id: selectedPet.id,
      appointment_type: appointmentType,
      appointment_datetime: appointmentDateTime.toISOString(),
      notes,
    });

    setLoading(false);

    // Verificar si la respuesta es exitosa
    // El servidor puede devolver { success: true } o { error: "fail", message: "..." }
    const isSuccess = result.success === true || (!result.error && result.data);

    if (isSuccess) {
      const successMessage = `Se ha agendado tu cita para el ${formatDate(date)} a las ${formatTime(time)}`;

      if (Platform.OS === 'web') {
        // En web, mostrar mensaje en pantalla
        setMessage({ type: 'success', text: successMessage });
        setTimeout(() => {
          setMessage(null);
          navigation.goBack();
        }, 3000);
      } else {
        // En móvil, usar Alert nativo
        Alert.alert(
          'Cita Agendada',
          successMessage,
          [
            {
              text: 'OK',
              onPress: () => navigation.goBack(),
            },
          ]
        );
      }
    } else {
      // Mostrar el mensaje de error del servidor
      const errorMessage = result.message || result.error || 'No se pudo agendar la cita';

      if (Platform.OS === 'web') {
        // En web, mostrar mensaje en pantalla
        setMessage({ type: 'error', text: errorMessage });
        setTimeout(() => setMessage(null), 5000);
      } else {
        // En móvil, usar Alert nativo
        Alert.alert('Error al agendar cita', errorMessage);
      }
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Mensaje de éxito/error para web */}
      {message && Platform.OS === 'web' && (
        <View style={[
          styles.messageContainer,
          message.type === 'success' ? styles.messageSuccess : styles.messageError
        ]}>
          <Ionicons
            name={message.type === 'success' ? 'checkmark-circle' : 'alert-circle'}
            size={24}
            color={COLORS.textWhite}
          />
          <Text style={styles.messageText}>{message.text}</Text>
          <TouchableOpacity onPress={() => setMessage(null)}>
            <Ionicons name="close" size={24} color={COLORS.textWhite} />
          </TouchableOpacity>
        </View>
      )}

      <View style={styles.header}>
        <Ionicons name="calendar" size={48} color={COLORS.primary} />
        <Text style={styles.title}>Agendar Cita</Text>
        <Text style={styles.subtitle}>
          Programa una cita veterinaria para tu mascota
        </Text>
      </View>

      {/* Seleccionar Mascota */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Selecciona tu mascota</Text>
        {pets.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons name="paw-outline" size={48} color={COLORS.textSecondary} />
            <Text style={styles.emptyText}>No tienes mascotas registradas</Text>
            <Button
              title="Agregar Mascota"
              onPress={() => navigation.navigate('AddPet')}
              variant="outline"
              size="small"
              style={styles.addPetButton}
            />
          </View>
        ) : (
          <View style={styles.petsGrid}>
            {pets.map((pet) => (
              <TouchableOpacity
                key={pet.id}
                style={[
                  styles.petCard,
                  selectedPet?.id === pet.id && styles.petCardSelected,
                ]}
                onPress={() => setSelectedPet(pet)}
              >
                <Ionicons
                  name="paw"
                  size={24}
                  color={selectedPet?.id === pet.id ? COLORS.primary : COLORS.textSecondary}
                />
                <Text
                  style={[
                    styles.petName,
                    selectedPet?.id === pet.id && styles.petNameSelected,
                  ]}
                >
                  {pet.name}
                </Text>
                {selectedPet?.id === pet.id && (
                  <Ionicons name="checkmark-circle" size={20} color={COLORS.primary} />
                )}
              </TouchableOpacity>
            ))}
          </View>
        )}
      </View>

      {/* Tipo de Cita */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Tipo de cita</Text>
        <View style={styles.typesGrid}>
          {appointmentTypes.map((type) => (
            <TouchableOpacity
              key={type.id}
              style={[
                styles.typeCard,
                appointmentType === type.id && styles.typeCardSelected,
              ]}
              onPress={() => setAppointmentType(type.id)}
            >
              <Ionicons
                name={type.icon}
                size={28}
                color={appointmentType === type.id ? COLORS.primary : COLORS.textSecondary}
              />
              <Text
                style={[
                  styles.typeName,
                  appointmentType === type.id && styles.typeNameSelected,
                ]}
              >
                {type.name}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Fecha y Hora */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Fecha y hora</Text>

        <DateInput
          label="Fecha"
          value={date}
          onChange={setDate}
          mode="date"
          minimumDate={new Date()}
        />

        <DateInput
          label="Hora"
          value={time}
          onChange={setTime}
          mode="time"
        />
      </View>

      {/* Notas */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Notas adicionales (opcional)</Text>
        <Input
          value={notes}
          onChangeText={setNotes}
          placeholder="Describe el motivo de la cita o información adicional"
          multiline
          numberOfLines={4}
          style={styles.notesInput}
        />
      </View>

      {/* Botones */}
      <View style={styles.buttonsContainer}>
        <Button
          title="Agendar Cita"
          onPress={handleSubmit}
          loading={loading}
          disabled={!selectedPet || !appointmentType}
        />
        <Button
          title="Cancelar"
          onPress={() => navigation.goBack()}
          variant="ghost"
          style={styles.cancelButton}
        />
      </View>
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

  messageContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING.md,
    borderRadius: BORDER_RADIUS.md,
    marginBottom: SPACING.md,
    ...SHADOWS.medium,
  },

  messageSuccess: {
    backgroundColor: COLORS.success,
  },

  messageError: {
    backgroundColor: COLORS.error,
  },

  messageText: {
    flex: 1,
    color: COLORS.textWhite,
    fontSize: FONTS.sizes.md,
    fontWeight: FONTS.weights.medium,
    marginHorizontal: SPACING.md,
  },

  header: {
    alignItems: 'center',
    marginBottom: SPACING.xl,
  },

  title: {
    fontSize: FONTS.sizes.xxl,
    fontWeight: FONTS.weights.bold,
    color: COLORS.textPrimary,
    marginTop: SPACING.md,
  },

  subtitle: {
    fontSize: FONTS.sizes.md,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginTop: SPACING.xs,
  },

  section: {
    marginBottom: SPACING.xl,
  },

  sectionTitle: {
    fontSize: FONTS.sizes.lg,
    fontWeight: FONTS.weights.bold,
    color: COLORS.textPrimary,
    marginBottom: SPACING.md,
  },

  emptyState: {
    alignItems: 'center',
    padding: SPACING.xl,
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.md,
  },

  emptyText: {
    fontSize: FONTS.sizes.md,
    color: COLORS.textSecondary,
    marginTop: SPACING.md,
    marginBottom: SPACING.lg,
  },

  addPetButton: {
    marginTop: SPACING.md,
  },

  petsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -SPACING.xs,
  },

  petCard: {
    width: '48%',
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
    margin: SPACING.xs,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
    ...SHADOWS.small,
  },

  petCardSelected: {
    borderColor: COLORS.primary,
    backgroundColor: COLORS.primary + '10',
  },

  petName: {
    fontSize: FONTS.sizes.md,
    color: COLORS.textPrimary,
    marginTop: SPACING.sm,
    fontWeight: FONTS.weights.medium,
  },

  petNameSelected: {
    color: COLORS.primary,
  },

  typesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -SPACING.xs,
  },

  typeCard: {
    width: '31%',
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
    margin: SPACING.xs,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
    ...SHADOWS.small,
  },

  typeCardSelected: {
    borderColor: COLORS.primary,
    backgroundColor: COLORS.primary + '10',
  },

  typeName: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.textPrimary,
    marginTop: SPACING.xs,
    textAlign: 'center',
  },

  typeNameSelected: {
    color: COLORS.primary,
    fontWeight: FONTS.weights.medium,
  },

  notesInput: {
    height: 100,
    textAlignVertical: 'top',
  },

  buttonsContainer: {
    marginTop: SPACING.md,
    marginBottom: SPACING.xl,
  },

  cancelButton: {
    marginTop: SPACING.md,
  },
});

export default BookAppointmentScreen;

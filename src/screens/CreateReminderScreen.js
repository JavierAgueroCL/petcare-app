/**
 * PetCare Mobile - Pantalla para Crear Recordatorios Manuales
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import Input from '../components/Input';
import DateInput from '../components/DateInput';
import Select from '../components/Select';
import Button from '../components/Button';
import { showToast } from '../components/Toast';
import * as petService from '../services/petService';
import * as notificationService from '../services/notificationService';
import { COLORS, LAYOUT, SPACING, FONTS } from '../constants/theme';

const CreateReminderScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { petId } = route.params || {};

  const [pets, setPets] = useState([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    petId: petId || null,
    type: 'general',
    title: '',
    message: '',
    scheduledDate: new Date(),
    priority: 'medium',
  });

  const typeOptions = [
    { label: 'Recordatorio General', value: 'general' },
    { label: 'Recordatorio de Vacuna', value: 'vaccine_reminder' },
    { label: 'Recordatorio de Desparasitación', value: 'deworming_reminder' },
    { label: 'Recordatorio de Cita', value: 'appointment_reminder' },
  ];

  const priorityOptions = [
    { label: 'Baja', value: 'low' },
    { label: 'Media', value: 'medium' },
    { label: 'Alta', value: 'high' },
    { label: 'Urgente', value: 'urgent' },
  ];

  useEffect(() => {
    loadPets();
  }, []);

  const loadPets = async () => {
    const result = await petService.getMyPets();
    if (result.success && result.data) {
      const petOptions = result.data.map(pet => ({
        label: pet.name,
        value: pet.id,
      }));
      // Agregar opción "Ninguna" al inicio
      setPets([
        { label: 'Ninguna (Recordatorio general)', value: null },
        ...petOptions,
      ]);
    }
  };

  const handleSubmit = async () => {
    if (!formData.title || !formData.message) {
      showToast('Por favor completa el título y mensaje', 'error');
      return;
    }

    setLoading(true);

    // Formatear fecha para el backend
    const scheduledDate = formData.scheduledDate.toISOString();

    const result = await notificationService.createReminder({
      pet_id: formData.petId,
      type: formData.type,
      title: formData.title,
      message: formData.message,
      scheduled_date: scheduledDate,
      priority: formData.priority,
    });

    setLoading(false);

    if (result.success) {
      showToast('Recordatorio creado exitosamente', 'success');
      setTimeout(() => {
        navigation.goBack();
      }, 500);
    } else {
      showToast(result.error || 'No se pudo crear el recordatorio', 'error');
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.content}>
        <Text style={styles.description}>
          Crea un recordatorio personalizado para el cuidado de tus mascotas
        </Text>

        {pets.length > 0 && (
          <Select
            label="Mascota (opcional)"
            value={formData.petId}
            onValueChange={(value) => setFormData({ ...formData, petId: value })}
            items={pets}
          />
        )}

        <Select
          label="Tipo de Recordatorio"
          value={formData.type}
          onValueChange={(value) => setFormData({ ...formData, type: value })}
          items={typeOptions}
        />

        <Input
          label="Título *"
          placeholder="Ej: Vacuna Antirrábica"
          value={formData.title}
          onChangeText={(text) => setFormData({ ...formData, title: text })}
        />

        <Input
          label="Mensaje *"
          placeholder="Ej: Recordatorio para aplicar la vacuna antirrábica anual"
          value={formData.message}
          onChangeText={(text) => setFormData({ ...formData, message: text })}
          multiline
          numberOfLines={4}
        />

        <DateInput
          label="Fecha y Hora del Recordatorio"
          value={formData.scheduledDate}
          onChange={(date) => setFormData({ ...formData, scheduledDate: date })}
          mode="datetime"
        />

        <Select
          label="Prioridad"
          value={formData.priority}
          onValueChange={(value) => setFormData({ ...formData, priority: value })}
          items={priorityOptions}
        />

        <Button
          title={loading ? 'Creando...' : 'Crear Recordatorio'}
          onPress={handleSubmit}
          disabled={loading}
          style={styles.submitButton}
        />
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: LAYOUT.screenPadding,
  },
  description: {
    fontSize: FONTS.sizes.md,
    color: COLORS.textSecondary,
    marginBottom: SPACING.lg,
    lineHeight: 20,
  },
  submitButton: {
    marginTop: SPACING.md,
  },
});

export default CreateReminderScreen;

/**
 * PetCare Mobile - Pantalla de Agregar Mascota
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import * as petService from '../services/petService';
import Input from '../components/Input';
import DateInput from '../components/DateInput';
import Select from '../components/Select';
import Button from '../components/Button';
import { showToast } from '../components/Toast';
import { COLORS, LAYOUT, SPACING, FONTS } from '../constants/theme';

const AddPetScreen = () => {
  const navigation = useNavigation();
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    species: 'perro',
    breed: '',
    gender: 'male',
    dateOfBirth: null,
    color: '',
    weightKg: '',
  });

  const speciesOptions = [
    { label: 'Perro', value: 'perro' },
    { label: 'Gato', value: 'gato' },
    { label: 'Ratón', value: 'raton' },
    { label: 'Conejo', value: 'conejo' },
    { label: 'Serpiente', value: 'serpiente' },
    { label: 'Vaca', value: 'vaca' },
    { label: 'Burro', value: 'burro' },
    { label: 'Caballo', value: 'caballo' },
    { label: 'Asno', value: 'asno' },
    { label: 'Gallina', value: 'gallina' },
    { label: 'Cerdo', value: 'cerdo' },
    { label: 'Loro', value: 'loro' },
    { label: 'Tortuga', value: 'tortuga' },
    { label: 'Iguana', value: 'iguana' },
    { label: 'Araña', value: 'araña' },
  ];

  const genderOptions = [
    { label: 'Macho', value: 'male' },
    { label: 'Hembra', value: 'female' },
    { label: 'Desconocido', value: 'unknown' },
  ];

  const handleSubmit = async () => {
    // Limpiar errores previos
    setServerError('');

    if (!formData.name || !formData.species) {
      setServerError('Por favor completa los campos obligatorios');
      return;
    }

    // Formatear fecha para el backend (YYYY-MM-DD)
    let date_of_birth = null;
    if (formData.dateOfBirth) {
      const year = formData.dateOfBirth.getFullYear();
      const month = (formData.dateOfBirth.getMonth() + 1).toString().padStart(2, '0');
      const day = formData.dateOfBirth.getDate().toString().padStart(2, '0');
      date_of_birth = `${year}-${month}-${day}`;
    }

    setLoading(true);
    const result = await petService.createPet({
      name: formData.name,
      species: formData.species,
      breed: formData.breed || undefined,
      gender: formData.gender,
      date_of_birth,
      color: formData.color || undefined,
      weight_kg: parseFloat(formData.weightKg) || undefined,
    });
    setLoading(false);

    if (result.success) {
      const createdPet = result.data;

      // Mostrar toast de éxito
      showToast(`${formData.name} ha sido agregado correctamente`, 'success');

      // Redirigir al perfil de la mascota creada
      navigation.navigate('PetDetail', { petId: createdPet.id });
    } else {
      // Construir mensaje de error con los detalles de validación
      let errorMessage = result.message || 'No se pudo agregar la mascota';

      if (result.details && Array.isArray(result.details)) {
        const validationErrors = result.details
          .map(detail => `• ${detail.field}: ${detail.message}`)
          .join('\n');
        errorMessage += '\n\n' + validationErrors;
      }

      setServerError(errorMessage);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.content}>
        <Input
          label="Nombre *"
          value={formData.name}
          onChangeText={(text) => {
            setFormData({ ...formData, name: text });
            if (serverError) setServerError('');
          }}
          placeholder="Nombre de la mascota"
        />

        <Select
          label="Tipo *"
          value={formData.species}
          onValueChange={(value) => {
            setFormData({ ...formData, species: value });
            if (serverError) setServerError('');
          }}
          items={speciesOptions}
        />

        <Select
          label="Género *"
          value={formData.gender}
          onValueChange={(value) => {
            setFormData({ ...formData, gender: value });
            if (serverError) setServerError('');
          }}
          items={genderOptions}
        />

        <Input
          label="Raza"
          value={formData.breed}
          onChangeText={(text) => {
            setFormData({ ...formData, breed: text });
            if (serverError) setServerError('');
          }}
          placeholder="Ej: Labrador"
        />

        <Input
          label="Color"
          value={formData.color}
          onChangeText={(text) => {
            setFormData({ ...formData, color: text });
            if (serverError) setServerError('');
          }}
          placeholder="Ej: Dorado"
        />

        <Input
          label="Peso (kg)"
          value={formData.weightKg}
          onChangeText={(text) => {
            setFormData({ ...formData, weightKg: text });
            if (serverError) setServerError('');
          }}
          placeholder="Ej: 25.5"
          keyboardType="decimal-pad"
        />

        <DateInput
          label="Fecha de Nacimiento"
          value={formData.dateOfBirth}
          onChange={(date) => {
            setFormData({ ...formData, dateOfBirth: date });
            if (serverError) setServerError('');
          }}
          mode="date"
          maximumDate={new Date()}
          placeholder="Seleccionar fecha"
        />

        {serverError ? (
          <View style={styles.serverErrorContainer}>
            <Ionicons name="alert-circle" size={20} color={COLORS.error} />
            <Text style={styles.serverErrorText}>{serverError}</Text>
          </View>
        ) : null}

        <Button
          title="Guardar Mascota"
          onPress={handleSubmit}
          loading={loading}
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
  serverErrorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.error + '15',
    padding: SPACING.md,
    borderRadius: 8,
    marginTop: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.error + '30',
  },
  serverErrorText: {
    color: COLORS.error,
    fontSize: FONTS.sizes.sm,
    marginLeft: SPACING.sm,
    flex: 1,
  },
  submitButton: {
    marginTop: 20,
  },
});

export default AddPetScreen;

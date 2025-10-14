/**
 * PetCare Mobile - Pantalla de Editar Mascota
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
  Image,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRoute, useNavigation } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';
import * as petService from '../services/petService';
import Input from '../components/Input';
import DateInput from '../components/DateInput';
import Select from '../components/Select';
import Button from '../components/Button';
import { COLORS, LAYOUT, SPACING, FONTS, BORDER_RADIUS } from '../constants/theme';

const EditPetScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { petId, pet: initialPet } = route.params;
  const [loading, setLoading] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [serverError, setServerError] = useState('');
  const [profileImage, setProfileImage] = useState(initialPet?.profile_image_url || null);
  const [selectedImageUri, setSelectedImageUri] = useState(null);
  const [formData, setFormData] = useState({
    name: initialPet?.name || '',
    species: initialPet?.species || 'perro',
    breed: initialPet?.breed || '',
    color: initialPet?.color || '',
    dateOfBirth: initialPet?.date_of_birth ? new Date(initialPet.date_of_birth) : null,
    weightKg: initialPet?.weight_kg?.toString() || '',
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

  const pickImage = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (status !== 'granted') {
        Alert.alert('Permiso denegado', 'Necesitamos permiso para acceder a tus fotos');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        setSelectedImageUri(result.assets[0].uri);
        setProfileImage(result.assets[0].uri);
      }
    } catch (error) {
      console.error('Error picking image:', error);
      Alert.alert('Error', 'No se pudo seleccionar la imagen');
    }
  };

  const uploadImage = async () => {
    if (!selectedImageUri) return true;

    try {
      setUploadingImage(true);
      console.log('Subiendo imagen:', selectedImageUri);
      const result = await petService.uploadPetImage(petId, selectedImageUri);
      console.log('Resultado de subida:', result);
      setUploadingImage(false);

      if (result.success) {
        setSelectedImageUri(null);
        return true;
      } else {
        const errorMsg = result.error || result.message || 'No se pudo subir la imagen';
        Alert.alert('Error al subir imagen', errorMsg);
        return false;
      }
    } catch (error) {
      console.error('Error en uploadImage:', error);
      setUploadingImage(false);
      Alert.alert('Error', 'Ocurrió un error al subir la imagen');
      return false;
    }
  };

  const handleSubmit = async () => {
    try {
      console.log('=== Iniciando handleSubmit ===');
      // Limpiar errores previos
      setServerError('');

      if (!formData.name) {
        setServerError('El nombre es obligatorio');
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

      console.log('Datos del formulario:', { name: formData.name, breed: formData.breed, color: formData.color, date_of_birth, weight_kg: formData.weightKg });

      setLoading(true);

      // Primero subir la imagen si hay una nueva
      if (selectedImageUri) {
        console.log('Hay imagen seleccionada, subiendo...');
        const imageUploaded = await uploadImage();
        if (!imageUploaded) {
          console.log('La imagen no se pudo subir, abortando');
          setLoading(false);
          return;
        }
        console.log('Imagen subida exitosamente');
      } else {
        console.log('No hay imagen para subir');
      }

      // Luego actualizar los datos de la mascota
      console.log('Actualizando datos de la mascota...');
      const result = await petService.updatePet(petId, {
        name: formData.name,
        species: formData.species,
        breed: formData.breed || undefined,
        color: formData.color || undefined,
        date_of_birth,
        weight_kg: parseFloat(formData.weightKg) || undefined,
      });
      console.log('Resultado de actualización:', result);
      setLoading(false);

      if (result.success) {
        console.log('Actualización exitosa');
        Alert.alert('Éxito', 'Mascota actualizada correctamente', [
          { text: 'OK', onPress: () => navigation.goBack() },
        ]);
      } else {
        console.log('Error en actualización:', result);
        // Construir mensaje de error con los detalles de validación
        let errorMessage = result.message || 'No se pudo actualizar la mascota';

        if (result.details && Array.isArray(result.details)) {
          const validationErrors = result.details
            .map(detail => `• ${detail.field}: ${detail.message}`)
            .join('\n');
          errorMessage += '\n\n' + validationErrors;
        }

        setServerError(errorMessage);
      }
    } catch (error) {
      console.error('Error en handleSubmit:', error);
      setLoading(false);
      Alert.alert('Error', 'Ocurrió un error al guardar los cambios');
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.content}>
        {/* Selector de imagen de perfil */}
        <View style={styles.imageSection}>
          <Text style={styles.sectionTitle}>Foto de perfil</Text>
          <TouchableOpacity
            style={styles.imagePickerContainer}
            onPress={pickImage}
            disabled={uploadingImage}
          >
            {profileImage ? (
              <Image source={{ uri: profileImage }} style={styles.profileImage} />
            ) : (
              <View style={styles.placeholderImage}>
                <Ionicons name="camera" size={48} color={COLORS.textDisabled} />
              </View>
            )}
            <View style={styles.imageOverlay}>
              <Ionicons name="camera" size={24} color={COLORS.textWhite} />
              <Text style={styles.imageOverlayText}>Cambiar foto</Text>
            </View>
          </TouchableOpacity>
        </View>

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
          title="Guardar Cambios"
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
  imageSection: {
    marginBottom: SPACING.xl,
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: FONTS.sizes.md,
    fontWeight: FONTS.weights.semibold,
    color: COLORS.textPrimary,
    marginBottom: SPACING.md,
    alignSelf: 'flex-start',
  },
  imagePickerContainer: {
    width: 150,
    height: 150,
    borderRadius: 75,
    overflow: 'hidden',
    position: 'relative',
  },
  profileImage: {
    width: '100%',
    height: '100%',
    borderRadius: 75,
  },
  placeholderImage: {
    width: '100%',
    height: '100%',
    backgroundColor: COLORS.surface,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: COLORS.divider,
    borderStyle: 'dashed',
  },
  imageOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0,0,0,0.6)',
    padding: SPACING.sm,
    alignItems: 'center',
  },
  imageOverlayText: {
    color: COLORS.textWhite,
    fontSize: FONTS.sizes.xs,
    marginTop: 4,
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

export default EditPetScreen;

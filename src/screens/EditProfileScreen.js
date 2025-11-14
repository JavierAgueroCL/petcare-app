/**
 * PetCare Mobile - Pantalla de Editar Perfil
 */

import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../contexts/AuthContext';
import Input from '../components/Input';
import Button from '../components/Button';
import { COLORS, LAYOUT } from '../constants/theme';

const EditProfileScreen = () => {
  const navigation = useNavigation();
  const { user, updateUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    phone: user?.phone || '',
    street: user?.street || '',
    streetNumber: user?.streetNumber || '',
    apartment: user?.apartment || '',
    city: user?.city || '',
    commune: user?.commune || '',
    region: user?.region || '',
    postalCode: user?.postalCode || '',
  });

  const handleSubmit = async () => {
    if (!formData.firstName || !formData.lastName) {
      Alert.alert('Error', 'El nombre y apellido son obligatorios');
      return;
    }

    setLoading(true);
    const result = await updateUser(formData);
    setLoading(false);

    if (result.success) {
      Alert.alert('Éxito', 'Perfil actualizado correctamente', [
        { text: 'OK', onPress: () => navigation.goBack() },
      ]);
    } else {
      // Construir mensaje de error con los detalles de validación
      let errorMessage = result.message || result.error || 'No se pudo actualizar el perfil';

      if (result.details && Array.isArray(result.details)) {
        const validationErrors = result.details
          .map(detail => `• ${detail.field}: ${detail.message}`)
          .join('\n');
        errorMessage += '\n\n' + validationErrors;
      }

      Alert.alert('Error', errorMessage);
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
          value={formData.firstName}
          onChangeText={(text) => setFormData({ ...formData, firstName: text })}
          placeholder="Tu nombre"
        />

        <Input
          label="Apellido *"
          value={formData.lastName}
          onChangeText={(text) => setFormData({ ...formData, lastName: text })}
          placeholder="Tu apellido"
        />

        <Input
          label="Teléfono"
          value={formData.phone}
          onChangeText={(text) => setFormData({ ...formData, phone: text })}
          placeholder="+56912345678"
          keyboardType="phone-pad"
        />

        <Input
          label="Calle"
          value={formData.street}
          onChangeText={(text) => setFormData({ ...formData, street: text })}
          placeholder="Nombre de la calle"
        />

        <Input
          label="Número"
          value={formData.streetNumber}
          onChangeText={(text) => setFormData({ ...formData, streetNumber: text })}
          placeholder="Número de calle"
          keyboardType="numeric"
        />

        <Input
          label="Departamento/Piso (opcional)"
          value={formData.apartment}
          onChangeText={(text) => setFormData({ ...formData, apartment: text })}
          placeholder="Depto, piso, etc."
        />

        <Input
          label="Ciudad"
          value={formData.city}
          onChangeText={(text) => setFormData({ ...formData, city: text })}
          placeholder="Tu ciudad"
        />

        <Input
          label="Comuna"
          value={formData.commune}
          onChangeText={(text) => setFormData({ ...formData, commune: text })}
          placeholder="Tu comuna"
        />

        <Input
          label="Región"
          value={formData.region}
          onChangeText={(text) => setFormData({ ...formData, region: text })}
          placeholder="Tu región"
        />

        <Input
          label="Código Postal (opcional)"
          value={formData.postalCode}
          onChangeText={(text) => setFormData({ ...formData, postalCode: text })}
          placeholder="Código postal"
          keyboardType="numeric"
        />

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
  submitButton: {
    marginTop: 20,
  },
});

export default EditProfileScreen;

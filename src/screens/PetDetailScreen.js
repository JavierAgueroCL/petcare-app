/**
 * PetCare Mobile - Pantalla de Detalle de Mascota
 */

import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Alert,
  Platform,
  ActivityIndicator,
  Linking,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRoute, useNavigation } from '@react-navigation/native';
import * as petService from '../services/petService';
import * as qrService from '../services/qrService';
import Button from '../components/Button';
import { COLORS, SPACING, FONTS, BORDER_RADIUS, SHADOWS, LAYOUT } from '../constants/theme';

const PetDetailScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { petId } = route.params;
  const [pet, setPet] = useState(null);
  const [loading, setLoading] = useState(true);
  const [qrImageUrl, setQrImageUrl] = useState(null);
  const [loadingQr, setLoadingQr] = useState(false);

  useEffect(() => {
    loadPet();
  }, [petId]);

  const loadPet = async () => {
    const result = await petService.getPetById(petId);
    setLoading(false);

    if (result.success) {
      setPet(result.data);
      loadQrCode();
    } else {
      Alert.alert('Error', 'No se pudo cargar la mascota');
      navigation.goBack();
    }
  };

  const loadQrCode = async () => {
    setLoadingQr(true);
    const result = await qrService.generatePetQR(petId);
    setLoadingQr(false);

    if (result.success && result.data && result.data.qr_url) {
      setQrImageUrl(result.data.qr_url);
    }
  };

  const handleDownloadQr = async () => {
    const result = await qrService.downloadPetQR(petId);

    if (result.success && result.data && result.data.download_url) {
      if (Platform.OS === 'web') {
        window.open(result.data.download_url, '_blank');
      } else {
        Linking.openURL(result.data.download_url);
      }
    } else {
      if (Platform.OS === 'web') {
        window.alert('No se pudo descargar el código QR');
      } else {
        Alert.alert('Error', 'No se pudo descargar el código QR');
      }
    }
  };

  const handleEdit = () => {
    navigation.navigate('EditPet', { petId, pet });
  };

  const handleDelete = () => {
    console.log('=== handleDelete llamado ===');

    // Función para mostrar confirmación según la plataforma
    const showConfirmation = () => {
      return new Promise((resolve) => {
        if (Platform.OS === 'web') {
          // En web, usar window.confirm
          const confirmed = window.confirm('¿Estás seguro de que quieres eliminar esta mascota?');
          resolve(confirmed);
        } else {
          // En móvil, usar Alert.alert nativo
          Alert.alert(
            'Eliminar Mascota',
            '¿Estás seguro de que quieres eliminar esta mascota?',
            [
              { text: 'Cancelar', style: 'cancel', onPress: () => resolve(false) },
              { text: 'Eliminar', style: 'destructive', onPress: () => resolve(true) },
            ]
          );
        }
      });
    };

    // Función para mostrar alerta según la plataforma
    const showAlert = (title, message, onOk) => {
      if (Platform.OS === 'web') {
        window.alert(message);
        if (onOk) onOk();
      } else {
        Alert.alert(title, message, [{ text: 'OK', onPress: onOk }]);
      }
    };

    // Ejecutar la eliminación
    showConfirmation().then(async (confirmed) => {
      if (!confirmed) {
        console.log('Eliminación cancelada por el usuario');
        return;
      }

      try {
        console.log('Eliminando mascota con ID:', petId);
        const result = await petService.deletePet(petId);
        console.log('Resultado de eliminación:', result);

        if (result.success) {
          console.log('Mascota eliminada exitosamente, navegando hacia atrás');
          showAlert('Éxito', 'Mascota eliminada correctamente', () => navigation.goBack());
        } else {
          console.log('Error al eliminar:', result);
          const errorMsg = result.message || result.error || 'No se pudo eliminar la mascota';
          showAlert('Error', errorMsg);
        }
      } catch (error) {
        console.error('Error en handleDelete:', error);
        showAlert('Error', 'Ocurrió un error al eliminar la mascota');
      }
    });
  };

  if (loading || !pet) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Cargando...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.imageContainer}>
        {pet.profile_image_url ? (
          <Image source={{ uri: pet.profile_image_url }} style={styles.image} />
        ) : (
          <View style={styles.placeholderImage}>
            <Ionicons name="paw" size={64} color={COLORS.textDisabled} />
          </View>
        )}
      </View>

      <View style={styles.content}>
        <Text style={styles.name}>{pet.name}</Text>
        <Text style={styles.breed}>{pet.breed || pet.species}</Text>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Información General</Text>
          <InfoRow icon="calendar" label="Edad" value={pet.age ? `${pet.age.years} años` : 'N/A'} />
          <InfoRow icon="male" label="Género" value={pet.gender === 'male' ? 'Macho' : 'Hembra'} />
          <InfoRow icon="scale" label="Peso" value={`${pet.weight_kg} kg`} />
          <InfoRow icon="color-palette" label="Color" value={pet.color} />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Código QR</Text>
          <View style={styles.qrContainer}>
            {loadingQr ? (
              <ActivityIndicator size="large" color={COLORS.primary} />
            ) : qrImageUrl ? (
              <>
                <Image source={{ uri: qrImageUrl }} style={styles.qrImage} />
                <Text style={styles.qrDescription}>
                  Escanea este código para ver la información pública de {pet.name}
                </Text>
                <TouchableOpacity style={styles.downloadQrButton} onPress={handleDownloadQr}>
                  <Ionicons name="download-outline" size={20} color={COLORS.surface} />
                  <Text style={styles.downloadQrButtonText}>Descargar QR</Text>
                </TouchableOpacity>
              </>
            ) : (
              <Text style={styles.qrError}>No se pudo cargar el código QR</Text>
            )}
          </View>
        </View>

        <TouchableOpacity
          style={styles.reminderButton}
          onPress={() => navigation.navigate('CreateReminder', { petId })}
        >
          <Ionicons name="alarm-outline" size={20} color={COLORS.primary} />
          <Text style={styles.reminderButtonText}>Crear Recordatorio</Text>
        </TouchableOpacity>

        <View style={styles.actions}>
          <Button title="Editar" onPress={handleEdit} style={styles.actionButton} />
          <TouchableOpacity
            style={[styles.actionButton, styles.deleteButton]}
            onPress={() => {
              console.log('TouchableOpacity presionado directamente');
              handleDelete();
            }}
          >
            <Text style={styles.deleteButtonText}>Eliminar</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

const InfoRow = ({ icon, label, value }) => (
  <View style={styles.infoRow}>
    <Ionicons name={icon} size={20} color={COLORS.textSecondary} />
    <Text style={styles.infoLabel}>{label}:</Text>
    <Text style={styles.infoValue}>{value}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageContainer: {
    height: 300,
    backgroundColor: COLORS.surface,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  placeholderImage: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.background,
  },
  content: {
    padding: LAYOUT.screenPadding,
  },
  name: {
    fontSize: FONTS.sizes.xxxl,
    fontWeight: FONTS.weights.bold,
    color: COLORS.textPrimary,
  },
  breed: {
    fontSize: FONTS.sizes.lg,
    color: COLORS.textSecondary,
    marginTop: SPACING.xs,
  },
  section: {
    marginTop: SPACING.xl,
  },
  sectionTitle: {
    fontSize: FONTS.sizes.lg,
    fontWeight: FONTS.weights.bold,
    color: COLORS.textPrimary,
    marginBottom: SPACING.md,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.divider,
  },
  infoLabel: {
    fontSize: FONTS.sizes.md,
    color: COLORS.textSecondary,
    marginLeft: SPACING.sm,
    flex: 1,
  },
  infoValue: {
    fontSize: FONTS.sizes.md,
    color: COLORS.textPrimary,
    fontWeight: FONTS.weights.medium,
  },
  qrContainer: {
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.lg,
    alignItems: 'center',
    ...SHADOWS.medium,
  },
  qrImage: {
    width: 200,
    height: 200,
    marginBottom: SPACING.md,
  },
  qrDescription: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginBottom: SPACING.md,
  },
  downloadQrButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.primary,
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    borderRadius: BORDER_RADIUS.md,
  },
  downloadQrButtonText: {
    fontSize: FONTS.sizes.md,
    fontWeight: FONTS.weights.semibold,
    color: COLORS.surface,
    marginLeft: SPACING.sm,
  },
  qrError: {
    fontSize: FONTS.sizes.md,
    color: COLORS.error,
    textAlign: 'center',
  },
  reminderButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.primary + '15',
    borderWidth: 1,
    borderColor: COLORS.primary,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
    marginTop: SPACING.md,
  },
  reminderButtonText: {
    fontSize: FONTS.sizes.md,
    fontWeight: FONTS.weights.semibold,
    color: COLORS.primary,
    marginLeft: SPACING.xs,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: SPACING.xl,
  },
  actionButton: {
    flex: 1,
    marginHorizontal: SPACING.xs,
  },
  deleteButton: {
    backgroundColor: COLORS.error,
    padding: SPACING.md,
    borderRadius: BORDER_RADIUS.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  deleteButtonText: {
    color: COLORS.textWhite,
    fontSize: FONTS.sizes.md,
    fontWeight: FONTS.weights.semibold,
  },
});

export default PetDetailScreen;

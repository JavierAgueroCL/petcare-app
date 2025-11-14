/**
 * PetCare Mobile - Detalle de Registro Médico con Fotos
 */

import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  TextInput,
  Modal,
  FlatList,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useFocusEffect } from '@react-navigation/native';
import * as attachmentService from '../services/medicalRecordAttachmentService';
import { COLORS, SPACING, FONTS, BORDER_RADIUS, SHADOWS, LAYOUT } from '../constants/theme';

const MedicalRecordDetailScreen = ({ route, navigation }) => {
  const { record, petName } = route.params;
  const [attachments, setAttachments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedAttachment, setSelectedAttachment] = useState(null);
  const [photoForm, setPhotoForm] = useState({
    title: '',
    description: '',
    date: new Date().toISOString().split('T')[0],
    photo: null,
  });

  useFocusEffect(
    useCallback(() => {
      loadAttachments();
    }, [])
  );

  const loadAttachments = async () => {
    setLoading(true);
    const result = await attachmentService.getAttachments(record.id);
    setLoading(false);

    if (result.success) {
      setAttachments(result.data || []);
    } else {
      Alert.alert('Error', 'No se pudieron cargar las fotos');
    }
  };

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permiso Necesario', 'Se necesita permiso para acceder a las fotos');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      setPhotoForm({ ...photoForm, photo: result.assets[0] });
    }
  };

  const handleAddPhoto = async () => {
    if (!photoForm.title || !photoForm.photo) {
      Alert.alert('Campos Requeridos', 'Debes proporcionar un título y una foto');
      return;
    }

    setUploading(true);

    const formData = new FormData();
    formData.append('title', photoForm.title);
    if (photoForm.description) {
      formData.append('description', photoForm.description);
    }
    formData.append('date', photoForm.date);

    formData.append('photo', {
      uri: photoForm.photo.uri,
      type: 'image/jpeg',
      name: 'photo.jpg',
    });

    const result = await attachmentService.addAttachment(record.id, formData);
    setUploading(false);

    if (result.success) {
      if (Platform.OS === 'web') {
        window.alert('Foto agregada correctamente');
      } else {
        Alert.alert('Éxito', 'Foto agregada correctamente');
      }
      setShowAddModal(false);
      setPhotoForm({
        title: '',
        description: '',
        date: new Date().toISOString().split('T')[0],
        photo: null,
      });
      loadAttachments();
    } else {
      Alert.alert('Error', result.error || 'No se pudo agregar la foto');
    }
  };

  const handleEditPhoto = async () => {
    if (!selectedAttachment || !photoForm.title) {
      Alert.alert('Campos Requeridos', 'Debes proporcionar un título');
      return;
    }

    const result = await attachmentService.updateAttachment(selectedAttachment.id, {
      title: photoForm.title,
      description: photoForm.description,
      date: photoForm.date,
    });

    if (result.success) {
      if (Platform.OS === 'web') {
        window.alert('Foto actualizada correctamente');
      } else {
        Alert.alert('Éxito', 'Foto actualizada correctamente');
      }
      setShowEditModal(false);
      setSelectedAttachment(null);
      loadAttachments();
    } else {
      Alert.alert('Error', result.error || 'No se pudo actualizar la foto');
    }
  };

  const handleDeletePhoto = async (attachmentId) => {
    const confirmDelete = () => {
      Alert.alert(
        'Confirmar Eliminación',
        '¿Estás seguro de que deseas eliminar esta foto?',
        [
          { text: 'Cancelar', style: 'cancel' },
          {
            text: 'Eliminar',
            style: 'destructive',
            onPress: async () => {
              const result = await attachmentService.deleteAttachment(attachmentId);
              if (result.success) {
                if (Platform.OS === 'web') {
                  window.alert('Foto eliminada correctamente');
                } else {
                  Alert.alert('Éxito', 'Foto eliminada correctamente');
                }
                loadAttachments();
              } else {
                Alert.alert('Error', result.error || 'No se pudo eliminar la foto');
              }
            },
          },
        ]
      );
    };

    if (Platform.OS === 'web') {
      if (window.confirm('¿Estás seguro de que deseas eliminar esta foto?')) {
        const result = await attachmentService.deleteAttachment(attachmentId);
        if (result.success) {
          window.alert('Foto eliminada correctamente');
          loadAttachments();
        } else {
          window.alert(result.error || 'No se pudo eliminar la foto');
        }
      }
    } else {
      confirmDelete();
    }
  };

  const openEditModal = (attachment) => {
    setSelectedAttachment(attachment);
    setPhotoForm({
      title: attachment.title,
      description: attachment.description || '',
      date: attachment.date,
      photo: null,
    });
    setShowEditModal(true);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-CL', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    });
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

  const PhotoCard = ({ attachment }) => (
    <View style={styles.photoCard}>
      <Image source={{ uri: attachment.file_url }} style={styles.photoImage} resizeMode="cover" />
      <View style={styles.photoContent}>
        <Text style={styles.photoTitle}>{attachment.title}</Text>
        {attachment.description && (
          <Text style={styles.photoDescription} numberOfLines={2}>
            {attachment.description}
          </Text>
        )}
        <Text style={styles.photoDate}>{formatDate(attachment.date)}</Text>
      </View>
      <View style={styles.photoActions}>
        <TouchableOpacity
          style={styles.photoActionButton}
          onPress={() => openEditModal(attachment)}
        >
          <Ionicons name="create-outline" size={20} color={COLORS.primary} />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.photoActionButton}
          onPress={() => handleDeletePhoto(attachment.id)}
        >
          <Ionicons name="trash-outline" size={20} color={COLORS.error} />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView}>
        {/* Información del Registro Médico */}
        <View style={styles.recordSection}>
          <View style={styles.recordHeader}>
            <Text style={styles.recordTitle}>{getRecordTypeLabel(record.record_type)}</Text>
            <Text style={styles.recordDate}>{formatDate(record.date)}</Text>
          </View>

          {record.diagnosis && (
            <View style={styles.infoSection}>
              <Text style={styles.infoLabel}>Diagnóstico:</Text>
              <Text style={styles.infoText}>{record.diagnosis}</Text>
            </View>
          )}

          {record.treatment && (
            <View style={styles.infoSection}>
              <Text style={styles.infoLabel}>Tratamiento:</Text>
              <Text style={styles.infoText}>{record.treatment}</Text>
            </View>
          )}

          {record.prescriptions && (
            <View style={styles.infoSection}>
              <Text style={styles.infoLabel}>Prescripciones:</Text>
              <Text style={styles.infoText}>{record.prescriptions}</Text>
            </View>
          )}

          {record.notes && (
            <View style={styles.infoSection}>
              <Text style={styles.infoLabel}>Notas:</Text>
              <Text style={styles.infoText}>{record.notes}</Text>
            </View>
          )}
        </View>

        {/* Sección de Fotos */}
        <View style={styles.photosSection}>
          <View style={styles.photosSectionHeader}>
            <Text style={styles.sectionTitle}>Fotos del Registro</Text>
            <TouchableOpacity
              style={styles.addButton}
              onPress={() => setShowAddModal(true)}
            >
              <Ionicons name="add-circle" size={24} color={COLORS.primary} />
              <Text style={styles.addButtonText}>Agregar Foto</Text>
            </TouchableOpacity>
          </View>

          {loading ? (
            <ActivityIndicator size="large" color={COLORS.primary} style={styles.loader} />
          ) : attachments.length === 0 ? (
            <View style={styles.emptyState}>
              <Ionicons name="images-outline" size={64} color={COLORS.textDisabled} />
              <Text style={styles.emptyStateTitle}>Sin fotos</Text>
              <Text style={styles.emptyStateText}>
                Agrega fotos para documentar este registro médico
              </Text>
            </View>
          ) : (
            <FlatList
              data={attachments}
              keyExtractor={(item) => item.id.toString()}
              renderItem={({ item }) => <PhotoCard attachment={item} />}
              scrollEnabled={false}
            />
          )}
        </View>
      </ScrollView>

      {/* Modal para Agregar Foto */}
      <Modal
        visible={showAddModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowAddModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Agregar Foto</Text>
              <TouchableOpacity onPress={() => setShowAddModal(false)}>
                <Ionicons name="close" size={24} color={COLORS.textPrimary} />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalBody}>
              <TouchableOpacity style={styles.imagePickerButton} onPress={pickImage}>
                {photoForm.photo ? (
                  <Image source={{ uri: photoForm.photo.uri }} style={styles.selectedImage} />
                ) : (
                  <View style={styles.imagePickerPlaceholder}>
                    <Ionicons name="camera" size={48} color={COLORS.textDisabled} />
                    <Text style={styles.imagePickerText}>Seleccionar Foto</Text>
                  </View>
                )}
              </TouchableOpacity>

              <View style={styles.formGroup}>
                <Text style={styles.label}>Título *</Text>
                <TextInput
                  style={styles.input}
                  value={photoForm.title}
                  onChangeText={(text) => setPhotoForm({ ...photoForm, title: text })}
                  placeholder="Ej: Radiografía de tórax"
                  placeholderTextColor={COLORS.textDisabled}
                />
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.label}>Descripción</Text>
                <TextInput
                  style={[styles.input, styles.textArea]}
                  value={photoForm.description}
                  onChangeText={(text) => setPhotoForm({ ...photoForm, description: text })}
                  placeholder="Descripción opcional"
                  placeholderTextColor={COLORS.textDisabled}
                  multiline
                  numberOfLines={3}
                />
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.label}>Fecha</Text>
                <TextInput
                  style={styles.input}
                  value={photoForm.date}
                  onChangeText={(text) => setPhotoForm({ ...photoForm, date: text })}
                  placeholder="YYYY-MM-DD"
                  placeholderTextColor={COLORS.textDisabled}
                />
              </View>
            </ScrollView>

            <View style={styles.modalFooter}>
              <TouchableOpacity
                style={[styles.button, styles.buttonSecondary]}
                onPress={() => setShowAddModal(false)}
              >
                <Text style={styles.buttonSecondaryText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.button, styles.buttonPrimary, uploading && styles.buttonDisabled]}
                onPress={handleAddPhoto}
                disabled={uploading}
              >
                {uploading ? (
                  <ActivityIndicator color={COLORS.surface} />
                ) : (
                  <Text style={styles.buttonPrimaryText}>Agregar</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Modal para Editar Foto */}
      <Modal
        visible={showEditModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowEditModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Editar Información</Text>
              <TouchableOpacity onPress={() => setShowEditModal(false)}>
                <Ionicons name="close" size={24} color={COLORS.textPrimary} />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalBody}>
              <View style={styles.formGroup}>
                <Text style={styles.label}>Título *</Text>
                <TextInput
                  style={styles.input}
                  value={photoForm.title}
                  onChangeText={(text) => setPhotoForm({ ...photoForm, title: text })}
                  placeholder="Título de la foto"
                  placeholderTextColor={COLORS.textDisabled}
                />
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.label}>Descripción</Text>
                <TextInput
                  style={[styles.input, styles.textArea]}
                  value={photoForm.description}
                  onChangeText={(text) => setPhotoForm({ ...photoForm, description: text })}
                  placeholder="Descripción opcional"
                  placeholderTextColor={COLORS.textDisabled}
                  multiline
                  numberOfLines={3}
                />
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.label}>Fecha</Text>
                <TextInput
                  style={styles.input}
                  value={photoForm.date}
                  onChangeText={(text) => setPhotoForm({ ...photoForm, date: text })}
                  placeholder="YYYY-MM-DD"
                  placeholderTextColor={COLORS.textDisabled}
                />
              </View>
            </ScrollView>

            <View style={styles.modalFooter}>
              <TouchableOpacity
                style={[styles.button, styles.buttonSecondary]}
                onPress={() => setShowEditModal(false)}
              >
                <Text style={styles.buttonSecondaryText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.button, styles.buttonPrimary]}
                onPress={handleEditPhoto}
              >
                <Text style={styles.buttonPrimaryText}>Guardar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
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
  recordSection: {
    backgroundColor: COLORS.surface,
    padding: SPACING.md,
    marginBottom: SPACING.md,
    ...SHADOWS.medium,
  },
  recordHeader: {
    marginBottom: SPACING.md,
    paddingBottom: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.divider,
  },
  recordTitle: {
    fontSize: FONTS.sizes.xl,
    fontWeight: FONTS.weights.bold,
    color: COLORS.textPrimary,
    marginBottom: SPACING.xs,
  },
  recordDate: {
    fontSize: FONTS.sizes.md,
    color: COLORS.textSecondary,
  },
  infoSection: {
    marginBottom: SPACING.md,
  },
  infoLabel: {
    fontSize: FONTS.sizes.sm,
    fontWeight: FONTS.weights.semibold,
    color: COLORS.textSecondary,
    marginBottom: SPACING.xs,
  },
  infoText: {
    fontSize: FONTS.sizes.md,
    color: COLORS.textPrimary,
    lineHeight: 20,
  },
  photosSection: {
    padding: SPACING.md,
  },
  photosSectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  sectionTitle: {
    fontSize: FONTS.sizes.lg,
    fontWeight: FONTS.weights.bold,
    color: COLORS.textPrimary,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  addButtonText: {
    fontSize: FONTS.sizes.md,
    fontWeight: FONTS.weights.semibold,
    color: COLORS.primary,
    marginLeft: SPACING.xs,
  },
  loader: {
    marginTop: SPACING.xl,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: SPACING.xl,
    marginTop: SPACING.xl,
  },
  emptyStateTitle: {
    fontSize: FONTS.sizes.lg,
    fontWeight: FONTS.weights.bold,
    color: COLORS.textPrimary,
    marginTop: SPACING.md,
  },
  emptyStateText: {
    fontSize: FONTS.sizes.md,
    color: COLORS.textSecondary,
    marginTop: SPACING.sm,
    textAlign: 'center',
  },
  photoCard: {
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.md,
    marginBottom: SPACING.md,
    overflow: 'hidden',
    ...SHADOWS.medium,
  },
  photoImage: {
    width: '100%',
    height: 200,
    backgroundColor: COLORS.background,
  },
  photoContent: {
    padding: SPACING.md,
  },
  photoTitle: {
    fontSize: FONTS.sizes.lg,
    fontWeight: FONTS.weights.bold,
    color: COLORS.textPrimary,
    marginBottom: SPACING.xs,
  },
  photoDescription: {
    fontSize: FONTS.sizes.md,
    color: COLORS.textSecondary,
    marginBottom: SPACING.xs,
  },
  photoDate: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.textSecondary,
  },
  photoActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    padding: SPACING.md,
    paddingTop: 0,
  },
  photoActionButton: {
    padding: SPACING.sm,
    marginLeft: SPACING.sm,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.lg,
    width: '90%',
    maxHeight: '80%',
    ...SHADOWS.large,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.divider,
  },
  modalTitle: {
    fontSize: FONTS.sizes.lg,
    fontWeight: FONTS.weights.bold,
    color: COLORS.textPrimary,
  },
  modalBody: {
    padding: SPACING.md,
  },
  modalFooter: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    padding: SPACING.md,
    borderTopWidth: 1,
    borderTopColor: COLORS.divider,
  },
  imagePickerButton: {
    marginBottom: SPACING.md,
  },
  selectedImage: {
    width: '100%',
    height: 200,
    borderRadius: BORDER_RADIUS.md,
  },
  imagePickerPlaceholder: {
    width: '100%',
    height: 200,
    borderRadius: BORDER_RADIUS.md,
    backgroundColor: COLORS.background,
    borderWidth: 2,
    borderColor: COLORS.divider,
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
  },
  imagePickerText: {
    fontSize: FONTS.sizes.md,
    color: COLORS.textDisabled,
    marginTop: SPACING.sm,
  },
  formGroup: {
    marginBottom: SPACING.md,
  },
  label: {
    fontSize: FONTS.sizes.md,
    fontWeight: FONTS.weights.semibold,
    color: COLORS.textPrimary,
    marginBottom: SPACING.xs,
  },
  input: {
    backgroundColor: COLORS.background,
    borderWidth: 1,
    borderColor: COLORS.divider,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
    fontSize: FONTS.sizes.md,
    color: COLORS.textPrimary,
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  button: {
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.lg,
    borderRadius: BORDER_RADIUS.md,
    marginLeft: SPACING.sm,
  },
  buttonPrimary: {
    backgroundColor: COLORS.primary,
  },
  buttonSecondary: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: COLORS.divider,
  },
  buttonPrimaryText: {
    fontSize: FONTS.sizes.md,
    fontWeight: FONTS.weights.semibold,
    color: COLORS.surface,
    textAlign: 'center',
  },
  buttonSecondaryText: {
    fontSize: FONTS.sizes.md,
    fontWeight: FONTS.weights.semibold,
    color: COLORS.textPrimary,
    textAlign: 'center',
  },
  buttonDisabled: {
    opacity: 0.6,
  },
});

export default MedicalRecordDetailScreen;

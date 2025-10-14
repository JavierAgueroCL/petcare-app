/**
 * PetCare Mobile - Pantalla de Cambiar Contraseña
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import Input from '../components/Input';
import Button from '../components/Button';
import { COLORS, SPACING, FONTS, BORDER_RADIUS, LAYOUT } from '../constants/theme';

const ChangePasswordScreen = () => {
  const navigation = useNavigation();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};

    if (!formData.currentPassword) {
      newErrors.currentPassword = 'La contraseña actual es requerida';
    }

    if (!formData.newPassword) {
      newErrors.newPassword = 'La nueva contraseña es requerida';
    } else if (formData.newPassword.length < 8) {
      newErrors.newPassword = 'La contraseña debe tener al menos 8 caracteres';
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Debes confirmar la nueva contraseña';
    } else if (formData.newPassword !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Las contraseñas no coinciden';
    }

    if (formData.currentPassword === formData.newPassword) {
      newErrors.newPassword = 'La nueva contraseña debe ser diferente a la actual';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    setLoading(true);

    // TODO: Implementar llamada al backend para cambiar contraseña
    // const result = await userService.changePassword({
    //   currentPassword: formData.currentPassword,
    //   newPassword: formData.newPassword,
    // });

    // Simulación por ahora
    setTimeout(() => {
      setLoading(false);
      Alert.alert(
        'Contraseña Actualizada',
        'Tu contraseña ha sido cambiada exitosamente',
        [{ text: 'OK', onPress: () => navigation.goBack() }]
      );
    }, 1500);
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.content}>
        <View style={styles.infoBox}>
          <Ionicons name="shield-checkmark" size={24} color={COLORS.primary} />
          <View style={styles.infoContent}>
            <Text style={styles.infoTitle}>Seguridad de la contraseña</Text>
            <Text style={styles.infoText}>
              Tu nueva contraseña debe tener al menos 8 caracteres y debe ser diferente a tu contraseña actual.
            </Text>
          </View>
        </View>

        <Input
          label="Contraseña Actual"
          value={formData.currentPassword}
          onChangeText={(text) => {
            setFormData({ ...formData, currentPassword: text });
            if (errors.currentPassword) {
              setErrors({ ...errors, currentPassword: null });
            }
          }}
          placeholder="Ingresa tu contraseña actual"
          secureTextEntry
          error={errors.currentPassword}
        />

        <Input
          label="Nueva Contraseña"
          value={formData.newPassword}
          onChangeText={(text) => {
            setFormData({ ...formData, newPassword: text });
            if (errors.newPassword) {
              setErrors({ ...errors, newPassword: null });
            }
          }}
          placeholder="Ingresa tu nueva contraseña"
          secureTextEntry
          error={errors.newPassword}
        />

        <Input
          label="Confirmar Nueva Contraseña"
          value={formData.confirmPassword}
          onChangeText={(text) => {
            setFormData({ ...formData, confirmPassword: text });
            if (errors.confirmPassword) {
              setErrors({ ...errors, confirmPassword: null });
            }
          }}
          placeholder="Confirma tu nueva contraseña"
          secureTextEntry
          error={errors.confirmPassword}
        />

        <View style={styles.requirementsBox}>
          <Text style={styles.requirementsTitle}>Requisitos de la contraseña:</Text>
          <View style={styles.requirementItem}>
            <Ionicons
              name={formData.newPassword.length >= 8 ? 'checkmark-circle' : 'ellipse-outline'}
              size={20}
              color={formData.newPassword.length >= 8 ? COLORS.success : COLORS.textSecondary}
            />
            <Text style={styles.requirementText}>Al menos 8 caracteres</Text>
          </View>
          <View style={styles.requirementItem}>
            <Ionicons
              name={formData.newPassword && formData.newPassword !== formData.currentPassword ? 'checkmark-circle' : 'ellipse-outline'}
              size={20}
              color={formData.newPassword && formData.newPassword !== formData.currentPassword ? COLORS.success : COLORS.textSecondary}
            />
            <Text style={styles.requirementText}>Diferente a la contraseña actual</Text>
          </View>
          <View style={styles.requirementItem}>
            <Ionicons
              name={formData.confirmPassword && formData.newPassword === formData.confirmPassword ? 'checkmark-circle' : 'ellipse-outline'}
              size={20}
              color={formData.confirmPassword && formData.newPassword === formData.confirmPassword ? COLORS.success : COLORS.textSecondary}
            />
            <Text style={styles.requirementText}>Las contraseñas coinciden</Text>
          </View>
        </View>

        <Button
          title="Cambiar Contraseña"
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
  infoBox: {
    flexDirection: 'row',
    backgroundColor: COLORS.primary + '15',
    padding: SPACING.md,
    borderRadius: BORDER_RADIUS.md,
    marginBottom: SPACING.xl,
    borderWidth: 1,
    borderColor: COLORS.primary + '30',
  },
  infoContent: {
    flex: 1,
    marginLeft: SPACING.md,
  },
  infoTitle: {
    fontSize: FONTS.sizes.md,
    fontWeight: FONTS.weights.semibold,
    color: COLORS.textPrimary,
    marginBottom: SPACING.xs,
  },
  infoText: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.textSecondary,
  },
  requirementsBox: {
    backgroundColor: COLORS.surface,
    padding: SPACING.md,
    borderRadius: BORDER_RADIUS.md,
    marginBottom: SPACING.lg,
  },
  requirementsTitle: {
    fontSize: FONTS.sizes.sm,
    fontWeight: FONTS.weights.semibold,
    color: COLORS.textPrimary,
    marginBottom: SPACING.sm,
  },
  requirementItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.xs,
  },
  requirementText: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.textSecondary,
    marginLeft: SPACING.sm,
  },
  submitButton: {
    marginTop: SPACING.md,
  },
});

export default ChangePasswordScreen;

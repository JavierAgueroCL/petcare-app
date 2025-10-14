/**
 * PetCare Mobile - Pantalla de Registro
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../contexts/AuthContext';
import Button from '../components/Button';
import Input from '../components/Input';
import DateInput from '../components/DateInput';
import { COLORS, SPACING, FONTS, LAYOUT } from '../constants/theme';
import * as authService from '../services/authService';

const RegisterScreen = ({ navigation }) => {
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
    phone: '',
    dateOfBirth: null,
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');

  const updateField = (field, value) => {
    setFormData({ ...formData, [field]: value });
    // Limpiar error del campo cuando el usuario escribe
    if (errors[field]) {
      setErrors({ ...errors, [field]: null });
    }
    if (serverError) {
      setServerError('');
    }
  };


  const validateForm = () => {
    const newErrors = {};

    // Email
    if (!formData.email) {
      newErrors.email = 'El email es requerido';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email inválido';
    }

    // Password
    if (!formData.password) {
      newErrors.password = 'La contraseña es requerida';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Mínimo 6 caracteres';
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
      newErrors.password = 'Debe contener mayúscula, minúscula y número';
    }

    // Confirmar password
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Confirma tu contraseña';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Las contraseñas no coinciden';
    }

    // Nombre
    if (!formData.firstName) {
      newErrors.firstName = 'El nombre es requerido';
    } else if (formData.firstName.length < 2) {
      newErrors.firstName = 'Mínimo 2 caracteres';
    }

    // Apellido
    if (!formData.lastName) {
      newErrors.lastName = 'El apellido es requerido';
    } else if (formData.lastName.length < 2) {
      newErrors.lastName = 'Mínimo 2 caracteres';
    }

    // Teléfono (opcional pero validar formato si se proporciona)
    if (formData.phone && !/^\+?56?[0-9]{9}$/.test(formData.phone.replace(/\s/g, ''))) {
      newErrors.phone = 'Formato: +56912345678 o 912345678';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleRegister = async () => {
    // Limpiar errores previos
    setErrors({});
    setServerError('');

    // Validar formulario
    if (!validateForm()) {
      return;
    }

    setLoading(true);

    // Formatear fecha para el backend (YYYY-MM-DD)
    let dateOfBirth = null;
    if (formData.dateOfBirth) {
      const year = formData.dateOfBirth.getFullYear();
      const month = (formData.dateOfBirth.getMonth() + 1).toString().padStart(2, '0');
      const day = formData.dateOfBirth.getDate().toString().padStart(2, '0');
      dateOfBirth = `${year}-${month}-${day}`;
    }

    // Llamar al servicio de registro
    const result = await authService.register({
      email: formData.email,
      password: formData.password,
      firstName: formData.firstName,
      lastName: formData.lastName,
      phone: formData.phone || undefined,
      dateOfBirth: dateOfBirth || undefined,
    });

    setLoading(false);

    if (result.success) {
      // El registro fue exitoso, iniciar sesión automáticamente
      await login(result.token, result.user);
    } else {
      // Construir mensaje de error con los detalles de validación
      let errorMessage = result.message || 'Error al registrar usuario';

      if (result.details && Array.isArray(result.details)) {
        const validationErrors = result.details
          .map(detail => `• ${detail.field}: ${detail.message}`)
          .join('\n');
        errorMessage += '\n' + validationErrors;
      }

      setServerError(errorMessage);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.header}>
          <Ionicons name="paw" size={48} color={COLORS.primary} />
          <Text style={styles.title}>Crear Cuenta</Text>
          <Text style={styles.subtitle}>Únete a PetCare</Text>
        </View>

        <View style={styles.form}>
          <Input
            label="Nombre"
            value={formData.firstName}
            onChangeText={(text) => updateField('firstName', text)}
            placeholder="Tu nombre"
            autoCapitalize="words"
            leftIcon="person-outline"
            error={errors.firstName}
          />

          <Input
            label="Apellido"
            value={formData.lastName}
            onChangeText={(text) => updateField('lastName', text)}
            placeholder="Tu apellido"
            autoCapitalize="words"
            leftIcon="person-outline"
            error={errors.lastName}
          />

          <Input
            label="Email"
            value={formData.email}
            onChangeText={(text) => updateField('email', text)}
            placeholder="tu@email.com"
            keyboardType="email-address"
            autoCapitalize="none"
            leftIcon="mail-outline"
            error={errors.email}
          />

          <Input
            label="Teléfono (opcional)"
            value={formData.phone}
            onChangeText={(text) => updateField('phone', text)}
            placeholder="+56912345678"
            keyboardType="phone-pad"
            leftIcon="call-outline"
            error={errors.phone}
          />

          <DateInput
            label="Fecha de Nacimiento (opcional)"
            value={formData.dateOfBirth}
            onChange={(date) => updateField('dateOfBirth', date)}
            mode="date"
            maximumDate={new Date()}
            minimumDate={new Date(1900, 0, 1)}
            placeholder="Seleccionar fecha"
          />

          <Input
            label="Contraseña"
            value={formData.password}
            onChangeText={(text) => updateField('password', text)}
            placeholder="Mínimo 6 caracteres"
            secureTextEntry
            leftIcon="lock-closed-outline"
            error={errors.password}
          />

          <Input
            label="Confirmar Contraseña"
            value={formData.confirmPassword}
            onChangeText={(text) => updateField('confirmPassword', text)}
            placeholder="Repite tu contraseña"
            secureTextEntry
            leftIcon="lock-closed-outline"
            error={errors.confirmPassword}
          />

          {serverError ? (
            <View style={styles.serverErrorContainer}>
              <Ionicons name="alert-circle" size={20} color={COLORS.error} />
              <Text style={styles.serverErrorText}>{serverError}</Text>
            </View>
          ) : null}

          <Button
            title="Registrarse"
            onPress={handleRegister}
            loading={loading}
            style={styles.registerButton}
          />

          <Button
            title="Ya tengo cuenta"
            onPress={() => navigation.goBack()}
            variant="ghost"
            style={styles.loginButton}
          />
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Al registrarte, aceptas nuestros términos y condiciones
          </Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },

  scrollContent: {
    flexGrow: 1,
    padding: LAYOUT.screenPadding,
    paddingTop: SPACING.xl,
  },

  header: {
    alignItems: 'center',
    marginBottom: SPACING.xl,
  },

  title: {
    fontSize: FONTS.sizes.xxl,
    fontWeight: FONTS.weights.bold,
    color: COLORS.primary,
    marginTop: SPACING.md,
  },

  subtitle: {
    fontSize: FONTS.sizes.md,
    color: COLORS.textSecondary,
    marginTop: SPACING.xs,
  },

  form: {
    marginBottom: SPACING.xl,
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

  registerButton: {
    marginTop: SPACING.md,
  },

  loginButton: {
    marginTop: SPACING.sm,
  },

  footer: {
    alignItems: 'center',
  },

  footerText: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.textSecondary,
    textAlign: 'center',
  },
});

export default RegisterScreen;

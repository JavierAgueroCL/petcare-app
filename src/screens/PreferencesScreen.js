/**
 * PetCare Mobile - Pantalla de Preferencias
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Switch,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING, FONTS, BORDER_RADIUS, LAYOUT } from '../constants/theme';
import * as userService from '../services/userService';

const PreferencesScreen = () => {
  const [preferences, setPreferences] = useState({
    darkMode: false,
    compactView: false,
    showImages: true,
    autoSync: true,
    offlineMode: false,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPreferences();
  }, []);

  const loadPreferences = async () => {
    setLoading(true);
    const result = await userService.getPreferences();
    if (result.success && result.data) {
      setPreferences(result.data);
    }
    setLoading(false);
  };

  const togglePreference = async (key) => {
    const updatedPreferences = { ...preferences, [key]: !preferences[key] };
    setPreferences(updatedPreferences);

    // Guardar en el backend
    await userService.updatePreferences(updatedPreferences);
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  const PreferenceItem = ({ icon, title, description, value, onToggle, type = 'switch' }) => (
    <View style={styles.preferenceItem}>
      <View style={styles.preferenceIcon}>
        <Ionicons name={icon} size={24} color={COLORS.primary} />
      </View>
      <View style={styles.preferenceContent}>
        <Text style={styles.preferenceTitle}>{title}</Text>
        {description && (
          <Text style={styles.preferenceDescription}>{description}</Text>
        )}
      </View>
      {type === 'switch' ? (
        <Switch
          value={value}
          onValueChange={onToggle}
          trackColor={{ false: COLORS.divider, true: COLORS.primary + '80' }}
          thumbColor={value ? COLORS.primary : COLORS.textDisabled}
        />
      ) : (
        <TouchableOpacity onPress={onToggle}>
          <Ionicons name="chevron-forward" size={24} color={COLORS.textSecondary} />
        </TouchableOpacity>
      )}
    </View>
  );

  return (
    <ScrollView style={styles.container}>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Apariencia</Text>
        <PreferenceItem
          icon="moon"
          title="Modo Oscuro"
          description="Activa el tema oscuro de la aplicación"
          value={preferences.darkMode}
          onToggle={() => togglePreference('darkMode')}
        />
        <PreferenceItem
          icon="contract"
          title="Vista Compacta"
          description="Muestra más información en menos espacio"
          value={preferences.compactView}
          onToggle={() => togglePreference('compactView')}
        />
        <PreferenceItem
          icon="image"
          title="Mostrar Imágenes"
          description="Muestra las fotos de tus mascotas"
          value={preferences.showImages}
          onToggle={() => togglePreference('showImages')}
        />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Sincronización</Text>
        <PreferenceItem
          icon="sync"
          title="Sincronización Automática"
          description="Sincroniza tus datos automáticamente"
          value={preferences.autoSync}
          onToggle={() => togglePreference('autoSync')}
        />
        <PreferenceItem
          icon="cloud-offline"
          title="Modo Sin Conexión"
          description="Permite usar la app sin conexión a internet"
          value={preferences.offlineMode}
          onToggle={() => togglePreference('offlineMode')}
        />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Datos</Text>
        <TouchableOpacity style={styles.actionItem}>
          <View style={styles.preferenceIcon}>
            <Ionicons name="trash" size={24} color={COLORS.error} />
          </View>
          <View style={styles.preferenceContent}>
            <Text style={[styles.preferenceTitle, { color: COLORS.error }]}>
              Limpiar Caché
            </Text>
            <Text style={styles.preferenceDescription}>
              Elimina archivos temporales y libera espacio
            </Text>
          </View>
          <Ionicons name="chevron-forward" size={24} color={COLORS.textSecondary} />
        </TouchableOpacity>
      </View>

      <View style={styles.infoBox}>
        <Ionicons name="information-circle" size={20} color={COLORS.info} />
        <Text style={styles.infoText}>
          Los cambios en las preferencias se guardan automáticamente.
        </Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.background,
  },
  section: {
    backgroundColor: COLORS.surface,
    marginBottom: SPACING.md,
    paddingVertical: SPACING.sm,
  },
  sectionTitle: {
    fontSize: FONTS.sizes.sm,
    fontWeight: FONTS.weights.bold,
    color: COLORS.textSecondary,
    paddingHorizontal: LAYOUT.screenPadding,
    paddingVertical: SPACING.sm,
    textTransform: 'uppercase',
  },
  preferenceItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: LAYOUT.screenPadding,
    paddingVertical: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.divider,
  },
  preferenceIcon: {
    width: 40,
    height: 40,
    borderRadius: BORDER_RADIUS.round,
    backgroundColor: COLORS.primary + '15',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SPACING.md,
  },
  preferenceContent: {
    flex: 1,
  },
  preferenceTitle: {
    fontSize: FONTS.sizes.md,
    fontWeight: FONTS.weights.medium,
    color: COLORS.textPrimary,
    marginBottom: SPACING.xs,
  },
  preferenceDescription: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.textSecondary,
  },
  actionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: LAYOUT.screenPadding,
    paddingVertical: SPACING.md,
  },
  infoBox: {
    flexDirection: 'row',
    backgroundColor: COLORS.info + '15',
    padding: SPACING.md,
    marginHorizontal: LAYOUT.screenPadding,
    marginVertical: SPACING.md,
    borderRadius: BORDER_RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.info + '30',
  },
  infoText: {
    flex: 1,
    fontSize: FONTS.sizes.sm,
    color: COLORS.textSecondary,
    marginLeft: SPACING.sm,
  },
});

export default PreferencesScreen;

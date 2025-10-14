/**
 * PetCare Mobile - Pantalla de Idioma
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING, FONTS, BORDER_RADIUS, LAYOUT } from '../constants/theme';
import * as userService from '../services/userService';

const LanguageScreen = () => {
  const [selectedLanguage, setSelectedLanguage] = useState('es');
  const [loading, setLoading] = useState(true);

  const languages = [
    { code: 'es', name: 'Español', nativeName: 'Español', flag: '🇨🇱' },
    { code: 'en', name: 'English', nativeName: 'English', flag: '🇺🇸' },
    { code: 'pt', name: 'Portuguese', nativeName: 'Português', flag: '🇧🇷' },
    { code: 'fr', name: 'French', nativeName: 'Français', flag: '🇫🇷' },
  ];

  useEffect(() => {
    loadLanguage();
  }, []);

  const loadLanguage = async () => {
    setLoading(true);
    const result = await userService.getUserProfile();
    if (result.success && result.data && result.data.language) {
      setSelectedLanguage(result.data.language);
    }
    setLoading(false);
  };

  const handleLanguageChange = (languageCode) => {
    Alert.alert(
      'Cambiar Idioma',
      '¿Deseas cambiar el idioma de la aplicación?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Cambiar',
          onPress: async () => {
            setSelectedLanguage(languageCode);

            // Guardar en el backend
            const result = await userService.updateLanguage(languageCode);

            if (result.success) {
              Alert.alert('Idioma Cambiado', 'El idioma se aplicará la próxima vez que abras la app');
            }
          },
        },
      ]
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  const LanguageItem = ({ language }) => {
    const isSelected = selectedLanguage === language.code;

    return (
      <TouchableOpacity
        style={[
          styles.languageItem,
          isSelected && styles.languageItemSelected,
        ]}
        onPress={() => handleLanguageChange(language.code)}
      >
        <Text style={styles.languageFlag}>{language.flag}</Text>
        <View style={styles.languageContent}>
          <Text style={styles.languageName}>{language.name}</Text>
          <Text style={styles.languageNativeName}>{language.nativeName}</Text>
        </View>
        {isSelected && (
          <Ionicons name="checkmark-circle" size={24} color={COLORS.primary} />
        )}
      </TouchableOpacity>
    );
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.infoBox}>
        <Ionicons name="information-circle" size={20} color={COLORS.info} />
        <Text style={styles.infoText}>
          Selecciona el idioma que prefieres para usar la aplicación.
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Idiomas Disponibles</Text>
        {languages.map((language) => (
          <LanguageItem key={language.code} language={language} />
        ))}
      </View>

      <View style={styles.helpBox}>
        <Ionicons name="help-circle" size={20} color={COLORS.textSecondary} />
        <Text style={styles.helpText}>
          ¿No encuentras tu idioma? Estamos trabajando para agregar más idiomas pronto.
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
  infoBox: {
    flexDirection: 'row',
    backgroundColor: COLORS.info + '15',
    padding: SPACING.md,
    marginHorizontal: LAYOUT.screenPadding,
    marginTop: SPACING.md,
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
  section: {
    backgroundColor: COLORS.surface,
    marginTop: SPACING.md,
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
  languageItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: LAYOUT.screenPadding,
    paddingVertical: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.divider,
  },
  languageItemSelected: {
    backgroundColor: COLORS.primary + '10',
  },
  languageFlag: {
    fontSize: 32,
    marginRight: SPACING.md,
  },
  languageContent: {
    flex: 1,
  },
  languageName: {
    fontSize: FONTS.sizes.md,
    fontWeight: FONTS.weights.medium,
    color: COLORS.textPrimary,
    marginBottom: SPACING.xs,
  },
  languageNativeName: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.textSecondary,
  },
  helpBox: {
    flexDirection: 'row',
    backgroundColor: COLORS.surface,
    padding: SPACING.md,
    marginHorizontal: LAYOUT.screenPadding,
    marginBottom: SPACING.md,
    borderRadius: BORDER_RADIUS.md,
  },
  helpText: {
    flex: 1,
    fontSize: FONTS.sizes.sm,
    color: COLORS.textSecondary,
    marginLeft: SPACING.sm,
  },
});

export default LanguageScreen;

/**
 * PetCare Mobile - Pantalla de Términos y Condiciones
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING, FONTS, BORDER_RADIUS, LAYOUT } from '../constants/theme';
import { getTerms } from '../services/legalService';

const TermsScreen = () => {
  const [loading, setLoading] = useState(true);
  const [content, setContent] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadTerms();
  }, []);

  const loadTerms = async () => {
    try {
      setLoading(true);
      const response = await getTerms();

      if (response.success && response.data) {
        const parsedContent = typeof response.data.content === 'string'
          ? JSON.parse(response.data.content)
          : response.data.content;
        setContent(parsedContent);
      } else {
        setError('No se pudo cargar el contenido');
      }
    } catch (err) {
      console.error('Error cargando términos:', err);
      setError('Error al cargar los términos y condiciones');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={[styles.container, styles.centered]}>
        <ActivityIndicator size="large" color={COLORS.primary} />
        <Text style={styles.loadingText}>Cargando términos y condiciones...</Text>
      </View>
    );
  }

  if (error || !content) {
    return (
      <View style={[styles.container, styles.centered]}>
        <Ionicons name="alert-circle" size={64} color={COLORS.error} />
        <Text style={styles.errorText}>{error || 'No se pudo cargar el contenido'}</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Ionicons name="document-text" size={48} color={COLORS.primary} />
        <Text style={styles.headerTitle}>{content.title || 'Términos y Condiciones'}</Text>
        <Text style={styles.headerSubtitle}>
          Última actualización: {content.lastUpdate || 'Octubre 2024'}
        </Text>
      </View>

      <View style={styles.content}>
        {content.sections && content.sections.map((section, index) => (
          <View key={index} style={styles.section}>
            <Text style={styles.sectionTitle}>{section.title}</Text>
            {section.content && (
              <Text style={styles.paragraph}>{section.content}</Text>
            )}
            {section.items && section.items.map((item, itemIndex) => (
              <Text key={itemIndex} style={styles.bulletPoint}>• {item}</Text>
            ))}
            {section.contact && (
              <>
                {section.contact.email && (
                  <Text style={styles.contactText}>Email: {section.contact.email}</Text>
                )}
                {section.contact.phone && (
                  <Text style={styles.contactText}>Teléfono: {section.contact.phone}</Text>
                )}
              </>
            )}
          </View>
        ))}
      </View>

      <View style={styles.footer}>
        <Ionicons name="shield-checkmark" size={20} color={COLORS.success} />
        <Text style={styles.footerText}>
          Al usar PetCare, usted acepta estos términos y condiciones.
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
  centered: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: LAYOUT.screenPadding,
  },
  loadingText: {
    fontSize: FONTS.sizes.md,
    color: COLORS.textSecondary,
    marginTop: SPACING.md,
  },
  errorText: {
    fontSize: FONTS.sizes.md,
    color: COLORS.error,
    marginTop: SPACING.md,
    textAlign: 'center',
  },
  header: {
    backgroundColor: COLORS.surface,
    alignItems: 'center',
    paddingVertical: SPACING.xl,
    marginBottom: SPACING.md,
  },
  headerTitle: {
    fontSize: FONTS.sizes.xxl,
    fontWeight: FONTS.weights.bold,
    color: COLORS.textPrimary,
    marginTop: SPACING.sm,
  },
  headerSubtitle: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.textSecondary,
    marginTop: SPACING.xs,
  },
  content: {
    paddingHorizontal: LAYOUT.screenPadding,
  },
  section: {
    marginBottom: SPACING.xl,
  },
  sectionTitle: {
    fontSize: FONTS.sizes.lg,
    fontWeight: FONTS.weights.bold,
    color: COLORS.textPrimary,
    marginBottom: SPACING.md,
  },
  paragraph: {
    fontSize: FONTS.sizes.md,
    color: COLORS.textSecondary,
    lineHeight: 22,
    marginBottom: SPACING.sm,
  },
  bulletPoint: {
    fontSize: FONTS.sizes.md,
    color: COLORS.textSecondary,
    lineHeight: 22,
    marginLeft: SPACING.md,
    marginBottom: SPACING.xs,
  },
  contactText: {
    fontSize: FONTS.sizes.md,
    color: COLORS.primary,
    lineHeight: 22,
    marginTop: SPACING.xs,
  },
  footer: {
    flexDirection: 'row',
    backgroundColor: COLORS.success + '15',
    padding: SPACING.md,
    marginHorizontal: LAYOUT.screenPadding,
    marginVertical: SPACING.xl,
    borderRadius: BORDER_RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.success + '30',
  },
  footerText: {
    flex: 1,
    fontSize: FONTS.sizes.sm,
    color: COLORS.textSecondary,
    marginLeft: SPACING.sm,
  },
});

export default TermsScreen;

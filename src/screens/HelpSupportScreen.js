/**
 * PetCare Mobile - Pantalla de Ayuda y Soporte
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Linking,
  LayoutAnimation,
  Platform,
  UIManager,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING, FONTS, BORDER_RADIUS, LAYOUT } from '../constants/theme';

// Habilitar animaciones en Android
if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const HelpSupportScreen = () => {
  const [expandedFAQ, setExpandedFAQ] = useState(null);

  const handleEmailPress = () => {
    Linking.openURL('mailto:soporte@petcare.cl?subject=Ayuda con PetCare');
  };

  const handlePhonePress = () => {
    Linking.openURL('tel:+56953431578');
  };

  const handleWebsitePress = () => {
    Linking.openURL('https://petcare.cl/ayuda');
  };

  const handleFAQPress = (id) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpandedFAQ(expandedFAQ === id ? null : id);
  };

  const SupportOption = ({ icon, title, description, onPress, color = COLORS.primary }) => (
    <TouchableOpacity style={styles.supportOption} onPress={onPress}>
      <View style={[styles.supportIcon, { backgroundColor: color + '15' }]}>
        <Ionicons name={icon} size={28} color={color} />
      </View>
      <View style={styles.supportContent}>
        <Text style={styles.supportTitle}>{title}</Text>
        <Text style={styles.supportDescription}>{description}</Text>
      </View>
      <Ionicons name="chevron-forward" size={24} color={COLORS.textSecondary} />
    </TouchableOpacity>
  );

  const FAQItem = ({ id, question, answer, isExpanded, onPress }) => (
    <View style={styles.faqContainer}>
      <TouchableOpacity
        style={styles.faqItem}
        onPress={() => onPress(id)}
        activeOpacity={0.7}
      >
        <View style={styles.faqIcon}>
          <Ionicons name="help-circle-outline" size={24} color={COLORS.primary} />
        </View>
        <View style={styles.faqContent}>
          <Text style={styles.faqQuestion}>{question}</Text>
        </View>
        <Ionicons
          name={isExpanded ? "chevron-down" : "chevron-forward"}
          size={20}
          color={COLORS.textSecondary}
        />
      </TouchableOpacity>
      {isExpanded && (
        <View style={styles.faqAnswer}>
          <Text style={styles.faqAnswerText}>{answer}</Text>
        </View>
      )}
    </View>
  );

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Ionicons name="headset" size={64} color={COLORS.primary} />
        <Text style={styles.headerTitle}>¿Cómo podemos ayudarte?</Text>
        <Text style={styles.headerSubtitle}>
          Estamos aquí para resolver tus dudas y ayudarte
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Contáctanos</Text>
        <SupportOption
          icon="mail"
          title="Correo Electrónico"
          description="soporte@petcare.cl"
          onPress={handleEmailPress}
          color={COLORS.primary}
        />
        <SupportOption
          icon="call"
          title="Teléfono"
          description="+56 9 5343 1578"
          onPress={handlePhonePress}
          color={COLORS.success}
        />
        <SupportOption
          icon="globe"
          title="Sitio Web"
          description="petcare.cl/ayuda"
          onPress={handleWebsitePress}
          color={COLORS.info}
        />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Preguntas Frecuentes</Text>
        <FAQItem
          id="faq1"
          question="¿Cómo agrego una nueva mascota?"
          answer="Para agregar una nueva mascota, ve a la sección 'Mascotas' y presiona el botón '+'. Completa la información requerida como nombre, tipo, raza y fecha de nacimiento."
          isExpanded={expandedFAQ === 'faq1'}
          onPress={handleFAQPress}
        />
        <FAQItem
          id="faq2"
          question="¿Cómo escaneo el código QR de mi mascota?"
          answer="Usa el escáner QR desde la pantalla de inicio. Coloca el código QR frente a la cámara y la app detectará automáticamente la información de la mascota."
          isExpanded={expandedFAQ === 'faq2'}
          onPress={handleFAQPress}
        />
        <FAQItem
          id="faq3"
          question="¿Puedo compartir el registro médico con mi veterinario?"
          answer="Sí, puedes compartir el registro médico de tu mascota desde la pantalla de detalles. Presiona 'Compartir' y selecciona el método que prefieras."
          isExpanded={expandedFAQ === 'faq3'}
          onPress={handleFAQPress}
        />
        <FAQItem
          id="faq4"
          question="¿Cómo actualizo la información de mi mascota?"
          answer="Desde la pantalla de detalles de tu mascota, presiona el botón de editar (ícono de lápiz) para actualizar cualquier información."
          isExpanded={expandedFAQ === 'faq4'}
          onPress={handleFAQPress}
        />
        <FAQItem
          id="faq5"
          question="¿Qué hago si pierdo a mi mascota?"
          answer="Reporta inmediatamente a tu mascota como perdida desde su perfil. Esto activará alertas en la comunidad y te ayudará a encontrarla más rápido."
          isExpanded={expandedFAQ === 'faq5'}
          onPress={handleFAQPress}
        />
      </View>

      <View style={styles.infoBox}>
        <Ionicons name="time" size={20} color={COLORS.info} />
        <View style={styles.infoContent}>
          <Text style={styles.infoTitle}>Horario de Atención</Text>
          <Text style={styles.infoText}>
            Lunes a Viernes: 9:00 - 18:00{'\n'}
            Sábados: 10:00 - 14:00
          </Text>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    backgroundColor: COLORS.surface,
    alignItems: 'center',
    paddingVertical: SPACING.xxl,
    marginBottom: SPACING.md,
  },
  headerTitle: {
    fontSize: FONTS.sizes.xxl,
    fontWeight: FONTS.weights.bold,
    color: COLORS.textPrimary,
    marginTop: SPACING.md,
  },
  headerSubtitle: {
    fontSize: FONTS.sizes.md,
    color: COLORS.textSecondary,
    marginTop: SPACING.xs,
    textAlign: 'center',
    paddingHorizontal: LAYOUT.screenPadding,
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
  supportOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: LAYOUT.screenPadding,
    paddingVertical: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.divider,
  },
  supportIcon: {
    width: 56,
    height: 56,
    borderRadius: BORDER_RADIUS.round,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SPACING.md,
  },
  supportContent: {
    flex: 1,
  },
  supportTitle: {
    fontSize: FONTS.sizes.md,
    fontWeight: FONTS.weights.semibold,
    color: COLORS.textPrimary,
    marginBottom: SPACING.xs,
  },
  supportDescription: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.textSecondary,
  },
  faqContainer: {
    borderBottomWidth: 1,
    borderBottomColor: COLORS.divider,
  },
  faqItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: LAYOUT.screenPadding,
    paddingVertical: SPACING.md,
  },
  faqIcon: {
    marginRight: SPACING.md,
  },
  faqContent: {
    flex: 1,
  },
  faqQuestion: {
    fontSize: FONTS.sizes.md,
    color: COLORS.textPrimary,
  },
  faqAnswer: {
    paddingHorizontal: LAYOUT.screenPadding,
    paddingLeft: LAYOUT.screenPadding + 24 + SPACING.md,
    paddingBottom: SPACING.md,
    paddingTop: SPACING.xs,
  },
  faqAnswerText: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.textSecondary,
    lineHeight: FONTS.sizes.sm * 1.5,
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
  infoContent: {
    flex: 1,
    marginLeft: SPACING.sm,
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
});

export default HelpSupportScreen;

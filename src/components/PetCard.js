/**
 * PetCare Mobile - Componente PetCard
 */

import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING, FONTS, BORDER_RADIUS, SHADOWS } from '../constants/theme';

const PetCard = ({ pet, onPress }) => {
  const getSpeciesIcon = (species) => {
    switch (species) {
      case 'dog':
        return 'paw';
      case 'cat':
        return 'paw';
      default:
        return 'paw';
    }
  };

  const getSpeciesLabel = (species) => {
    switch (species) {
      case 'dog':
        return 'Perro';
      case 'cat':
        return 'Gato';
      default:
        return species;
    }
  };

  const getAge = () => {
    if (pet.date_of_birth) {
      const birthDate = new Date(pet.date_of_birth);
      const today = new Date();
      const ageInMonths = Math.floor((today - birthDate) / (1000 * 60 * 60 * 24 * 30));

      if (ageInMonths < 12) {
        return `${ageInMonths} meses`;
      } else {
        const years = Math.floor(ageInMonths / 12);
        return `${years} ${years === 1 ? 'año' : 'años'}`;
      }
    } else if (pet.estimated_age_months) {
      if (pet.estimated_age_months < 12) {
        return `~${pet.estimated_age_months} meses`;
      } else {
        const years = Math.floor(pet.estimated_age_months / 12);
        return `~${years} ${years === 1 ? 'año' : 'años'}`;
      }
    }
    return 'Edad desconocida';
  };

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.imageContainer}>
        {pet.profile_image_url ? (
          <Image
            source={{ uri: pet.profile_image_url }}
            style={styles.image}
            resizeMode="cover"
          />
        ) : (
          <View style={styles.placeholderImage}>
            <Ionicons name={getSpeciesIcon(pet.species)} size={48} color={COLORS.textDisabled} />
          </View>
        )}

        {pet.status === 'lost' && (
          <View style={styles.lostBadge}>
            <Text style={styles.lostBadgeText}>PERDIDA</Text>
          </View>
        )}
      </View>

      <View style={styles.content}>
        <Text style={styles.name}>{pet.name}</Text>

        <View style={styles.infoRow}>
          <Ionicons name={getSpeciesIcon(pet.species)} size={16} color={COLORS.textSecondary} />
          <Text style={styles.infoText}>{getSpeciesLabel(pet.species)}</Text>

          {pet.breed && (
            <>
              <View style={styles.separator} />
              <Text style={styles.infoText}>{pet.breed}</Text>
            </>
          )}
        </View>

        <View style={styles.infoRow}>
          <Ionicons name="calendar-outline" size={16} color={COLORS.textSecondary} />
          <Text style={styles.infoText}>{getAge()}</Text>

          {pet.gender && (
            <>
              <View style={styles.separator} />
              <Ionicons
                name={pet.gender === 'male' ? 'male' : 'female'}
                size={16}
                color={pet.gender === 'male' ? COLORS.info : COLORS.primary}
              />
            </>
          )}
        </View>
      </View>

      <Ionicons name="chevron-forward" size={24} color={COLORS.textSecondary} />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
    marginBottom: SPACING.md,
    alignItems: 'center',
    ...SHADOWS.medium,
  },

  imageContainer: {
    position: 'relative',
    marginRight: SPACING.md,
  },

  image: {
    width: 80,
    height: 80,
    borderRadius: BORDER_RADIUS.md,
  },

  placeholderImage: {
    width: 80,
    height: 80,
    borderRadius: BORDER_RADIUS.md,
    backgroundColor: COLORS.background,
    alignItems: 'center',
    justifyContent: 'center',
  },

  lostBadge: {
    position: 'absolute',
    top: 4,
    right: 4,
    backgroundColor: COLORS.error,
    paddingHorizontal: SPACING.xs,
    paddingVertical: 2,
    borderRadius: BORDER_RADIUS.xs,
  },

  lostBadgeText: {
    color: COLORS.textWhite,
    fontSize: FONTS.sizes.xs,
    fontWeight: FONTS.weights.bold,
  },

  content: {
    flex: 1,
  },

  name: {
    fontSize: FONTS.sizes.lg,
    fontWeight: FONTS.weights.bold,
    color: COLORS.textPrimary,
    marginBottom: SPACING.xs,
  },

  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.xs,
  },

  infoText: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.textSecondary,
    marginLeft: SPACING.xs,
  },

  separator: {
    width: 1,
    height: 12,
    backgroundColor: COLORS.divider,
    marginHorizontal: SPACING.sm,
  },
});

export default PetCard;

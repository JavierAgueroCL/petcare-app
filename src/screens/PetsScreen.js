/**
 * PetCare Mobile - Pantalla de Mascotas
 */

import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import * as petService from '../services/petService';
import PetCard from '../components/PetCard';
import Button from '../components/Button';
import { COLORS, SPACING, FONTS, LAYOUT } from '../constants/theme';

const PetsScreen = () => {
  const navigation = useNavigation();
  const [pets, setPets] = useState([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  useFocusEffect(
    useCallback(() => {
      loadPets();
    }, [])
  );

  const loadPets = async () => {
    setLoading(true);
    const result = await petService.getMyPets();
    setLoading(false);

    if (result.success) {
      setPets(result.data || []);
    } else {
      Alert.alert('Error', 'No se pudieron cargar las mascotas');
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadPets();
    setRefreshing(false);
  };

  const handlePetPress = (petId) => {
    navigation.navigate('PetDetail', { petId });
  };

  const handleAddPet = () => {
    navigation.navigate('AddPet');
  };

  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
      <Ionicons name="paw-outline" size={64} color={COLORS.textDisabled} />
      <Text style={styles.emptyTitle}>No tienes mascotas registradas</Text>
      <Text style={styles.emptySubtitle}>
        Agrega tu primera mascota para comenzar a usar PetCare
      </Text>
      <Button
        title="Agregar Mascota"
        onPress={handleAddPet}
        style={styles.emptyButton}
      />
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={pets}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <PetCard pet={item} onPress={() => handlePetPress(item.id)} />
        )}
        contentContainerStyle={[
          styles.listContent,
          pets.length === 0 && styles.listContentEmpty,
        ]}
        ListEmptyComponent={!loading && renderEmpty}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      />

      {pets.length > 0 && (
        <TouchableOpacity style={styles.fab} onPress={handleAddPet}>
          <Ionicons name="add" size={32} color={COLORS.textWhite} />
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },

  listContent: {
    padding: LAYOUT.screenPadding,
  },

  listContentEmpty: {
    flexGrow: 1,
    justifyContent: 'center',
  },

  emptyContainer: {
    alignItems: 'center',
    paddingHorizontal: SPACING.xl,
  },

  emptyTitle: {
    fontSize: FONTS.sizes.xl,
    fontWeight: FONTS.weights.bold,
    color: COLORS.textPrimary,
    marginTop: SPACING.lg,
    textAlign: 'center',
  },

  emptySubtitle: {
    fontSize: FONTS.sizes.md,
    color: COLORS.textSecondary,
    marginTop: SPACING.sm,
    textAlign: 'center',
  },

  emptyButton: {
    marginTop: SPACING.xl,
  },

  fab: {
    position: 'absolute',
    right: SPACING.lg,
    bottom: SPACING.lg,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
});

export default PetsScreen;

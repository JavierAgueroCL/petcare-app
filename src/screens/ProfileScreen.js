/**
 * PetCare Mobile - Pantalla de Perfil
 */

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../contexts/AuthContext';
import { COLORS, SPACING, FONTS, BORDER_RADIUS, SHADOWS, LAYOUT } from '../constants/theme';

const ProfileScreen = () => {
  const navigation = useNavigation();
  const { user, logout } = useAuth();
  const [isLoggingOut, setIsLoggingOut] = React.useState(false);

  const handleLogout = () => {
    console.log('🔘 Botón de logout presionado');
    Alert.alert('Cerrar Sesión', '¿Estás seguro de que quieres cerrar sesión?', [
      { text: 'Cancelar', style: 'cancel', onPress: () => console.log('❌ Logout cancelado') },
      {
        text: 'Cerrar Sesión',
        style: 'destructive',
        onPress: async () => {
          console.log('✅ Logout confirmado');
          setIsLoggingOut(true);
          try {
            const result = await logout();
            console.log('📤 Resultado del logout:', result);
            if (!result.success) {
              Alert.alert('Error', 'Hubo un problema al cerrar sesión');
            }
          } catch (error) {
            console.error('❌ Error logging out:', error);
            Alert.alert('Error', 'No se pudo cerrar sesión');
          } finally {
            setIsLoggingOut(false);
          }
        },
      },
    ]);
  };

  const MenuItem = ({ icon, title, onPress, color = COLORS.textPrimary }) => (
    <TouchableOpacity style={styles.menuItem} onPress={onPress}>
      <Ionicons name={icon} size={24} color={color} />
      <Text style={[styles.menuItemText, { color }]}>{title}</Text>
      <Ionicons name="chevron-forward" size={24} color={COLORS.textSecondary} />
    </TouchableOpacity>
  );

  return (
    <View style={{ flex: 1 }}>
      <ScrollView style={styles.container}>
        <View style={styles.header}>
          <View style={styles.avatarContainer}>
            <Ionicons name="person-circle" size={100} color={COLORS.primary} />
          </View>
          <Text style={styles.name}>
            {user?.firstName} {user?.lastName}
          </Text>
          <Text style={styles.email}>{user?.email}</Text>
          {user?.role && (
            <View style={styles.roleBadge}>
              <Text style={styles.roleBadgeText}>
                {user.role === 'owner' ? 'Dueño' : user.role}
              </Text>
            </View>
          )}
        </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Mi Cuenta</Text>
        <MenuItem
          icon="person-outline"
          title="Editar Perfil"
          onPress={() => navigation.navigate('EditProfile')}
        />
        <MenuItem
          icon="notifications-outline"
          title="Notificaciones"
          onPress={() => navigation.navigate('Notifications')}
        />
        <MenuItem
          icon="lock-closed-outline"
          title="Cambiar Contraseña"
          onPress={() => navigation.navigate('ChangePassword')}
        />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Configuración</Text>
        <MenuItem
          icon="settings-outline"
          title="Preferencias"
          onPress={() => navigation.navigate('Preferences')}
        />
        <MenuItem
          icon="help-circle-outline"
          title="Ayuda y Soporte"
          onPress={() => navigation.navigate('HelpSupport')}
        />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Legal</Text>
        <MenuItem
          icon="document-text-outline"
          title="Términos y Condiciones"
          onPress={() => navigation.navigate('Terms')}
        />
        <MenuItem
          icon="shield-checkmark-outline"
          title="Política de Privacidad"
          onPress={() => navigation.navigate('PrivacyPolicy')}
        />
      </View>

      <View style={styles.section}>
        <MenuItem
          icon="log-out-outline"
          title="Cerrar Sesión"
          onPress={handleLogout}
          color={COLORS.error}
        />
      </View>

      <View style={styles.footer}>
        <Text style={styles.version}>PetCare v1.0.0</Text>
      </View>
    </ScrollView>

    {isLoggingOut && (
      <View style={styles.loadingOverlay}>
        <ActivityIndicator size="large" color={COLORS.primary} />
        <Text style={styles.loadingText}>Cerrando sesión...</Text>
      </View>
    )}
    </View>
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
    paddingVertical: SPACING.xl,
    marginBottom: SPACING.md,
  },

  avatarContainer: {
    marginBottom: SPACING.md,
  },

  name: {
    fontSize: FONTS.sizes.xxl,
    fontWeight: FONTS.weights.bold,
    color: COLORS.textPrimary,
  },

  email: {
    fontSize: FONTS.sizes.md,
    color: COLORS.textSecondary,
    marginTop: SPACING.xs,
  },

  roleBadge: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs,
    borderRadius: BORDER_RADIUS.md,
    marginTop: SPACING.sm,
  },

  roleBadgeText: {
    color: COLORS.textWhite,
    fontSize: FONTS.sizes.sm,
    fontWeight: FONTS.weights.medium,
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

  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: LAYOUT.screenPadding,
    paddingVertical: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.divider,
  },

  menuItemText: {
    flex: 1,
    fontSize: FONTS.sizes.md,
    marginLeft: SPACING.md,
  },

  footer: {
    alignItems: 'center',
    paddingVertical: SPACING.xl,
  },

  version: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.textDisabled,
  },

  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },

  loadingText: {
    color: COLORS.textWhite,
    fontSize: FONTS.sizes.md,
    marginTop: SPACING.md,
  },
});

export default ProfileScreen;

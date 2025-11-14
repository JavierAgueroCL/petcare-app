/**
 * PetCare Mobile - Navegación Principal
 */

import React from 'react';
import { View, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';

import { useAuth } from '../contexts/AuthContext';
import { COLORS } from '../constants/theme';

// Screens
import LoadingScreen from '../screens/LoadingScreen';
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import HomeScreen from '../screens/HomeScreen';
import PetsScreen from '../screens/PetsScreen';
import PetDetailScreen from '../screens/PetDetailScreen';
import AddPetScreen from '../screens/AddPetScreen';
import EditPetScreen from '../screens/EditPetScreen';
import QRScannerScreen from '../screens/QRScannerScreen';
import ProfileScreen from '../screens/ProfileScreen';
import EditProfileScreen from '../screens/EditProfileScreen';
import BookAppointmentScreen from '../screens/BookAppointmentScreen';
import MedicalRecordsScreen from '../screens/MedicalRecordsScreen';
import MedicalRecordDetailScreen from '../screens/MedicalRecordDetailScreen';
import AppointmentsScreen from '../screens/AppointmentsScreen';
import NotificationsScreen from '../screens/NotificationsScreen';
import UserNotificationsScreen from '../screens/UserNotificationsScreen';
import CreateReminderScreen from '../screens/CreateReminderScreen';
import ChangePasswordScreen from '../screens/ChangePasswordScreen';
import PreferencesScreen from '../screens/PreferencesScreen';
import LanguageScreen from '../screens/LanguageScreen';
import HelpSupportScreen from '../screens/HelpSupportScreen';
import TermsScreen from '../screens/TermsScreen';
import PrivacyPolicyScreen from '../screens/PrivacyPolicyScreen';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

// Navegación de tabs principales
const MainTabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'Home') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Pets') {
            iconName = focused ? 'paw' : 'paw-outline';
          } else if (route.name === 'QRScanner') {
            iconName = focused ? 'qr-code' : 'qr-code-outline';
          } else if (route.name === 'Profile') {
            iconName = focused ? 'person' : 'person-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: COLORS.primary,
        tabBarInactiveTintColor: COLORS.textSecondary,
        tabBarStyle: {
          backgroundColor: COLORS.surface,
          borderTopColor: COLORS.border,
          height: 75,
          paddingBottom: 8,
          paddingTop: 8,
        },
        headerStyle: {
          backgroundColor: COLORS.primary,
        },
        headerTintColor: COLORS.textWhite,
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      })}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{ title: 'Inicio' }}
      />
      <Tab.Screen
        name="Pets"
        component={PetsScreen}
        options={{ title: 'Mis Mascotas' }}
      />
      <Tab.Screen
        name="QRScanner"
        component={QRScannerScreen}
        options={{ title: 'Escanear QR' }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{ title: 'Perfil' }}
      />
    </Tab.Navigator>
  );
};

// Navegación autenticada
const AuthenticatedNavigator = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: COLORS.primary,
        },
        headerTintColor: COLORS.textWhite,
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}
    >
      <Stack.Screen
        name="MainTabs"
        component={MainTabNavigator}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="PetDetail"
        component={PetDetailScreen}
        options={{ title: 'Detalle de Mascota' }}
      />
      <Stack.Screen
        name="AddPet"
        component={AddPetScreen}
        options={{ title: 'Agregar Mascota' }}
      />
      <Stack.Screen
        name="EditPet"
        component={EditPetScreen}
        options={{ title: 'Editar Mascota' }}
      />
      <Stack.Screen
        name="EditProfile"
        component={EditProfileScreen}
        options={{ title: 'Editar Perfil' }}
      />
      <Stack.Screen
        name="BookAppointment"
        component={BookAppointmentScreen}
        options={{ title: 'Agendar Cita' }}
      />
      <Stack.Screen
        name="MedicalRecords"
        component={MedicalRecordsScreen}
        options={{ title: 'Registros Médicos' }}
      />
      <Stack.Screen
        name="MedicalRecordDetail"
        component={MedicalRecordDetailScreen}
        options={{ title: 'Detalle del Registro' }}
      />
      <Stack.Screen
        name="Appointments"
        component={AppointmentsScreen}
        options={{ title: 'Mis Citas' }}
      />
      <Stack.Screen
        name="Notifications"
        component={UserNotificationsScreen}
        options={{ title: 'Notificaciones' }}
      />
      <Stack.Screen
        name="NotificationSettings"
        component={NotificationsScreen}
        options={{ title: 'Configuración de Notificaciones' }}
      />
      <Stack.Screen
        name="CreateReminder"
        component={CreateReminderScreen}
        options={{ title: 'Crear Recordatorio' }}
      />
      <Stack.Screen
        name="ChangePassword"
        component={ChangePasswordScreen}
        options={{ title: 'Cambiar Contraseña' }}
      />
      <Stack.Screen
        name="Preferences"
        component={PreferencesScreen}
        options={{ title: 'Preferencias' }}
      />
      <Stack.Screen
        name="Language"
        component={LanguageScreen}
        options={{ title: 'Idioma' }}
      />
      <Stack.Screen
        name="HelpSupport"
        component={HelpSupportScreen}
        options={{ title: 'Ayuda y Soporte' }}
      />
      <Stack.Screen
        name="Terms"
        component={TermsScreen}
        options={{ title: 'Términos y Condiciones' }}
      />
      <Stack.Screen
        name="PrivacyPolicy"
        component={PrivacyPolicyScreen}
        options={{ title: 'Política de Privacidad' }}
      />
    </Stack.Navigator>
  );
};

// Navegación no autenticada
const UnauthenticatedNavigator = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />
    </Stack.Navigator>
  );
};

// Navegador principal
const AppNavigator = () => {
  const { isAuthenticated, isLoading, sessionId } = useAuth();

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <View style={styles.container}>
      <NavigationContainer key={`session-${sessionId}`}>
        {isAuthenticated ? <AuthenticatedNavigator /> : <UnauthenticatedNavigator />}
      </NavigationContainer>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default AppNavigator;

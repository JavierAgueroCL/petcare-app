/**
 * PetCare Mobile App
 * Aplicación móvil para la gestión de mascotas
 */

import React, { useEffect } from 'react';
import { Platform } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AuthProvider } from './src/contexts/AuthContext';
import AppNavigator from './src/navigation/AppNavigator';

export default function App() {
  useEffect(() => {
    // Solo aplicar estilos al body en web
    if (Platform.OS === 'web' && typeof document !== 'undefined') {
      // Agregar estilos al body
      document.body.style.overflow = 'auto';
      // Puedes agregar más estilos aquí:
      // document.body.style.backgroundColor = '#f5f5f5';
      // document.body.style.fontFamily = 'Arial, sans-serif';
    }
  }, []);

  return (
    <SafeAreaProvider>
      <AuthProvider>
        <AppNavigator />
        <StatusBar style="light" />
      </AuthProvider>
    </SafeAreaProvider>
  );
}

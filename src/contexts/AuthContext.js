/**
 * PetCare Mobile - Contexto de Autenticación
 */

import React, { createContext, useState, useEffect, useContext } from 'react';
import { getAuthToken, getUserData } from '../utils/storage';
import * as authService from '../services/authService';

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [sessionId, setSessionId] = useState(Date.now());

  // Verificar si hay una sesión guardada al iniciar
  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const token = await getAuthToken();
      const userData = await getUserData();

      if (token && userData) {
        setUser(userData);
        setIsAuthenticated(true);
        setSessionId(Date.now());

        // Verificar que el token siga siendo válido
        const result = await authService.getProfile();
        if (result.success) {
          setUser(result.data);
          await authService.saveSession(token, result.data);
        } else {
          // Token inválido, limpiar sesión
          await logout();
        }
      }
    } catch (error) {
      console.error('Error checking auth status:', error);
      await logout();
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (token, userData) => {
    try {
      await authService.saveSession(token, userData);
      setUser(userData);
      setIsAuthenticated(true);
      setSessionId(Date.now());
      return { success: true };
    } catch (error) {
      console.error('Error during login:', error);
      return { success: false, error: error.message };
    }
  };

  const logout = async () => {
    console.log('🚪 Logout iniciado...');
    try {
      // Limpiar sesión del storage
      await authService.clearSession();
      console.log('✅ Sesión limpiada del storage');

      // Actualizar estados de forma síncrona
      setIsAuthenticated(false);
      setUser(null);
      setSessionId(Date.now());
      console.log('✅ Estados actualizados: isAuthenticated=false, user=null');

      return { success: true };
    } catch (error) {
      console.error('❌ Error during logout:', error);

      // Incluso si hay error, limpiar estados locales
      setIsAuthenticated(false);
      setUser(null);
      setSessionId(Date.now());

      return { success: false, error: error.message };
    }
  };

  const updateUser = async (userData) => {
    try {
      const result = await authService.updateProfile(userData);
      if (result.success) {
        const updatedUser = result.data;
        setUser(updatedUser);
        const token = await getAuthToken();
        await authService.saveSession(token, updatedUser);
        return { success: true, data: updatedUser };
      }
      return result;
    } catch (error) {
      console.error('Error updating user:', error);
      return { success: false, error: error.message };
    }
  };

  const refreshProfile = async () => {
    try {
      const result = await authService.getProfile();
      if (result.success) {
        const updatedUser = result.data;
        setUser(updatedUser);
        const token = await getAuthToken();
        await authService.saveSession(token, updatedUser);
        return { success: true, data: updatedUser };
      }
      return result;
    } catch (error) {
      console.error('Error refreshing profile:', error);
      return { success: false, error: error.message };
    }
  };

  const value = {
    user,
    isLoading,
    isAuthenticated,
    sessionId,
    login,
    logout,
    updateUser,
    refreshProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;

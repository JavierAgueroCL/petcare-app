/**
 * PetCare Mobile - Pantalla de Escáner QR
 */

import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import { Camera } from 'expo-camera';
import { Ionicons } from '@expo/vector-icons';
import * as qrService from '../services/qrService';
import { COLORS, SPACING, FONTS } from '../constants/theme';

const QRScannerScreen = () => {
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  const handleBarCodeScanned = async ({ type, data }) => {
    setScanned(true);

    const result = await qrService.scanQR(data);

    if (result.success) {
      const pet = result.data.pet;
      Alert.alert(
        'Mascota Encontrada',
        `Nombre: ${pet.name}\nEspecie: ${pet.species}\nDueño: ${pet.Owner?.firstName || 'N/A'}`,
        [{ text: 'OK', onPress: () => setScanned(false) }]
      );
    } else {
      Alert.alert('Error', 'Código QR no válido', [
        { text: 'OK', onPress: () => setScanned(false) },
      ]);
    }
  };

  if (hasPermission === null) {
    return (
      <View style={styles.container}>
        <Text>Solicitando permiso de cámara...</Text>
      </View>
    );
  }

  if (hasPermission === false) {
    return (
      <View style={styles.container}>
        <Ionicons name="camera-off" size={64} color={COLORS.textDisabled} />
        <Text style={styles.message}>No hay acceso a la cámara</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Camera
        style={styles.camera}
        onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
        barCodeScannerSettings={{
          barCodeTypes: ['qr'],
        }}
      >
        <View style={styles.overlay}>
          <View style={styles.scanArea}>
            <View style={[styles.corner, styles.topLeft]} />
            <View style={[styles.corner, styles.topRight]} />
            <View style={[styles.corner, styles.bottomLeft]} />
            <View style={[styles.corner, styles.bottomRight]} />
          </View>
          <Text style={styles.instructionText}>
            Apunta la cámara al código QR de la mascota
          </Text>
        </View>
      </Camera>

      {scanned && (
        <TouchableOpacity
          style={styles.scanAgainButton}
          onPress={() => setScanned(false)}
        >
          <Text style={styles.scanAgainText}>Escanear Nuevamente</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  message: {
    fontSize: FONTS.sizes.lg,
    color: COLORS.textSecondary,
    marginTop: SPACING.lg,
  },
  camera: {
    flex: 1,
    width: '100%',
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  scanArea: {
    width: 250,
    height: 250,
    position: 'relative',
  },
  corner: {
    position: 'absolute',
    width: 40,
    height: 40,
    borderColor: COLORS.primary,
    borderWidth: 4,
  },
  topLeft: {
    top: 0,
    left: 0,
    borderRightWidth: 0,
    borderBottomWidth: 0,
  },
  topRight: {
    top: 0,
    right: 0,
    borderLeftWidth: 0,
    borderBottomWidth: 0,
  },
  bottomLeft: {
    bottom: 0,
    left: 0,
    borderRightWidth: 0,
    borderTopWidth: 0,
  },
  bottomRight: {
    bottom: 0,
    right: 0,
    borderLeftWidth: 0,
    borderTopWidth: 0,
  },
  instructionText: {
    color: COLORS.textWhite,
    fontSize: FONTS.sizes.md,
    textAlign: 'center',
    marginTop: SPACING.xl,
    paddingHorizontal: SPACING.xl,
  },
  scanAgainButton: {
    position: 'absolute',
    bottom: 50,
    backgroundColor: COLORS.primary,
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.xl,
    borderRadius: 25,
  },
  scanAgainText: {
    color: COLORS.textWhite,
    fontSize: FONTS.sizes.md,
    fontWeight: 'bold',
  },
});

export default QRScannerScreen;

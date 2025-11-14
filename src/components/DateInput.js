/**
 * DateInput - Componente de selección de fecha compatible con web y móvil
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
  TextInput,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { COLORS, SPACING, FONTS, BORDER_RADIUS } from '../constants/theme';

const DateInput = ({
  label,
  value,
  onChange,
  mode = 'date',
  minimumDate,
  maximumDate,
  placeholder = 'Seleccionar',
  error,
}) => {
  const [showPicker, setShowPicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [tempDateValue, setTempDateValue] = useState(null);
  const [tempValue, setTempValue] = useState('');

  const formatDate = (date) => {
    if (!date) return '';
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const formatTime = (date) => {
    if (!date) return '';
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
  };

  const formatDateTime = (date) => {
    if (!date) return '';
    return `${formatDate(date)} ${formatTime(date)}`;
  };

  const formatDisplay = (date) => {
    if (!date) return placeholder;
    if (mode === 'time') return formatTime(date);
    if (mode === 'datetime') return formatDateTime(date);
    return formatDate(date);
  };

  const handlePickerChange = (event, selectedDate) => {
    if (Platform.OS === 'android') {
      setShowPicker(false);

      // Para datetime en Android, necesitamos dos pasos
      if (mode === 'datetime' && selectedDate && event.type !== 'dismissed') {
        setTempDateValue(selectedDate);
        // Mostrar el selector de hora después de seleccionar la fecha
        setTimeout(() => setShowTimePicker(true), 100);
        return;
      }
    }

    if (selectedDate && event.type !== 'dismissed') {
      onChange(selectedDate);
    }
  };

  const handleTimePickerChange = (event, selectedTime) => {
    setShowTimePicker(false);

    if (selectedTime && event.type !== 'dismissed') {
      // Combinar la fecha guardada con la hora seleccionada
      const combinedDate = new Date(tempDateValue);
      combinedDate.setHours(selectedTime.getHours());
      combinedDate.setMinutes(selectedTime.getMinutes());
      onChange(combinedDate);
    }
    setTempDateValue(null);
  };

  const handleWebInputChange = (text) => {
    setTempValue(text);

    // Validar y convertir el input web
    if (mode === 'date' && text) {
      // Formato esperado: YYYY-MM-DD
      const date = new Date(text);
      if (!isNaN(date.getTime())) {
        onChange(date);
      }
    } else if (mode === 'time' && text) {
      // Formato esperado: HH:MM
      const [hours, minutes] = text.split(':');
      const date = new Date();
      date.setHours(parseInt(hours) || 0);
      date.setMinutes(parseInt(minutes) || 0);
      onChange(date);
    } else if (mode === 'datetime' && text) {
      // Formato esperado: YYYY-MM-DDTHH:MM
      const date = new Date(text);
      if (!isNaN(date.getTime())) {
        onChange(date);
      }
    }
  };

  const getWebInputType = () => {
    if (mode === 'time') return 'time';
    if (mode === 'datetime') return 'datetime-local';
    return 'date';
  };

  const getWebValue = () => {
    if (!value) return '';

    if (mode === 'time') {
      const hours = value.getHours().toString().padStart(2, '0');
      const minutes = value.getMinutes().toString().padStart(2, '0');
      return `${hours}:${minutes}`;
    }

    if (mode === 'datetime') {
      const year = value.getFullYear();
      const month = (value.getMonth() + 1).toString().padStart(2, '0');
      const day = value.getDate().toString().padStart(2, '0');
      const hours = value.getHours().toString().padStart(2, '0');
      const minutes = value.getMinutes().toString().padStart(2, '0');
      return `${year}-${month}-${day}T${hours}:${minutes}`;
    }

    // date
    const year = value.getFullYear();
    const month = (value.getMonth() + 1).toString().padStart(2, '0');
    const day = value.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  return (
    <View style={styles.container}>
      {label && <Text style={styles.label}>{label}</Text>}

      {Platform.OS === 'web' ? (
        // Input nativo HTML5 para web
        <TextInput
          style={[styles.webInput, error && styles.inputError]}
          type={getWebInputType()}
          value={getWebValue()}
          onChange={(e) => handleWebInputChange(e.target.value)}
          placeholder={placeholder}
        />
      ) : (
        // Botón táctil para móvil
        <>
          <TouchableOpacity
            style={[styles.button, error && styles.buttonError]}
            onPress={() => setShowPicker(true)}
          >
            <Ionicons
              name={
                mode === 'time'
                  ? 'time-outline'
                  : mode === 'datetime'
                  ? 'calendar-outline'
                  : 'calendar-outline'
              }
              size={20}
              color={value ? COLORS.primary : COLORS.textSecondary}
            />
            <Text style={[styles.buttonText, !value && styles.placeholderText]}>
              {formatDisplay(value)}
            </Text>
          </TouchableOpacity>

          {showPicker && (
            <DateTimePicker
              value={value || new Date()}
              mode={mode === 'datetime' && Platform.OS === 'android' ? 'date' : mode}
              display={Platform.OS === 'ios' ? 'spinner' : 'default'}
              onChange={handlePickerChange}
              minimumDate={minimumDate}
              maximumDate={maximumDate}
            />
          )}

          {showTimePicker && Platform.OS === 'android' && (
            <DateTimePicker
              value={tempDateValue || value || new Date()}
              mode="time"
              display="default"
              onChange={handleTimePickerChange}
            />
          )}
        </>
      )}

      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: SPACING.md,
  },

  label: {
    fontSize: FONTS.sizes.sm,
    fontWeight: FONTS.weights.medium,
    color: COLORS.text,
    marginBottom: SPACING.xs,
  },

  button: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
    minHeight: 50,
  },

  buttonError: {
    borderColor: COLORS.error,
  },

  buttonText: {
    fontSize: FONTS.sizes.md,
    color: COLORS.text,
    marginLeft: SPACING.sm,
    flex: 1,
  },

  placeholderText: {
    color: COLORS.textSecondary,
  },

  webInput: {
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
    fontSize: FONTS.sizes.md,
    color: COLORS.text,
    minHeight: 50,
    outlineStyle: 'none',
  },

  inputError: {
    borderColor: COLORS.error,
  },

  errorText: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.error,
    marginTop: SPACING.xs,
  },
});

export default DateInput;

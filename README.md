# PetCare Mobile App

Aplicación móvil React Native para la plataforma PetCare Chile.

## Características Implementadas

### Autenticación
- Login con JWT (autenticación local)
- Gestión de sesión con AsyncStorage
- Context API para estado global de autenticación

### Gestión de Mascotas
- Listar todas las mascotas del usuario
- Ver detalle de mascota
- Agregar nueva mascota
- Editar información de mascota
- Eliminar mascota
- Tarjetas visuales con información de mascotas

### Escáner QR
- Escanear códigos QR de mascotas
- Visualizar información de mascota escaneada
- Interfaz de cámara con overlay

### Perfil de Usuario
- Ver perfil propio
- Editar información de perfil
- Cerrar sesión

### Navegación
- Bottom Tab Navigator (Home, Mascotas, Escáner QR, Perfil)
- Stack Navigator para flujos internos
- Navegación fluida entre pantallas

## Estructura del Proyecto

```
app/
├── src/
│   ├── components/          # Componentes reutilizables
│   │   ├── Button.js
│   │   ├── Input.js
│   │   └── PetCard.js
│   ├── contexts/            # Contexts de React
│   │   └── AuthContext.js
│   ├── navigation/          # Configuración de navegación
│   │   └── AppNavigator.js
│   ├── screens/             # Pantallas de la app
│   │   ├── LoadingScreen.js
│   │   ├── LoginScreen.js
│   │   ├── HomeScreen.js
│   │   ├── PetsScreen.js
│   │   ├── PetDetailScreen.js
│   │   ├── AddPetScreen.js
│   │   ├── EditPetScreen.js
│   │   ├── QRScannerScreen.js
│   │   ├── ProfileScreen.js
│   │   └── EditProfileScreen.js
│   ├── services/            # Servicios de API
│   │   ├── api.js
│   │   ├── authService.js
│   │   ├── petService.js
│   │   ├── medicalService.js
│   │   └── qrService.js
│   ├── utils/               # Utilidades
│   │   └── storage.js
│   └── constants/           # Constantes y configuración
│       ├── config.js
│       └── theme.js
├── App.js                   # Punto de entrada
├── package.json
└── README.md
```

## Instalación y Configuración

### 1. Instalar dependencias

```bash
cd app
npm install
```

### 2. Configurar variables de entorno

```bash
cp .env.example .env
# Editar .env con la URL de tu backend
```

Variables disponibles en `.env`:

```env
# Ambiente: development, qa, staging, production
EXPO_PUBLIC_ENV=development

# URL del backend API
EXPO_PUBLIC_API_URL=http://localhost:3000/api

# Timeout para requests (ms)
EXPO_PUBLIC_API_TIMEOUT=30000
```

### 3. Iniciar la aplicación

```bash
# Desarrollo con Expo
npm start

# Android
npm run android

# iOS (requiere macOS)
npm run ios

# Web
npm run web
```

**IMPORTANTE**: Después de cambiar variables en `.env`, reinicia el bundler de Expo.

## Ambientes

La app soporta múltiples ambientes. Para cambiar entre ellos:

```bash
# Development (local)
cp .env .env.backup  # Backup opcional
cat .env            # Por defecto usa localhost

# QA
cp .env.qa .env

# Staging
cp .env.staging .env

# Production
cp .env.production .env
```

Luego reinicia Expo: `npm start`

### URLs por ambiente

- **Development**: `http://localhost:3000/api` o `http://10.0.2.2:3000/api` (Android emulator)
- **QA**: `https://api-qa.petcare.cl/api`
- **Staging**: `https://api-staging.petcare.cl/api`
- **Production**: `https://api.petcare.cl/api`

## Conexión con Backend

La URL del backend se lee desde la variable de entorno `EXPO_PUBLIC_API_URL` configurada en el archivo `.env`.

## Servicios de API Implementados

### AuthService
- `getProfile()` - Obtener perfil del usuario
- `updateProfile(data)` - Actualizar perfil
- `uploadProfileImage(imageUri)` - Subir foto de perfil

### PetService
- `getMyPets()` - Obtener todas las mascotas
- `getPetById(id)` - Obtener mascota por ID
- `createPet(data)` - Crear nueva mascota
- `updatePet(id, data)` - Actualizar mascota
- `deletePet(id)` - Eliminar mascota
- `uploadPetImage(id, imageUri)` - Subir imagen de mascota
- `uploadMultiplePetImages(id, imageUris)` - Subir múltiples imágenes
- `reportLostPet(id, data)` - Reportar mascota perdida
- `markPetAsFound(id)` - Marcar mascota como encontrada

### MedicalService
- `createMedicalRecord(petId, data)` - Crear registro médico
- `getMedicalRecord(id)` - Obtener registro médico
- `updateMedicalRecord(id, data)` - Actualizar registro
- `deleteMedicalRecord(id)` - Eliminar registro
- `createVaccine(petId, data)` - Crear vacuna
- `getUpcomingVaccines()` - Obtener próximas vacunas

### QRService
- `scanQR(code)` - Escanear código QR
- `regenerateQR(petId, reason)` - Regenerar código QR
- `getQRScans(petId)` - Obtener historial de escaneos

## Componentes Reutilizables

### Button
Botón customizado con múltiples variantes y estados.

```javascript
<Button
  title="Guardar"
  onPress={handleSave}
  variant="primary"
  size="medium"
  loading={loading}
/>
```

**Variantes:** `primary`, `secondary`, `outline`, `ghost`, `danger`
**Tamaños:** `small`, `medium`, `large`

### Input
Input de texto con label, iconos y validación.

```javascript
<Input
  label="Email"
  value={email}
  onChangeText={setEmail}
  placeholder="tu@email.com"
  leftIcon="mail-outline"
  error={emailError}
/>
```

### PetCard
Tarjeta visual para mostrar información de mascota.

```javascript
<PetCard
  pet={petData}
  onPress={() => handlePetPress(petData.id)}
/>
```

## Estado de Desarrollo

### Completado
- Estructura base del proyecto
- Sistema de navegación completo
- Autenticación JWT con backend
- CRUD completo de mascotas
- Escáner de códigos QR
- Gestión de perfil de usuario
- Conexión con backend API
- Componentes reutilizables
- Tema y estilos consistentes
- Configuración por ambientes

### Pendiente
- Carga de imágenes (ImagePicker)
- Notificaciones push
- Recordatorios de vacunas
- Historial médico detallado
- Compartir perfiles de mascotas
- Modo offline con sincronización
- Tests unitarios e integración

## Tecnologías Utilizadas

- **React Native** - Framework móvil
- **Expo** - Plataforma de desarrollo
- **React Navigation** - Navegación
- **Axios** - Cliente HTTP
- **AsyncStorage** - Almacenamiento local
- **Expo Camera** - Escáner QR
- **JWT** - Autenticación con backend

## Notas de Desarrollo

1. **Variables de entorno**: La app usa `EXPO_PUBLIC_*` para variables accesibles en el código. Reinicia el bundler después de cambios en `.env`.

2. **Imágenes**: El ImagePicker está preparado en los servicios pero requiere implementación en las pantallas.

3. **Android Emulator**: Si usas emulador Android, usa `http://10.0.2.2:3000/api` en lugar de `localhost`:
   ```env
   EXPO_PUBLIC_API_URL=http://10.0.2.2:3000/api
   ```

4. **iOS Simulator**: `localhost` funciona correctamente en simulador iOS.

5. **Dispositivo físico**: Usa la IP de tu computadora:
   ```env
   EXPO_PUBLIC_API_URL=http://192.168.1.X:3000/api
   ```

6. **Permisos**: La app solicita permisos de cámara automáticamente para el escáner QR.

## Comandos Útiles

```bash
# Limpiar caché de Expo
npm start -- --clear

# Ver logs en tiempo real
npx react-native log-android
npx react-native log-ios

# Construir APK (requiere configuración adicional)
expo build:android

# Construir IPA (requiere macOS y configuración)
expo build:ios
```

## Soporte

Para problemas o preguntas sobre el desarrollo:
- Revisar documentación de Expo: https://docs.expo.dev/
- Revisar documentación de React Navigation: https://reactnavigation.org/

---

Desarrollado con dedicación para PetCare Chile 🐾

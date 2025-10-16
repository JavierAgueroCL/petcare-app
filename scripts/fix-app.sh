#!/bin/bash

# Script para diagnosticar y reparar la App PetCare
# Ejecutar: bash app/scripts/fix-app.sh

set -e

echo "========================================="
echo "PetCare App - Diagnostico y Reparacion"
echo "========================================="
echo ""

# Cambiar al directorio de la app
cd "$(dirname "$0")/.."

# 1. Verificar directorio
echo "1. Directorio actual:"
pwd
echo ""

# 2. Actualizar código
echo "2. Actualizando codigo desde Git..."
git pull
echo ""

# 3. Ver procesos de Node corriendo
echo "3. Procesos de Node.js corriendo:"
ps aux | grep "npm run start" | grep -v grep || echo "No hay procesos de npm run start corriendo"
echo ""

# 4. Detener procesos anteriores
echo "4. Deteniendo procesos anteriores..."

# Detener pm2 si está corriendo
if command -v pm2 &> /dev/null; then
    pm2 stop petcare-app 2>/dev/null || true
    pm2 delete petcare-app 2>/dev/null || true
fi

# Matar procesos de npm start
pkill -f "npm run start" || echo "No habia procesos de npm para detener"

sleep 2
echo ""

# 5. Verificar dependencias
echo "5. Verificando dependencias..."
if [ ! -d node_modules ]; then
    echo "Instalando dependencias..."
    npm install
else
    echo "node_modules existe"
    echo "Actualizando dependencias si es necesario..."
    npm install
fi
echo ""

# 6. Verificar package.json
echo "6. Verificando package.json..."
if [ ! -f package.json ]; then
    echo "ERROR: package.json no existe"
    exit 1
fi
echo "package.json encontrado"
echo ""

# 7. Iniciar app
echo "7. Iniciando app..."
echo ""

# Detectar si pm2 está disponible
if command -v pm2 &> /dev/null; then
    echo "pm2 detectado - usando pm2 para gestionar el proceso"
    pm2 start npm --name petcare-app -- run start
    pm2 save
    echo ""
    echo "App iniciada con pm2"
    echo "Para ver logs: pm2 logs petcare-app"
    echo "Para reiniciar: pm2 restart petcare-app"
    echo "Para detener: pm2 stop petcare-app"
    sleep 3
    SERVER_PID=$(pm2 pid petcare-app 2>/dev/null | head -n1)
else
    echo "pm2 no detectado - usando npm directamente"
    echo "RECOMENDACION: Instala pm2 para mejor gestion del proceso:"
    echo "  npm install -g pm2"
    echo ""
    echo "Ejecutando: npm run start"
    npm run start &
    SERVER_PID=$!
    echo "App iniciada con PID: $SERVER_PID"
    sleep 3
fi
echo ""

# 8. Verificar que el proceso esté corriendo
echo "8. Verificando app..."
if command -v pm2 &> /dev/null; then
    pm2 list | grep petcare-app
    echo ""
    echo "App esta corriendo con pm2"
else
    if [ ! -z "$SERVER_PID" ] && ps -p $SERVER_PID > /dev/null 2>&1; then
        echo "App esta corriendo (PID: $SERVER_PID)"
    else
        echo "ERROR: La app no esta corriendo"
        exit 1
    fi
fi
echo ""

echo "========================================="
echo "Diagnostico completado"
echo "========================================="
echo ""

if command -v pm2 &> /dev/null; then
    echo "App corriendo con pm2"
    echo ""
    echo "Comandos utiles de pm2:"
    echo "  pm2 list                 - Ver todos los procesos"
    echo "  pm2 logs petcare-app     - Ver logs en tiempo real"
    echo "  pm2 restart petcare-app  - Reiniciar app"
    echo "  pm2 stop petcare-app     - Detener app"
    echo "  pm2 monit                - Monitor en tiempo real"
    echo ""
else
    echo "App corriendo con npm (PID: $SERVER_PID)"
    echo ""
    echo "Para detener la app:"
    echo "  kill $SERVER_PID"
    echo ""
    echo "ADVERTENCIA: El proceso se detendra si cierras la terminal."
    echo ""
    echo "Para gestion de procesos en produccion, instala pm2:"
    echo "  npm install -g pm2"
    echo "  Luego ejecuta de nuevo este script"
fi
echo ""

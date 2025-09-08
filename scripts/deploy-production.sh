#!/bin/bash

# Script para deploy a producción
set -e

echo "🚀 Iniciando deploy a producción..."

# Variables
PRODUCTION_BRANCH="main"
SANDBOX_BRANCH="sandbox"

# Verificar que estamos en la rama correcta
CURRENT_BRANCH=$(git branch --show-current)
if [ "$CURRENT_BRANCH" != "$PRODUCTION_BRANCH" ]; then
  echo "❌ Debes estar en la rama $PRODUCTION_BRANCH para hacer deploy a producción"
  echo "🔄 Cambiando a la rama de producción..."
  git checkout $PRODUCTION_BRANCH
fi

# Verificar que no hay cambios sin commitear
if [ -n "$(git status --porcelain)" ]; then
  echo "❌ Hay cambios sin commitear. Por favor, haz commit de todos los cambios antes de continuar."
  git status
  exit 1
fi

# Hacer pull de los últimos cambios
echo "📥 Obteniendo últimos cambios..."
git pull origin $PRODUCTION_BRANCH

# Verificar que el build funciona
echo "🔨 Verificando build..."
npm run build

if [ $? -eq 0 ]; then
  echo "✅ Build exitoso"
else
  echo "❌ Build fallido. Revisa los errores antes de continuar."
  exit 1
fi

# Hacer push a producción
echo "🚀 Haciendo push a producción..."
git push origin $PRODUCTION_BRANCH

if [ $? -eq 0 ]; then
  echo "✅ Push a producción exitoso"
else
  echo "❌ Error en el push a producción"
  exit 1
fi

# Verificar que Amplify está desplegando
echo "⏳ Esperando que Amplify procese el deploy..."
echo "🔗 Puedes monitorear el progreso en:"
echo "   https://console.aws.amazon.com/amplify/home?region=us-east-1"

# Esperar un poco para que Amplify inicie el deploy
sleep 10

# Verificar el estado del deploy
echo "🔍 Verificando estado del deploy..."
if command -v aws > /dev/null 2>&1; then
  # Obtener información de la app de Amplify
  APP_ID=$(aws amplify list-apps --query 'apps[?name==`OnPointAdmin`].appId' --output text 2>/dev/null || echo "")
  
  if [ -n "$APP_ID" ]; then
    echo "📱 App ID: $APP_ID"
    echo "🔗 URL de producción: https://main.d3ts6pwgn7uyyh.amplifyapp.com"
  else
    echo "⚠️  No se pudo obtener información de la app de Amplify"
  fi
else
  echo "⚠️  AWS CLI no disponible para verificar el estado"
fi

echo ""
echo "🎉 ¡Deploy a producción iniciado!"
echo ""
echo "📋 Información importante:"
echo "  - Rama: $PRODUCTION_BRANCH"
echo "  - URL de producción: https://main.d3ts6pwgn7uyyh.amplifyapp.com"
echo "  - URL de sandbox: https://sandbox.d3ts6pwgn7uyyh.amplifyapp.com"
echo ""
echo "⏳ El deploy puede tomar varios minutos. Monitorea el progreso en la consola de AWS Amplify."
echo ""
echo "🔐 CREDENCIALES DE PRODUCCIÓN:"
echo "  Admin: admin@onpoint.com"
echo "  Ejecutivo: ejecutivo@onpoint.com"
echo "  Contraseña: OnPoint2024!"
echo ""
echo "⚠️  IMPORTANTE: Cambiar las contraseñas por defecto en producción!"

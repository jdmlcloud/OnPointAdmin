#!/bin/bash

# Script para preparar el entorno de producción
set -e

echo "🚀 Preparando entorno de producción..."

# Variables
PRODUCTION_BRANCH="main"
CURRENT_BRANCH=$(git branch --show-current)

echo "📋 Información del entorno:"
echo "  - Rama actual: $CURRENT_BRANCH"
echo "  - Rama de producción: $PRODUCTION_BRANCH"

# Verificar que estamos en la rama correcta
if [ "$CURRENT_BRANCH" != "$PRODUCTION_BRANCH" ]; then
  echo "⚠️  No estás en la rama de producción ($PRODUCTION_BRANCH)"
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
echo "📥 Obteniendo últimos cambios de la rama de producción..."
git pull origin $PRODUCTION_BRANCH

# Verificar que el build funciona
echo "🔨 Verificando que el build funciona..."
npm run build

if [ $? -eq 0 ]; then
  echo "✅ Build exitoso"
else
  echo "❌ Build falló. Revisa los errores antes de continuar."
  exit 1
fi

# Verificar variables de entorno
echo "🔍 Verificando configuración de producción..."

# Verificar que existe el archivo de configuración
if [ ! -f "scripts/cognito-config.env" ]; then
  echo "⚠️  Archivo de configuración de Cognito no encontrado"
  echo "📝 Creando archivo de configuración..."
  cp scripts/cognito-config.env.example scripts/cognito-config.env
  echo "✅ Archivo creado. Edita scripts/cognito-config.env con los valores de producción"
fi

# Verificar configuración de AWS
echo "🔍 Verificando configuración de AWS..."
if ! aws sts get-caller-identity > /dev/null 2>&1; then
  echo "⚠️  AWS CLI no configurado o credenciales inválidas"
  echo "📝 Configura AWS CLI antes de continuar:"
  echo "   aws configure"
  exit 1
fi

echo "✅ Configuración de AWS verificada"

# Verificar que los servicios están funcionando
echo "🔍 Verificando servicios de AWS..."

# Verificar Cognito
echo "  - Verificando Cognito..."
if aws cognito-idp list-user-pools --max-results 1 > /dev/null 2>&1; then
  echo "    ✅ Cognito funcionando"
else
  echo "    ❌ Error con Cognito"
  exit 1
fi

# Verificar DynamoDB
echo "  - Verificando DynamoDB..."
if aws dynamodb list-tables > /dev/null 2>&1; then
  echo "    ✅ DynamoDB funcionando"
else
  echo "    ❌ Error con DynamoDB"
  exit 1
fi

# Verificar Lambda
echo "  - Verificando Lambda..."
if aws lambda list-functions --max-items 1 > /dev/null 2>&1; then
  echo "    ✅ Lambda funcionando"
else
  echo "    ❌ Error con Lambda"
  exit 1
fi

# Verificar API Gateway
echo "  - Verificando API Gateway..."
if aws apigateway get-rest-apis --limit 1 > /dev/null 2>&1; then
  echo "    ✅ API Gateway funcionando"
else
  echo "    ❌ Error con API Gateway"
  exit 1
fi

echo ""
echo "🎉 ¡Entorno de producción listo!"
echo ""
echo "📋 Próximos pasos:"
echo "  1. Verificar que todas las variables de entorno estén configuradas"
echo "  2. Probar la aplicación en el entorno de sandbox"
echo "  3. Hacer deploy a producción cuando esté listo"
echo ""
echo "🔗 URLs importantes:"
echo "  - Sandbox: https://sandbox.d3ts6pwgn7uyyh.amplifyapp.com"
echo "  - API Gateway: https://7z4skk6jy0.execute-api.us-east-1.amazonaws.com/prod"
echo ""
echo "⚠️  IMPORTANTE: Cambiar contraseñas por defecto en producción!"

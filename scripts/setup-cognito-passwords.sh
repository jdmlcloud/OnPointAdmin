#!/bin/bash

# Script para configurar contraseñas de usuarios en Cognito
set -e

echo "🔐 Configurando contraseñas de usuarios en Cognito..."

# Cargar configuración desde archivo .env
if [ -f "scripts/cognito-config.env" ]; then
    echo "📋 Cargando configuración desde cognito-config.env..."
    source scripts/cognito-config.env
else
    echo "⚠️  Archivo cognito-config.env no encontrado"
    echo "📝 Creando archivo de configuración..."
    
    # Crear archivo de configuración con valores por defecto
    cat > scripts/cognito-config.env << EOF
# Configuración de AWS Cognito
COGNITO_USER_POOL_ID=us-east-1_pnE1wndnB
COGNITO_CLIENT_ID=76ho4o7fqhh3vdsiqqq269jjt5
DEFAULT_PASSWORD=OnPoint2024!
ADMIN_EMAIL=admin@onpoint.com
EJECUTIVO_EMAIL=ejecutivo@onpoint.com
EOF
    
    echo "✅ Archivo creado. Edita scripts/cognito-config.env si necesitas cambiar valores"
    source scripts/cognito-config.env
fi

# Variables desde el archivo de configuración
USER_POOL_ID="$COGNITO_USER_POOL_ID"
ADMIN_EMAIL="$ADMIN_EMAIL"
EJECUTIVO_EMAIL="$EJECUTIVO_EMAIL"
DEFAULT_PASSWORD="$DEFAULT_PASSWORD"

echo "📋 Configurando contraseñas para usuarios:"
echo "  - Admin: $ADMIN_EMAIL"
echo "  - Ejecutivo: $EJECUTIVO_EMAIL"
echo "  - Contraseña temporal: $DEFAULT_PASSWORD"

# Configurar contraseña para admin
echo "🔧 Configurando contraseña para admin..."
aws cognito-idp admin-set-user-password \
    --user-pool-id $USER_POOL_ID \
    --username $ADMIN_EMAIL \
    --password $DEFAULT_PASSWORD \
    --permanent

# Configurar contraseña para ejecutivo
echo "🔧 Configurando contraseña para ejecutivo..."
aws cognito-idp admin-set-user-password \
    --user-pool-id $USER_POOL_ID \
    --username $EJECUTIVO_EMAIL \
    --password $DEFAULT_PASSWORD \
    --permanent

echo "✅ Contraseñas configuradas exitosamente!"
echo ""
echo "🔑 Credenciales de acceso:"
echo "  Admin:"
echo "    Email: $ADMIN_EMAIL"
echo "    Contraseña: $DEFAULT_PASSWORD"
echo ""
echo "  Ejecutivo:"
echo "    Email: $EJECUTIVO_EMAIL"
echo "    Contraseña: $DEFAULT_PASSWORD"
echo ""
echo "⚠️  IMPORTANTE: Cambiar estas contraseñas en producción!"
echo "🌐 URL de login: https://sandbox.d3ts6pwgn7uyyh.amplifyapp.com/auth/signin"

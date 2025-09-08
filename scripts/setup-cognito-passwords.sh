#!/bin/bash

# Script para configurar contraseñas de usuarios en Cognito
set -e

echo "🔐 Configurando contraseñas de usuarios en Cognito..."

# Variables
USER_POOL_ID="us-east-1_pnE1wndnB"
ADMIN_EMAIL="admin@onpoint.com"
EJECUTIVO_EMAIL="ejecutivo@onpoint.com"
DEFAULT_PASSWORD="OnPoint2024!"

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

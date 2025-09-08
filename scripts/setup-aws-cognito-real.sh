#!/bin/bash

# Script para configurar AWS Cognito real
echo "🔐 Configurando AWS Cognito Real para OnPoint Admin"
echo "=================================================="

# Verificar si AWS CLI está instalado
if ! command -v aws &> /dev/null; then
    echo "❌ AWS CLI no está instalado. Por favor instálalo primero:"
    echo "   https://docs.aws.amazon.com/cli/latest/userguide/getting-started-install.html"
    exit 1
fi

# Verificar configuración de AWS CLI
echo "🔍 Verificando configuración de AWS CLI..."
aws sts get-caller-identity > /dev/null 2>&1
if [ $? -ne 0 ]; then
    echo "❌ AWS CLI no está configurado correctamente."
    echo "   Ejecuta: aws configure"
    echo "   Y proporciona tus credenciales AWS"
    exit 1
fi

echo "✅ AWS CLI configurado correctamente"

# Obtener información de la cuenta
echo "📋 Obteniendo información de la cuenta AWS..."
ACCOUNT_ID=$(aws sts get-caller-identity --query Account --output text)
REGION=$(aws configure get region)
echo "   Account ID: $ACCOUNT_ID"
echo "   Region: $REGION"

# Verificar que el User Pool existe
USER_POOL_ID="us-east-1_pnE1wndnB"
echo "🔍 Verificando User Pool: $USER_POOL_ID"
aws cognito-idp describe-user-pool --user-pool-id $USER_POOL_ID > /dev/null 2>&1
if [ $? -ne 0 ]; then
    echo "❌ User Pool $USER_POOL_ID no existe o no tienes permisos para accederlo."
    echo "   Verifica que el User Pool existe en tu cuenta AWS."
    exit 1
fi

echo "✅ User Pool encontrado"

# Obtener información del User Pool
echo "📋 Obteniendo información del User Pool..."
USER_POOL_INFO=$(aws cognito-idp describe-user-pool --user-pool-id $USER_POOL_ID)
USER_POOL_NAME=$(echo $USER_POOL_INFO | jq -r '.UserPool.Name')
echo "   User Pool Name: $USER_POOL_NAME"

# Verificar que el App Client existe
CLIENT_ID="76ho4o7fqhh3vdsiqqq269jjt5"
echo "🔍 Verificando App Client: $CLIENT_ID"
aws cognito-idp describe-user-pool-client --user-pool-id $USER_POOL_ID --client-id $CLIENT_ID > /dev/null 2>&1
if [ $? -ne 0 ]; then
    echo "❌ App Client $CLIENT_ID no existe o no tienes permisos para accederlo."
    exit 1
fi

echo "✅ App Client encontrado"

# Obtener credenciales AWS
echo "🔑 Obteniendo credenciales AWS..."
ACCESS_KEY_ID=$(aws configure get aws_access_key_id)
SECRET_ACCESS_KEY=$(aws configure get aws_secret_access_key)

if [ -z "$ACCESS_KEY_ID" ] || [ -z "$SECRET_ACCESS_KEY" ]; then
    echo "❌ No se pudieron obtener las credenciales AWS."
    exit 1
fi

echo "✅ Credenciales AWS obtenidas"

# Crear archivo .env.local
echo "📝 Creando archivo .env.local..."
cat > .env.local << EOF
# AWS Configuration
AWS_REGION=$REGION
AWS_ACCESS_KEY_ID=$ACCESS_KEY_ID
AWS_SECRET_ACCESS_KEY=$SECRET_ACCESS_KEY

# AWS Cognito Configuration
AWS_COGNITO_USER_POOL_ID=$USER_POOL_ID
AWS_COGNITO_CLIENT_ID=$CLIENT_ID

# Public AWS Configuration (accessible in browser)
NEXT_PUBLIC_AWS_REGION=$REGION
NEXT_PUBLIC_AWS_COGNITO_USER_POOL_ID=$USER_POOL_ID
NEXT_PUBLIC_AWS_COGNITO_CLIENT_ID=$CLIENT_ID
NEXT_PUBLIC_AWS_ACCESS_KEY_ID=$ACCESS_KEY_ID
NEXT_PUBLIC_AWS_SECRET_ACCESS_KEY=$SECRET_ACCESS_KEY

# NextAuth Configuration
NEXTAUTH_URL=https://sandbox.d3ts6pwgn7uyyh.amplifyapp.com
NEXTAUTH_SECRET=dev-secret-key-for-development-only-not-for-production

# Database Configuration
DYNAMODB_REGION=$REGION
DYNAMODB_TABLE_PREFIX=onpoint

# S3 Configuration
S3_BUCKET_NAME=onpoint-storage
S3_REGION=$REGION
CLOUDFRONT_DOMAIN=

# AI Services
OPENAI_API_KEY=
ANTHROPIC_API_KEY=

# AWS AI Services
AWS_BEDROCK_REGION=$REGION
AWS_BEDROCK_MODEL_ID=anthropic.claude-3-5-sonnet-20241022-v2:0

# WhatsApp Business API
WHATSAPP_ACCESS_TOKEN=
WHATSAPP_PHONE_NUMBER_ID=
WHATSAPP_WEBHOOK_VERIFY_TOKEN=

# Email Service
RESEND_API_KEY=

# Environment
NODE_ENV=development
EOF

echo "✅ Archivo .env.local creado"

# Verificar usuarios existentes
echo "👥 Verificando usuarios existentes en el User Pool..."
USERS=$(aws cognito-idp list-users --user-pool-id $USER_POOL_ID --query 'Users[].Username' --output text)
if [ -n "$USERS" ]; then
    echo "   Usuarios encontrados:"
    for user in $USERS; do
        echo "   - $user"
    done
else
    echo "   ⚠️  No se encontraron usuarios en el User Pool."
    echo "   Puedes crear usuarios usando el script setup-cognito.sh"
fi

echo ""
echo "🎉 Configuración de AWS Cognito Real completada!"
echo "=================================================="
echo ""
echo "📋 Información de configuración:"
echo "   User Pool ID: $USER_POOL_ID"
echo "   Client ID: $CLIENT_ID"
echo "   Region: $REGION"
echo "   Account ID: $ACCOUNT_ID"
echo ""
echo "🚀 Próximos pasos:"
echo "   1. Ejecuta: npm run dev"
echo "   2. Ve a: https://sandbox.d3ts6pwgn7uyyh.amplifyapp.com/auth/cognito-real"
echo "   3. Usa las credenciales de los usuarios existentes"
echo ""
echo "⚠️  IMPORTANTE:"
echo "   - Las credenciales AWS están en .env.local (NO subir a Git)"
echo "   - Este es un entorno de desarrollo"
echo "   - Para producción, usa IAM roles en lugar de credenciales"
echo ""
echo "🔐 URLs de prueba:"
echo "   - Login real: https://sandbox.d3ts6pwgn7uyyh.amplifyapp.com/auth/cognito-real"
echo "   - Dashboard real: https://sandbox.d3ts6pwgn7uyyh.amplifyapp.com/cognito-dashboard-real"
echo "   - Login simulación: https://sandbox.d3ts6pwgn7uyyh.amplifyapp.com/auth/cognito-direct"
echo "   - Dashboard simulación: https://sandbox.d3ts6pwgn7uyyh.amplifyapp.com/cognito-dashboard-direct"

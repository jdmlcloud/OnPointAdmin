#!/bin/bash

# Script de configuración para entorno de desarrollo
# OnPoint Admin - Plataforma de Ventas B2B con IA

echo "🚀 Configurando entorno de desarrollo para OnPoint Admin..."

# Verificar Node.js
if ! command -v node &> /dev/null; then
    echo "❌ Node.js no está instalado. Por favor instala Node.js 18+ desde https://nodejs.org"
    exit 1
fi

NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo "❌ Node.js versión $NODE_VERSION detectada. Se requiere Node.js 18+"
    exit 1
fi

echo "✅ Node.js $(node -v) detectado"

# Verificar npm
if ! command -v npm &> /dev/null; then
    echo "❌ npm no está instalado"
    exit 1
fi

echo "✅ npm $(npm -v) detectado"

# Crear archivo .env.local si no existe
if [ ! -f ".env.local" ]; then
    echo "📝 Creando archivo .env.local..."
    cat > .env.local << EOF
# Database
DYNAMODB_REGION=us-east-1
DYNAMODB_TABLE_PREFIX=onpoint

# AWS Configuration
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=your_access_key_here
AWS_SECRET_ACCESS_KEY=your_secret_key_here

# S3 Configuration
S3_BUCKET_NAME=onpoint-storage
S3_REGION=us-east-1
CLOUDFRONT_DOMAIN=your_cloudfront_domain

# Authentication
NEXTAUTH_URL=https://sandbox.d3ts6pwgn7uyyh.amplifyapp.com
NEXTAUTH_SECRET=your_nextauth_secret_here
COGNITO_CLIENT_ID=your_cognito_client_id
COGNITO_CLIENT_SECRET=your_cognito_client_secret
COGNITO_ISSUER=https://cognito-idp.us-east-1.amazonaws.com/your_user_pool_id

# AI Services
OPENAI_API_KEY=your_openai_api_key
ANTHROPIC_API_KEY=your_anthropic_api_key

# WhatsApp Business API
WHATSAPP_ACCESS_TOKEN=your_whatsapp_access_token
WHATSAPP_PHONE_NUMBER_ID=your_phone_number_id
WHATSAPP_WEBHOOK_VERIFY_TOKEN=your_webhook_verify_token

# Email Service
RESEND_API_KEY=your_resend_api_key

# Environment
NODE_ENV=development
EOF
    echo "✅ Archivo .env.local creado"
    echo "⚠️  IMPORTANTE: Edita .env.local con tus credenciales reales"
else
    echo "✅ Archivo .env.local ya existe"
fi

# Instalar dependencias
echo "📦 Instalando dependencias..."
npm install

if [ $? -eq 0 ]; then
    echo "✅ Dependencias instaladas correctamente"
else
    echo "❌ Error instalando dependencias"
    exit 1
fi

# Verificar TypeScript
echo "🔍 Verificando configuración de TypeScript..."
npm run type-check

if [ $? -eq 0 ]; then
    echo "✅ TypeScript configurado correctamente"
else
    echo "⚠️  Advertencias de TypeScript detectadas (esto es normal en desarrollo)"
fi

echo ""
echo "🎉 ¡Configuración completada!"
echo ""
echo "📋 Próximos pasos:"
echo "1. Edita .env.local con tus credenciales AWS, OpenAI, etc."
echo "2. Configura tu base de datos DynamoDB"
echo "3. Ejecuta 'npm run dev' para iniciar el servidor de desarrollo"
echo ""
echo "🌐 La aplicación estará disponible en: https://sandbox.d3ts6pwgn7uyyh.amplifyapp.com"
echo ""
echo "📚 Documentación: README.md"
echo "🔧 Scripts disponibles:"
echo "   npm run dev      - Servidor de desarrollo"
echo "   npm run build    - Build de producción"
echo "   npm run lint     - Linter"
echo "   npm run type-check - Verificación de tipos"
echo ""

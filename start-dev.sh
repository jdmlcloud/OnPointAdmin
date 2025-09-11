#!/bin/bash

# Configurar variables de entorno AWS
# NOTA: Configura estas variables en tu sistema antes de ejecutar este script
# export AWS_ACCESS_KEY_ID=your-access-key-id
# export AWS_SECRET_ACCESS_KEY=your-secret-access-key
# export AWS_REGION=us-east-1

# Verificar que las credenciales estén configuradas
if [ -z "$AWS_ACCESS_KEY_ID" ]; then
    echo "❌ Error: AWS_ACCESS_KEY_ID no está configurado"
    echo "Por favor configura las variables de entorno AWS antes de ejecutar este script"
    exit 1
fi

# Configurar variables de DynamoDB
export USERS_TABLE=OnPointAdmin-Users-sandbox
export VERIFICATION_TOKENS_TABLE=OnPointAdmin-VerificationTokens-sandbox
export SESSIONS_TABLE=OnPointAdmin-Sessions-sandbox
export TWO_FA_CODES_TABLE=OnPointAdmin-TwoFACodes-sandbox

# Configurar variables de Cognito
export COGNITO_USER_POOL_ID=us-east-1_pnE1wndnB
export COGNITO_CLIENT_ID=76ho4o7fqhh3vdsiqqq269jjt5

# Configurar otras variables
export JWT_SECRET=onpoint-admin-jwt-secret-key-2024
export APP_URL=http://localhost:3000

echo "🚀 Iniciando servidor de desarrollo con variables AWS configuradas..."
echo "AWS_ACCESS_KEY_ID: $AWS_ACCESS_KEY_ID"
echo "AWS_REGION: $AWS_REGION"
echo "USERS_TABLE: $USERS_TABLE"

# Iniciar servidor
npm run dev

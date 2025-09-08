#!/bin/bash

# 🚀 Script de Configuración AWS Cognito para OnPoint Admin
# Este script configura AWS Cognito paso a paso

set -e  # Salir si hay algún error

echo "🔐 Configurando AWS Cognito para OnPoint Admin"
echo "=============================================="

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Función para imprimir mensajes
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Verificar si AWS CLI está instalado
if ! command -v aws &> /dev/null; then
    print_error "AWS CLI no está instalado. Instálalo primero:"
    echo "  brew install awscli"
    exit 1
fi

print_success "AWS CLI está instalado: $(aws --version)"

# Verificar configuración de AWS
print_status "Verificando configuración de AWS..."
if ! aws sts get-caller-identity &> /dev/null; then
    print_warning "AWS CLI no está configurado. Necesitas configurar tus credenciales:"
    echo ""
    echo "1. Ve a AWS Console → IAM → Users → Tu Usuario → Security Credentials"
    echo "2. Crea un Access Key"
    echo "3. Ejecuta: aws configure"
    echo ""
    echo "Datos necesarios:"
    echo "  - AWS Access Key ID"
    echo "  - AWS Secret Access Key"
    echo "  - Default region: us-east-1 (recomendado)"
    echo "  - Default output format: json"
    echo ""
    read -p "¿Ya configuraste AWS CLI? (y/n): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        print_error "Configura AWS CLI primero y vuelve a ejecutar este script"
        exit 1
    fi
fi

# Verificar configuración
print_status "Verificando credenciales de AWS..."
AWS_ACCOUNT_ID=$(aws sts get-caller-identity --query Account --output text)
AWS_REGION=$(aws configure get region)

if [ -z "$AWS_REGION" ]; then
    AWS_REGION="us-east-1"
    print_warning "Región no configurada, usando: $AWS_REGION"
fi

print_success "AWS configurado correctamente"
print_status "Account ID: $AWS_ACCOUNT_ID"
print_status "Región: $AWS_REGION"

# Crear User Pool
print_status "Creando User Pool en AWS Cognito..."

USER_POOL_NAME="OnPointAdmin-Users"
USER_POOL_ID=$(aws cognito-idp create-user-pool \
    --pool-name "$USER_POOL_NAME" \
    --policies '{
        "PasswordPolicy": {
            "MinimumLength": 8,
            "RequireUppercase": true,
            "RequireLowercase": true,
            "RequireNumbers": true,
            "RequireSymbols": true
        }
    }' \
    --username-attributes email \
    --auto-verified-attributes email \
    --schema '[
        {
            "Name": "email",
            "AttributeDataType": "String",
            "Required": true,
            "Mutable": true
        },
        {
            "Name": "name",
            "AttributeDataType": "String",
            "Required": true,
            "Mutable": true
        },
        {
            "Name": "role",
            "AttributeDataType": "String",
            "Required": true,
            "Mutable": true
        }
    ]' \
    --query 'UserPool.Id' \
    --output text)

print_success "User Pool creado: $USER_POOL_ID"

# Crear App Client
print_status "Creando App Client..."

CLIENT_NAME="OnPointAdmin-WebApp"
CLIENT_ID=$(aws cognito-idp create-user-pool-client \
    --user-pool-id "$USER_POOL_ID" \
    --client-name "$CLIENT_NAME" \
    --generate-secret \
    --explicit-auth-flows USER_PASSWORD_AUTH ALLOW_USER_SRP_AUTH \
    --supported-identity-providers COGNITO \
    --callback-urls "https://sandbox.d3ts6pwgn7uyyh.amplifyapp.com/auth/callback" \
    --logout-urls "https://sandbox.d3ts6pwgn7uyyh.amplifyapp.com/auth/signin" \
    --allowed-o-auth-flows implicit code \
    --allowed-o-auth-scopes email openid profile \
    --allowed-o-auth-flows-user-pool-client \
    --query 'UserPoolClient.ClientId' \
    --output text)

print_success "App Client creado: $CLIENT_ID"

# Obtener Client Secret
print_status "Obteniendo Client Secret..."
CLIENT_SECRET=$(aws cognito-idp describe-user-pool-client \
    --user-pool-id "$USER_POOL_ID" \
    --client-id "$CLIENT_ID" \
    --query 'UserPoolClient.ClientSecret' \
    --output text)

print_success "Client Secret obtenido"

# Crear usuario admin
print_status "Creando usuario administrador..."

aws cognito-idp admin-create-user \
    --user-pool-id "$USER_POOL_ID" \
    --username "admin@onpoint.com" \
    --user-attributes Name=email,Value=admin@onpoint.com Name=name,Value="Admin User" Name=role,Value=admin \
    --temporary-password "TempPass123!" \
    --message-action SUPPRESS

aws cognito-idp admin-set-user-password \
    --user-pool-id "$USER_POOL_ID" \
    --username "admin@onpoint.com" \
    --password "Admin123!" \
    --permanent

print_success "Usuario admin creado: admin@onpoint.com"

# Crear usuario ejecutivo
print_status "Creando usuario ejecutivo..."

aws cognito-idp admin-create-user \
    --user-pool-id "$USER_POOL_ID" \
    --username "ejecutivo@onpoint.com" \
    --user-attributes Name=email,Value=ejecutivo@onpoint.com Name=name,Value="Ejecutivo User" Name=role,Value=ejecutivo \
    --temporary-password "TempPass123!" \
    --message-action SUPPRESS

aws cognito-idp admin-set-user-password \
    --user-pool-id "$USER_POOL_ID" \
    --username "ejecutivo@onpoint.com" \
    --password "Ejecutivo123!" \
    --permanent

print_success "Usuario ejecutivo creado: ejecutivo@onpoint.com"

# Crear archivo .env.local
print_status "Creando archivo .env.local..."

cat > .env.local << EOF
# AWS Cognito Configuration
AWS_REGION=$AWS_REGION
AWS_COGNITO_USER_POOL_ID=$USER_POOL_ID
AWS_COGNITO_CLIENT_ID=$CLIENT_ID
AWS_COGNITO_CLIENT_SECRET=$CLIENT_SECRET

# NextAuth Configuration (temporal)
NEXTAUTH_URL=https://sandbox.d3ts6pwgn7uyyh.amplifyapp.com
NEXTAUTH_SECRET=your-secret-key-here
EOF

print_success "Archivo .env.local creado"

# Mostrar resumen
echo ""
echo "🎉 ¡Configuración de AWS Cognito completada!"
echo "=============================================="
echo ""
echo "📋 Información importante:"
echo "  User Pool ID: $USER_POOL_ID"
echo "  Client ID: $CLIENT_ID"
echo "  Región: $AWS_REGION"
echo ""
echo "👤 Usuarios creados:"
echo "  Admin: admin@onpoint.com / Admin123!"
echo "  Ejecutivo: ejecutivo@onpoint.com / Ejecutivo123!"
echo ""
echo "🔗 URLs importantes:"
echo "  AWS Console: https://console.aws.amazon.com/cognito/users/?region=$AWS_REGION"
echo "  User Pool: https://console.aws.amazon.com/cognito/users/?region=$AWS_REGION#/pool/$USER_POOL_ID/details"
echo ""
echo "📝 Próximos pasos:"
echo "  1. Instalar dependencias: npm install aws-amplify @aws-amplify/ui-react"
echo "  2. Configurar Amplify en la aplicación"
echo "  3. Reemplazar NextAuth con Cognito"
echo "  4. Probar login con los usuarios creados"
echo ""
print_success "¡Listo para continuar con la integración!"

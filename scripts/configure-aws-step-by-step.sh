#!/bin/bash

# 🚀 Script de Configuración AWS Cognito - Paso a Paso
# Este script te guía para configurar AWS Cognito manualmente

set -e

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

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

echo "🔐 Configuración AWS Cognito - Paso a Paso"
echo "=========================================="
echo ""

# Paso 1: Verificar AWS CLI
print_status "Paso 1: Verificando AWS CLI..."
if ! command -v aws &> /dev/null; then
    print_error "AWS CLI no está instalado. Instálalo primero:"
    echo "  brew install awscli"
    exit 1
fi

print_success "AWS CLI está instalado: $(aws --version)"

# Paso 2: Configurar AWS CLI
print_status "Paso 2: Configurando AWS CLI..."
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

# Paso 3: Crear User Pool
print_status "Paso 3: Creando User Pool en AWS Cognito..."

USER_POOL_NAME="OnPointAdmin-Users"
print_status "Creando User Pool: $USER_POOL_NAME"

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
            "Required": false,
            "Mutable": true
        }
    ]' \
    --query 'UserPool.Id' \
    --output text)

print_success "User Pool creado: $USER_POOL_ID"

# Paso 4: Crear App Client
print_status "Paso 4: Creando App Client..."

CLIENT_NAME="OnPointAdmin-WebApp"
print_status "Creando App Client: $CLIENT_NAME"

CLIENT_ID=$(aws cognito-idp create-user-pool-client \
    --user-pool-id "$USER_POOL_ID" \
    --client-name "$CLIENT_NAME" \
    --generate-secret \
    --explicit-auth-flows ALLOW_USER_PASSWORD_AUTH ALLOW_USER_SRP_AUTH \
    --supported-identity-providers COGNITO \
    --callback-urls "http://localhost:3000/auth/callback" \
    --logout-urls "http://localhost:3000/auth/signin" \
    --allowed-o-auth-flows implicit code \
    --allowed-o-auth-scopes email openid profile \
    --allowed-o-auth-flows-user-pool-client \
    --query 'UserPoolClient.ClientId' \
    --output text)

print_success "App Client creado: $CLIENT_ID"

# Paso 5: Obtener Client Secret
print_status "Paso 5: Obteniendo Client Secret..."
CLIENT_SECRET=$(aws cognito-idp describe-user-pool-client \
    --user-pool-id "$USER_POOL_ID" \
    --client-id "$CLIENT_ID" \
    --query 'UserPoolClient.ClientSecret' \
    --output text)

print_success "Client Secret obtenido"

# Paso 6: Crear usuario admin
print_status "Paso 6: Creando usuario administrador..."

aws cognito-idp admin-create-user \
    --user-pool-id "$USER_POOL_ID" \
    --username "admin@onpoint.com" \
    --user-attributes Name=email,Value=admin@onpoint.com Name=name,Value="Admin User" \
    --temporary-password "TempPass123!" \
    --message-action SUPPRESS

aws cognito-idp admin-set-user-password \
    --user-pool-id "$USER_POOL_ID" \
    --username "admin@onpoint.com" \
    --password "Admin123!" \
    --permanent

print_success "Usuario admin creado: admin@onpoint.com"

# Paso 7: Crear usuario ejecutivo
print_status "Paso 7: Creando usuario ejecutivo..."

aws cognito-idp admin-create-user \
    --user-pool-id "$USER_POOL_ID" \
    --username "ejecutivo@onpoint.com" \
    --user-attributes Name=email,Value=ejecutivo@onpoint.com Name=name,Value="Ejecutivo User" \
    --temporary-password "TempPass123!" \
    --message-action SUPPRESS

aws cognito-idp admin-set-user-password \
    --user-pool-id "$USER_POOL_ID" \
    --username "ejecutivo@onpoint.com" \
    --password "Ejecutivo123!" \
    --permanent

print_success "Usuario ejecutivo creado: ejecutivo@onpoint.com"

# Paso 8: Crear archivo .env.local
print_status "Paso 8: Creando archivo .env.local..."

cat > .env.local << EOF
# AWS Cognito Configuration
AWS_REGION=$AWS_REGION
AWS_COGNITO_USER_POOL_ID=$USER_POOL_ID
AWS_COGNITO_CLIENT_ID=$CLIENT_ID
AWS_COGNITO_CLIENT_SECRET=$CLIENT_SECRET

# Public variables (accessible in browser)
NEXT_PUBLIC_AWS_REGION=$AWS_REGION
NEXT_PUBLIC_AWS_COGNITO_USER_POOL_ID=$USER_POOL_ID
NEXT_PUBLIC_AWS_COGNITO_CLIENT_ID=$CLIENT_ID

# NextAuth Configuration (temporal)
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=dev-secret-key-for-development-only-not-for-production
NODE_ENV=development
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
echo "  1. Reiniciar el servidor de desarrollo: npm run dev"
echo "  2. Ir a: http://localhost:3000/auth/cognito-signin"
echo "  3. Probar login con los usuarios creados"
echo "  4. Verificar en AWS Console que los usuarios existen"
echo ""
print_success "¡Listo para probar la autenticación real!"

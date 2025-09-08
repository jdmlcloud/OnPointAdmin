#!/bin/bash

# Script para configurar Lambda functions para sandbox
set -e

echo "⚡ Configurando Lambda functions para sandbox..."

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuración
REGION="us-east-1"

# Función para configurar una Lambda function para sandbox
configure_lambda_for_sandbox() {
    local function_name=$1
    
    echo -e "${BLUE}⚡ Configurando $function_name para sandbox...${NC}"
    
    # Crear archivo de variables de entorno para sandbox
    cat > /tmp/lambda-env-sandbox.json << 'EOF'
{
  "Variables": {
    "ENVIRONMENT": "sandbox",
    "REGION": "us-east-1",
    "PROJECT_NAME": "OnPointAdmin",
    "DYNAMODB_USERS_TABLE": "OnPointAdmin-Users-sandbox",
    "DYNAMODB_PROVIDERS_TABLE": "OnPointAdmin-Providers-sandbox",
    "DYNAMODB_PRODUCTS_TABLE": "OnPointAdmin-Products-sandbox",
    "DYNAMODB_TAGS_TABLE": "OnPointAdmin-Tags-sandbox",
    "DYNAMODB_REGION": "us-east-1",
    "LOG_LEVEL": "DEBUG"
  }
}
EOF
    
    # Actualizar variables de entorno
    aws lambda update-function-configuration \
        --function-name "$function_name" \
        --environment file:///tmp/lambda-env-sandbox.json \
        --region "$REGION" \
        --query 'LastUpdateStatus' \
        --output text
    
    echo -e "${GREEN}✅ $function_name configurada para sandbox${NC}"
}

# Configurar todas las Lambda functions para sandbox
echo -e "${YELLOW}📋 Configurando Lambda functions para sandbox...${NC}"

configure_lambda_for_sandbox "onpoint-admin-providers"
configure_lambda_for_sandbox "onpoint-admin-users"
configure_lambda_for_sandbox "onpoint-admin-stats"
configure_lambda_for_sandbox "onpoint-admin-tags"
configure_lambda_for_sandbox "onpoint-products-api"

echo ""
echo -e "${GREEN}🎉 ¡Todas las Lambda functions configuradas para sandbox!${NC}"
echo ""
echo -e "${BLUE}📋 Lambda functions configuradas:${NC}"
echo "  - onpoint-admin-providers"
echo "  - onpoint-admin-users"
echo "  - onpoint-admin-stats"
echo "  - onpoint-admin-tags"
echo "  - onpoint-products-api"
echo ""
echo -e "${YELLOW}⚠️  Las Lambda functions ahora usan tablas de sandbox${NC}"
echo -e "${YELLOW}⚠️  Espera unos segundos para que los cambios se apliquen${NC}"

# Limpiar archivo temporal
rm -f /tmp/lambda-env-sandbox.json

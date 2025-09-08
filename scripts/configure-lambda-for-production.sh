#!/bin/bash

# Script para configurar Lambda functions para producción
set -e

echo "⚡ Configurando Lambda functions para producción..."

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuración
REGION="us-east-1"

# Función para configurar una Lambda function para producción
configure_lambda_for_production() {
    local function_name=$1
    
    echo -e "${BLUE}⚡ Configurando $function_name para producción...${NC}"
    
    # Crear archivo de variables de entorno para producción
    cat > /tmp/lambda-env-production.json << 'EOF'
{
  "Variables": {
    "ENVIRONMENT": "prod",
    "REGION": "us-east-1",
    "PROJECT_NAME": "OnPointAdmin",
    "DYNAMODB_USERS_TABLE": "OnPointAdmin-Users-prod",
    "DYNAMODB_PROVIDERS_TABLE": "OnPointAdmin-Providers-prod",
    "DYNAMODB_PRODUCTS_TABLE": "OnPointAdmin-Products-prod",
    "DYNAMODB_TAGS_TABLE": "OnPointAdmin-Tags-prod",
    "DYNAMODB_REGION": "us-east-1",
    "LOG_LEVEL": "INFO"
  }
}
EOF
    
    # Actualizar variables de entorno
    aws lambda update-function-configuration \
        --function-name "$function_name" \
        --environment file:///tmp/lambda-env-production.json \
        --region "$REGION" \
        --query 'LastUpdateStatus' \
        --output text
    
    echo -e "${GREEN}✅ $function_name configurada para producción${NC}"
}

# Configurar todas las Lambda functions para producción
echo -e "${YELLOW}📋 Configurando Lambda functions para producción...${NC}"

configure_lambda_for_production "onpoint-admin-providers"
configure_lambda_for_production "onpoint-admin-users"
configure_lambda_for_production "onpoint-admin-stats"
configure_lambda_for_production "onpoint-admin-tags"
configure_lambda_for_production "onpoint-products-api"

echo ""
echo -e "${GREEN}🎉 ¡Todas las Lambda functions configuradas para producción!${NC}"
echo ""
echo -e "${BLUE}📋 Lambda functions configuradas:${NC}"
echo "  - onpoint-admin-providers"
echo "  - onpoint-admin-users"
echo "  - onpoint-admin-stats"
echo "  - onpoint-admin-tags"
echo "  - onpoint-products-api"
echo ""
echo -e "${YELLOW}⚠️  Las Lambda functions ahora usan tablas de producción${NC}"
echo -e "${YELLOW}⚠️  Espera unos segundos para que los cambios se apliquen${NC}"

# Limpiar archivo temporal
rm -f /tmp/lambda-env-production.json

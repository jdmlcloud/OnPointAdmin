#!/bin/bash

# Script simple para actualizar variables de entorno en Lambda functions
set -e

echo "⚡ Actualizando variables de entorno en Lambda functions..."

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Función para actualizar variables de entorno
update_lambda_env() {
    local function_name=$1
    local env=$2
    
    echo -e "${BLUE}⚡ Actualizando $function_name para $env...${NC}"
    
    if [ "$env" = "sandbox" ]; then
        cat > /tmp/lambda-env.json << 'EOF'
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
    else
        cat > /tmp/lambda-env.json << 'EOF'
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
    fi
    
    aws lambda update-function-configuration \
        --function-name "$function_name" \
        --environment file:///tmp/lambda-env.json \
        --query 'Environment.Variables' \
        --output json > /dev/null
    
    echo -e "${GREEN}✅ $function_name actualizada para $env${NC}"
}

# Actualizar todas las Lambda functions para sandbox
echo -e "${YELLOW}📋 Actualizando Lambda functions para SANDBOX...${NC}"
update_lambda_env "onpoint-admin-providers" "sandbox"
update_lambda_env "onpoint-admin-users" "sandbox"
update_lambda_env "onpoint-admin-stats" "sandbox"
update_lambda_env "onpoint-admin-tags" "sandbox"
update_lambda_env "onpoint-products-api" "sandbox"

# Actualizar todas las Lambda functions para producción
echo -e "${YELLOW}📋 Actualizando Lambda functions para PRODUCCIÓN...${NC}"
update_lambda_env "onpoint-admin-providers" "prod"
update_lambda_env "onpoint-admin-users" "prod"
update_lambda_env "onpoint-admin-stats" "prod"
update_lambda_env "onpoint-admin-tags" "prod"
update_lambda_env "onpoint-products-api" "prod"

echo ""
echo -e "${GREEN}🎉 ¡Variables de entorno actualizadas en todas las Lambda functions!${NC}"
echo ""
echo -e "${BLUE}📋 Resumen:${NC}"
echo "  - Sandbox: Variables configuradas para tablas sandbox"
echo "  - Producción: Variables configuradas para tablas prod"
echo ""
echo -e "${YELLOW}⚠️  Nota: Las Lambda functions ahora usan las tablas de DynamoDB correctas${NC}"

#!/bin/bash

# Script para actualizar variables de entorno en Lambda functions
set -e

echo "⚡ Actualizando variables de entorno en Lambda functions..."

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuración
REGION="us-east-1"
PROJECT_NAME="OnPointAdmin"

# Función para actualizar variables de entorno de una Lambda function
update_lambda_env() {
    local function_name=$1
    local env=$2
    
    echo -e "${BLUE}⚡ Actualizando variables de entorno para $function_name ($env)...${NC}"
    
    # Variables de entorno específicas para cada entorno
    if [ "$env" = "sandbox" ]; then
        ENV_VARS='{"ENVIRONMENT":"sandbox","REGION":"'$REGION'","PROJECT_NAME":"'$PROJECT_NAME'","DYNAMODB_USERS_TABLE":"'$PROJECT_NAME'-Users-sandbox","DYNAMODB_PROVIDERS_TABLE":"'$PROJECT_NAME'-Providers-sandbox","DYNAMODB_PRODUCTS_TABLE":"'$PROJECT_NAME'-Products-sandbox","DYNAMODB_TAGS_TABLE":"'$PROJECT_NAME'-Tags-sandbox","DYNAMODB_REGION":"'$REGION'","LOG_LEVEL":"DEBUG"}'
    else
        ENV_VARS='{"ENVIRONMENT":"prod","REGION":"'$REGION'","PROJECT_NAME":"'$PROJECT_NAME'","DYNAMODB_USERS_TABLE":"'$PROJECT_NAME'-Users-prod","DYNAMODB_PROVIDERS_TABLE":"'$PROJECT_NAME'-Providers-prod","DYNAMODB_PRODUCTS_TABLE":"'$PROJECT_NAME'-Products-prod","DYNAMODB_TAGS_TABLE":"'$PROJECT_NAME'-Tags-prod","DYNAMODB_REGION":"'$REGION'","LOG_LEVEL":"INFO"}'
    fi
    
    # Actualizar variables de entorno
    aws lambda update-function-configuration \
        --function-name "$function_name" \
        --environment "Variables=$ENV_VARS" \
        --region "$REGION" \
        --query 'Environment.Variables' \
        --output json
    
    echo -e "${GREEN}✅ Variables de entorno actualizadas para $function_name${NC}"
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

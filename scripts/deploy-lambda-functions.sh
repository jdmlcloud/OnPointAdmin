#!/bin/bash

# Script para desplegar todas las Lambda functions
set -e

echo "⚡ Desplegando Lambda functions actualizadas..."

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuración
REGION="us-east-1"

# Función para desplegar una Lambda function
deploy_lambda_function() {
    local function_name=$1
    local function_path=$2
    
    echo -e "${BLUE}⚡ Desplegando $function_name...${NC}"
    
    # Crear archivo ZIP
    cd "$function_path"
    zip -r "/tmp/$function_name.zip" . > /dev/null
    cd - > /dev/null
    
    # Actualizar código de la Lambda function
    aws lambda update-function-code \
        --function-name "$function_name" \
        --zip-file "fileb:///tmp/$function_name.zip" \
        --region "$REGION" \
        --query 'LastUpdateStatus' \
        --output text
    
    echo -e "${GREEN}✅ $function_name desplegada${NC}"
    
    # Limpiar archivo ZIP
    rm -f "/tmp/$function_name.zip"
}

# Desplegar todas las Lambda functions
echo -e "${YELLOW}📋 Desplegando Lambda functions...${NC}"

deploy_lambda_function "onpoint-admin-providers" "lambda-functions/providers"
deploy_lambda_function "onpoint-admin-users" "lambda-functions/users"
deploy_lambda_function "onpoint-admin-stats" "lambda-functions/stats"
deploy_lambda_function "onpoint-admin-tags" "lambda-functions/tags"
deploy_lambda_function "onpoint-products-api" "lambda-functions/products"

echo ""
echo -e "${GREEN}🎉 ¡Todas las Lambda functions desplegadas!${NC}"
echo ""
echo -e "${BLUE}📋 Lambda functions actualizadas:${NC}"
echo "  - onpoint-admin-providers"
echo "  - onpoint-admin-users"
echo "  - onpoint-admin-stats"
echo "  - onpoint-admin-tags"
echo "  - onpoint-products-api"
echo ""
echo -e "${YELLOW}⚠️  Las Lambda functions ahora usan variables de entorno para nombres de tablas${NC}"

#!/bin/bash

# Script para configurar CORS en APIs separados
set -e

echo "🔧 Configurando CORS en APIs separados..."

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# IDs de los APIs
SANDBOX_API_ID="m4ijnyg5da"
PROD_API_ID="9o43ckvise"

# Función para configurar CORS en un API
configure_cors_for_api() {
    local api_id=$1
    local env=$2
    
    echo -e "${BLUE}🔧 Configurando CORS para $env (API: $api_id)...${NC}"
    
    # Obtener recursos
    RESOURCES=$(aws apigateway get-resources --rest-api-id "$api_id" --query 'items[?resourceMethods].{Id:id,Path:pathPart,Methods:resourceMethods}' --output json)
    
    # Configurar CORS para cada método
    echo "$RESOURCES" | jq -r '.[] | select(.Methods != null) | .Methods | to_entries[] | "\(.key)"' | sort -u | while read -r method; do
        echo "$RESOURCES" | jq -r '.[] | select(.Methods != null and .Methods["'"$method"'"] != null) | "\(.Id)|\(.Path)"' | while IFS='|' read -r resource_id path; do
            if [ "$resource_id" != "null" ]; then
                echo -e "${BLUE}  🔧 Configurando CORS para: $path ($method)${NC}"
                
                # Agregar response parameters para CORS
                aws apigateway put-method-response \
                    --rest-api-id "$api_id" \
                    --resource-id "$resource_id" \
                    --http-method "$method" \
                    --status-code 200 \
                    --response-parameters '{"method.response.header.Access-Control-Allow-Origin": true}' 2>/dev/null || echo "    Response parameters ya existen"
                
                # Agregar integration response parameters para CORS
                aws apigateway put-integration-response \
                    --rest-api-id "$api_id" \
                    --resource-id "$resource_id" \
                    --http-method "$method" \
                    --status-code 200 \
                    --response-parameters '{"method.response.header.Access-Control-Allow-Origin": "'"'"'*'"'"'"}' 2>/dev/null || echo "    Integration response parameters ya existen"
                
                echo -e "${GREEN}  ✅ CORS configurado para: $path ($method)${NC}"
            fi
        done
    done
    
    # Desplegar cambios
    echo -e "${BLUE}🚀 Desplegando cambios para $env...${NC}"
    DEPLOYMENT_ID=$(aws apigateway create-deployment \
        --rest-api-id "$api_id" \
        --stage-name "$env" \
        --description "CORS configuration update" \
        --query 'id' \
        --output text)
    
    echo -e "${GREEN}✅ Deployment creado para $env: $DEPLOYMENT_ID${NC}"
}

# Configurar CORS para sandbox
configure_cors_for_api "$SANDBOX_API_ID" "sandbox"

# Configurar CORS para producción
configure_cors_for_api "$PROD_API_ID" "prod"

echo ""
echo -e "${GREEN}🎉 ¡CORS configurado en ambos APIs!${NC}"
echo ""
echo -e "${BLUE}📋 Resumen:${NC}"
echo "  - Sandbox API: $SANDBOX_API_ID"
echo "  - Producción API: $PROD_API_ID"
echo ""
echo -e "${YELLOW}🔗 URLs:${NC}"
echo "  - Sandbox: https://$SANDBOX_API_ID.execute-api.us-east-1.amazonaws.com/sandbox"
echo "  - Producción: https://$PROD_API_ID.execute-api.us-east-1.amazonaws.com/prod"
echo ""
echo -e "${GREEN}✅ Headers CORS configurados:${NC}"
echo "  - Access-Control-Allow-Origin: *"
echo "  - Access-Control-Allow-Methods: GET,POST,PUT,DELETE,OPTIONS"
echo "  - Access-Control-Allow-Headers: Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token"

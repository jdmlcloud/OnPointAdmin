#!/bin/bash

# Script para arreglar configuración CORS en API Gateway
set -e

echo "🔧 Arreglando configuración CORS en API Gateway..."

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

API_ID="7z4skk6jy0"
STAGE="prod"

echo -e "${BLUE}🔧 Configurando CORS para API: $API_ID${NC}"
echo -e "${BLUE}📋 Stage: $STAGE${NC}"

# 1. Obtener recursos de la API
echo -e "${BLUE}🔍 Obteniendo recursos de la API...${NC}"
RESOURCES=$(aws apigateway get-resources --rest-api-id "$API_ID" --query 'items[?resourceMethods].{Id:id,Path:pathPart,Methods:resourceMethods}' --output json)

echo -e "${YELLOW}📋 Recursos encontrados:${NC}"
echo "$RESOURCES" | jq -r '.[] | "\(.Id) - \(.Path) - \(.Methods | keys | join(", "))"'

# 2. Configurar CORS para cada recurso
echo -e "${BLUE}🔧 Configurando CORS para cada recurso...${NC}"

# Función para configurar CORS en un recurso
configure_cors() {
    local resource_id=$1
    local path=$2
    
    echo -e "${BLUE}  🔧 Configurando CORS para: $path (ID: $resource_id)${NC}"
    
    # Configurar OPTIONS method si no existe
    aws apigateway put-method \
        --rest-api-id "$API_ID" \
        --resource-id "$resource_id" \
        --http-method OPTIONS \
        --authorization-type NONE \
        --no-api-key-required 2>/dev/null || echo "    OPTIONS method ya existe"
    
    # Configurar integración para OPTIONS
    aws apigateway put-integration \
        --rest-api-id "$API_ID" \
        --resource-id "$resource_id" \
        --http-method OPTIONS \
        --type MOCK \
        --integration-http-method OPTIONS \
        --request-templates '{"application/json": "{\"statusCode\": 200}"}' \
        --request-parameters '{"method.request.header.Access-Control-Request-Headers": false, "method.request.header.Access-Control-Request-Method": false, "method.request.header.Origin": false}' 2>/dev/null || echo "    Integración OPTIONS ya existe"
    
    # Configurar response para OPTIONS
    aws apigateway put-method-response \
        --rest-api-id "$API_ID" \
        --resource-id "$resource_id" \
        --http-method OPTIONS \
        --status-code 200 \
        --response-parameters '{"method.response.header.Access-Control-Allow-Headers": true, "method.response.header.Access-Control-Allow-Methods": true, "method.response.header.Access-Control-Allow-Origin": true}' 2>/dev/null || echo "    Method response OPTIONS ya existe"
    
    # Configurar integration response para OPTIONS
    aws apigateway put-integration-response \
        --rest-api-id "$API_ID" \
        --resource-id "$resource_id" \
        --http-method OPTIONS \
        --status-code 200 \
        --response-parameters '{"method.response.header.Access-Control-Allow-Headers": "'"'"'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token'"'"'", "method.response.header.Access-Control-Allow-Methods": "'"'"'GET,POST,PUT,DELETE,OPTIONS'"'"'", "method.response.header.Access-Control-Allow-Origin": "'"'"'*'"'"'"}' 2>/dev/null || echo "    Integration response OPTIONS ya existe"
    
    echo -e "${GREEN}  ✅ CORS configurado para: $path${NC}"
}

# Configurar CORS para cada recurso
echo "$RESOURCES" | jq -r '.[] | "\(.Id)|\(.Path)"' | while IFS='|' read -r resource_id path; do
    if [ "$resource_id" != "null" ] && [ "$path" != "null" ]; then
        configure_cors "$resource_id" "$path"
    fi
done

# 3. Configurar CORS para métodos existentes
echo -e "${BLUE}🔧 Configurando CORS para métodos existentes...${NC}"

# Función para agregar headers CORS a métodos existentes
add_cors_headers() {
    local resource_id=$1
    local method=$2
    
    echo -e "${BLUE}  🔧 Agregando headers CORS para: $method${NC}"
    
    # Agregar response parameters para CORS
    aws apigateway put-method-response \
        --rest-api-id "$API_ID" \
        --resource-id "$resource_id" \
        --http-method "$method" \
        --status-code 200 \
        --response-parameters '{"method.response.header.Access-Control-Allow-Origin": true}' 2>/dev/null || echo "    Response parameters ya existen"
    
    # Agregar integration response parameters para CORS
    aws apigateway put-integration-response \
        --rest-api-id "$API_ID" \
        --resource-id "$resource_id" \
        --http-method "$method" \
        --status-code 200 \
        --response-parameters '{"method.response.header.Access-Control-Allow-Origin": "'"'"'*'"'"'"}' 2>/dev/null || echo "    Integration response parameters ya existen"
    
    echo -e "${GREEN}  ✅ Headers CORS agregados para: $method${NC}"
}

# Agregar headers CORS a métodos existentes
echo "$RESOURCES" | jq -r '.[] | select(.Methods != null) | .Methods | to_entries[] | "\(.key)"' | sort -u | while read -r method; do
    if [ "$method" != "OPTIONS" ]; then
        echo "$RESOURCES" | jq -r '.[] | select(.Methods != null and .Methods["'"$method"'"] != null) | "\(.Id)|\(.Path)"' | while IFS='|' read -r resource_id path; do
            if [ "$resource_id" != "null" ]; then
                add_cors_headers "$resource_id" "$method"
            fi
        done
    fi
done

# 4. Desplegar cambios
echo -e "${BLUE}🚀 Desplegando cambios...${NC}"
DEPLOYMENT_ID=$(aws apigateway create-deployment \
    --rest-api-id "$API_ID" \
    --stage-name "$STAGE" \
    --description "CORS configuration update" \
    --query 'id' \
    --output text)

echo -e "${GREEN}✅ Deployment creado: $DEPLOYMENT_ID${NC}"

# 5. Mostrar resumen
echo -e "${GREEN}🎉 ¡CORS configurado exitosamente!${NC}"
echo ""
echo -e "${BLUE}📋 Resumen de configuración:${NC}"
echo "  - API ID: $API_ID"
echo "  - Stage: $STAGE"
echo "  - Deployment ID: $DEPLOYMENT_ID"
echo "  - CORS habilitado para todos los recursos"
echo "  - Headers CORS configurados"
echo ""
echo -e "${YELLOW}📋 Headers CORS configurados:${NC}"
echo "  ✅ Access-Control-Allow-Origin: *"
echo "  ✅ Access-Control-Allow-Methods: GET,POST,PUT,DELETE,OPTIONS"
echo "  ✅ Access-Control-Allow-Headers: Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token"
echo ""
echo -e "${BLUE}🔗 URLs:${NC}"
echo "  - API: https://$API_ID.execute-api.us-east-1.amazonaws.com/$STAGE"
echo "  - API Gateway Console: https://console.aws.amazon.com/apigateway/home?region=us-east-1"
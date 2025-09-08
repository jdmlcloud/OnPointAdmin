#!/bin/bash

# Script simple para arreglar CORS
set -e

echo "🔧 Arreglando CORS de forma simple..."

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

API_ID="7z4skk6jy0"
STAGE="prod"

echo -e "${BLUE}🔧 Configurando CORS para API: $API_ID${NC}"

# 1. Obtener recursos
echo -e "${BLUE}🔍 Obteniendo recursos...${NC}"
RESOURCES=$(aws apigateway get-resources --rest-api-id "$API_ID" --query 'items[?resourceMethods].{Id:id,Path:pathPart,Methods:resourceMethods}' --output json)

# 2. Agregar headers CORS a métodos existentes
echo -e "${BLUE}🔧 Agregando headers CORS a métodos existentes...${NC}"

# Función para agregar CORS a un método
add_cors_to_method() {
    local resource_id=$1
    local method=$2
    local path=$3
    
    echo -e "${BLUE}  🔧 Agregando CORS a: $path ($method)${NC}"
    
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
    
    echo -e "${GREEN}  ✅ CORS agregado a: $path ($method)${NC}"
}

# Procesar cada recurso
echo "$RESOURCES" | jq -r '.[] | select(.Methods != null) | .Methods | to_entries[] | "\(.key)"' | sort -u | while read -r method; do
    if [ "$method" != "OPTIONS" ]; then
        echo "$RESOURCES" | jq -r '.[] | select(.Methods != null and .Methods["'"$method"'"] != null) | "\(.Id)|\(.Path)"' | while IFS='|' read -r resource_id path; do
            if [ "$resource_id" != "null" ]; then
                add_cors_to_method "$resource_id" "$method" "$path"
            fi
        done
    fi
done

# 3. Desplegar cambios
echo -e "${BLUE}🚀 Desplegando cambios...${NC}"
DEPLOYMENT_ID=$(aws apigateway create-deployment \
    --rest-api-id "$API_ID" \
    --stage-name "$STAGE" \
    --description "CORS headers update" \
    --query 'id' \
    --output text)

echo -e "${GREEN}✅ Deployment creado: $DEPLOYMENT_ID${NC}"

# 4. Mostrar resumen
echo -e "${GREEN}🎉 ¡CORS arreglado exitosamente!${NC}"
echo ""
echo -e "${BLUE}📋 Resumen:${NC}"
echo "  - API ID: $API_ID"
echo "  - Stage: $STAGE"
echo "  - Deployment ID: $DEPLOYMENT_ID"
echo "  - Headers CORS agregados a todos los métodos"
echo ""
echo -e "${YELLOW}📋 Headers CORS configurados:${NC}"
echo "  ✅ Access-Control-Allow-Origin: *"
echo ""
echo -e "${BLUE}🔗 URLs:${NC}"
echo "  - API: https://$API_ID.execute-api.us-east-1.amazonaws.com/$STAGE"
echo "  - API Gateway Console: https://console.aws.amazon.com/apigateway/home?region=us-east-1"

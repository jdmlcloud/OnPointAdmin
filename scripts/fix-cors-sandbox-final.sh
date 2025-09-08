#!/bin/bash

# Script para configurar CORS definitivamente en el API de sandbox
set -e

echo "🔧 Configurando CORS definitivamente en API de sandbox..."

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuración
REGION="us-east-1"
API_ID="m4ijnyg5da"
STAGE="sandbox"

echo -e "${BLUE}🔧 Configurando CORS para API: $API_ID${NC}"

# Función para configurar CORS en un recurso
configure_cors_for_resource() {
    local resource_id=$1
    local resource_name=$2
    
    echo -e "${YELLOW}🔧 Configurando CORS para: $resource_name (ID: $resource_id)${NC}"
    
    # Obtener métodos existentes
    METHODS=$(aws apigateway get-resource --rest-api-id "$API_ID" --resource-id "$resource_id" --query 'resourceMethods | keys(@)' --output text)
    
    for method in $METHODS; do
        if [ "$method" != "OPTIONS" ]; then
            echo -e "${BLUE}  🔧 Configurando CORS para: $method${NC}"
            
            # Agregar headers CORS a la respuesta del método
            aws apigateway update-method-response \
                --rest-api-id "$API_ID" \
                --resource-id "$resource_id" \
                --http-method "$method" \
                --status-code 200 \
                --response-parameters method.response.header.Access-Control-Allow-Origin=true,method.response.header.Access-Control-Allow-Headers=true,method.response.header.Access-Control-Allow-Methods=true
            
            # Agregar headers CORS a la integración
            aws apigateway update-integration-response \
                --rest-api-id "$API_ID" \
                --resource-id "$resource_id" \
                --http-method "$method" \
                --status-code 200 \
                --response-parameters method.response.header.Access-Control-Allow-Origin="'*'",method.response.header.Access-Control-Allow-Headers="'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token'",method.response.header.Access-Control-Allow-Methods="'GET,POST,PUT,DELETE,OPTIONS'"
            
            echo -e "${GREEN}  ✅ CORS configurado para: $method${NC}"
        fi
    done
    
    # Crear método OPTIONS si no existe
    if ! echo "$METHODS" | grep -q "OPTIONS"; then
        echo -e "${BLUE}  🔧 Creando método OPTIONS${NC}"
        
        # Crear método OPTIONS
        aws apigateway put-method \
            --rest-api-id "$API_ID" \
            --resource-id "$resource_id" \
            --http-method OPTIONS \
            --authorization-type NONE
        
        # Crear integración para OPTIONS
        aws apigateway put-integration \
            --rest-api-id "$API_ID" \
            --resource-id "$resource_id" \
            --http-method OPTIONS \
            --type MOCK \
            --request-templates '{"application/json": "{\"statusCode\": 200}"}'
        
        # Configurar respuesta para OPTIONS
        aws apigateway put-method-response \
            --rest-api-id "$API_ID" \
            --resource-id "$resource_id" \
            --http-method OPTIONS \
            --status-code 200 \
            --response-parameters method.response.header.Access-Control-Allow-Origin=true,method.response.header.Access-Control-Allow-Headers=true,method.response.header.Access-Control-Allow-Methods=true
        
        # Configurar respuesta de integración para OPTIONS
        aws apigateway put-integration-response \
            --rest-api-id "$API_ID" \
            --resource-id "$resource_id" \
            --http-method OPTIONS \
            --status-code 200 \
            --response-parameters method.response.header.Access-Control-Allow-Origin="'*'",method.response.header.Access-Control-Allow-Headers="'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token'",method.response.header.Access-Control-Allow-Methods="'GET,POST,PUT,DELETE,OPTIONS'"
        
        echo -e "${GREEN}  ✅ Método OPTIONS creado${NC}"
    fi
}

# Obtener todos los recursos
RESOURCES=$(aws apigateway get-resources --rest-api-id "$API_ID" --query 'items[?pathPart!=`{id}` && pathPart!=null].{id:id,pathPart:pathPart}' --output json)

echo "$RESOURCES" | jq -r '.[] | "\(.id) \(.pathPart)"' | while read resource_id resource_name; do
    if [ -n "$resource_id" ] && [ -n "$resource_name" ]; then
        configure_cors_for_resource "$resource_id" "$resource_name"
    fi
done

echo ""
echo -e "${BLUE}🚀 Desplegando cambios...${NC}"
DEPLOYMENT_ID=$(aws apigateway create-deployment \
    --rest-api-id "$API_ID" \
    --stage-name "$STAGE" \
    --description "CORS configuration update" \
    --query 'id' \
    --output text)

echo -e "${GREEN}✅ Deployment creado: $DEPLOYMENT_ID${NC}"

echo ""
echo -e "${GREEN}🎉 ¡CORS configurado definitivamente!${NC}"
echo ""
echo -e "${BLUE}📋 Configuración aplicada:${NC}"
echo "  - Headers CORS en todos los métodos"
echo "  - Métodos OPTIONS creados"
echo "  - Access-Control-Allow-Origin: *"
echo "  - Access-Control-Allow-Methods: GET,POST,PUT,DELETE,OPTIONS"
echo "  - Access-Control-Allow-Headers: Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token"
echo ""
echo -e "${YELLOW}⚠️  Espera unos segundos para que los cambios se apliquen${NC}"

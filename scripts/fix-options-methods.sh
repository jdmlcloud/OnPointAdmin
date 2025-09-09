#!/bin/bash

# Script para configurar métodos OPTIONS en todos los recursos
set -e

echo "🔧 Configurando métodos OPTIONS en todos los recursos..."

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

echo -e "${BLUE}🔧 Configurando métodos OPTIONS para API: $API_ID${NC}"

# Crear archivo JSON para parámetros CORS
cat > /tmp/cors-params.json << 'EOF'
{
  "method.response.header.Access-Control-Allow-Origin": "'*'",
  "method.response.header.Access-Control-Allow-Headers": "'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token'",
  "method.response.header.Access-Control-Allow-Methods": "'GET,POST,PUT,DELETE,OPTIONS'"
}
EOF

# Función para configurar OPTIONS en un recurso
configure_options_for_resource() {
    local resource_id=$1
    local resource_name=$2
    
    echo -e "${YELLOW}🔧 Configurando OPTIONS para: $resource_name (ID: $resource_id)${NC}"
    
    # Verificar si ya existe el método OPTIONS
    if aws apigateway get-method --rest-api-id "$API_ID" --resource-id "$resource_id" --http-method OPTIONS >/dev/null 2>&1; then
        echo -e "${BLUE}  ℹ️  Método OPTIONS ya existe${NC}"
        return
    fi
    
    # Crear método OPTIONS
    echo -e "${BLUE}  🔧 Creando método OPTIONS${NC}"
    aws apigateway put-method \
        --rest-api-id "$API_ID" \
        --resource-id "$resource_id" \
        --http-method OPTIONS \
        --authorization-type NONE
    
    # Crear integración para OPTIONS
    echo -e "${BLUE}  🔧 Creando integración MOCK${NC}"
    aws apigateway put-integration \
        --rest-api-id "$API_ID" \
        --resource-id "$resource_id" \
        --http-method OPTIONS \
        --type MOCK \
        --request-templates '{"application/json": "{\"statusCode\": 200}"}'
    
    # Configurar respuesta para OPTIONS
    echo -e "${BLUE}  🔧 Configurando respuesta del método${NC}"
    aws apigateway put-method-response \
        --rest-api-id "$API_ID" \
        --resource-id "$resource_id" \
        --http-method OPTIONS \
        --status-code 200 \
        --response-parameters method.response.header.Access-Control-Allow-Origin=true,method.response.header.Access-Control-Allow-Headers=true,method.response.header.Access-Control-Allow-Methods=true
    
    # Configurar respuesta de integración para OPTIONS
    echo -e "${BLUE}  🔧 Configurando respuesta de integración${NC}"
    aws apigateway put-integration-response \
        --rest-api-id "$API_ID" \
        --resource-id "$resource_id" \
        --http-method OPTIONS \
        --status-code 200 \
        --response-parameters file:///tmp/cors-params.json
    
    echo -e "${GREEN}  ✅ Método OPTIONS configurado para: $resource_name${NC}"
}

# Obtener todos los recursos
RESOURCES=$(aws apigateway get-resources --rest-api-id "$API_ID" --query 'items[?pathPart!=`{id}` && pathPart!=null].{id:id,pathPart:pathPart}' --output json)

echo "$RESOURCES" | jq -r '.[] | "\(.id) \(.pathPart)"' | while read resource_id resource_name; do
    if [ -n "$resource_id" ] && [ -n "$resource_name" ]; then
        configure_options_for_resource "$resource_id" "$resource_name"
    fi
done

echo ""
echo -e "${BLUE}🚀 Desplegando cambios...${NC}"
DEPLOYMENT_ID=$(aws apigateway create-deployment \
    --rest-api-id "$API_ID" \
    --stage-name "$STAGE" \
    --description "OPTIONS methods configuration" \
    --query 'id' \
    --output text)

echo -e "${GREEN}✅ Deployment creado: $DEPLOYMENT_ID${NC}"

echo ""
echo -e "${GREEN}🎉 ¡Métodos OPTIONS configurados!${NC}"
echo ""
echo -e "${BLUE}📋 Configuración aplicada:${NC}"
echo "  - Métodos OPTIONS creados en todos los recursos"
echo "  - Autorización: NONE"
echo "  - Integración: MOCK"
echo "  - Headers CORS configurados"
echo ""
echo -e "${YELLOW}⚠️  Espera unos segundos para que los cambios se apliquen${NC}"

# Limpiar archivo temporal
rm -f /tmp/cors-params.json

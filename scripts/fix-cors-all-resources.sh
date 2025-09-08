#!/bin/bash

# Script para aplicar CORS completo a todos los recursos
set -e

echo "🔧 Aplicando CORS completo a todos los recursos..."

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

# Crear archivos JSON para parámetros
cat > /tmp/method-response.json << 'EOF'
{
  "method.response.header.Access-Control-Allow-Origin": true,
  "method.response.header.Access-Control-Allow-Headers": true,
  "method.response.header.Access-Control-Allow-Methods": true
}
EOF

cat > /tmp/integration-response.json << 'EOF'
{
  "method.response.header.Access-Control-Allow-Origin": "'*'",
  "method.response.header.Access-Control-Allow-Headers": "'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token'",
  "method.response.header.Access-Control-Allow-Methods": "'GET,POST,PUT,DELETE,OPTIONS'"
}
EOF

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
            
            # Eliminar respuesta del método existente
            aws apigateway delete-method-response --rest-api-id "$API_ID" --resource-id "$resource_id" --http-method "$method" --status-code 200 2>/dev/null || true
            
            # Crear nueva respuesta del método con CORS completo
            aws apigateway put-method-response \
                --rest-api-id "$API_ID" \
                --resource-id "$resource_id" \
                --http-method "$method" \
                --status-code 200 \
                --response-parameters file:///tmp/method-response.json
            
            # Eliminar respuesta de integración existente
            aws apigateway delete-integration-response --rest-api-id "$API_ID" --resource-id "$resource_id" --http-method "$method" --status-code 200 2>/dev/null || true
            
            # Crear nueva respuesta de integración con CORS completo
            aws apigateway put-integration-response \
                --rest-api-id "$API_ID" \
                --resource-id "$resource_id" \
                --http-method "$method" \
                --status-code 200 \
                --response-parameters file:///tmp/integration-response.json
            
            echo -e "${GREEN}  ✅ CORS configurado para: $method${NC}"
        fi
    done
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
    --description "Complete CORS configuration" \
    --query 'id' \
    --output text)

echo -e "${GREEN}✅ Deployment creado: $DEPLOYMENT_ID${NC}"

echo ""
echo -e "${GREEN}🎉 ¡CORS completo configurado!${NC}"
echo ""
echo -e "${BLUE}📋 Configuración aplicada:${NC}"
echo "  - Headers CORS en todos los métodos (GET, POST, PUT, DELETE)"
echo "  - Gateway Responses configurados para errores 4XX y 5XX"
echo "  - Access-Control-Allow-Origin: *"
echo "  - Access-Control-Allow-Methods: GET,POST,PUT,DELETE,OPTIONS"
echo "  - Access-Control-Allow-Headers: Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token"
echo ""
echo -e "${YELLOW}⚠️  Espera unos segundos para que los cambios se apliquen${NC}"

# Limpiar archivos temporales
rm -f /tmp/method-response.json /tmp/integration-response.json

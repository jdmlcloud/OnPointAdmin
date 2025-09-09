#!/bin/bash

# Script para configurar todos los endpoints de API Gateway
# Uso: ./scripts/setup-api-endpoints.sh

set -e

# Variables
REST_API_ID="m4ijnyg5da"
REGION="us-east-1"
ACCOUNT_ID="209350187548"
ROOT_RESOURCE_ID="0cwniebr73"

# Función para crear endpoint completo
create_endpoint() {
    local endpoint_name=$1
    local function_name=$2
    
    echo "🔧 Configurando endpoint: $endpoint_name"
    
    # Crear recurso principal
    local resource_id=$(aws apigateway create-resource \
        --rest-api-id $REST_API_ID \
        --parent-id $ROOT_RESOURCE_ID \
        --path-part $endpoint_name \
        --region $REGION \
        --query 'id' \
        --output text)
    
    echo "  ✅ Recurso creado: $resource_id"
    
    # Crear recurso {id}
    local id_resource_id=$(aws apigateway create-resource \
        --rest-api-id $REST_API_ID \
        --parent-id $resource_id \
        --path-part "{id}" \
        --region $REGION \
        --query 'id' \
        --output text)
    
    echo "  ✅ Recurso {id} creado: $id_resource_id"
    
    # Configurar métodos para recurso principal
    for method in GET POST; do
        echo "  🔧 Configurando $method /$endpoint_name"
        
        # Crear método
        aws apigateway put-method \
            --rest-api-id $REST_API_ID \
            --resource-id $resource_id \
            --http-method $method \
            --authorization-type NONE \
            --region $REGION > /dev/null
        
        # Crear integración
        aws apigateway put-integration \
            --rest-api-id $REST_API_ID \
            --resource-id $resource_id \
            --http-method $method \
            --type AWS_PROXY \
            --integration-http-method POST \
            --uri "arn:aws:apigateway:$REGION:lambda:path/2015-03-31/functions/arn:aws:lambda:$REGION:$ACCOUNT_ID:function:$function_name/invocations" \
            --region $REGION > /dev/null
        
        echo "    ✅ $method configurado"
    done
    
    # Configurar métodos para recurso {id}
    for method in GET PUT DELETE; do
        echo "  🔧 Configurando $method /$endpoint_name/{id}"
        
        # Crear método
        aws apigateway put-method \
            --rest-api-id $REST_API_ID \
            --resource-id $id_resource_id \
            --http-method $method \
            --authorization-type NONE \
            --region $REGION > /dev/null
        
        # Crear integración
        aws apigateway put-integration \
            --rest-api-id $REST_API_ID \
            --resource-id $id_resource_id \
            --http-method $method \
            --type AWS_PROXY \
            --integration-http-method POST \
            --uri "arn:aws:apigateway:$REGION:lambda:path/2015-03-31/functions/arn:aws:lambda:$REGION:$ACCOUNT_ID:function:$function_name/invocations" \
            --region $REGION > /dev/null
        
        echo "    ✅ $method configurado"
    done
    
    # Dar permisos a API Gateway
    aws lambda add-permission \
        --function-name $function_name \
        --statement-id "apigateway-invoke-$endpoint_name" \
        --action lambda:InvokeFunction \
        --principal apigateway.amazonaws.com \
        --source-arn "arn:aws:execute-api:$REGION:$ACCOUNT_ID:$REST_API_ID/*/*" \
        --region $REGION > /dev/null
    
    echo "  ✅ Permisos configurados"
    echo "  🎉 Endpoint $endpoint_name configurado completamente"
    echo ""
}

# Lista de endpoints a crear
endpoints=(
    "proposals:OnPointAdmin-Proposals-sandbox"
    "whatsapp:OnPointAdmin-WhatsApp-sandbox"
    "analytics:OnPointAdmin-Analytics-sandbox"
    "reports:OnPointAdmin-Reports-sandbox"
    "integrations:OnPointAdmin-Integrations-sandbox"
    "editor:OnPointAdmin-Editor-sandbox"
    "tracking:OnPointAdmin-Tracking-sandbox"
    "ai-test:OnPointAdmin-AI-Test-sandbox"
)

echo "🚀 Iniciando configuración de endpoints de API Gateway..."
echo ""

# Crear cada endpoint
for endpoint_info in "${endpoints[@]}"; do
    IFS=':' read -r endpoint_name function_name <<< "$endpoint_info"
    create_endpoint "$endpoint_name" "$function_name"
done

echo "🎉 ¡Todos los endpoints configurados exitosamente!"
echo ""
echo "📋 Endpoints creados:"
for endpoint_info in "${endpoints[@]}"; do
    IFS=':' read -r endpoint_name function_name <<< "$endpoint_info"
    echo "  - /$endpoint_name (GET, POST)"
    echo "  - /$endpoint_name/{id} (GET, PUT, DELETE)"
done
echo ""
echo "🔗 URL base: https://$REST_API_ID.execute-api.$REGION.amazonaws.com/sandbox"

#!/bin/bash

# Script para configurar APIs separados para cada entorno
set -e

echo "🔧 Configurando APIs separados para cada entorno..."

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuración
REGION="us-east-1"
PROJECT_NAME="OnPointAdmin"

echo -e "${BLUE}📋 Configuración:${NC}"
echo "  - Región: $REGION"
echo "  - Proyecto: $PROJECT_NAME"
echo ""

# Función para crear API Gateway
create_api_gateway() {
    local env=$1
    local api_name="$PROJECT_NAME-$env-API"
    
    echo -e "${BLUE}🚀 Creando API Gateway para $env...${NC}"
    
    # Crear API Gateway
    API_ID=$(aws apigateway create-rest-api \
        --name "$api_name" \
        --description "API Gateway para $env" \
        --endpoint-configuration types=REGIONAL \
        --query 'id' \
        --output text)
    
    echo -e "${GREEN}✅ API Gateway creado: $API_ID${NC}"
    
    # Obtener root resource
    ROOT_RESOURCE_ID=$(aws apigateway get-resources \
        --rest-api-id "$API_ID" \
        --query 'items[0].id' \
        --output text)
    
    echo -e "${BLUE}📁 Root Resource ID: $ROOT_RESOURCE_ID${NC}"
    
    # Crear recursos
    create_resources "$API_ID" "$ROOT_RESOURCE_ID" "$env"
    
    # Crear deployment
    create_deployment "$API_ID" "$env"
    
    echo -e "${GREEN}✅ API Gateway $env configurado: $API_ID${NC}"
    echo -e "${YELLOW}🔗 URL: https://$API_ID.execute-api.$REGION.amazonaws.com/$env${NC}"
    
    # Guardar en archivo de configuración
    echo "API_ID_$env=$API_ID" >> "config/api-$env.env"
    echo "API_URL_$env=https://$API_ID.execute-api.$REGION.amazonaws.com/$env" >> "config/api-$env.env"
}

# Función para crear recursos
create_resources() {
    local api_id=$1
    local root_id=$2
    local env=$3
    
    echo -e "${BLUE}📁 Creando recursos para $env...${NC}"
    
    # Crear recurso providers
    PROVIDERS_RESOURCE_ID=$(aws apigateway create-resource \
        --rest-api-id "$api_id" \
        --parent-id "$root_id" \
        --path-part "providers" \
        --query 'id' \
        --output text)
    
    # Crear recurso products
    PRODUCTS_RESOURCE_ID=$(aws apigateway create-resource \
        --rest-api-id "$api_id" \
        --parent-id "$root_id" \
        --path-part "products" \
        --query 'id' \
        --output text)
    
    # Crear recurso users
    USERS_RESOURCE_ID=$(aws apigateway create-resource \
        --rest-api-id "$api_id" \
        --parent-id "$root_id" \
        --path-part "users" \
        --query 'id' \
        --output text)
    
    # Crear recurso stats
    STATS_RESOURCE_ID=$(aws apigateway create-resource \
        --rest-api-id "$api_id" \
        --parent-id "$root_id" \
        --path-part "stats" \
        --query 'id' \
        --output text)
    
    # Crear recurso tags
    TAGS_RESOURCE_ID=$(aws apigateway create-resource \
        --rest-api-id "$api_id" \
        --parent-id "$root_id" \
        --path-part "tags" \
        --query 'id' \
        --output text)
    
    # Crear recurso {id} para providers
    PROVIDER_ID_RESOURCE_ID=$(aws apigateway create-resource \
        --rest-api-id "$api_id" \
        --parent-id "$PROVIDERS_RESOURCE_ID" \
        --path-part "{id}" \
        --query 'id' \
        --output text)
    
    echo -e "${GREEN}✅ Recursos creados para $env${NC}"
    
    # Crear métodos
    create_methods "$api_id" "$PROVIDERS_RESOURCE_ID" "$PRODUCTS_RESOURCE_ID" "$USERS_RESOURCE_ID" "$STATS_RESOURCE_ID" "$TAGS_RESOURCE_ID" "$PROVIDER_ID_RESOURCE_ID" "$env"
}

# Función para crear métodos
create_methods() {
    local api_id=$1
    local providers_id=$2
    local products_id=$3
    local users_id=$4
    local stats_id=$5
    local tags_id=$6
    local provider_id_id=$7
    local env=$8
    
    echo -e "${BLUE}🔧 Creando métodos para $env...${NC}"
    
    # Métodos para providers
    aws apigateway put-method \
        --rest-api-id "$api_id" \
        --resource-id "$providers_id" \
        --http-method GET \
        --authorization-type NONE \
        --no-api-key-required
    
    aws apigateway put-method \
        --rest-api-id "$api_id" \
        --resource-id "$providers_id" \
        --http-method POST \
        --authorization-type NONE \
        --no-api-key-required
    
    # Métodos para products
    aws apigateway put-method \
        --rest-api-id "$api_id" \
        --resource-id "$products_id" \
        --http-method GET \
        --authorization-type NONE \
        --no-api-key-required
    
    aws apigateway put-method \
        --rest-api-id "$api_id" \
        --resource-id "$products_id" \
        --http-method POST \
        --authorization-type NONE \
        --no-api-key-required
    
    # Métodos para users
    aws apigateway put-method \
        --rest-api-id "$api_id" \
        --resource-id "$users_id" \
        --http-method GET \
        --authorization-type NONE \
        --no-api-key-required
    
    # Métodos para stats
    aws apigateway put-method \
        --rest-api-id "$api_id" \
        --resource-id "$stats_id" \
        --http-method GET \
        --authorization-type NONE \
        --no-api-key-required
    
    # Métodos para tags
    aws apigateway put-method \
        --rest-api-id "$api_id" \
        --resource-id "$tags_id" \
        --http-method GET \
        --authorization-type NONE \
        --no-api-key-required
    
    # Métodos para provider/{id}
    aws apigateway put-method \
        --rest-api-id "$api_id" \
        --resource-id "$provider_id_id" \
        --http-method PUT \
        --authorization-type NONE \
        --no-api-key-required
    
    aws apigateway put-method \
        --rest-api-id "$api_id" \
        --resource-id "$provider_id_id" \
        --http-method DELETE \
        --authorization-type NONE \
        --no-api-key-required
    
    echo -e "${GREEN}✅ Métodos creados para $env${NC}"
    
    # Crear integraciones
    create_integrations "$api_id" "$providers_id" "$products_id" "$users_id" "$stats_id" "$tags_id" "$provider_id_id" "$env"
}

# Función para crear integraciones
create_integrations() {
    local api_id=$1
    local providers_id=$2
    local products_id=$3
    local users_id=$4
    local stats_id=$5
    local tags_id=$6
    local provider_id_id=$7
    local env=$8
    
    echo -e "${BLUE}🔗 Creando integraciones para $env...${NC}"
    
    # Obtener ARN de Lambda functions (usar nombres existentes)
    PROVIDERS_LAMBDA_ARN=$(aws lambda get-function \
        --function-name "onpoint-admin-providers" \
        --query 'Configuration.FunctionArn' \
        --output text 2>/dev/null || echo "")
    
    PRODUCTS_LAMBDA_ARN=$(aws lambda get-function \
        --function-name "onpoint-products-api" \
        --query 'Configuration.FunctionArn' \
        --output text 2>/dev/null || echo "")
    
    USERS_LAMBDA_ARN=$(aws lambda get-function \
        --function-name "onpoint-admin-users" \
        --query 'Configuration.FunctionArn' \
        --output text 2>/dev/null || echo "")
    
    STATS_LAMBDA_ARN=$(aws lambda get-function \
        --function-name "onpoint-admin-stats" \
        --query 'Configuration.FunctionArn' \
        --output text 2>/dev/null || echo "")
    
    TAGS_LAMBDA_ARN=$(aws lambda get-function \
        --function-name "onpoint-admin-tags" \
        --query 'Configuration.FunctionArn' \
        --output text 2>/dev/null || echo "")
    
    # Crear integraciones si las Lambda functions existen
    if [ -n "$PROVIDERS_LAMBDA_ARN" ]; then
        # Integración para providers GET
        aws apigateway put-integration \
            --rest-api-id "$api_id" \
            --resource-id "$providers_id" \
            --http-method GET \
            --type AWS_PROXY \
            --integration-http-method POST \
            --uri "arn:aws:apigateway:$REGION:lambda:path/2015-03-31/functions/$PROVIDERS_LAMBDA_ARN/invocations"
        
        # Integración para providers POST
        aws apigateway put-integration \
            --rest-api-id "$api_id" \
            --resource-id "$providers_id" \
            --http-method POST \
            --type AWS_PROXY \
            --integration-http-method POST \
            --uri "arn:aws:apigateway:$REGION:lambda:path/2015-03-31/functions/$PROVIDERS_LAMBDA_ARN/invocations"
        
        # Integración para provider/{id} PUT
        aws apigateway put-integration \
            --rest-api-id "$api_id" \
            --resource-id "$provider_id_id" \
            --http-method PUT \
            --type AWS_PROXY \
            --integration-http-method POST \
            --uri "arn:aws:apigateway:$REGION:lambda:path/2015-03-31/functions/$PROVIDERS_LAMBDA_ARN/invocations"
        
        # Integración para provider/{id} DELETE
        aws apigateway put-integration \
            --rest-api-id "$api_id" \
            --resource-id "$provider_id_id" \
            --http-method DELETE \
            --type AWS_PROXY \
            --integration-http-method POST \
            --uri "arn:aws:apigateway:$REGION:lambda:path/2015-03-31/functions/$PROVIDERS_LAMBDA_ARN/invocations"
        
        echo -e "${GREEN}✅ Integraciones de providers creadas${NC}"
    fi
    
    if [ -n "$PRODUCTS_LAMBDA_ARN" ]; then
        # Integración para products GET
        aws apigateway put-integration \
            --rest-api-id "$api_id" \
            --resource-id "$products_id" \
            --http-method GET \
            --type AWS_PROXY \
            --integration-http-method POST \
            --uri "arn:aws:apigateway:$REGION:lambda:path/2015-03-31/functions/$PRODUCTS_LAMBDA_ARN/invocations"
        
        # Integración para products POST
        aws apigateway put-integration \
            --rest-api-id "$api_id" \
            --resource-id "$products_id" \
            --http-method POST \
            --type AWS_PROXY \
            --integration-http-method POST \
            --uri "arn:aws:apigateway:$REGION:lambda:path/2015-03-31/functions/$PRODUCTS_LAMBDA_ARN/invocations"
        
        echo -e "${GREEN}✅ Integraciones de products creadas${NC}"
    fi
    
    if [ -n "$USERS_LAMBDA_ARN" ]; then
        # Integración para users GET
        aws apigateway put-integration \
            --rest-api-id "$api_id" \
            --resource-id "$users_id" \
            --http-method GET \
            --type AWS_PROXY \
            --integration-http-method POST \
            --uri "arn:aws:apigateway:$REGION:lambda:path/2015-03-31/functions/$USERS_LAMBDA_ARN/invocations"
        
        echo -e "${GREEN}✅ Integraciones de users creadas${NC}"
    fi
    
    if [ -n "$STATS_LAMBDA_ARN" ]; then
        # Integración para stats GET
        aws apigateway put-integration \
            --rest-api-id "$api_id" \
            --resource-id "$stats_id" \
            --http-method GET \
            --type AWS_PROXY \
            --integration-http-method POST \
            --uri "arn:aws:apigateway:$REGION:lambda:path/2015-03-31/functions/$STATS_LAMBDA_ARN/invocations"
        
        echo -e "${GREEN}✅ Integraciones de stats creadas${NC}"
    fi
    
    if [ -n "$TAGS_LAMBDA_ARN" ]; then
        # Integración para tags GET
        aws apigateway put-integration \
            --rest-api-id "$api_id" \
            --resource-id "$tags_id" \
            --http-method GET \
            --type AWS_PROXY \
            --integration-http-method POST \
            --uri "arn:aws:apigateway:$REGION:lambda:path/2015-03-31/functions/$TAGS_LAMBDA_ARN/invocations"
        
        echo -e "${GREEN}✅ Integraciones de tags creadas${NC}"
    fi
}

# Función para crear deployment
create_deployment() {
    local api_id=$1
    local env=$2
    
    echo -e "${BLUE}🚀 Creando deployment para $env...${NC}"
    
    DEPLOYMENT_ID=$(aws apigateway create-deployment \
        --rest-api-id "$api_id" \
        --stage-name "$env" \
        --description "Deployment inicial para $env" \
        --query 'id' \
        --output text)
    
    echo -e "${GREEN}✅ Deployment creado: $DEPLOYMENT_ID${NC}"
}

# Función para configurar CORS
configure_cors() {
    local api_id=$1
    local env=$2
    
    echo -e "${BLUE}🔧 Configurando CORS para $env...${NC}"
    
    # Obtener recursos
    RESOURCES=$(aws apigateway get-resources --rest-api-id "$api_id" --query 'items[?resourceMethods].{Id:id,Path:pathPart,Methods:resourceMethods}' --output json)
    
    # Configurar CORS para cada recurso
    echo "$RESOURCES" | jq -r '.[] | select(.Methods != null) | .Methods | to_entries[] | "\(.key)"' | sort -u | while read -r method; do
        if [ "$method" != "OPTIONS" ]; then
            echo "$RESOURCES" | jq -r '.[] | select(.Methods != null and .Methods["'"$method"'"] != null) | "\(.Id)|\(.Path)"' | while IFS='|' read -r resource_id path; do
                if [ "$resource_id" != "null" ]; then
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
                fi
            done
        fi
    done
    
    echo -e "${GREEN}✅ CORS configurado para $env${NC}"
}

# Función principal
main() {
    echo -e "${BLUE}🚀 Configurando APIs separados para cada entorno${NC}"
    echo ""
    
    # Crear directorio de configuración
    mkdir -p config
    
    # Crear API para sandbox
    echo -e "${YELLOW}📋 Configurando API para SANDBOX...${NC}"
    create_api_gateway "sandbox"
    
    # Crear API para producción
    echo -e "${YELLOW}📋 Configurando API para PRODUCCIÓN...${NC}"
    create_api_gateway "prod"
    
    # Configurar CORS
    echo -e "${YELLOW}📋 Configurando CORS...${NC}"
    configure_cors "$API_ID_SANDBOX" "sandbox"
    configure_cors "$API_ID_PROD" "prod"
    
    echo ""
    echo -e "${GREEN}🎉 ¡APIs separados configurados exitosamente!${NC}"
    echo ""
    echo -e "${BLUE}📋 Resumen:${NC}"
    echo "  - Sandbox API: $API_ID_SANDBOX"
    echo "  - Producción API: $API_ID_PROD"
    echo ""
    echo -e "${YELLOW}📁 Archivos de configuración creados:${NC}"
    echo "  - config/api-sandbox.env"
    echo "  - config/api-prod.env"
    echo ""
    echo -e "${BLUE}🔗 URLs:${NC}"
    echo "  - Sandbox: https://$API_ID_SANDBOX.execute-api.$REGION.amazonaws.com/sandbox"
    echo "  - Producción: https://$API_ID_PROD.execute-api.$REGION.amazonaws.com/prod"
    echo ""
    echo -e "${YELLOW}⚠️  Nota: Asegúrate de que las Lambda functions existan para cada entorno${NC}"
}

# Ejecutar función principal
main "$@"

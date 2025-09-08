#!/bin/bash

# Script para arreglar API Gateway
echo "🚀 Arreglando configuración de API Gateway..."

# Configuración
REGION="us-east-1"
API_ID="7z4skk6jy0"
FUNCTION_PREFIX="onpoint-admin"

# IDs de recursos existentes
PROVIDERS_RESOURCE_ID="2zlxq1"
USERS_RESOURCE_ID="70taq0"
STATS_RESOURCE_ID="kqk8tl"

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Función para imprimir mensajes
print_info() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️ $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

# Verificar que AWS CLI esté configurado
if ! aws sts get-caller-identity > /dev/null 2>&1; then
    print_error "AWS CLI no está configurado. Ejecuta 'aws configure' primero."
    exit 1
fi

print_info "AWS CLI configurado correctamente"
print_info "Usando API ID: $API_ID"

# Función para crear integración OPTIONS (CORS)
create_cors_integration() {
    local resource_id=$1
    local method_name=$2
    
    print_info "Creando integración CORS para $method_name OPTIONS"
    
    aws apigateway put-integration \
        --rest-api-id "$API_ID" \
        --resource-id "$resource_id" \
        --http-method OPTIONS \
        --type MOCK \
        --integration-http-method OPTIONS \
        --request-templates '{"application/json": "{\"statusCode\": 200}"}' \
        --region "$REGION"
    
    if [ $? -eq 0 ]; then
        print_info "✅ Integración CORS creada para $method_name OPTIONS"
    else
        print_error "❌ Error creando integración CORS para $method_name OPTIONS"
        exit 1
    fi
    
    # Crear respuesta para OPTIONS
    aws apigateway put-integration-response \
        --rest-api-id "$API_ID" \
        --resource-id "$resource_id" \
        --http-method OPTIONS \
        --status-code 200 \
        --response-parameters '{"method.response.header.Access-Control-Allow-Headers": "'\''Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token'\''","method.response.header.Access-Control-Allow-Origin": "'\''*'\''","method.response.header.Access-Control-Allow-Methods": "'\''GET,POST,PUT,DELETE,OPTIONS'\''"}' \
        --region "$REGION"
    
    # Crear respuesta de método para OPTIONS
    aws apigateway put-method-response \
        --rest-api-id "$API_ID" \
        --resource-id "$resource_id" \
        --http-method OPTIONS \
        --status-code 200 \
        --response-parameters '{"method.response.header.Access-Control-Allow-Headers": true,"method.response.header.Access-Control-Allow-Origin": true,"method.response.header.Access-Control-Allow-Methods": true}' \
        --region "$REGION"
}

# Crear integraciones CORS
create_cors_integration "$PROVIDERS_RESOURCE_ID" "providers"
create_cors_integration "$USERS_RESOURCE_ID" "users"
create_cors_integration "$STATS_RESOURCE_ID" "stats"

# Desplegar API
print_info "Desplegando API Gateway"
aws apigateway create-deployment \
    --rest-api-id "$API_ID" \
    --stage-name "prod" \
    --region "$REGION"

if [ $? -eq 0 ]; then
    print_info "✅ API Gateway desplegado exitosamente"
else
    print_error "❌ Error desplegando API Gateway"
    exit 1
fi

# Obtener URL de la API
API_URL="https://$API_ID.execute-api.$REGION.amazonaws.com/prod"

print_info "🎉 API Gateway configurado exitosamente!"
print_info "📋 Información de la API:"
print_info "   API ID: $API_ID"
print_info "   URL: $API_URL"
print_info "   Endpoints disponibles:"
print_info "     GET  $API_URL/providers"
print_info "     POST $API_URL/providers"
print_info "     GET  $API_URL/users"
print_info "     GET  $API_URL/stats"
print_info ""
print_info "📋 Próximos pasos:"
print_info "   1. Configurar variables de entorno en Lambda functions"
print_info "   2. Probar los endpoints"
print_info "   3. Actualizar el frontend para usar la nueva API"

#!/bin/bash

# Script para arreglar CORS en API Gateway
echo "🚀 Arreglando configuración de CORS..."

# Configuración
REGION="us-east-1"
API_ID="7z4skk6jy0"

# IDs de recursos
PROVIDERS_RESOURCE_ID="2zlxq1"
USERS_RESOURCE_ID="70taq0"
STATS_RESOURCE_ID="kqk8tl"
TAGS_RESOURCE_ID="31z472"
PROVIDER_ID_RESOURCE_ID="b3n8ay"

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

# Función para configurar CORS en un recurso
configure_cors() {
    local resource_id=$1
    local resource_name=$2
    
    print_info "Configurando CORS para $resource_name"
    
    # Crear respuesta de método para OPTIONS
    aws apigateway put-method-response \
        --rest-api-id "$API_ID" \
        --resource-id "$resource_id" \
        --http-method OPTIONS \
        --status-code 200 \
        --response-parameters '{"method.response.header.Access-Control-Allow-Headers": true,"method.response.header.Access-Control-Allow-Origin": true,"method.response.header.Access-Control-Allow-Methods": true}' \
        --region "$REGION"
    
    # Crear respuesta de integración para OPTIONS
    aws apigateway put-integration-response \
        --rest-api-id "$API_ID" \
        --resource-id "$resource_id" \
        --http-method OPTIONS \
        --status-code 200 \
        --response-parameters '{"method.response.header.Access-Control-Allow-Headers": "'\''Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token'\''","method.response.header.Access-Control-Allow-Origin": "'\''*'\''","method.response.header.Access-Control-Allow-Methods": "'\''GET,POST,PUT,DELETE,OPTIONS'\''"}' \
        --region "$REGION"
    
    print_info "✅ CORS configurado para $resource_name"
}

# Configurar CORS para todos los recursos
configure_cors "$PROVIDERS_RESOURCE_ID" "providers"
configure_cors "$USERS_RESOURCE_ID" "users"
configure_cors "$STATS_RESOURCE_ID" "stats"
configure_cors "$TAGS_RESOURCE_ID" "tags"
configure_cors "$PROVIDER_ID_RESOURCE_ID" "providers/{id}"

# Desplegar API
print_info "Desplegando API Gateway con CORS actualizado"
aws apigateway create-deployment \
    --rest-api-id "$API_ID" \
    --stage-name "prod" \
    --region "$REGION"

if [ $? -eq 0 ]; then
    print_info "✅ API Gateway desplegado exitosamente con CORS"
else
    print_error "❌ Error desplegando API Gateway"
    exit 1
fi

print_info "🎉 CORS configurado exitosamente!"
print_info "📋 Ahora el frontend puede conectarse desde:"
print_info "   https://sandbox.d3ts6pwgn7uyyh.amplifyapp.com"
print_info "   https://main.d3ts6pwgn7uyyh.amplifyapp.com"
print_info "   Cualquier dominio (*)"

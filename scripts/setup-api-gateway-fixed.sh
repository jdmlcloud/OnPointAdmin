#!/bin/bash

# Script mejorado para configurar API Gateway
echo "🚀 Configurando API Gateway para OnPoint Admin (versión mejorada)..."

# Configuración
REGION="us-east-1"
API_NAME="onpoint-admin-api"
FUNCTION_PREFIX="onpoint-admin"

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

# Crear API Gateway
print_info "Creando API Gateway: $API_NAME"

API_ID=$(aws apigateway create-rest-api \
    --name "$API_NAME" \
    --description "API para OnPoint Admin" \
    --region "$REGION" \
    --query 'id' \
    --output text)

if [ $? -eq 0 ]; then
    print_info "✅ API Gateway creado con ID: $API_ID"
else
    print_error "❌ Error creando API Gateway"
    exit 1
fi

# Obtener root resource ID
ROOT_RESOURCE_ID=$(aws apigateway get-resources \
    --rest-api-id "$API_ID" \
    --region "$REGION" \
    --query 'items[?path==`/`].id' \
    --output text)

print_info "Root Resource ID: $ROOT_RESOURCE_ID"

# Función para crear recurso y esperar
create_resource_and_wait() {
    local parent_id=$1
    local path_part=$2
    local resource_name=$3
    
    print_info "Creando recurso: $resource_name"
    
    RESOURCE_ID=$(aws apigateway create-resource \
        --rest-api-id "$API_ID" \
        --parent-id "$parent_id" \
        --path-part "$path_part" \
        --region "$REGION" \
        --query 'id' \
        --output text)
    
    if [ $? -eq 0 ]; then
        print_info "✅ Recurso $resource_name creado con ID: $RESOURCE_ID"
        # Esperar un momento para que el recurso se propague
        sleep 2
        echo "$RESOURCE_ID"
    else
        print_error "❌ Error creando recurso $resource_name"
        exit 1
    fi
}

# Crear recursos principales
PROVIDERS_RESOURCE_ID=$(create_resource_and_wait "$ROOT_RESOURCE_ID" "providers" "providers")
USERS_RESOURCE_ID=$(create_resource_and_wait "$ROOT_RESOURCE_ID" "users" "users")
STATS_RESOURCE_ID=$(create_resource_and_wait "$ROOT_RESOURCE_ID" "stats" "stats")

# Función para crear método y esperar
create_method_and_wait() {
    local resource_id=$1
    local http_method=$2
    local method_name=$3
    
    print_info "Creando método $http_method para $method_name"
    
    aws apigateway put-method \
        --rest-api-id "$API_ID" \
        --resource-id "$resource_id" \
        --http-method "$http_method" \
        --authorization-type NONE \
        --region "$REGION"
    
    if [ $? -eq 0 ]; then
        print_info "✅ Método $http_method creado para $method_name"
        # Esperar un momento para que el método se propague
        sleep 2
    else
        print_error "❌ Error creando método $http_method para $method_name"
        exit 1
    fi
}

# Crear métodos para providers
create_method_and_wait "$PROVIDERS_RESOURCE_ID" "GET" "providers"
create_method_and_wait "$PROVIDERS_RESOURCE_ID" "POST" "providers"
create_method_and_wait "$PROVIDERS_RESOURCE_ID" "OPTIONS" "providers"

# Crear métodos para users
create_method_and_wait "$USERS_RESOURCE_ID" "GET" "users"
create_method_and_wait "$USERS_RESOURCE_ID" "OPTIONS" "users"

# Crear métodos para stats
create_method_and_wait "$STATS_RESOURCE_ID" "GET" "stats"
create_method_and_wait "$STATS_RESOURCE_ID" "OPTIONS" "stats"

# Función para crear integración y esperar
create_integration_and_wait() {
    local resource_id=$1
    local http_method=$2
    local function_name=$3
    local method_name=$4
    
    print_info "Creando integración Lambda para $method_name $http_method"
    
    aws apigateway put-integration \
        --rest-api-id "$API_ID" \
        --resource-id "$resource_id" \
        --http-method "$http_method" \
        --type AWS_PROXY \
        --integration-http-method POST \
        --uri "arn:aws:apigateway:$REGION:lambda:path/2015-03-31/functions/arn:aws:lambda:$REGION:$(aws sts get-caller-identity --query Account --output text):function:$function_name/invocations" \
        --region "$REGION"
    
    if [ $? -eq 0 ]; then
        print_info "✅ Integración Lambda creada para $method_name $http_method"
        # Esperar un momento para que la integración se propague
        sleep 2
    else
        print_error "❌ Error creando integración Lambda para $method_name $http_method"
        exit 1
    fi
}

# Crear integraciones para providers
create_integration_and_wait "$PROVIDERS_RESOURCE_ID" "GET" "${FUNCTION_PREFIX}-providers" "providers"
create_integration_and_wait "$PROVIDERS_RESOURCE_ID" "POST" "${FUNCTION_PREFIX}-providers" "providers"

# Crear integraciones para users
create_integration_and_wait "$USERS_RESOURCE_ID" "GET" "${FUNCTION_PREFIX}-users" "users"

# Crear integraciones para stats
create_integration_and_wait "$STATS_RESOURCE_ID" "GET" "${FUNCTION_PREFIX}-stats" "stats"

# Dar permisos a API Gateway para invocar Lambda
print_info "Configurando permisos para Lambda functions"

aws lambda add-permission \
    --function-name "${FUNCTION_PREFIX}-providers" \
    --statement-id "apigateway-invoke-$(date +%s)" \
    --action "lambda:InvokeFunction" \
    --principal "apigateway.amazonaws.com" \
    --source-arn "arn:aws:execute-api:$REGION:$(aws sts get-caller-identity --query Account --output text):$API_ID/*/*" \
    --region "$REGION"

aws lambda add-permission \
    --function-name "${FUNCTION_PREFIX}-users" \
    --statement-id "apigateway-invoke-$(date +%s)" \
    --action "lambda:InvokeFunction" \
    --principal "apigateway.amazonaws.com" \
    --source-arn "arn:aws:execute-api:$REGION:$(aws sts get-caller-identity --query Account --output text):$API_ID/*/*" \
    --region "$REGION"

aws lambda add-permission \
    --function-name "${FUNCTION_PREFIX}-stats" \
    --statement-id "apigateway-invoke-$(date +%s)" \
    --action "lambda:InvokeFunction" \
    --principal "apigateway.amazonaws.com" \
    --source-arn "arn:aws:execute-api:$REGION:$(aws sts get-caller-identity --query Account --output text):$API_ID/*/*" \
    --region "$REGION"

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
print_info "   4. Configurar el dominio personalizado (opcional)"

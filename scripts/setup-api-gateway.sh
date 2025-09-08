#!/bin/bash

# Script para configurar API Gateway
echo "🚀 Configurando API Gateway para OnPoint Admin..."

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

# Crear recursos
create_resource() {
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
        echo "$RESOURCE_ID"
    else
        print_error "❌ Error creando recurso $resource_name"
        exit 1
    fi
}

# Crear recursos principales
PROVIDERS_RESOURCE_ID=$(create_resource "$ROOT_RESOURCE_ID" "providers" "providers")
USERS_RESOURCE_ID=$(create_resource "$ROOT_RESOURCE_ID" "users" "users")
STATS_RESOURCE_ID=$(create_resource "$ROOT_RESOURCE_ID" "stats" "stats")

# Crear método GET para providers
print_info "Creando método GET para providers"
aws apigateway put-method \
    --rest-api-id "$API_ID" \
    --resource-id "$PROVIDERS_RESOURCE_ID" \
    --http-method GET \
    --authorization-type NONE \
    --region "$REGION"

# Crear método POST para providers
print_info "Creando método POST para providers"
aws apigateway put-method \
    --rest-api-id "$API_ID" \
    --resource-id "$PROVIDERS_RESOURCE_ID" \
    --http-method POST \
    --authorization-type NONE \
    --region "$REGION"

# Crear método OPTIONS para CORS
print_info "Creando método OPTIONS para CORS"
aws apigateway put-method \
    --rest-api-id "$API_ID" \
    --resource-id "$PROVIDERS_RESOURCE_ID" \
    --http-method OPTIONS \
    --authorization-type NONE \
    --region "$REGION"

# Crear método GET para users
print_info "Creando método GET para users"
aws apigateway put-method \
    --rest-api-id "$API_ID" \
    --resource-id "$USERS_RESOURCE_ID" \
    --http-method GET \
    --authorization-type NONE \
    --region "$REGION"

# Crear método GET para stats
print_info "Creando método GET para stats"
aws apigateway put-method \
    --rest-api-id "$API_ID" \
    --resource-id "$STATS_RESOURCE_ID" \
    --http-method GET \
    --authorization-type NONE \
    --region "$REGION"

# Crear integración con Lambda para providers GET
print_info "Creando integración Lambda para providers GET"
aws apigateway put-integration \
    --rest-api-id "$API_ID" \
    --resource-id "$PROVIDERS_RESOURCE_ID" \
    --http-method GET \
    --type AWS_PROXY \
    --integration-http-method POST \
    --uri "arn:aws:apigateway:$REGION:lambda:path/2015-03-31/functions/arn:aws:lambda:$REGION:$(aws sts get-caller-identity --query Account --output text):function:${FUNCTION_PREFIX}-providers/invocations" \
    --region "$REGION"

# Crear integración con Lambda para providers POST
print_info "Creando integración Lambda para providers POST"
aws apigateway put-integration \
    --rest-api-id "$API_ID" \
    --resource-id "$PROVIDERS_RESOURCE_ID" \
    --http-method POST \
    --type AWS_PROXY \
    --integration-http-method POST \
    --uri "arn:aws:apigateway:$REGION:lambda:path/2015-03-31/functions/arn:aws:lambda:$REGION:$(aws sts get-caller-identity --query Account --output text):function:${FUNCTION_PREFIX}-providers/invocations" \
    --region "$REGION"

# Crear integración con Lambda para users GET
print_info "Creando integración Lambda para users GET"
aws apigateway put-integration \
    --rest-api-id "$API_ID" \
    --resource-id "$USERS_RESOURCE_ID" \
    --http-method GET \
    --type AWS_PROXY \
    --integration-http-method POST \
    --uri "arn:aws:apigateway:$REGION:lambda:path/2015-03-31/functions/arn:aws:lambda:$REGION:$(aws sts get-caller-identity --query Account --output text):function:${FUNCTION_PREFIX}-users/invocations" \
    --region "$REGION"

# Crear integración con Lambda para stats GET
print_info "Creando integración Lambda para stats GET"
aws apigateway put-integration \
    --rest-api-id "$API_ID" \
    --resource-id "$STATS_RESOURCE_ID" \
    --http-method GET \
    --type AWS_PROXY \
    --integration-http-method POST \
    --uri "arn:aws:apigateway:$REGION:lambda:path/2015-03-31/functions/arn:aws:lambda:$REGION:$(aws sts get-caller-identity --query Account --output text):function:${FUNCTION_PREFIX}-stats/invocations" \
    --region "$REGION"

# Dar permisos a API Gateway para invocar Lambda
print_info "Configurando permisos para Lambda functions"

aws lambda add-permission \
    --function-name "${FUNCTION_PREFIX}-providers" \
    --statement-id "apigateway-invoke" \
    --action "lambda:InvokeFunction" \
    --principal "apigateway.amazonaws.com" \
    --source-arn "arn:aws:execute-api:$REGION:$(aws sts get-caller-identity --query Account --output text):$API_ID/*/*" \
    --region "$REGION"

aws lambda add-permission \
    --function-name "${FUNCTION_PREFIX}-users" \
    --statement-id "apigateway-invoke" \
    --action "lambda:InvokeFunction" \
    --principal "apigateway.amazonaws.com" \
    --source-arn "arn:aws:execute-api:$REGION:$(aws sts get-caller-identity --query Account --output text):$API_ID/*/*" \
    --region "$REGION"

aws lambda add-permission \
    --function-name "${FUNCTION_PREFIX}-stats" \
    --statement-id "apigateway-invoke" \
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
print_info "   2. Crear las tablas de DynamoDB"
print_info "   3. Actualizar el frontend para usar la nueva API"
print_info "   4. Probar los endpoints"

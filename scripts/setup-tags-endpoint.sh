#!/bin/bash

# Script para configurar endpoint de tags
echo "🚀 Configurando endpoint de tags..."

# Configuración
REGION="us-east-1"
API_ID="7z4skk6jy0"
FUNCTION_PREFIX="onpoint-admin"

# IDs de recursos existentes
ROOT_RESOURCE_ID="d2cg1mzpz9"

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

# Crear recurso tags
print_info "Creando recurso tags..."

TAGS_RESOURCE_ID=$(aws apigateway create-resource \
    --rest-api-id "$API_ID" \
    --parent-id "$ROOT_RESOURCE_ID" \
    --path-part "tags" \
    --region "$REGION" \
    --query 'id' \
    --output text)

if [ $? -eq 0 ]; then
    print_info "✅ Recurso tags creado con ID: $TAGS_RESOURCE_ID"
else
    print_error "❌ Error creando recurso tags"
    exit 1
fi

# Crear método GET para tags
print_info "Creando método GET para tags"
aws apigateway put-method \
    --rest-api-id "$API_ID" \
    --resource-id "$TAGS_RESOURCE_ID" \
    --http-method GET \
    --authorization-type NONE \
    --region "$REGION"

# Crear método OPTIONS para CORS
print_info "Creando método OPTIONS para CORS"
aws apigateway put-method \
    --rest-api-id "$API_ID" \
    --resource-id "$TAGS_RESOURCE_ID" \
    --http-method OPTIONS \
    --authorization-type NONE \
    --region "$REGION"

# Crear integración Lambda para tags GET
print_info "Creando integración Lambda para tags GET"
aws apigateway put-integration \
    --rest-api-id "$API_ID" \
    --resource-id "$TAGS_RESOURCE_ID" \
    --http-method GET \
    --type AWS_PROXY \
    --integration-http-method POST \
    --uri "arn:aws:apigateway:$REGION:lambda:path/2015-03-31/functions/arn:aws:lambda:$REGION:$(aws sts get-caller-identity --query Account --output text):function:${FUNCTION_PREFIX}-tags/invocations" \
    --region "$REGION"

# Crear integración CORS para OPTIONS
print_info "Creando integración CORS para tags OPTIONS"
aws apigateway put-integration \
    --rest-api-id "$API_ID" \
    --resource-id "$TAGS_RESOURCE_ID" \
    --http-method OPTIONS \
    --type MOCK \
    --integration-http-method OPTIONS \
    --request-templates '{"application/json": "{\"statusCode\": 200}"}' \
    --region "$REGION"

# Dar permisos a API Gateway para invocar Lambda
print_info "Configurando permisos para Lambda function de tags"

aws lambda add-permission \
    --function-name "${FUNCTION_PREFIX}-tags" \
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

print_info "🎉 Endpoint de tags configurado exitosamente!"
print_info "📋 Endpoints disponibles:"
print_info "     GET    /providers"
print_info "     POST   /providers"
print_info "     PUT    /providers/{id}"
print_info "     DELETE /providers/{id}"
print_info "     GET    /users"
print_info "     GET    /stats"
print_info "     GET    /tags"

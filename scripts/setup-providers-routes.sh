#!/bin/bash

# Script para configurar rutas con parámetros para providers
echo "🚀 Configurando rutas con parámetros para providers..."

# Configuración
REGION="us-east-1"
API_ID="7z4skk6jy0"
FUNCTION_PREFIX="onpoint-admin"

# IDs de recursos existentes
PROVIDERS_RESOURCE_ID="2zlxq1"

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

# Crear recurso {id} bajo providers
print_info "Creando recurso {id} bajo providers..."

PROVIDER_ID_RESOURCE_ID=$(aws apigateway create-resource \
    --rest-api-id "$API_ID" \
    --parent-id "$PROVIDERS_RESOURCE_ID" \
    --path-part "{id}" \
    --region "$REGION" \
    --query 'id' \
    --output text)

if [ $? -eq 0 ]; then
    print_info "✅ Recurso {id} creado con ID: $PROVIDER_ID_RESOURCE_ID"
else
    print_error "❌ Error creando recurso {id}"
    exit 1
fi

# Crear métodos PUT y DELETE para providers/{id}
print_info "Creando método PUT para providers/{id}"
aws apigateway put-method \
    --rest-api-id "$API_ID" \
    --resource-id "$PROVIDER_ID_RESOURCE_ID" \
    --http-method PUT \
    --authorization-type NONE \
    --region "$REGION"

print_info "Creando método DELETE para providers/{id}"
aws apigateway put-method \
    --rest-api-id "$API_ID" \
    --resource-id "$PROVIDER_ID_RESOURCE_ID" \
    --http-method DELETE \
    --authorization-type NONE \
    --region "$REGION"

# Crear integraciones para PUT y DELETE
print_info "Creando integración Lambda para providers/{id} PUT"
aws apigateway put-integration \
    --rest-api-id "$API_ID" \
    --resource-id "$PROVIDER_ID_RESOURCE_ID" \
    --http-method PUT \
    --type AWS_PROXY \
    --integration-http-method POST \
    --uri "arn:aws:apigateway:$REGION:lambda:path/2015-03-31/functions/arn:aws:lambda:$REGION:$(aws sts get-caller-identity --query Account --output text):function:${FUNCTION_PREFIX}-providers/invocations" \
    --region "$REGION"

print_info "Creando integración Lambda para providers/{id} DELETE"
aws apigateway put-integration \
    --rest-api-id "$API_ID" \
    --resource-id "$PROVIDER_ID_RESOURCE_ID" \
    --http-method DELETE \
    --type AWS_PROXY \
    --integration-http-method POST \
    --uri "arn:aws:apigateway:$REGION:lambda:path/2015-03-31/functions/arn:aws:lambda:$REGION:$(aws sts get-caller-identity --query Account --output text):function:${FUNCTION_PREFIX}-providers/invocations" \
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

print_info "🎉 Rutas con parámetros configuradas exitosamente!"
print_info "📋 Endpoints disponibles:"
print_info "     GET    /providers"
print_info "     POST   /providers"
print_info "     PUT    /providers/{id}"
print_info "     DELETE /providers/{id}"

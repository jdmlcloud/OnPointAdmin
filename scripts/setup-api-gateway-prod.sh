#!/bin/bash

# Script para configurar API Gateway de producción
echo "🌐 Configurando API Gateway de producción..."

# Configuración
API_ID="9o43ckvise"
REGION="us-east-1"
STAGE="prod"

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
print_info "Configurando API Gateway: $API_ID"

# Crear recursos si no existen
print_info "Creando recursos del API Gateway..."

# Crear recurso /notifications
aws apigateway create-resource \
  --rest-api-id $API_ID \
  --parent-id $(aws apigateway get-resources --rest-api-id $API_ID --query 'items[?path==`/`].id' --output text) \
  --path-part notifications \
  --region $REGION || print_warning "Recurso /notifications ya existe"

# Crear recurso /productivity
aws apigateway create-resource \
  --rest-api-id $API_ID \
  --parent-id $(aws apigateway get-resources --rest-api-id $API_ID --query 'items[?path==`/`].id' --output text) \
  --path-part productivity \
  --region $REGION || print_warning "Recurso /productivity ya existe"

# Crear recurso /system
aws apigateway create-resource \
  --rest-api-id $API_ID \
  --parent-id $(aws apigateway get-resources --rest-api-id $API_ID --query 'items[?path==`/`].id' --output text) \
  --path-part system \
  --region $REGION || print_warning "Recurso /system ya existe"

# Crear recurso /health
aws apigateway create-resource \
  --rest-api-id $API_ID \
  --parent-id $(aws apigateway get-resources --rest-api-id $API_ID --query 'items[?path==`/`].id' --output text) \
  --path-part health \
  --region $REGION || print_warning "Recurso /health ya existe"

print_info "✅ Recursos del API Gateway creados"

# Obtener IDs de recursos
NOTIFICATIONS_RESOURCE_ID=$(aws apigateway get-resources --rest-api-id $API_ID --query 'items[?pathPart==`notifications`].id' --output text)
PRODUCTIVITY_RESOURCE_ID=$(aws apigateway get-resources --rest-api-id $API_ID --query 'items[?pathPart==`productivity`].id' --output text)
SYSTEM_RESOURCE_ID=$(aws apigateway get-resources --rest-api-id $API_ID --query 'items[?pathPart==`system`].id' --output text)
HEALTH_RESOURCE_ID=$(aws apigateway get-resources --rest-api-id $API_ID --query 'items[?pathPart==`health`].id' --output text)

print_info "IDs de recursos obtenidos:"
print_info "  - Notifications: $NOTIFICATIONS_RESOURCE_ID"
print_info "  - Productivity: $PRODUCTIVITY_RESOURCE_ID"
print_info "  - System: $SYSTEM_RESOURCE_ID"
print_info "  - Health: $HEALTH_RESOURCE_ID"

# Crear métodos HTTP
print_info "Creando métodos HTTP..."

# GET /notifications
aws apigateway put-method \
  --rest-api-id $API_ID \
  --resource-id $NOTIFICATIONS_RESOURCE_ID \
  --http-method GET \
  --authorization-type NONE \
  --region $REGION || print_warning "Método GET /notifications ya existe"

# GET /productivity
aws apigateway put-method \
  --rest-api-id $API_ID \
  --resource-id $PRODUCTIVITY_RESOURCE_ID \
  --http-method GET \
  --authorization-type NONE \
  --region $REGION || print_warning "Método GET /productivity ya existe"

# GET /system
aws apigateway put-method \
  --rest-api-id $API_ID \
  --resource-id $SYSTEM_RESOURCE_ID \
  --http-method GET \
  --authorization-type NONE \
  --region $REGION || print_warning "Método GET /system ya existe"

# GET /health
aws apigateway put-method \
  --rest-api-id $API_ID \
  --resource-id $HEALTH_RESOURCE_ID \
  --http-method GET \
  --authorization-type NONE \
  --region $REGION || print_warning "Método GET /health ya existe"

print_info "✅ Métodos HTTP creados"

# Crear integraciones
print_info "Creando integraciones con Lambda..."

# Integración /notifications
aws apigateway put-integration \
  --rest-api-id $API_ID \
  --resource-id $NOTIFICATIONS_RESOURCE_ID \
  --http-method GET \
  --type AWS_PROXY \
  --integration-http-method POST \
  --uri arn:aws:apigateway:us-east-1:lambda:path/2015-03-31/functions/arn:aws:lambda:us-east-1:$(aws sts get-caller-identity --query Account --output text):function:OnPointAdmin-notifications-prod/invocations \
  --region $REGION || print_warning "Integración /notifications ya existe"

# Integración /productivity
aws apigateway put-integration \
  --rest-api-id $API_ID \
  --resource-id $PRODUCTIVITY_RESOURCE_ID \
  --http-method GET \
  --type AWS_PROXY \
  --integration-http-method POST \
  --uri arn:aws:apigateway:us-east-1:lambda:path/2015-03-31/functions/arn:aws:lambda:us-east-1:$(aws sts get-caller-identity --query Account --output text):function:OnPointAdmin-productivity-prod/invocations \
  --region $REGION || print_warning "Integración /productivity ya existe"

# Integración /system
aws apigateway put-integration \
  --rest-api-id $API_ID \
  --resource-id $SYSTEM_RESOURCE_ID \
  --http-method GET \
  --type AWS_PROXY \
  --integration-http-method POST \
  --uri arn:aws:apigateway:us-east-1:lambda:path/2015-03-31/functions/arn:aws:lambda:us-east-1:$(aws sts get-caller-identity --query Account --output text):function:OnPointAdmin-system-metrics-prod/invocations \
  --region $REGION || print_warning "Integración /system ya existe"

# Integración /health
aws apigateway put-integration \
  --rest-api-id $API_ID \
  --resource-id $HEALTH_RESOURCE_ID \
  --http-method GET \
  --type AWS_PROXY \
  --integration-http-method POST \
  --uri arn:aws:apigateway:us-east-1:lambda:path/2015-03-31/functions/arn:aws:lambda:us-east-1:$(aws sts get-caller-identity --query Account --output text):function:OnPointAdmin-health-check-prod/invocations \
  --region $REGION || print_warning "Integración /health ya existe"

print_info "✅ Integraciones creadas"

# Dar permisos a Lambda para ser invocada por API Gateway
print_info "Configurando permisos de Lambda..."

aws lambda add-permission \
  --function-name OnPointAdmin-notifications-prod \
  --statement-id apigateway-invoke \
  --action lambda:InvokeFunction \
  --principal apigateway.amazonaws.com \
  --source-arn "arn:aws:execute-api:us-east-1:$(aws sts get-caller-identity --query Account --output text):$API_ID/*/*" \
  --region $REGION || print_warning "Permiso para notifications ya existe"

aws lambda add-permission \
  --function-name OnPointAdmin-productivity-prod \
  --statement-id apigateway-invoke \
  --action lambda:InvokeFunction \
  --principal apigateway.amazonaws.com \
  --source-arn "arn:aws:execute-api:us-east-1:$(aws sts get-caller-identity --query Account --output text):$API_ID/*/*" \
  --region $REGION || print_warning "Permiso para productivity ya existe"

aws lambda add-permission \
  --function-name OnPointAdmin-system-metrics-prod \
  --statement-id apigateway-invoke \
  --action lambda:InvokeFunction \
  --principal apigateway.amazonaws.com \
  --source-arn "arn:aws:execute-api:us-east-1:$(aws sts get-caller-identity --query Account --output text):$API_ID/*/*" \
  --region $REGION || print_warning "Permiso para system-metrics ya existe"

aws lambda add-permission \
  --function-name OnPointAdmin-health-check-prod \
  --statement-id apigateway-invoke \
  --action lambda:InvokeFunction \
  --principal apigateway.amazonaws.com \
  --source-arn "arn:aws:execute-api:us-east-1:$(aws sts get-caller-identity --query Account --output text):$API_ID/*/*" \
  --region $REGION || print_warning "Permiso para health-check ya existe"

print_info "✅ Permisos configurados"

# Desplegar API
print_info "Desplegando API Gateway..."

aws apigateway create-deployment \
  --rest-api-id $API_ID \
  --stage-name $STAGE \
  --region $REGION || print_warning "Deployment ya existe"

print_info "✅ API Gateway configurado exitosamente"
print_info "🌐 URL de producción: https://$API_ID.execute-api.us-east-1.amazonaws.com/$STAGE"
print_info "📊 Endpoints disponibles:"
print_info "  - GET /notifications"
print_info "  - GET /productivity"
print_info "  - GET /system"
print_info "  - GET /health"

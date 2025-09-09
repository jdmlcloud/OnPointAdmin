#!/bin/bash

# Script para desplegar Lambda functions
echo "🚀 Desplegando Lambda functions..."

# Configuración
STAGE=${1:-sandbox}
REGION="us-east-1"

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
print_info "Desplegando a entorno: $STAGE"

# Función para desplegar una Lambda
deploy_lambda() {
    local function_name=$1
    local zip_file=$2
    local handler=$3
    local description=$4
    
    echo "📦 Desplegando $function_name..."
    
    # Crear el ZIP si no existe
    if [ ! -f "$zip_file" ]; then
        echo "📦 Creando ZIP para $function_name..."
        cd lambda-functions/$function_name
        zip -r ../$zip_file . -x "*.zip" "node_modules/*" "*.log"
        cd ../..
    fi
    
    # Crear o actualizar la función Lambda
    aws lambda create-function \
        --function-name "OnPointAdmin-$function_name-$STAGE" \
        --runtime nodejs18.x \
        --role arn:aws:iam::$(aws sts get-caller-identity --query Account --output text):role/lambda-execution-role \
        --handler $handler \
        --zip-file fileb://$zip_file \
        --description "$description" \
        --timeout 30 \
        --memory-size 256 \
        --region $REGION \
        --environment Variables="{STAGE=$STAGE,AWS_REGION=$REGION}" \
        --output table || \
    aws lambda update-function-code \
        --function-name "OnPointAdmin-$function_name-$STAGE" \
        --zip-file fileb://$zip_file \
        --region $REGION \
        --output table
    
    if [ $? -eq 0 ]; then
        print_info "✅ $function_name desplegada exitosamente"
    else
        print_error "❌ Error desplegando $function_name"
    fi
}

# Desplegar las funciones principales
deploy_lambda "notifications" "notifications-lambda.zip" "index.handler" "Notificaciones y alertas del dashboard"
deploy_lambda "productivity" "productivity-lambda.zip" "index.handler" "Métricas de productividad del dashboard"
deploy_lambda "system-metrics" "system-metrics-lambda.zip" "index.handler" "Métricas del sistema y CloudWatch"
deploy_lambda "health-check" "health-check-lambda.zip" "index.handler" "Health checks para servicios AWS"

# Desplegar funciones de datos
deploy_lambda "users" "users-lambda.zip" "index.handler" "Gestión de usuarios"
deploy_lambda "products" "products-lambda.zip" "index.handler" "Gestión de productos"
deploy_lambda "providers" "providers-lambda.zip" "index.handler" "Gestión de proveedores"
deploy_lambda "logos" "logos-lambda.zip" "index.handler" "Gestión de logos y clientes"

# Desplegar funciones de herramientas
deploy_lambda "quotations" "quotations-lambda.zip" "index.handler" "Sistema de cotizaciones"
deploy_lambda "proposals" "proposals-lambda.zip" "index.handler" "Propuestas comerciales"
deploy_lambda "whatsapp" "whatsapp-lambda.zip" "index.handler" "WhatsApp + IA"
deploy_lambda "analytics" "analytics-lambda.zip" "index.handler" "Métricas y análisis"
deploy_lambda "reports" "reports-lambda.zip" "index.handler" "Reportes del sistema"
deploy_lambda "tracking" "tracking-lambda.zip" "index.handler" "Envío y seguimiento"
deploy_lambda "editor" "editor-lambda.zip" "index.handler" "Editor visual"
deploy_lambda "integrations" "integrations-lambda.zip" "index.handler" "APIs y conexiones"

print_info "✅ Todas las Lambda functions desplegadas exitosamente a $STAGE"
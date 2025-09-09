#!/bin/bash

# Script para desplegar las Lambda functions del dashboard
echo "🚀 Desplegando Lambda functions del dashboard..."

# Configuración
API_ID="m4ijnyg5da"
REGION="us-east-1"
STAGE="sandbox"

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
        --output table || \
    aws lambda update-function-code \
        --function-name "OnPointAdmin-$function_name-$STAGE" \
        --zip-file fileb://$zip_file \
        --region $REGION \
        --output table
}

# Desplegar las funciones
deploy_lambda "notifications" "notifications-lambda.zip" "index.handler" "Notificaciones y alertas del dashboard"
deploy_lambda "productivity" "productivity-lambda.zip" "index.handler" "Métricas de productividad del dashboard"
deploy_lambda "system-metrics" "system-metrics-lambda.zip" "index.handler" "Métricas del sistema y CloudWatch"

echo "✅ Lambda functions desplegadas exitosamente!"

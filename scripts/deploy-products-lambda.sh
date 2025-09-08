#!/bin/bash

# Script para desplegar la función Lambda de productos
set -e

echo "🚀 Desplegando función Lambda de productos..."

# Variables
FUNCTION_NAME="onpoint-products-api"
ROLE_NAME="lambda-execution-role"
REGION="us-east-1"

# Crear el archivo ZIP
echo "📦 Creando archivo ZIP..."
cd lambda-functions/products
zip -r products-lambda.zip index.js
cd ../..

# Verificar si el rol existe
echo "🔍 Verificando rol IAM..."
if ! aws iam get-role --role-name $ROLE_NAME >/dev/null 2>&1; then
    echo "❌ El rol $ROLE_NAME no existe. Ejecuta primero setup-lambda-role.sh"
    exit 1
fi

# Obtener el ARN del rol
ROLE_ARN=$(aws iam get-role --role-name $ROLE_NAME --query 'Role.Arn' --output text)
echo "✅ Rol encontrado: $ROLE_ARN"

# Verificar si la función ya existe
if aws lambda get-function --function-name $FUNCTION_NAME >/dev/null 2>&1; then
    echo "🔄 Actualizando función Lambda existente..."
    aws lambda update-function-code \
        --function-name $FUNCTION_NAME \
        --zip-file fileb://lambda-functions/products/products-lambda.zip
    
    aws lambda update-function-configuration \
        --function-name $FUNCTION_NAME \
        --role $ROLE_ARN \
        --handler index.handler \
        --runtime nodejs18.x \
        --timeout 30 \
        --memory-size 256
else
    echo "🆕 Creando nueva función Lambda..."
    aws lambda create-function \
        --function-name $FUNCTION_NAME \
        --runtime nodejs18.x \
        --role $ROLE_ARN \
        --handler index.handler \
        --zip-file fileb://lambda-functions/products/products-lambda.zip \
        --timeout 30 \
        --memory-size 256 \
        --description "API para gestión de productos OnPoint"
fi

# Limpiar archivo ZIP
rm lambda-functions/products/products-lambda.zip

echo "✅ Función Lambda de productos desplegada exitosamente!"
echo "📋 Información de la función:"
aws lambda get-function --function-name $FUNCTION_NAME --query 'Configuration.{FunctionName:FunctionName,Runtime:Runtime,Role:Role,Handler:Handler,Timeout:Timeout,MemorySize:MemorySize}' --output table

echo ""
echo "🔗 Próximos pasos:"
echo "1. Ejecutar: ./scripts/setup-api-gateway-products.sh"
echo "2. Probar la API: curl https://7z4skk6jy0.execute-api.us-east-1.amazonaws.com/prod/products"

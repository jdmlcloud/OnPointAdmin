#!/bin/bash

# Script para desplegar Lambda functions del sistema de usuarios a AWS
# Configuración para entorno sandbox

set -e

echo "🚀 Desplegando Lambda functions del sistema de usuarios a AWS Sandbox..."

# Configuración
REGION="us-east-1"
ENVIRONMENT="sandbox"
PROJECT_NAME="OnPointAdmin"

# Variables de entorno para sandbox
ENV_VARS='ENVIRONMENT='$ENVIRONMENT',PROJECT_NAME='$PROJECT_NAME',REGION='$REGION',LOG_LEVEL=DEBUG,DYNAMODB_USERS_TABLE=OnPointAdmin-Users-sandbox,DYNAMODB_ROLES_TABLE=OnPointAdmin-Roles-sandbox,DYNAMODB_PERMISSIONS_TABLE=OnPointAdmin-Permissions-sandbox,DYNAMODB_PROVIDERS_TABLE=OnPointAdmin-Providers-sandbox,DYNAMODB_PRODUCTS_TABLE=OnPointAdmin-Products-sandbox,DYNAMODB_TAGS_TABLE=OnPointAdmin-Tags-sandbox,DYNAMODB_REGION='$REGION

# Función para crear o actualizar Lambda
deploy_lambda() {
    local function_name=$1
    local function_dir=$2
    local description=$3
    
    echo "📦 Procesando $function_name..."
    
    # Crear directorio temporal
    local temp_dir="/tmp/$function_name"
    mkdir -p "$temp_dir"
    
    # Copiar archivos
    cp "lambda-functions/$function_dir/index.js" "$temp_dir/"
    cp "lambda-functions/$function_dir/package.json" "$temp_dir/"
    
    # Instalar dependencias
    cd "$temp_dir"
    npm install --production --silent
    
    # Crear ZIP
    zip -r "$function_name.zip" . -q
    
    # Verificar si la función existe
    if aws lambda get-function --function-name "$function_name" --region "$REGION" >/dev/null 2>&1; then
        echo "🔄 Actualizando función existente: $function_name"
        aws lambda update-function-code \
            --function-name "$function_name" \
            --zip-file "fileb://$function_name.zip" \
            --region "$REGION" >/dev/null
        
        aws lambda update-function-configuration \
            --function-name "$function_name" \
            --description "$description" \
            --environment "Variables={ENVIRONMENT=$ENVIRONMENT,PROJECT_NAME=$PROJECT_NAME,REGION=$REGION,LOG_LEVEL=DEBUG,DYNAMODB_USERS_TABLE=OnPointAdmin-Users-sandbox,DYNAMODB_ROLES_TABLE=OnPointAdmin-Roles-sandbox,DYNAMODB_PERMISSIONS_TABLE=OnPointAdmin-Permissions-sandbox,DYNAMODB_PROVIDERS_TABLE=OnPointAdmin-Providers-sandbox,DYNAMODB_PRODUCTS_TABLE=OnPointAdmin-Products-sandbox,DYNAMODB_TAGS_TABLE=OnPointAdmin-Tags-sandbox,DYNAMODB_REGION=$REGION}" \
            --region "$REGION" >/dev/null
    else
        echo "🆕 Creando nueva función: $function_name"
        aws lambda create-function \
            --function-name "$function_name" \
            --runtime nodejs18.x \
            --role arn:aws:iam::209350187548:role/lambda-execution-role \
            --handler index.handler \
            --zip-file "fileb://$function_name.zip" \
            --description "$description" \
            --environment "Variables={ENVIRONMENT=$ENVIRONMENT,PROJECT_NAME=$PROJECT_NAME,REGION=$REGION,LOG_LEVEL=DEBUG,DYNAMODB_USERS_TABLE=OnPointAdmin-Users-sandbox,DYNAMODB_ROLES_TABLE=OnPointAdmin-Roles-sandbox,DYNAMODB_PERMISSIONS_TABLE=OnPointAdmin-Permissions-sandbox,DYNAMODB_PROVIDERS_TABLE=OnPointAdmin-Providers-sandbox,DYNAMODB_PRODUCTS_TABLE=OnPointAdmin-Products-sandbox,DYNAMODB_TAGS_TABLE=OnPointAdmin-Tags-sandbox,DYNAMODB_REGION=$REGION}" \
            --timeout 30 \
            --memory-size 256 \
            --region "$REGION" >/dev/null
    fi
    
    # Limpiar
    cd - >/dev/null
    rm -rf "$temp_dir"
    
    echo "✅ $function_name desplegada correctamente"
}

# Desplegar funciones del sistema de usuarios
deploy_lambda "OnPointAdmin-Auth-$ENVIRONMENT" "auth" "Sistema de autenticación OnPoint Admin"
deploy_lambda "OnPointAdmin-Users-$ENVIRONMENT" "users" "Gestión de usuarios OnPoint Admin"
deploy_lambda "OnPointAdmin-Roles-$ENVIRONMENT" "roles" "Gestión de roles OnPoint Admin"
deploy_lambda "OnPointAdmin-Permissions-$ENVIRONMENT" "permissions" "Gestión de permisos OnPoint Admin"

echo ""
echo "🎉 Todas las Lambda functions del sistema de usuarios han sido desplegadas a AWS Sandbox!"
echo ""
echo "📋 Funciones desplegadas:"
echo "  - OnPointAdmin-Auth-sandbox"
echo "  - OnPointAdmin-Users-sandbox"
echo "  - OnPointAdmin-Roles-sandbox"
echo "  - OnPointAdmin-Permissions-sandbox"
echo ""
echo "🔧 Configuración:"
echo "  - Entorno: $ENVIRONMENT"
echo "  - Región: $REGION"
echo "  - Tablas: OnPointAdmin-*-sandbox"
echo ""
echo "✅ Listo para configurar API Gateway y probar en sandbox"

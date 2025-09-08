#!/bin/bash

# Script para desplegar las Lambda functions
echo "🚀 Desplegando Lambda functions para OnPoint Admin..."

# Configuración
REGION="us-east-1"
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

# Crear directorio temporal
TEMP_DIR=$(mktemp -d)
print_info "Directorio temporal creado: $TEMP_DIR"

# Función para crear y desplegar una Lambda function
deploy_function() {
    local function_name=$1
    local source_dir=$2
    local zip_file="$TEMP_DIR/${function_name}.zip"
    
    print_info "Desplegando función: $function_name"
    
    # Crear directorio para la función
    mkdir -p "$TEMP_DIR/$function_name"
    
    # Copiar archivos
    cp "$source_dir/index.js" "$TEMP_DIR/$function_name/"
    cp lambda-functions/package.json "$TEMP_DIR/$function_name/"
    
    # Instalar dependencias
    cd "$TEMP_DIR/$function_name"
    npm install --production
    cd - > /dev/null
    
    # Crear ZIP
    cd "$TEMP_DIR/$function_name"
    zip -r "$zip_file" . > /dev/null
    cd - > /dev/null
    
    # Verificar si la función existe
    if aws lambda get-function --function-name "$function_name" --region "$REGION" > /dev/null 2>&1; then
        print_info "Actualizando función existente: $function_name"
        aws lambda update-function-code \
            --function-name "$function_name" \
            --zip-file "fileb://$zip_file" \
            --region "$REGION"
    else
        print_info "Creando nueva función: $function_name"
        aws lambda create-function \
            --function-name "$function_name" \
            --runtime nodejs18.x \
            --role arn:aws:iam::$(aws sts get-caller-identity --query Account --output text):role/lambda-execution-role \
            --handler index.handler \
            --zip-file "fileb://$zip_file" \
            --region "$REGION" \
            --timeout 30 \
            --memory-size 256
    fi
    
    if [ $? -eq 0 ]; then
        print_info "✅ Función $function_name desplegada exitosamente"
    else
        print_error "❌ Error desplegando función $function_name"
        exit 1
    fi
}

# Desplegar funciones
deploy_function "${FUNCTION_PREFIX}-providers" "lambda-functions/providers"
deploy_function "${FUNCTION_PREFIX}-users" "lambda-functions/users"
deploy_function "${FUNCTION_PREFIX}-stats" "lambda-functions/stats"

# Limpiar directorio temporal
rm -rf "$TEMP_DIR"
print_info "Directorio temporal limpiado"

print_info "🎉 Todas las Lambda functions han sido desplegadas exitosamente!"
print_info "📋 Próximos pasos:"
print_info "   1. Configurar API Gateway"
print_info "   2. Crear las tablas de DynamoDB"
print_info "   3. Configurar variables de entorno en Lambda"
print_info "   4. Probar las funciones"

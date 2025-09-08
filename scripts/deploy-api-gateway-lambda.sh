#!/bin/bash

# Script principal para desplegar API Gateway + Lambda
echo "🚀 Desplegando API Gateway + Lambda para OnPoint Admin..."

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
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

print_step() {
    echo -e "${BLUE}🔧 $1${NC}"
}

# Verificar que AWS CLI esté configurado
if ! aws sts get-caller-identity > /dev/null 2>&1; then
    print_error "AWS CLI no está configurado. Ejecuta 'aws configure' primero."
    exit 1
fi

print_info "AWS CLI configurado correctamente"

# Paso 1: Configurar DynamoDB
print_step "Paso 1: Configurando DynamoDB..."
./scripts/setup-dynamodb-lambda.sh
if [ $? -ne 0 ]; then
    print_error "Error configurando DynamoDB"
    exit 1
fi

# Paso 2: Desplegar Lambda functions
print_step "Paso 2: Desplegando Lambda functions..."
./scripts/deploy-lambda.sh
if [ $? -ne 0 ]; then
    print_error "Error desplegando Lambda functions"
    exit 1
fi

# Paso 3: Configurar API Gateway
print_step "Paso 3: Configurando API Gateway..."
./scripts/setup-api-gateway.sh
if [ $? -ne 0 ]; then
    print_error "Error configurando API Gateway"
    exit 1
fi

print_info "🎉 ¡Deployment completado exitosamente!"
print_info "📋 Resumen del deployment:"
print_info "   ✅ DynamoDB configurado"
print_info "   ✅ Lambda functions desplegadas"
print_info "   ✅ API Gateway configurado"
print_info ""
print_info "📋 Próximos pasos:"
print_info "   1. Obtener la URL de la API desde el output anterior"
print_info "   2. Actualizar el frontend para usar la nueva API"
print_info "   3. Probar los endpoints"
print_info "   4. Configurar el dominio personalizado (opcional)"
print_info ""
print_info "🔗 Para probar los endpoints:"
print_info "   curl https://[API-ID].execute-api.us-east-1.amazonaws.com/prod/providers"
print_info "   curl https://[API-ID].execute-api.us-east-1.amazonaws.com/prod/users"
print_info "   curl https://[API-ID].execute-api.us-east-1.amazonaws.com/prod/stats"

#!/bin/bash

# Script para ejecutar health checks
echo "🏥 Ejecutando health checks..."

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
print_info "Ejecutando health checks para entorno: $STAGE"

# Función para ejecutar health check
run_health_check() {
    local function_name=$1
    local endpoint=$2
    
    echo "🔍 Verificando $function_name..."
    
    # Invocar la función Lambda directamente
    aws lambda invoke \
        --function-name "OnPointAdmin-$function_name-$STAGE" \
        --payload '{"httpMethod":"GET","resource":"'$endpoint'","pathParameters":null}' \
        --region $REGION \
        /tmp/response.json
    
    if [ $? -eq 0 ]; then
        # Leer la respuesta
        response=$(cat /tmp/response.json)
        echo "📊 Respuesta: $response"
        
        # Verificar si la respuesta indica éxito
        if echo "$response" | grep -q '"success":true'; then
            print_info "✅ $function_name está funcionando correctamente"
            return 0
        else
            print_warning "⚠️ $function_name respondió pero con advertencias"
            return 1
        fi
    else
        print_error "❌ Error invocando $function_name"
        return 1
    fi
}

# Ejecutar health checks
echo "🏥 Iniciando health checks del sistema..."

# Health check general
run_health_check "health-check" "/health"

# Health checks específicos
run_health_check "health-check" "/health/dynamodb"
run_health_check "health-check" "/health/lambda"
run_health_check "health-check" "/health/apigateway"

# Health checks de servicios principales
run_health_check "notifications" "/notifications"
run_health_check "productivity" "/productivity/metrics"
run_health_check "system-metrics" "/system/metrics"

# Health checks de datos
run_health_check "users" "/users"
run_health_check "products" "/products"
run_health_check "providers" "/providers"
run_health_check "logos" "/logos"

print_info "🏥 Health checks completados"
print_info "📊 Revisa los logs de CloudWatch para más detalles"

# Limpiar archivos temporales
rm -f /tmp/response.json

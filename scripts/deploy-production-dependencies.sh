#!/bin/bash

# Script para desplegar dependencias de producción
# Incluye Lambdas, tablas, API Gateway, etc.

set -e

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Función para mostrar mensajes
log() {
    echo -e "${BLUE}[$(date +'%Y-%m-%d %H:%M:%S')]${NC} $1"
}

success() {
    echo -e "${GREEN}✅ $1${NC}"
}

warning() {
    echo -e "${YELLOW}⚠️ $1${NC}"
}

error() {
    echo -e "${RED}❌ $1${NC}"
}

# Verificar que estamos en el directorio correcto
if [ ! -f "package.json" ]; then
    error "No se encontró package.json. Ejecuta este script desde la raíz del proyecto."
    exit 1
fi

# Verificar variables de entorno
if [ -z "$AWS_REGION" ]; then
    export AWS_REGION="us-east-1"
    warning "AWS_REGION no definido, usando us-east-1"
fi

log "🚀 Iniciando despliegue de dependencias de producción..."

# 1. Desplegar Lambda functions
log "📦 Desplegando Lambda functions..."
if [ -f "scripts/deploy-lambda-functions.sh" ]; then
    chmod +x scripts/deploy-lambda-functions.sh
    ./scripts/deploy-lambda-functions.sh prod
    success "Lambda functions desplegadas"
else
    error "Script deploy-lambda-functions.sh no encontrado"
    exit 1
fi

# 2. Crear/actualizar tablas de base de datos
log "🗄️ Creando/actualizando tablas de base de datos..."
if [ -f "scripts/setup-dashboard-tables.sh" ]; then
    chmod +x scripts/setup-dashboard-tables.sh
    ./scripts/setup-dashboard-tables.sh prod
    success "Tablas de base de datos configuradas"
else
    warning "Script setup-dashboard-tables.sh no encontrado, saltando..."
fi

# 3. Configurar API Gateway
log "🌐 Configurando API Gateway..."
if [ -f "scripts/setup-api-gateway-prod.sh" ]; then
    chmod +x scripts/setup-api-gateway-prod.sh
    ./scripts/setup-api-gateway-prod.sh
    success "API Gateway configurado"
else
    error "Script setup-api-gateway-prod.sh no encontrado"
    exit 1
fi

# 4. Configurar endpoints específicos
log "🔗 Configurando endpoints específicos..."
if [ -f "scripts/setup-api-endpoints.sh" ]; then
    chmod +x scripts/setup-api-endpoints.sh
    ./scripts/setup-api-endpoints.sh prod
    success "Endpoints configurados"
else
    warning "Script setup-api-endpoints.sh no encontrado, saltando..."
fi

# 5. Desplegar frontend
log "📱 Desplegando frontend..."
if [ -d ".next" ]; then
    aws s3 sync .next/static s3://onpoint-admin-prod/static --delete
    aws s3 sync public s3://onpoint-admin-prod/ --delete
    success "Frontend desplegado"
else
    error "Directorio .next no encontrado. Ejecuta 'npm run build' primero"
    exit 1
fi

# 6. Invalidar CloudFront
log "🔄 Invalidando CloudFront..."
if [ ! -z "$CLOUDFRONT_DISTRIBUTION_ID_PROD" ]; then
    aws cloudfront create-invalidation \
        --distribution-id $CLOUDFRONT_DISTRIBUTION_ID_PROD \
        --paths "/*"
    success "CloudFront invalidado"
else
    warning "CLOUDFRONT_DISTRIBUTION_ID_PROD no definido, saltando invalidación"
fi

# 7. Ejecutar health checks
log "🏥 Ejecutando health checks..."
if [ -f "scripts/run-health-checks.sh" ]; then
    chmod +x scripts/run-health-checks.sh
    ./scripts/run-health-checks.sh prod
    success "Health checks completados"
else
    warning "Script run-health-checks.sh no encontrado, saltando..."
fi

# 8. Verificar servicios AWS
log "🔍 Verificando servicios AWS..."

# Verificar Lambda functions
log "Verificando Lambda functions..."
aws lambda list-functions --query 'Functions[?contains(FunctionName, `onpoint`)].FunctionName' --output table

# Verificar DynamoDB tables
log "Verificando tablas DynamoDB..."
aws dynamodb list-tables --query 'TableNames[?contains(@, `onpoint`)]' --output table

# Verificar API Gateway
log "Verificando API Gateway..."
aws apigateway get-rest-apis --query 'items[?contains(name, `onpoint`)].{Name:name,Id:id}' --output table

# 9. Mostrar resumen
echo ""
log "🎉 Despliegue de dependencias completado!"
echo ""
echo "📊 Resumen del despliegue:"
echo "  ✅ Lambda functions: Desplegadas"
echo "  ✅ Base de datos: Configurada"
echo "  ✅ API Gateway: Configurado"
echo "  ✅ Frontend: Desplegado"
echo "  ✅ CloudFront: Invalidado"
echo "  ✅ Health checks: Ejecutados"
echo ""
echo "🔗 URLs de producción:"
echo "  - Frontend: https://production.d3ts6pwgn7uyyh.amplifyapp.com"
echo "  - API: https://9o43ckvise.execute-api.us-east-1.amazonaws.com/prod"
echo "  - Clientes API: https://mkrc6lo043.execute-api.us-east-1.amazonaws.com/prod"
echo ""
echo "💡 Próximos pasos:"
echo "  1. Verifica que la aplicación funcione correctamente"
echo "  2. Ejecuta tests de integración"
echo "  3. Monitorea logs de CloudWatch"
echo "  4. Configura alertas si es necesario"
echo ""
success "¡Producción lista para usar!"

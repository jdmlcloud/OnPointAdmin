#!/bin/bash

# Script para configurar el dominio actual
set -e

echo "🌐 Configurando dominio actual de Amplify..."

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

ENVIRONMENT="sandbox"
API_ID="7z4skk6jy0"
STAGE="prod"

# URLs actuales
API_URL="https://7z4skk6jy0.execute-api.us-east-1.amazonaws.com/prod"
APP_URL="https://sandbox.d3ts6pwgn7uyyh.amplifyapp.com"

echo -e "${BLUE}🌐 Configurando entorno: $ENVIRONMENT${NC}"
echo -e "${BLUE}📋 URLs actuales:${NC}"
echo "  - API: $API_URL"
echo "  - App: $APP_URL"

# 1. Verificar que la API funciona
echo -e "${BLUE}🔍 Verificando que la API funciona...${NC}"
API_STATUS=$(curl -s -o /dev/null -w "%{http_code}" "$API_URL/providers")

if [ "$API_STATUS" = "200" ]; then
    echo -e "${GREEN}✅ API funcionando correctamente${NC}"
else
    echo -e "${RED}❌ API no responde correctamente (Status: $API_STATUS)${NC}"
    exit 1
fi

# 2. Verificar que la app funciona
echo -e "${BLUE}🔍 Verificando que la app funciona...${NC}"
APP_STATUS=$(curl -s -o /dev/null -w "%{http_code}" "$APP_URL")

if [ "$APP_STATUS" = "200" ]; then
    echo -e "${GREEN}✅ App funcionando correctamente${NC}"
else
    echo -e "${YELLOW}⚠️ App no responde correctamente (Status: $APP_STATUS)${NC}"
fi

# 3. Crear archivo de configuración
echo -e "${BLUE}📝 Creando archivo de configuración...${NC}"
mkdir -p config

cat > "config/current-domain-$ENVIRONMENT.env" << EOF
# Configuración de dominio actual para $ENVIRONMENT
ENVIRONMENT=$ENVIRONMENT
API_ID=$API_ID
STAGE=$STAGE
API_BASE_URL=$API_URL
APP_BASE_URL=$APP_URL
THROTTLE_RATE=500
THROTTLE_BURST=1000
LOG_LEVEL=DEBUG
MONITORING_ENABLED=true
LOG_GROUP_NAME=/aws/apigateway/$ENVIRONMENT
EOF

echo -e "${GREEN}✅ Archivo de configuración creado: config/current-domain-$ENVIRONMENT.env${NC}"

# 4. Mostrar resumen
echo -e "${GREEN}🎉 ¡Configuración completada!${NC}"
echo ""
echo -e "${BLUE}📋 Resumen de configuración:${NC}"
echo "  - Entorno: $ENVIRONMENT"
echo "  - API: $API_URL"
echo "  - App: $APP_URL"
echo "  - API ID: $API_ID"
echo "  - Stage: $STAGE"
echo ""
echo -e "${YELLOW}📋 URLs para usar:${NC}"
echo "  - API: $API_URL"
echo "  - App: $APP_URL"
echo "  - Login: $APP_URL/auth/signin"
echo ""
echo -e "${BLUE}🔗 URLs de administración:${NC}"
echo "  - API Gateway: https://console.aws.amazon.com/apigateway/home?region=us-east-1"
echo "  - Amplify: https://console.aws.amazon.com/amplify/home?region=us-east-1"
echo "  - CloudWatch: https://console.aws.amazon.com/cloudwatch/home?region=us-east-1"

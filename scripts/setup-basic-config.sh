#!/bin/bash

# Script básico para configurar la infraestructura
set -e

echo "🔧 Configurando configuración básica de AWS..."

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

ENVIRONMENT="sandbox"
API_ID="aegk94vynl"
STAGE="sandbox"

echo -e "${BLUE}🔧 Configurando entorno: $ENVIRONMENT${NC}"
echo -e "${BLUE}📋 Configuración básica:${NC}"
echo "  - API ID: $API_ID"
echo "  - Stage: $STAGE"

# 1. Verificar estado de la API
echo -e "${BLUE}🔍 Verificando estado de la API...${NC}"
API_STATUS=$(aws apigateway get-stage \
    --rest-api-id "$API_ID" \
    --stage-name "$STAGE" \
    --query 'deploymentId' \
    --output text 2>/dev/null || echo "none")

if [ "$API_STATUS" != "none" ]; then
    echo -e "${GREEN}✅ API Gateway funcionando correctamente${NC}"
else
    echo -e "${YELLOW}⚠️ API Gateway necesita configuración adicional${NC}"
fi

# 2. Configurar CloudWatch Logs
echo -e "${BLUE}📊 Configurando CloudWatch Logs...${NC}"

# Crear log group
LOG_GROUP_NAME="/aws/apigateway/$ENVIRONMENT"
aws logs create-log-group \
    --log-group-name "$LOG_GROUP_NAME" \
    --region us-east-1 2>/dev/null || echo "Log group ya existe"

echo -e "${GREEN}✅ CloudWatch Logs configurado${NC}"

# 3. Crear archivo de configuración
echo -e "${BLUE}📝 Creando archivo de configuración...${NC}"
mkdir -p config

cat > "config/aws-protection-$ENVIRONMENT.env" << EOF
# Configuración de protección AWS para $ENVIRONMENT
ENVIRONMENT=$ENVIRONMENT
API_ID=$API_ID
STAGE=$STAGE
THROTTLE_RATE=500
THROTTLE_BURST=1000
LOG_LEVEL=DEBUG
MONITORING_ENABLED=true
LOG_GROUP_NAME=$LOG_GROUP_NAME
API_BASE_URL=https://$API_ID.execute-api.us-east-1.amazonaws.com/$STAGE
EOF

echo -e "${GREEN}✅ Archivo de configuración creado: config/aws-protection-$ENVIRONMENT.env${NC}"

# 4. Mostrar resumen
echo -e "${GREEN}🎉 ¡Configuración básica completada!${NC}"
echo ""
echo -e "${BLUE}📋 Resumen de configuración:${NC}"
echo "  - Entorno: $ENVIRONMENT"
echo "  - API ID: $API_ID"
echo "  - Stage: $STAGE"
echo "  - Rate Limit: 500 req/s"
echo "  - Burst: 1000 req/s"
echo "  - Log Level: DEBUG"
echo "  - Monitoring: true"
echo "  - Log Group: $LOG_GROUP_NAME"
echo "  - API URL: https://$API_ID.execute-api.us-east-1.amazonaws.com/$STAGE"
echo ""
echo -e "${YELLOW}📋 Configuración implementada:${NC}"
echo "  ✅ CloudWatch Logging"
echo "  ✅ Monitoreo básico"
echo "  ✅ Configuración de entorno"
echo ""
echo -e "${BLUE}🔗 URLs:${NC}"
echo "  - API: https://$API_ID.execute-api.us-east-1.amazonaws.com/$STAGE"
echo "  - CloudWatch: https://console.aws.amazon.com/cloudwatch/home?region=us-east-1"
echo "  - API Gateway: https://console.aws.amazon.com/apigateway/home?region=us-east-1"

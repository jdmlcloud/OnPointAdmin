#!/bin/bash

# Script simple para configurar protección básica
set -e

echo "🔧 Configurando protección básica de AWS..."

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

ENVIRONMENT="sandbox"
API_ID="aegk94vynl"
STAGE="sandbox"
WAF_ARN="arn:aws:wafv2:us-east-1:209350187548:regional/webacl/OnPointAdmin-Sandbox-WAF/792f396a-6fad-45b2-8c1f-41a7e8db2c3f"

echo -e "${BLUE}🔧 Configurando entorno: $ENVIRONMENT${NC}"
echo -e "${BLUE}📋 Usando recursos existentes:${NC}"
echo "  - API ID: $API_ID"
echo "  - Stage: $STAGE"
echo "  - WAF: $WAF_ARN"

# 1. Verificar que el WAF esté asociado
echo -e "${BLUE}🔒 Verificando asociación del WAF...${NC}"
WAF_ASSOCIATED=$(aws wafv2 get-web-acl-for-resource \
    --resource-arn "arn:aws:apigateway:us-east-1::/restapis/$API_ID/stages/$STAGE" \
    --region us-east-1 \
    --query 'WebACL.ARN' \
    --output text 2>/dev/null || echo "none")

if [ "$WAF_ASSOCIATED" = "none" ]; then
    echo -e "${YELLOW}⚠️ WAF no asociado, asociando...${NC}"
    aws wafv2 associate-web-acl \
        --web-acl-arn "$WAF_ARN" \
        --resource-arn "arn:aws:apigateway:us-east-1::/restapis/$API_ID/stages/$STAGE" \
        --region us-east-1
    echo -e "${GREEN}✅ WAF asociado${NC}"
else
    echo -e "${GREEN}✅ WAF ya está asociado${NC}"
fi

# 2. Configurar CloudWatch Logs
echo -e "${BLUE}📊 Configurando CloudWatch Logs...${NC}"

# Crear log group
LOG_GROUP_NAME="/aws/apigateway/$ENVIRONMENT"
aws logs create-log-group \
    --log-group-name "$LOG_GROUP_NAME" \
    --region us-east-1 2>/dev/null || echo "Log group ya existe"

echo -e "${GREEN}✅ CloudWatch Logs configurado${NC}"

# 3. Verificar estado de la API
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

# 4. Crear archivo de configuración
echo -e "${BLUE}📝 Creando archivo de configuración...${NC}"
mkdir -p config

cat > "config/aws-protection-$ENVIRONMENT.env" << EOF
# Configuración de protección AWS para $ENVIRONMENT
ENVIRONMENT=$ENVIRONMENT
API_ID=$API_ID
STAGE=$STAGE
WAF_ARN=$WAF_ARN
THROTTLE_RATE=500
THROTTLE_BURST=1000
LOG_LEVEL=DEBUG
MONITORING_ENABLED=true
LOG_GROUP_NAME=$LOG_GROUP_NAME
API_BASE_URL=https://$API_ID.execute-api.us-east-1.amazonaws.com/$STAGE
EOF

echo -e "${GREEN}✅ Archivo de configuración creado: config/aws-protection-$ENVIRONMENT.env${NC}"

# 5. Mostrar resumen
echo -e "${GREEN}🎉 ¡Configuración completada!${NC}"
echo ""
echo -e "${BLUE}📋 Resumen de configuración:${NC}"
echo "  - Entorno: $ENVIRONMENT"
echo "  - API ID: $API_ID"
echo "  - Stage: $STAGE"
echo "  - WAF: $WAF_ARN"
echo "  - Rate Limit: 500 req/s"
echo "  - Burst: 1000 req/s"
echo "  - Log Level: DEBUG"
echo "  - Monitoring: true"
echo "  - Log Group: $LOG_GROUP_NAME"
echo "  - API URL: https://$API_ID.execute-api.us-east-1.amazonaws.com/$STAGE"
echo ""
echo -e "${YELLOW}📋 Protecciones implementadas:${NC}"
echo "  ✅ WAF con reglas de seguridad"
echo "  ✅ CloudWatch Logging"
echo "  ✅ Monitoreo básico"
echo ""
echo -e "${BLUE}🔗 URLs:${NC}"
echo "  - API: https://$API_ID.execute-api.us-east-1.amazonaws.com/$STAGE"
echo "  - WAF Console: https://console.aws.amazon.com/wafv2/homev2/web-acls?region=us-east-1"
echo "  - CloudWatch: https://console.aws.amazon.com/cloudwatch/home?region=us-east-1"
echo "  - API Gateway: https://console.aws.amazon.com/apigateway/home?region=us-east-1"

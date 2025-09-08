#!/bin/bash

# Script para configurar dominio personalizado y protección AWS
set -e

echo "🌐 Configurando dominio personalizado y protección AWS..."

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Función para mostrar ayuda
show_help() {
    echo "Uso: $0 [ENVIRONMENT] [DOMAIN]"
    echo ""
    echo "Argumentos:"
    echo "  ENVIRONMENT  - sandbox o production"
    echo "  DOMAIN       - Dominio personalizado (ej: api.onpoint.com)"
    echo ""
    echo "Ejemplos:"
    echo "  $0 sandbox api-sandbox.onpoint.com"
    echo "  $0 production api.onpoint.com"
}

# Verificar argumentos
if [ $# -lt 2 ]; then
    show_help
    exit 1
fi

ENVIRONMENT=$1
DOMAIN=$2

# Validar entorno
if [[ "$ENVIRONMENT" != "sandbox" && "$ENVIRONMENT" != "production" ]]; then
    echo -e "${RED}❌ Entorno inválido. Usa: sandbox o production${NC}"
    exit 1
fi

echo -e "${BLUE}🔧 Configurando entorno: $ENVIRONMENT${NC}"
echo -e "${BLUE}🌐 Dominio: $DOMAIN${NC}"

# Configurar variables según el entorno
if [ "$ENVIRONMENT" = "production" ]; then
    API_ID="7z4skk6jy0"  # API de producción
    STAGE="prod"
    CERTIFICATE_DOMAIN="*.onpoint.com"
    WAF_NAME="OnPointAdmin-Production-WAF"
    THROTTLE_RATE=1000
    THROTTLE_BURST=2000
else
    API_ID="aegk94vynl"  # API de sandbox
    STAGE="sandbox"
    CERTIFICATE_DOMAIN="*.sandbox.onpoint.com"
    WAF_NAME="OnPointAdmin-Sandbox-WAF"
    THROTTLE_RATE=500
    THROTTLE_BURST=1000
fi

echo -e "${YELLOW}📋 Configuración:${NC}"
echo "  - API ID: $API_ID"
echo "  - Stage: $STAGE"
echo "  - Dominio: $DOMAIN"
echo "  - Certificado: $CERTIFICATE_DOMAIN"
echo "  - WAF: $WAF_NAME"
echo "  - Rate Limit: $THROTTLE_RATE req/s"
echo "  - Burst: $THROTTLE_BURST req/s"

# 1. Crear certificado SSL
echo -e "${BLUE}🔐 Creando certificado SSL...${NC}"
CERTIFICATE_ARN=$(aws acm request-certificate \
    --domain-name "$DOMAIN" \
    --subject-alternative-names "$CERTIFICATE_DOMAIN" \
    --validation-method DNS \
    --region us-east-1 \
    --query 'CertificateArn' \
    --output text)

echo -e "${GREEN}✅ Certificado creado: $CERTIFICATE_ARN${NC}"

# 2. Crear WAF para protección
echo -e "${BLUE}🛡️ Creando WAF para protección...${NC}"

# Crear Web ACL
WAF_ARN=$(aws wafv2 create-web-acl \
    --name "$WAF_NAME" \
    --scope REGIONAL \
    --default-action Allow={} \
    --rules '[
        {
            "Name": "RateLimitRule",
            "Priority": 1,
            "Statement": {
                "RateBasedStatement": {
                    "Limit": '$THROTTLE_RATE',
                    "AggregateKeyType": "IP"
                }
            },
            "Action": {
                "Block": {}
            },
            "VisibilityConfig": {
                "SampledRequestsEnabled": true,
                "CloudWatchMetricsEnabled": true,
                "MetricName": "RateLimitRule"
            }
        },
        {
            "Name": "AWSManagedRulesCommonRuleSet",
            "Priority": 2,
            "OverrideAction": {
                "None": {}
            },
            "Statement": {
                "ManagedRuleGroupStatement": {
                    "VendorName": "AWS",
                    "Name": "AWSManagedRulesCommonRuleSet"
                }
            },
            "VisibilityConfig": {
                "SampledRequestsEnabled": true,
                "CloudWatchMetricsEnabled": true,
                "MetricName": "AWSManagedRulesCommonRuleSet"
            }
        }
    ]' \
    --visibility-config SampledRequestsEnabled=true,CloudWatchMetricsEnabled=true,MetricName="$WAF_NAME" \
    --region us-east-1 \
    --query 'Summary.ARN' \
    --output text)

echo -e "${GREEN}✅ WAF creado: $WAF_ARN${NC}"

# 3. Crear dominio personalizado en API Gateway
echo -e "${BLUE}🌐 Creando dominio personalizado en API Gateway...${NC}"

# Esperar a que el certificado esté listo
echo -e "${YELLOW}⏳ Esperando a que el certificado esté listo...${NC}"
aws acm wait certificate-validated --certificate-arn "$CERTIFICATE_ARN" --region us-east-1

# Crear dominio personalizado
aws apigateway create-domain-name \
    --domain-name "$DOMAIN" \
    --certificate-arn "$CERTIFICATE_ARN" \
    --endpoint-configuration types=REGIONAL \
    --security-policy TLS_1_2 \
    --query 'domainName' \
    --output text

echo -e "${GREEN}✅ Dominio personalizado creado: $DOMAIN${NC}"

# 4. Crear base path mapping
echo -e "${BLUE}🔗 Creando base path mapping...${NC}"
aws apigateway create-base-path-mapping \
    --domain-name "$DOMAIN" \
    --rest-api-id "$API_ID" \
    --stage "$STAGE" \
    --base-path ""

echo -e "${GREEN}✅ Base path mapping creado${NC}"

# 5. Configurar throttling
echo -e "${BLUE}⚡ Configurando throttling...${NC}"
aws apigateway update-stage \
    --rest-api-id "$API_ID" \
    --stage-name "$STAGE" \
    --patch-ops '[
        {
            "op": "replace",
            "path": "/throttle/rateLimit",
            "value": "'$THROTTLE_RATE'"
        },
        {
            "op": "replace",
            "path": "/throttle/burstLimit",
            "value": "'$THROTTLE_BURST'"
        }
    ]'

echo -e "${GREEN}✅ Throttling configurado${NC}"

# 6. Asociar WAF al API Gateway
echo -e "${BLUE}🔒 Asociando WAF al API Gateway...${NC}"
aws wafv2 associate-web-acl \
    --web-acl-arn "$WAF_ARN" \
    --resource-arn "arn:aws:apigateway:us-east-1::/restapis/$API_ID/stages/$STAGE" \
    --region us-east-1

echo -e "${GREEN}✅ WAF asociado al API Gateway${NC}"

# 7. Crear archivo de configuración
echo -e "${BLUE}📝 Creando archivo de configuración...${NC}"
cat > "config/api-$ENVIRONMENT.env" << EOF
# Configuración API $ENVIRONMENT
API_BASE_URL=https://$DOMAIN
API_ID=$API_ID
STAGE=$STAGE
CERTIFICATE_ARN=$CERTIFICATE_ARN
WAF_ARN=$WAF_ARN
THROTTLE_RATE=$THROTTLE_RATE
THROTTLE_BURST=$THROTTLE_BURST
ENVIRONMENT=$ENVIRONMENT
EOF

echo -e "${GREEN}✅ Archivo de configuración creado: config/api-$ENVIRONMENT.env${NC}"

# 8. Mostrar resumen
echo -e "${GREEN}🎉 ¡Configuración completada!${NC}"
echo ""
echo -e "${BLUE}📋 Resumen de configuración:${NC}"
echo "  - Entorno: $ENVIRONMENT"
echo "  - Dominio: https://$DOMAIN"
echo "  - API ID: $API_ID"
echo "  - Stage: $STAGE"
echo "  - Certificado: $CERTIFICATE_ARN"
echo "  - WAF: $WAF_ARN"
echo "  - Rate Limit: $THROTTLE_RATE req/s"
echo "  - Burst: $THROTTLE_BURST req/s"
echo ""
echo -e "${YELLOW}📋 Próximos pasos:${NC}"
echo "  1. Configurar DNS para apuntar a $DOMAIN"
echo "  2. Actualizar variables de entorno en la aplicación"
echo "  3. Probar la API con el nuevo dominio"
echo "  4. Configurar monitoreo y alertas"
echo ""
echo -e "${BLUE}🔗 URLs:${NC}"
echo "  - API: https://$DOMAIN"
echo "  - AWS Console: https://console.aws.amazon.com/apigateway/home?region=us-east-1"
echo "  - WAF Console: https://console.aws.amazon.com/wafv2/homev2/web-acls?region=us-east-1"

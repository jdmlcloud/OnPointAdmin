#!/bin/bash

# Script para configurar dominio gratuito
set -e

echo "🌐 Configurando dominio gratuito para OnPoint Admin..."

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Función para mostrar ayuda
show_help() {
    echo "Uso: $0 [ENVIRONMENT] [DOMAIN_TYPE]"
    echo ""
    echo "Argumentos:"
    echo "  ENVIRONMENT  - sandbox o production"
    echo "  DOMAIN_TYPE  - free (usar dominio gratuito) o custom (dominio personalizado)"
    echo ""
    echo "Ejemplos:"
    echo "  $0 sandbox free"
    echo "  $0 production custom"
}

# Verificar argumentos
if [ $# -lt 2 ]; then
    show_help
    exit 1
fi

ENVIRONMENT=$1
DOMAIN_TYPE=$2

# Validar entorno
if [[ "$ENVIRONMENT" != "sandbox" && "$ENVIRONMENT" != "production" ]]; then
    echo -e "${RED}❌ Entorno inválido. Usa: sandbox o production${NC}"
    exit 1
fi

echo -e "${BLUE}🌐 Configurando dominio para: $ENVIRONMENT${NC}"
echo -e "${BLUE}🔧 Tipo de dominio: $DOMAIN_TYPE${NC}"

# Configurar variables según el entorno
if [ "$ENVIRONMENT" = "production" ]; then
    API_ID="7z4skk6jy0"
    STAGE="prod"
    if [ "$DOMAIN_TYPE" = "free" ]; then
        DOMAIN="onpoint-admin.tk"
        API_SUBDOMAIN="api.onpoint-admin.tk"
        APP_SUBDOMAIN="app.onpoint-admin.tk"
    else
        DOMAIN="onpoint.com"
        API_SUBDOMAIN="api.onpoint.com"
        APP_SUBDOMAIN="app.onpoint.com"
    fi
else
    API_ID="7z4skk6jy0"
    STAGE="prod"
    if [ "$DOMAIN_TYPE" = "free" ]; then
        DOMAIN="onpoint-sandbox.tk"
        API_SUBDOMAIN="api.onpoint-sandbox.tk"
        APP_SUBDOMAIN="app.onpoint-sandbox.tk"
    else
        DOMAIN="onpoint.com"
        API_SUBDOMAIN="api-sandbox.onpoint.com"
        APP_SUBDOMAIN="app-sandbox.onpoint.com"
    fi
fi

echo -e "${YELLOW}📋 Configuración:${NC}"
echo "  - Entorno: $ENVIRONMENT"
echo "  - Dominio: $DOMAIN"
echo "  - API: $API_SUBDOMAIN"
echo "  - App: $APP_SUBDOMAIN"
echo "  - API ID: $API_ID"
echo "  - Stage: $STAGE"

# 1. Crear certificado SSL
echo -e "${BLUE}🔐 Creando certificado SSL...${NC}"
CERTIFICATE_ARN=$(aws acm request-certificate \
    --domain-name "$DOMAIN" \
    --subject-alternative-names "*.$DOMAIN" \
    --validation-method DNS \
    --region us-east-1 \
    --query 'CertificateArn' \
    --output text)

echo -e "${GREEN}✅ Certificado creado: $CERTIFICATE_ARN${NC}"

# 2. Obtener registros de validación DNS
echo -e "${BLUE}📋 Obteniendo registros de validación DNS...${NC}"
VALIDATION_RECORDS=$(aws acm describe-certificate \
    --certificate-arn "$CERTIFICATE_ARN" \
    --region us-east-1 \
    --query 'Certificate.DomainValidationOptions[].ResourceRecord' \
    --output json)

echo -e "${YELLOW}📝 Registros de validación DNS:${NC}"
echo "$VALIDATION_RECORDS" | jq -r '.[] | "\(.Name) \(.Type) \(.Value)"'

# 3. Crear dominio personalizado en API Gateway
echo -e "${BLUE}🌐 Creando dominio personalizado en API Gateway...${NC}"

# Esperar a que el certificado esté listo
echo -e "${YELLOW}⏳ Esperando a que el certificado esté listo...${NC}"
aws acm wait certificate-validated --certificate-arn "$CERTIFICATE_ARN" --region us-east-1

# Crear dominio personalizado
aws apigateway create-domain-name \
    --domain-name "$API_SUBDOMAIN" \
    --certificate-arn "$CERTIFICATE_ARN" \
    --endpoint-configuration types=REGIONAL \
    --security-policy TLS_1_2 \
    --query 'domainName' \
    --output text

echo -e "${GREEN}✅ Dominio personalizado creado: $API_SUBDOMAIN${NC}"

# 4. Crear base path mapping
echo -e "${BLUE}🔗 Creando base path mapping...${NC}"
aws apigateway create-base-path-mapping \
    --domain-name "$API_SUBDOMAIN" \
    --rest-api-id "$API_ID" \
    --stage "$STAGE" \
    --base-path ""

echo -e "${GREEN}✅ Base path mapping creado${NC}"

# 5. Crear archivo de configuración
echo -e "${BLUE}📝 Creando archivo de configuración...${NC}"
mkdir -p config

cat > "config/domain-$ENVIRONMENT.env" << EOF
# Configuración de dominio para $ENVIRONMENT
DOMAIN=$DOMAIN
API_SUBDOMAIN=$API_SUBDOMAIN
APP_SUBDOMAIN=$APP_SUBDOMAIN
CERTIFICATE_ARN=$CERTIFICATE_ARN
API_ID=$API_ID
STAGE=$STAGE
ENVIRONMENT=$ENVIRONMENT
API_BASE_URL=https://$API_SUBDOMAIN
EOF

echo -e "${GREEN}✅ Archivo de configuración creado: config/domain-$ENVIRONMENT.env${NC}"

# 6. Mostrar resumen
echo -e "${GREEN}🎉 ¡Dominio configurado!${NC}"
echo ""
echo -e "${BLUE}📋 Resumen de configuración:${NC}"
echo "  - Entorno: $ENVIRONMENT"
echo "  - Dominio: $DOMAIN"
echo "  - API: https://$API_SUBDOMAIN"
echo "  - App: https://$APP_SUBDOMAIN"
echo "  - Certificado: $CERTIFICATE_ARN"
echo ""
echo -e "${YELLOW}📋 Próximos pasos:${NC}"
echo "  1. Configurar DNS para apuntar a $API_SUBDOMAIN"
echo "  2. Actualizar variables de entorno en la aplicación"
echo "  3. Probar la API con el nuevo dominio"
echo ""
echo -e "${BLUE}🔗 URLs:${NC}"
echo "  - API: https://$API_SUBDOMAIN"
echo "  - AWS Console: https://console.aws.amazon.com/apigateway/home?region=us-east-1"
echo "  - ACM: https://console.aws.amazon.com/acm/home?region=us-east-1"

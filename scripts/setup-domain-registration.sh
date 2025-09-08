#!/bin/bash

# Script para registrar dominio y configurar DNS
set -e

echo "🌐 Configurando registro de dominio y DNS..."

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Función para mostrar ayuda
show_help() {
    echo "Uso: $0 [DOMAIN] [ENVIRONMENT]"
    echo ""
    echo "Argumentos:"
    echo "  DOMAIN       - Dominio a registrar (ej: onpoint.com)"
    echo "  ENVIRONMENT  - sandbox o production"
    echo ""
    echo "Ejemplos:"
    echo "  $0 onpoint.com production"
    echo "  $0 onpoint.com sandbox"
}

# Verificar argumentos
if [ $# -lt 2 ]; then
    show_help
    exit 1
fi

DOMAIN=$1
ENVIRONMENT=$2

# Validar entorno
if [[ "$ENVIRONMENT" != "sandbox" && "$ENVIRONMENT" != "production" ]]; then
    echo -e "${RED}❌ Entorno inválido. Usa: sandbox o production${NC}"
    exit 1
fi

echo -e "${BLUE}🌐 Configurando dominio: $DOMAIN${NC}"
echo -e "${BLUE}🔧 Entorno: $ENVIRONMENT${NC}"

# Configurar subdominios según el entorno
if [ "$ENVIRONMENT" = "production" ]; then
    API_SUBDOMAIN="api.$DOMAIN"
    APP_SUBDOMAIN="app.$DOMAIN"
    ADMIN_SUBDOMAIN="admin.$DOMAIN"
else
    API_SUBDOMAIN="api-sandbox.$DOMAIN"
    APP_SUBDOMAIN="app-sandbox.$DOMAIN"
    ADMIN_SUBDOMAIN="admin-sandbox.$DOMAIN"
fi

echo -e "${YELLOW}📋 Subdominios configurados:${NC}"
echo "  - API: $API_SUBDOMAIN"
echo "  - App: $APP_SUBDOMAIN"
echo "  - Admin: $ADMIN_SUBDOMAIN"

# 1. Verificar si el dominio ya está registrado
echo -e "${BLUE}🔍 Verificando si el dominio ya está registrado...${NC}"
EXISTING_ZONE=$(aws route53 list-hosted-zones --query "HostedZones[?Name=='$DOMAIN.'].Id" --output text)

if [ -n "$EXISTING_ZONE" ]; then
    echo -e "${GREEN}✅ Dominio ya registrado: $EXISTING_ZONE${NC}"
    ZONE_ID="$EXISTING_ZONE"
else
    echo -e "${YELLOW}⚠️ Dominio no registrado. Necesitas registrarlo manualmente.${NC}"
    echo -e "${YELLOW}📋 Pasos para registrar el dominio:${NC}"
    echo "  1. Ve a https://console.aws.amazon.com/route53/home#DomainRegistration:"
    echo "  2. Registra el dominio: $DOMAIN"
    echo "  3. Ejecuta este script nuevamente"
    echo ""
    echo -e "${BLUE}🔗 Alternativamente, puedes usar otro proveedor de dominios:${NC}"
    echo "  - GoDaddy, Namecheap, Cloudflare, etc."
    echo "  - Luego configura los nameservers en Route 53"
    exit 1
fi

# 2. Crear certificado SSL para el dominio
echo -e "${BLUE}🔐 Creando certificado SSL...${NC}"
CERTIFICATE_ARN=$(aws acm request-certificate \
    --domain-name "$DOMAIN" \
    --subject-alternative-names "*.$DOMAIN" \
    --validation-method DNS \
    --region us-east-1 \
    --query 'CertificateArn' \
    --output text)

echo -e "${GREEN}✅ Certificado creado: $CERTIFICATE_ARN${NC}"

# 3. Obtener registros de validación DNS
echo -e "${BLUE}📋 Obteniendo registros de validación DNS...${NC}"
VALIDATION_RECORDS=$(aws acm describe-certificate \
    --certificate-arn "$CERTIFICATE_ARN" \
    --region us-east-1 \
    --query 'Certificate.DomainValidationOptions[].ResourceRecord' \
    --output json)

echo -e "${YELLOW}📝 Registros de validación DNS:${NC}"
echo "$VALIDATION_RECORDS" | jq -r '.[] | "\(.Name) \(.Type) \(.Value)"'

# 4. Crear registros DNS para validación
echo -e "${BLUE}🔗 Creando registros DNS para validación...${NC}"
echo "$VALIDATION_RECORDS" | jq -r '.[] | {
    "Action": "CREATE",
    "ResourceRecordSet": {
        "Name": .Name,
        "Type": .Type,
        "TTL": 300,
        "ResourceRecords": [{"Value": .Value}]
    }
}' | jq -s '{Changes: .}' > /tmp/validation-records.json

aws route53 change-resource-record-sets \
    --hosted-zone-id "$ZONE_ID" \
    --change-batch file:///tmp/validation-records.json

echo -e "${GREEN}✅ Registros de validación creados${NC}"

# 5. Esperar validación del certificado
echo -e "${YELLOW}⏳ Esperando validación del certificado...${NC}"
aws acm wait certificate-validated --certificate-arn "$CERTIFICATE_ARN" --region us-east-1

echo -e "${GREEN}✅ Certificado validado${NC}"

# 6. Crear registros DNS para subdominios
echo -e "${BLUE}🔗 Creando registros DNS para subdominios...${NC}"

# Obtener el endpoint de API Gateway
API_ENDPOINT=$(aws apigateway get-rest-api --rest-api-id 7z4skk6jy0 --query 'endpointConfiguration.types[0]' --output text)
if [ "$API_ENDPOINT" = "REGIONAL" ]; then
    API_ENDPOINT="7z4skk6jy0.execute-api.us-east-1.amazonaws.com"
fi

# Crear registros DNS
cat > /tmp/dns-records.json << EOF
{
    "Changes": [
        {
            "Action": "CREATE",
            "ResourceRecordSet": {
                "Name": "$API_SUBDOMAIN",
                "Type": "CNAME",
                "TTL": 300,
                "ResourceRecords": [{"Value": "$API_ENDPOINT"}]
            }
        },
        {
            "Action": "CREATE",
            "ResourceRecordSet": {
                "Name": "$APP_SUBDOMAIN",
                "Type": "CNAME",
                "TTL": 300,
                "ResourceRecords": [{"Value": "d3ts6pwgn7uyyh.amplifyapp.com"}]
            }
        },
        {
            "Action": "CREATE",
            "ResourceRecordSet": {
                "Name": "$ADMIN_SUBDOMAIN",
                "Type": "CNAME",
                "TTL": 300,
                "ResourceRecords": [{"Value": "d3ts6pwgn7uyyh.amplifyapp.com"}]
            }
        }
    ]
}
EOF

aws route53 change-resource-record-sets \
    --hosted-zone-id "$ZONE_ID" \
    --change-batch file:///tmp/dns-records.json

echo -e "${GREEN}✅ Registros DNS creados${NC}"

# 7. Crear archivo de configuración
echo -e "${BLUE}📝 Creando archivo de configuración...${NC}"
mkdir -p config

cat > "config/domain-$ENVIRONMENT.env" << EOF
# Configuración de dominio para $ENVIRONMENT
DOMAIN=$DOMAIN
API_SUBDOMAIN=$API_SUBDOMAIN
APP_SUBDOMAIN=$APP_SUBDOMAIN
ADMIN_SUBDOMAIN=$ADMIN_SUBDOMAIN
CERTIFICATE_ARN=$CERTIFICATE_ARN
ZONE_ID=$ZONE_ID
API_ENDPOINT=$API_ENDPOINT
ENVIRONMENT=$ENVIRONMENT
EOF

echo -e "${GREEN}✅ Archivo de configuración creado: config/domain-$ENVIRONMENT.env${NC}"

# 8. Mostrar resumen
echo -e "${GREEN}🎉 ¡Dominio configurado!${NC}"
echo ""
echo -e "${BLUE}📋 Resumen de configuración:${NC}"
echo "  - Dominio: $DOMAIN"
echo "  - Entorno: $ENVIRONMENT"
echo "  - API: https://$API_SUBDOMAIN"
echo "  - App: https://$APP_SUBDOMAIN"
echo "  - Admin: https://$ADMIN_SUBDOMAIN"
echo "  - Certificado: $CERTIFICATE_ARN"
echo "  - Zone ID: $ZONE_ID"
echo ""
echo -e "${YELLOW}📋 Próximos pasos:${NC}"
echo "  1. Esperar propagación DNS (5-10 minutos)"
echo "  2. Configurar dominio personalizado en API Gateway"
echo "  3. Actualizar variables de entorno en la aplicación"
echo "  4. Probar los nuevos dominios"
echo ""
echo -e "${BLUE}🔗 URLs:${NC}"
echo "  - Route 53: https://console.aws.amazon.com/route53/home"
echo "  - API Gateway: https://console.aws.amazon.com/apigateway/home?region=us-east-1"
echo "  - ACM: https://console.aws.amazon.com/acm/home?region=us-east-1"

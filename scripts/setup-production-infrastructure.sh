#!/bin/bash

# Script maestro para configurar infraestructura de producción
set -e

echo "🚀 Configurando infraestructura de producción OnPoint Admin..."

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
NC='\033[0m' # No Color

# Función para mostrar ayuda
show_help() {
    echo "Uso: $0 [ENVIRONMENT] [DOMAIN]"
    echo ""
    echo "Argumentos:"
    echo "  ENVIRONMENT  - sandbox o production"
    echo "  DOMAIN       - Dominio personalizado (ej: onpoint.com)"
    echo ""
    echo "Ejemplos:"
    echo "  $0 sandbox onpoint.com"
    echo "  $0 production onpoint.com"
    echo ""
    echo "Este script configurará:"
    echo "  ✅ Protección AWS (WAF, Rate Limiting)"
    echo "  ✅ Dominio personalizado"
    echo "  ✅ Certificado SSL"
    echo "  ✅ DNS configuration"
    echo "  ✅ Monitoreo y alertas"
    echo "  ✅ Separación de entornos"
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

echo -e "${PURPLE}🎯 Configurando infraestructura para: $ENVIRONMENT${NC}"
echo -e "${PURPLE}🌐 Dominio: $DOMAIN${NC}"
echo ""

# Función para ejecutar script con manejo de errores
run_script() {
    local script_name=$1
    local description=$2
    
    echo -e "${BLUE}🔄 Ejecutando: $description${NC}"
    if ./scripts/$script_name; then
        echo -e "${GREEN}✅ $description completado${NC}"
    else
        echo -e "${RED}❌ Error en: $description${NC}"
        exit 1
    fi
    echo ""
}

# 1. Configurar protección AWS
echo -e "${YELLOW}🛡️ PASO 1: Configurando protección AWS...${NC}"
run_script "setup-aws-protection.sh $ENVIRONMENT" "Protección AWS (WAF, Rate Limiting, Monitoreo)"

# 2. Configurar dominio y DNS
echo -e "${YELLOW}🌐 PASO 2: Configurando dominio y DNS...${NC}"
run_script "setup-domain-registration.sh $DOMAIN $ENVIRONMENT" "Registro de dominio y configuración DNS"

# 3. Configurar dominio personalizado en API Gateway
echo -e "${YELLOW}🔗 PASO 3: Configurando dominio personalizado en API Gateway...${NC}"
if [ "$ENVIRONMENT" = "production" ]; then
    API_SUBDOMAIN="api.$DOMAIN"
else
    API_SUBDOMAIN="api-sandbox.$DOMAIN"
fi

run_script "setup-custom-domain.sh $ENVIRONMENT $API_SUBDOMAIN" "Dominio personalizado en API Gateway"

# 4. Crear archivo de configuración maestro
echo -e "${BLUE}📝 Creando archivo de configuración maestro...${NC}"
mkdir -p config

cat > "config/infrastructure-$ENVIRONMENT.env" << EOF
# Configuración de infraestructura para $ENVIRONMENT
# Generado automáticamente el $(date)

# Entorno
ENVIRONMENT=$ENVIRONMENT
DOMAIN=$DOMAIN

# URLs
API_URL=https://$API_SUBDOMAIN
APP_URL=https://app-$ENVIRONMENT.$DOMAIN
ADMIN_URL=https://admin-$ENVIRONMENT.$DOMAIN

# AWS Resources
API_ID=$(grep API_ID config/aws-protection-$ENVIRONMENT.env | cut -d'=' -f2)
WAF_ARN=$(grep WAF_ARN config/aws-protection-$ENVIRONMENT.env | cut -d'=' -f2)
CERTIFICATE_ARN=$(grep CERTIFICATE_ARN config/domain-$ENVIRONMENT.env | cut -d'=' -f2)
ZONE_ID=$(grep ZONE_ID config/domain-$ENVIRONMENT.env | cut -d'=' -f2)

# Protección
THROTTLE_RATE=$(grep THROTTLE_RATE config/aws-protection-$ENVIRONMENT.env | cut -d'=' -f2)
THROTTLE_BURST=$(grep THROTTLE_BURST config/aws-protection-$ENVIRONMENT.env | cut -d'=' -f2)
LOG_LEVEL=$(grep LOG_LEVEL config/aws-protection-$ENVIRONMENT.env | cut -d'=' -f2)

# Monitoreo
MONITORING_ENABLED=true
LOG_GROUP_NAME=/aws/apigateway/$ENVIRONMENT
EOF

echo -e "${GREEN}✅ Archivo de configuración maestro creado${NC}"

# 5. Mostrar resumen final
echo -e "${GREEN}🎉 ¡Infraestructura configurada exitosamente!${NC}"
echo ""
echo -e "${PURPLE}📋 Resumen de configuración:${NC}"
echo "  - Entorno: $ENVIRONMENT"
echo "  - Dominio: $DOMAIN"
echo "  - API: https://$API_SUBDOMAIN"
echo "  - App: https://app-$ENVIRONMENT.$DOMAIN"
echo "  - Admin: https://admin-$ENVIRONMENT.$DOMAIN"
echo ""
echo -e "${BLUE}🛡️ Protecciones implementadas:${NC}"
echo "  ✅ WAF con reglas de seguridad"
echo "  ✅ Rate Limiting (DDoS protection)"
echo "  ✅ SQL Injection Protection"
echo "  ✅ OWASP Top 10 Protection"
echo "  ✅ CloudWatch Logging"
echo "  ✅ CloudWatch Alarms"
echo "  ✅ IAM Roles seguros"
echo ""
echo -e "${BLUE}🌐 Infraestructura de red:${NC}"
echo "  ✅ Dominio personalizado"
echo "  ✅ Certificado SSL"
echo "  ✅ DNS configurado"
echo "  ✅ API Gateway personalizado"
echo ""
echo -e "${YELLOW}📋 Próximos pasos:${NC}"
echo "  1. Esperar propagación DNS (5-10 minutos)"
echo "  2. Actualizar variables de entorno en la aplicación"
echo "  3. Probar los nuevos dominios"
echo "  4. Configurar monitoreo adicional si es necesario"
echo ""
echo -e "${BLUE}🔗 URLs de administración:${NC}"
echo "  - Route 53: https://console.aws.amazon.com/route53/home"
echo "  - API Gateway: https://console.aws.amazon.com/apigateway/home?region=us-east-1"
echo "  - WAF: https://console.aws.amazon.com/wafv2/homev2/web-acls?region=us-east-1"
echo "  - CloudWatch: https://console.aws.amazon.com/cloudwatch/home?region=us-east-1"
echo "  - ACM: https://console.aws.amazon.com/acm/home?region=us-east-1"
echo ""
echo -e "${GREEN}✅ Configuración completada para $ENVIRONMENT${NC}"

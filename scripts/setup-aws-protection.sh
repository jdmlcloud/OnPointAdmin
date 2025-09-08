#!/bin/bash

# Script para configurar protección AWS y separar entornos
set -e

echo "🛡️ Configurando protección AWS y separación de entornos..."

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Función para mostrar ayuda
show_help() {
    echo "Uso: $0 [ENVIRONMENT]"
    echo ""
    echo "Argumentos:"
    echo "  ENVIRONMENT  - sandbox o production"
    echo ""
    echo "Ejemplos:"
    echo "  $0 sandbox"
    echo "  $0 production"
}

# Verificar argumentos
if [ $# -lt 1 ]; then
    show_help
    exit 1
fi

ENVIRONMENT=$1

# Validar entorno
if [[ "$ENVIRONMENT" != "sandbox" && "$ENVIRONMENT" != "production" ]]; then
    echo -e "${RED}❌ Entorno inválido. Usa: sandbox o production${NC}"
    exit 1
fi

echo -e "${BLUE}🔧 Configurando protección para entorno: $ENVIRONMENT${NC}"

# Configurar variables según el entorno
if [ "$ENVIRONMENT" = "production" ]; then
    API_ID="7z4skk6jy0"
    STAGE="prod"
    WAF_NAME="OnPointAdmin-Production-WAF"
    THROTTLE_RATE=1000
    THROTTLE_BURST=2000
    LOG_LEVEL="INFO"
    MONITORING_ENABLED=true
else
    API_ID="aegk94vynl"
    STAGE="sandbox"
    WAF_NAME="OnPointAdmin-Sandbox-WAF"
    THROTTLE_RATE=500
    THROTTLE_BURST=1000
    LOG_LEVEL="DEBUG"
    MONITORING_ENABLED=true
fi

echo -e "${YELLOW}📋 Configuración:${NC}"
echo "  - Entorno: $ENVIRONMENT"
echo "  - API ID: $API_ID"
echo "  - Stage: $STAGE"
echo "  - WAF: $WAF_NAME"
echo "  - Rate Limit: $THROTTLE_RATE req/s"
echo "  - Burst: $THROTTLE_BURST req/s"
echo "  - Log Level: $LOG_LEVEL"

# 1. Crear WAF con reglas de protección
echo -e "${BLUE}🛡️ Creando WAF con reglas de protección...${NC}"

# Crear Web ACL con reglas de protección
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
        },
        {
            "Name": "AWSManagedRulesKnownBadInputsRuleSet",
            "Priority": 3,
            "OverrideAction": {
                "None": {}
            },
            "Statement": {
                "ManagedRuleGroupStatement": {
                    "VendorName": "AWS",
                    "Name": "AWSManagedRulesKnownBadInputsRuleSet"
                }
            },
            "VisibilityConfig": {
                "SampledRequestsEnabled": true,
                "CloudWatchMetricsEnabled": true,
                "MetricName": "AWSManagedRulesKnownBadInputsRuleSet"
            }
        },
        {
            "Name": "AWSManagedRulesSQLiRuleSet",
            "Priority": 4,
            "OverrideAction": {
                "None": {}
            },
            "Statement": {
                "ManagedRuleGroupStatement": {
                    "VendorName": "AWS",
                    "Name": "AWSManagedRulesSQLiRuleSet"
                }
            },
            "VisibilityConfig": {
                "SampledRequestsEnabled": true,
                "CloudWatchMetricsEnabled": true,
                "MetricName": "AWSManagedRulesSQLiRuleSet"
            }
        }
    ]' \
    --visibility-config SampledRequestsEnabled=true,CloudWatchMetricsEnabled=true,MetricName="$WAF_NAME" \
    --region us-east-1 \
    --query 'Summary.ARN' \
    --output text)

echo -e "${GREEN}✅ WAF creado: $WAF_ARN${NC}"

# 2. Configurar throttling en API Gateway
echo -e "${BLUE}⚡ Configurando throttling en API Gateway...${NC}"
aws apigateway update-stage \
    --rest-api-id "$API_ID" \
    --stage-name "$STAGE" \
    --patch-ops op=replace,path=/throttle/rateLimit,value="$THROTTLE_RATE" \
    --patch-ops op=replace,path=/throttle/burstLimit,value="$THROTTLE_BURST"

echo -e "${GREEN}✅ Throttling configurado${NC}"

# 3. Asociar WAF al API Gateway
echo -e "${BLUE}🔒 Asociando WAF al API Gateway...${NC}"
aws wafv2 associate-web-acl \
    --web-acl-arn "$WAF_ARN" \
    --resource-arn "arn:aws:apigateway:us-east-1::/restapis/$API_ID/stages/$STAGE" \
    --region us-east-1

echo -e "${GREEN}✅ WAF asociado al API Gateway${NC}"

# 4. Configurar CloudWatch Logs
echo -e "${BLUE}📊 Configurando CloudWatch Logs...${NC}"

# Crear log group
LOG_GROUP_NAME="/aws/apigateway/$ENVIRONMENT"
aws logs create-log-group \
    --log-group-name "$LOG_GROUP_NAME" \
    --region us-east-1 2>/dev/null || echo "Log group ya existe"

# Configurar logging en API Gateway
aws apigateway update-stage \
    --rest-api-id "$API_ID" \
    --stage-name "$STAGE" \
    --patch-ops op=replace,path=/accessLogSettings/destinationArn,value="arn:aws:logs:us-east-1:209350187548:log-group:$LOG_GROUP_NAME" \
    --patch-ops op=replace,path=/accessLogSettings/format,value='{"requestId":"$context.requestId","ip":"$context.identity.sourceIp","user":"$context.identity.user","requestTime":"$context.requestTime","httpMethod":"$context.httpMethod","resourcePath":"$context.resourcePath","status":"$context.status","responseLength":"$context.responseLength","responseTime":"$context.responseTime"}'

echo -e "${GREEN}✅ CloudWatch Logs configurado${NC}"

# 5. Crear CloudWatch Alarms
echo -e "${BLUE}🚨 Creando CloudWatch Alarms...${NC}"

# Alarm para errores 4xx
aws cloudwatch put-metric-alarm \
    --alarm-name "OnPointAdmin-$ENVIRONMENT-4xx-Errors" \
    --alarm-description "Alarm for 4xx errors in $ENVIRONMENT" \
    --metric-name "4XXError" \
    --namespace "AWS/ApiGateway" \
    --statistic "Sum" \
    --period 300 \
    --threshold 10 \
    --comparison-operator "GreaterThanThreshold" \
    --evaluation-periods 2 \
    --alarm-actions "arn:aws:sns:us-east-1:209350187548:OnPointAdmin-Alerts" \
    --dimensions Name=ApiName,Value="onpoint-admin-api" Name=Stage,Value="$STAGE" \
    --region us-east-1 2>/dev/null || echo "Alarm ya existe"

# Alarm para errores 5xx
aws cloudwatch put-metric-alarm \
    --alarm-name "OnPointAdmin-$ENVIRONMENT-5xx-Errors" \
    --alarm-description "Alarm for 5xx errors in $ENVIRONMENT" \
    --metric-name "5XXError" \
    --namespace "AWS/ApiGateway" \
    --statistic "Sum" \
    --period 300 \
    --threshold 5 \
    --comparison-operator "GreaterThanThreshold" \
    --evaluation-periods 2 \
    --alarm-actions "arn:aws:sns:us-east-1:209350187548:OnPointAdmin-Alerts" \
    --dimensions Name=ApiName,Value="onpoint-admin-api" Name=Stage,Value="$STAGE" \
    --region us-east-1 2>/dev/null || echo "Alarm ya existe"

echo -e "${GREEN}✅ CloudWatch Alarms creados${NC}"

# 6. Configurar IAM roles para Lambda
echo -e "${BLUE}🔐 Configurando IAM roles para Lambda...${NC}"

# Crear role para Lambda
ROLE_NAME="OnPointAdmin-$ENVIRONMENT-LambdaRole"
aws iam create-role \
    --role-name "$ROLE_NAME" \
    --assume-role-policy-document '{
        "Version": "2012-10-17",
        "Statement": [
            {
                "Effect": "Allow",
                "Principal": {
                    "Service": "lambda.amazonaws.com"
                },
                "Action": "sts:AssumeRole"
            }
        ]
    }' 2>/dev/null || echo "Role ya existe"

# Adjuntar políticas
aws iam attach-role-policy \
    --role-name "$ROLE_NAME" \
    --policy-arn "arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole"

aws iam attach-role-policy \
    --role-name "$ROLE_NAME" \
    --policy-arn "arn:aws:iam::aws:policy/AmazonDynamoDBFullAccess"

echo -e "${GREEN}✅ IAM roles configurados${NC}"

# 7. Crear archivo de configuración
echo -e "${BLUE}📝 Creando archivo de configuración...${NC}"
mkdir -p config

cat > "config/aws-protection-$ENVIRONMENT.env" << EOF
# Configuración de protección AWS para $ENVIRONMENT
ENVIRONMENT=$ENVIRONMENT
API_ID=$API_ID
STAGE=$STAGE
WAF_ARN=$WAF_ARN
THROTTLE_RATE=$THROTTLE_RATE
THROTTLE_BURST=$THROTTLE_BURST
LOG_LEVEL=$LOG_LEVEL
MONITORING_ENABLED=$MONITORING_ENABLED
LOG_GROUP_NAME=$LOG_GROUP_NAME
LAMBDA_ROLE_NAME=$ROLE_NAME
EOF

echo -e "${GREEN}✅ Archivo de configuración creado: config/aws-protection-$ENVIRONMENT.env${NC}"

# 8. Mostrar resumen
echo -e "${GREEN}🎉 ¡Protección AWS configurada!${NC}"
echo ""
echo -e "${BLUE}📋 Resumen de protección:${NC}"
echo "  - Entorno: $ENVIRONMENT"
echo "  - WAF: $WAF_ARN"
echo "  - Rate Limit: $THROTTLE_RATE req/s"
echo "  - Burst: $THROTTLE_BURST req/s"
echo "  - Log Level: $LOG_LEVEL"
echo "  - Monitoring: $MONITORING_ENABLED"
echo "  - Log Group: $LOG_GROUP_NAME"
echo "  - Lambda Role: $ROLE_NAME"
echo ""
echo -e "${YELLOW}📋 Protecciones implementadas:${NC}"
echo "  ✅ Rate Limiting (DDoS protection)"
echo "  ✅ Common Rule Set (OWASP Top 10)"
echo "  ✅ Known Bad Inputs (Malicious requests)"
echo "  ✅ SQL Injection Protection"
echo "  ✅ CloudWatch Logging"
echo "  ✅ CloudWatch Alarms"
echo "  ✅ IAM Roles seguros"
echo ""
echo -e "${BLUE}🔗 URLs:${NC}"
echo "  - WAF Console: https://console.aws.amazon.com/wafv2/homev2/web-acls?region=us-east-1"
echo "  - CloudWatch: https://console.aws.amazon.com/cloudwatch/home?region=us-east-1"
echo "  - API Gateway: https://console.aws.amazon.com/apigateway/home?region=us-east-1"

#!/bin/bash

# Script para configurar entorno de producción
echo "🚀 Configurando entorno de producción..."

# Configuración
REGION="us-east-1"
STAGE="prod"

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
print_info "Configurando entorno de producción..."

# Crear tablas DynamoDB para producción
print_info "Creando tablas DynamoDB para producción..."

# Notificaciones - Producción
aws dynamodb create-table \
  --table-name OnPointAdmin-Notifications-prod \
  --attribute-definitions \
    AttributeName=id,AttributeType=S \
    AttributeName=userId,AttributeType=S \
    AttributeName=createdAt,AttributeType=S \
  --key-schema \
    AttributeName=id,KeyType=HASH \
  --global-secondary-indexes \
    'IndexName=UserCreatedIndex,KeySchema=[{AttributeName=userId,KeyType=HASH},{AttributeName=createdAt,KeyType=RANGE}],Projection={ProjectionType=ALL},ProvisionedThroughput={ReadCapacityUnits=10,WriteCapacityUnits=10}' \
  --billing-mode PROVISIONED \
  --provisioned-throughput ReadCapacityUnits=10,WriteCapacityUnits=10 \
  --region $REGION || print_warning "Tabla de Notificaciones ya existe"

# Productividad - Producción
aws dynamodb create-table \
  --table-name OnPointAdmin-Productivity-prod \
  --attribute-definitions \
    AttributeName=id,AttributeType=S \
    AttributeName=userId,AttributeType=S \
    AttributeName=date,AttributeType=S \
  --key-schema \
    AttributeName=id,KeyType=HASH \
  --global-secondary-indexes \
    'IndexName=UserDateIndex,KeySchema=[{AttributeName=userId,KeyType=HASH},{AttributeName=date,KeyType=RANGE}],Projection={ProjectionType=ALL},ProvisionedThroughput={ReadCapacityUnits=10,WriteCapacityUnits=10}' \
  --billing-mode PROVISIONED \
  --provisioned-throughput ReadCapacityUnits=10,WriteCapacityUnits=10 \
  --region $REGION || print_warning "Tabla de Productividad ya existe"

# System Metrics - Producción
aws dynamodb create-table \
  --table-name OnPointAdmin-SystemMetrics-prod \
  --attribute-definitions \
    AttributeName=id,AttributeType=S \
    AttributeName=service,AttributeType=S \
    AttributeName=timestamp,AttributeType=S \
  --key-schema \
    AttributeName=id,KeyType=HASH \
  --global-secondary-indexes \
    'IndexName=ServiceTimestampIndex,KeySchema=[{AttributeName=service,KeyType=HASH},{AttributeName=timestamp,KeyType=RANGE}],Projection={ProjectionType=ALL},ProvisionedThroughput={ReadCapacityUnits=10,WriteCapacityUnits=10}' \
  --billing-mode PROVISIONED \
  --provisioned-throughput ReadCapacityUnits=10,WriteCapacityUnits=10 \
  --region $REGION || print_warning "Tabla de System Metrics ya existe"

# Crear buckets S3 para producción
print_info "Creando buckets S3 para producción..."

aws s3 mb s3://onpoint-admin-prod --region $REGION || print_warning "Bucket onpoint-admin-prod ya existe"
aws s3 mb s3://onpoint-logos-prod --region $REGION || print_warning "Bucket onpoint-logos-prod ya existe"

# Configurar políticas de S3
print_info "Configurando políticas de S3..."

# Política para bucket de logos
cat > /tmp/logos-policy.json << EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "PublicReadGetObject",
      "Effect": "Allow",
      "Principal": "*",
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::onpoint-logos-prod/*"
    }
  ]
}
EOF

aws s3api put-bucket-policy --bucket onpoint-logos-prod --policy file:///tmp/logos-policy.json

# Crear CloudFront distribution para producción
print_info "Creando CloudFront distribution..."

# Configuración de CloudFront
cat > /tmp/cloudfront-config.json << EOF
{
  "CallerReference": "onpoint-admin-prod-$(date +%s)",
  "Comment": "OnPoint Admin Production Distribution",
  "DefaultRootObject": "index.html",
  "Origins": {
    "Quantity": 1,
    "Items": [
      {
        "Id": "S3-onpoint-admin-prod",
        "DomainName": "onpoint-admin-prod.s3.amazonaws.com",
        "S3OriginConfig": {
          "OriginAccessIdentity": ""
        }
      }
    ]
  },
  "DefaultCacheBehavior": {
    "TargetOriginId": "S3-onpoint-admin-prod",
    "ViewerProtocolPolicy": "redirect-to-https",
    "TrustedSigners": {
      "Enabled": false,
      "Quantity": 0
    },
    "ForwardedValues": {
      "QueryString": false,
      "Cookies": {
        "Forward": "none"
      }
    },
    "MinTTL": 0,
    "DefaultTTL": 86400,
    "MaxTTL": 31536000
  },
  "Enabled": true,
  "PriceClass": "PriceClass_100"
}
EOF

# Crear la distribución (esto requiere configuración manual adicional)
print_warning "CloudFront distribution requiere configuración manual adicional"

# Desplegar Lambda functions a producción
print_info "Desplegando Lambda functions a producción..."

chmod +x scripts/deploy-lambda-functions.sh
./scripts/deploy-lambda-functions.sh prod

# Configurar API Gateway para producción
print_info "Configurando API Gateway para producción..."

chmod +x scripts/setup-api-gateway.sh
./scripts/setup-api-gateway.sh prod

# Ejecutar health checks
print_info "Ejecutando health checks de producción..."

chmod +x scripts/run-health-checks.sh
./scripts/run-health-checks.sh prod

print_info "✅ Entorno de producción configurado exitosamente"
print_info "📊 Recursos creados:"
print_info "  - Tablas DynamoDB para producción"
print_info "  - Buckets S3 para producción"
print_info "  - Lambda functions desplegadas"
print_info "  - API Gateway configurado"
print_info "  - Health checks ejecutados"

# Limpiar archivos temporales
rm -f /tmp/logos-policy.json
rm -f /tmp/cloudfront-config.json

#!/bin/bash

# Script para configurar tablas DynamoDB para dashboard
echo "🚀 Configurando tablas DynamoDB para dashboard..."

# Configuración
REGION="us-east-1"

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

# Crear tabla de Notificaciones
print_info "Creando tabla de Notificaciones..."

aws dynamodb create-table \
  --table-name OnPointAdmin-Notifications-sandbox \
  --attribute-definitions \
    AttributeName=id,AttributeType=S \
    AttributeName=userId,AttributeType=S \
    AttributeName=createdAt,AttributeType=S \
  --key-schema \
    AttributeName=id,KeyType=HASH \
  --global-secondary-indexes \
    'IndexName=UserCreatedIndex,KeySchema=[{AttributeName=userId,KeyType=HASH},{AttributeName=createdAt,KeyType=RANGE}],Projection={ProjectionType=ALL},ProvisionedThroughput={ReadCapacityUnits=5,WriteCapacityUnits=5}' \
  --billing-mode PROVISIONED \
  --provisioned-throughput ReadCapacityUnits=5,WriteCapacityUnits=5 \
  --region $REGION

if [ $? -eq 0 ]; then
    print_info "✅ Tabla de Notificaciones creada exitosamente"
else
    print_warning "⚠️ La tabla de Notificaciones ya existe o hubo un error"
fi

# Crear tabla de Productividad
print_info "Creando tabla de Productividad..."

aws dynamodb create-table \
  --table-name OnPointAdmin-Productivity-sandbox \
  --attribute-definitions \
    AttributeName=id,AttributeType=S \
    AttributeName=userId,AttributeType=S \
    AttributeName=date,AttributeType=S \
  --key-schema \
    AttributeName=id,KeyType=HASH \
  --global-secondary-indexes \
    'IndexName=UserDateIndex,KeySchema=[{AttributeName=userId,KeyType=HASH},{AttributeName=date,KeyType=RANGE}],Projection={ProjectionType=ALL},ProvisionedThroughput={ReadCapacityUnits=5,WriteCapacityUnits=5}' \
  --billing-mode PROVISIONED \
  --provisioned-throughput ReadCapacityUnits=5,WriteCapacityUnits=5 \
  --region $REGION

if [ $? -eq 0 ]; then
    print_info "✅ Tabla de Productividad creada exitosamente"
else
    print_warning "⚠️ La tabla de Productividad ya existe o hubo un error"
fi

# Crear tabla de System Metrics
print_info "Creando tabla de System Metrics..."

aws dynamodb create-table \
  --table-name OnPointAdmin-SystemMetrics-sandbox \
  --attribute-definitions \
    AttributeName=id,AttributeType=S \
    AttributeName=service,AttributeType=S \
    AttributeName=timestamp,AttributeType=S \
  --key-schema \
    AttributeName=id,KeyType=HASH \
  --global-secondary-indexes \
    'IndexName=ServiceTimestampIndex,KeySchema=[{AttributeName=service,KeyType=HASH},{AttributeName=timestamp,KeyType=RANGE}],Projection={ProjectionType=ALL},ProvisionedThroughput={ReadCapacityUnits=5,WriteCapacityUnits=5}' \
  --billing-mode PROVISIONED \
  --provisioned-throughput ReadCapacityUnits=5,WriteCapacityUnits=5 \
  --region $REGION

if [ $? -eq 0 ]; then
    print_info "✅ Tabla de System Metrics creada exitosamente"
else
    print_warning "⚠️ La tabla de System Metrics ya existe o hubo un error"
fi

# Crear las mismas tablas para producción
print_info "Creando tablas para producción..."

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
  --region $REGION

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
  --region $REGION

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
  --region $REGION

print_info "✅ Todas las tablas configuradas exitosamente"
print_info "📊 Tablas creadas:"
print_info "  - OnPointAdmin-Notifications-sandbox"
print_info "  - OnPointAdmin-Notifications-prod"
print_info "  - OnPointAdmin-Productivity-sandbox"
print_info "  - OnPointAdmin-Productivity-prod"
print_info "  - OnPointAdmin-SystemMetrics-sandbox"
print_info "  - OnPointAdmin-SystemMetrics-prod"

#!/bin/bash

# =============================================================================
# Script de Configuración AWS DynamoDB para OnPoint Admin
# =============================================================================
# Este script configura las tablas de DynamoDB necesarias para el sistema
# =============================================================================

set -e

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Función para imprimir mensajes con colores
print_message() {
    echo -e "${2}${1}${NC}"
}

print_header() {
    echo -e "\n${BLUE}=============================================================================${NC}"
    echo -e "${BLUE}$1${NC}"
    echo -e "${BLUE}=============================================================================${NC}\n"
}

print_success() {
    print_message "✅ $1" $GREEN
}

print_warning() {
    print_message "⚠️  $1" $YELLOW
}

print_error() {
    print_message "❌ $1" $RED
}

print_info() {
    print_message "ℹ️  $1" $CYAN
}

# Verificar si AWS CLI está instalado
check_aws_cli() {
    if ! command -v aws &> /dev/null; then
        print_error "AWS CLI no está instalado. Por favor instálalo primero."
        print_info "Instrucciones: https://docs.aws.amazon.com/cli/latest/userguide/getting-started-install.html"
        exit 1
    fi
    print_success "AWS CLI está instalado"
}

# Verificar configuración de AWS
check_aws_config() {
    print_info "Verificando configuración de AWS..."
    
    if ! aws sts get-caller-identity &> /dev/null; then
        print_error "AWS CLI no está configurado correctamente."
        print_info "Ejecuta: aws configure"
        exit 1
    fi
    
    AWS_ACCOUNT_ID=$(aws sts get-caller-identity --query Account --output text)
    AWS_REGION=$(aws configure get region)
    
    print_success "AWS configurado correctamente"
    print_info "Account ID: $AWS_ACCOUNT_ID"
    print_info "Región: $AWS_REGION"
}

# Variables de configuración
AWS_REGION=${AWS_REGION:-$(aws configure get region)}
PROJECT_NAME="onpoint-admin"
ENVIRONMENT="dev"

# Nombres de las tablas
USERS_TABLE="${PROJECT_NAME}-users-${ENVIRONMENT}"
PROVIDERS_TABLE="${PROJECT_NAME}-providers-${ENVIRONMENT}"
PRODUCTS_TABLE="${PROJECT_NAME}-products-${ENVIRONMENT}"
ORDERS_TABLE="${PROJECT_NAME}-orders-${ENVIRONMENT}"

print_header "Configuración AWS DynamoDB - OnPoint Admin"

# Verificar dependencias
check_aws_cli
check_aws_config

print_info "Configurando tablas DynamoDB en región: $AWS_REGION"

# Función para crear tabla
create_table() {
    local table_name=$1
    local partition_key=$2
    local sort_key=$3
    local description=$4
    
    print_info "Creando tabla: $table_name"
    
    # Verificar si la tabla ya existe
    if aws dynamodb describe-table --table-name "$table_name" --region "$AWS_REGION" &> /dev/null; then
        print_warning "La tabla $table_name ya existe"
        return 0
    fi
    
    # Crear comando base
    local create_cmd="aws dynamodb create-table \
        --table-name $table_name \
        --attribute-definitions \
            AttributeName=$partition_key,AttributeType=S"
    
    # Agregar sort key si existe
    if [ -n "$sort_key" ]; then
        create_cmd="$create_cmd \
            AttributeName=$sort_key,AttributeType=S"
    fi
    
    # Agregar key schema
    create_cmd="$create_cmd \
        --key-schema \
            AttributeName=$partition_key,KeyType=HASH"
    
    if [ -n "$sort_key" ]; then
        create_cmd="$create_cmd \
            AttributeName=$sort_key,KeyType=RANGE"
    fi
    
    # Agregar configuración de billing y tags
    create_cmd="$create_cmd \
        --billing-mode PAY_PER_REQUEST \
        --tags \
            Key=Project,Value=$PROJECT_NAME \
            Key=Environment,Value=$ENVIRONMENT \
            Key=Description,Value=\"$description\""
    
    # Ejecutar comando
    if eval $create_cmd; then
        print_success "Tabla $table_name creada exitosamente"
    else
        print_error "Error al crear tabla $table_name"
        return 1
    fi
}

# Función para esperar a que la tabla esté activa
wait_for_table() {
    local table_name=$1
    
    print_info "Esperando a que la tabla $table_name esté activa..."
    
    aws dynamodb wait table-exists \
        --table-name "$table_name" \
        --region "$AWS_REGION"
    
    print_success "Tabla $table_name está activa"
}

# Crear tablas
print_header "Creando Tablas DynamoDB"

# Tabla de Usuarios
create_table "$USERS_TABLE" "id" "" "Tabla de usuarios del sistema"
wait_for_table "$USERS_TABLE"

# Tabla de Proveedores
create_table "$PROVIDERS_TABLE" "id" "" "Tabla de proveedores del sistema"
wait_for_table "$PROVIDERS_TABLE"

# Tabla de Productos
create_table "$PRODUCTS_TABLE" "id" "" "Tabla de productos del sistema"
wait_for_table "$PRODUCTS_TABLE"

# Tabla de Órdenes
create_table "$ORDERS_TABLE" "id" "" "Tabla de órdenes del sistema"
wait_for_table "$ORDERS_TABLE"

# Crear índices secundarios globales (GSI)
print_header "Creando Índices Secundarios"

# GSI para usuarios por email
print_info "Creando GSI para usuarios por email..."
aws dynamodb update-table \
    --table-name "$USERS_TABLE" \
    --attribute-definitions \
        AttributeName=email,AttributeType=S \
    --global-secondary-index-updates \
        '[{
            "Create": {
                "IndexName": "email-index",
                "KeySchema": [{"AttributeName": "email", "KeyType": "HASH"}],
                "Projection": {"ProjectionType": "ALL"}
            }
        }]' \
    --region "$AWS_REGION" || print_warning "GSI email-index ya existe o error al crearlo"

# GSI para productos por proveedor
print_info "Creando GSI para productos por proveedor..."
aws dynamodb update-table \
    --table-name "$PRODUCTS_TABLE" \
    --attribute-definitions \
        AttributeName=providerId,AttributeType=S \
    --global-secondary-index-updates \
        '[{
            "Create": {
                "IndexName": "provider-index",
                "KeySchema": [{"AttributeName": "providerId", "KeyType": "HASH"}],
                "Projection": {"ProjectionType": "ALL"}
            }
        }]' \
    --region "$AWS_REGION" || print_warning "GSI provider-index ya existe o error al crearlo"

# GSI para órdenes por usuario
print_info "Creando GSI para órdenes por usuario..."
aws dynamodb update-table \
    --table-name "$ORDERS_TABLE" \
    --attribute-definitions \
        AttributeName=userId,AttributeType=S \
    --global-secondary-index-updates \
        '[{
            "Create": {
                "IndexName": "user-index",
                "KeySchema": [{"AttributeName": "userId", "KeyType": "HASH"}],
                "Projection": {"ProjectionType": "ALL"}
            }
        }]' \
    --region "$AWS_REGION" || print_warning "GSI user-index ya existe o error al crearlo"

# Insertar datos de ejemplo
print_header "Insertando Datos de Ejemplo"

# Función para insertar item
insert_item() {
    local table_name=$1
    local item_json=$2
    
    print_info "Insertando item en $table_name..."
    
    if aws dynamodb put-item \
        --table-name "$table_name" \
        --item "$item_json" \
        --region "$AWS_REGION"; then
        print_success "Item insertado en $table_name"
    else
        print_warning "Error al insertar item en $table_name"
    fi
}

# Usuario administrador de ejemplo
insert_item "$USERS_TABLE" '{
    "id": {"S": "admin-001"},
    "email": {"S": "admin@tallerimpresion.com"},
    "name": {"S": "María González - Administradora"},
    "role": {"S": "admin"},
    "status": {"S": "active"},
    "createdAt": {"S": "'$(date -u +%Y-%m-%dT%H:%M:%SZ)'"},
    "updatedAt": {"S": "'$(date -u +%Y-%m-%dT%H:%M:%SZ)'"},
    "cognitoId": {"S": "cognito-admin-123"}
}'

# Proveedor de ejemplo
insert_item "$PROVIDERS_TABLE" '{
    "id": {"S": "provider-001"},
    "name": {"S": "Empresa ABC - Marketing Corporativo"},
    "email": {"S": "pedidos@empresaabc.com"},
    "phone": {"S": "+52-55-1234-5678"},
    "address": {"S": "Av. Reforma 123, Col. Centro, CDMX 06000"},
    "status": {"S": "active"},
    "createdAt": {"S": "'$(date -u +%Y-%m-%dT%H:%M:%SZ)'"},
    "updatedAt": {"S": "'$(date -u +%Y-%m-%dT%H:%M:%SZ)'"},
    "cognitoId": {"S": "cognito-client-abc"}
}'

# Producto de ejemplo
insert_item "$PRODUCTS_TABLE" '{
    "id": {"S": "product-001"},
    "name": {"S": "Camisetas Personalizadas - Algodón 100%"},
    "description": {"S": "Camisetas de algodón 100% con impresión digital de alta calidad. Disponible en tallas S, M, L, XL. Mínimo 50 piezas."},
    "price": {"N": "85.00"},
    "category": {"S": "Textiles"},
    "providerId": {"S": "provider-001"},
    "status": {"S": "active"},
    "createdAt": {"S": "'$(date -u +%Y-%m-%dT%H:%M:%SZ)'"},
    "updatedAt": {"S": "'$(date -u +%Y-%m-%dT%H:%M:%SZ)'"}
}'

# Generar archivo .env.local
print_header "Generando Archivo de Configuración"

ENV_FILE=".env.local"
ENV_CONTENT="# AWS DynamoDB Configuration
AWS_REGION=$AWS_REGION
DYNAMODB_USERS_TABLE=$USERS_TABLE
DYNAMODB_PROVIDERS_TABLE=$PROVIDERS_TABLE
DYNAMODB_PRODUCTS_TABLE=$PRODUCTS_TABLE
DYNAMODB_ORDERS_TABLE=$ORDERS_TABLE

# DynamoDB Status
DYNAMODB_CONFIGURED=true
DYNAMODB_ENVIRONMENT=$ENVIRONMENT
"

# Agregar al archivo .env.local existente o crear uno nuevo
if [ -f "$ENV_FILE" ]; then
    # Remover configuraciones DynamoDB existentes
    grep -v "DYNAMODB_" "$ENV_FILE" > "${ENV_FILE}.tmp"
    mv "${ENV_FILE}.tmp" "$ENV_FILE"
fi

echo "$ENV_CONTENT" >> "$ENV_FILE"
print_success "Configuración guardada en $ENV_FILE"

# Mostrar resumen
print_header "Resumen de Configuración"

print_success "Tablas DynamoDB creadas:"
print_info "  • $USERS_TABLE"
print_info "  • $PROVIDERS_TABLE"
print_info "  • $PRODUCTS_TABLE"
print_info "  • $ORDERS_TABLE"

print_success "Índices secundarios creados:"
print_info "  • email-index (usuarios)"
print_info "  • provider-index (productos)"
print_info "  • user-index (órdenes)"

print_success "Datos de ejemplo insertados"

print_info "Región AWS: $AWS_REGION"
print_info "Account ID: $AWS_ACCOUNT_ID"

print_header "Próximos Pasos"

print_info "1. Verifica las tablas en AWS Console:"
print_info "   https://console.aws.amazon.com/dynamodb/home?region=$AWS_REGION"

print_info "2. Actualiza las variables de entorno en tu aplicación:"
print_info "   DYNAMODB_USERS_TABLE=$USERS_TABLE"
print_info "   DYNAMODB_PROVIDERS_TABLE=$PROVIDERS_TABLE"
print_info "   DYNAMODB_PRODUCTS_TABLE=$PRODUCTS_TABLE"
print_info "   DYNAMODB_ORDERS_TABLE=$ORDERS_TABLE"

print_info "3. Reinicia tu aplicación para cargar las nuevas configuraciones"

print_info "4. Prueba el dashboard DynamoDB en:"
print_info "   http://localhost:3000/dashboard-dynamodb"

print_success "¡Configuración de DynamoDB completada exitosamente!"

print_warning "Nota: Las tablas están configuradas con PAY_PER_REQUEST (billing on-demand)"
print_warning "Esto significa que solo pagarás por las operaciones que realices"

print_header "Comandos Útiles"

print_info "Listar tablas:"
print_info "aws dynamodb list-tables --region $AWS_REGION"

print_info "Describir tabla:"
print_info "aws dynamodb describe-table --table-name $USERS_TABLE --region $AWS_REGION"

print_info "Eliminar tabla (¡CUIDADO!):"
print_info "aws dynamodb delete-table --table-name $USERS_TABLE --region $AWS_REGION"

print_success "¡DynamoDB está listo para usar! 🚀"

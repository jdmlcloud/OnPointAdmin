#!/bin/bash

# Script para configurar DynamoDB para Lambda functions
echo "🚀 Configurando DynamoDB para OnPoint Admin Lambda functions..."

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

# Función para crear tabla de DynamoDB
create_table() {
    local table_name=$1
    local description=$2
    
    print_info "Creando tabla: $table_name"
    
    # Verificar si la tabla ya existe
    if aws dynamodb describe-table --table-name "$table_name" --region "$REGION" > /dev/null 2>&1; then
        print_warning "Tabla $table_name ya existe, saltando..."
        return 0
    fi
    
    aws dynamodb create-table \
        --table-name "$table_name" \
        --attribute-definitions \
            AttributeName=id,AttributeType=S \
        --key-schema \
            AttributeName=id,KeyType=HASH \
        --billing-mode PAY_PER_REQUEST \
        --region "$REGION" \
        --tags Key=Project,Value=OnPointAdmin Key=Environment,Value=Development
    
    if [ $? -eq 0 ]; then
        print_info "✅ Tabla $table_name creada exitosamente"
        
        # Esperar a que la tabla esté activa
        print_info "Esperando a que la tabla esté activa..."
        aws dynamodb wait table-exists --table-name "$table_name" --region "$REGION"
        print_info "✅ Tabla $table_name está activa"
    else
        print_error "❌ Error creando tabla $table_name"
        exit 1
    fi
}

# Crear tablas
create_table "onpoint-admin-providers-dev" "Tabla de proveedores"
create_table "onpoint-admin-users-dev" "Tabla de usuarios"
create_table "onpoint-admin-products-dev" "Tabla de productos"

# Crear datos de prueba
print_info "Creando datos de prueba..."

# Crear usuario admin
print_info "Creando usuario administrador..."
aws dynamodb put-item \
    --table-name "onpoint-admin-users-dev" \
    --item '{
        "id": {"S": "user-admin-1"},
        "name": {"S": "Administrador Principal"},
        "email": {"S": "admin@onpoint.com"},
        "role": {"S": "admin"},
        "status": {"S": "active"},
        "createdAt": {"S": "'$(date -u +%Y-%m-%dT%H:%M:%S.%3NZ)'"},
        "updatedAt": {"S": "'$(date -u +%Y-%m-%dT%H:%M:%S.%3NZ)'"}
    }' \
    --region "$REGION"

# Crear usuario ejecutiva
print_info "Creando usuario ejecutiva..."
aws dynamodb put-item \
    --table-name "onpoint-admin-users-dev" \
    --item '{
        "id": {"S": "user-ejecutiva-1"},
        "name": {"S": "Ejecutiva de Ventas"},
        "email": {"S": "ejecutiva@onpoint.com"},
        "role": {"S": "manager"},
        "status": {"S": "active"},
        "createdAt": {"S": "'$(date -u +%Y-%m-%dT%H:%M:%S.%3NZ)'"},
        "updatedAt": {"S": "'$(date -u +%Y-%m-%dT%H:%M:%S.%3NZ)'"}
    }' \
    --region "$REGION"

# Crear proveedor de prueba
print_info "Creando proveedor de prueba..."
aws dynamodb put-item \
    --table-name "onpoint-admin-providers-dev" \
    --item '{
        "id": {"S": "provider-test-1"},
        "name": {"S": "Proveedor de Prueba"},
        "email": {"S": "proveedor@test.com"},
        "company": {"S": "Empresa Test S.A."},
        "phone": {"S": "+1234567890"},
        "description": {"S": "Proveedor de prueba para testing"},
        "website": {"S": "https://test.com"},
        "address": {"M": {
            "street": {"S": "Calle Test 123"},
            "city": {"S": "Ciudad Test"},
            "state": {"S": "Estado Test"},
            "zipCode": {"S": "12345"},
            "country": {"S": "País Test"}
        }},
        "contacts": {"L": [
            {"M": {
                "name": {"S": "Contacto Principal"},
                "position": {"S": "Gerente"},
                "email": {"S": "contacto@test.com"},
                "phone": {"S": "+1234567891"},
                "isPrimary": {"BOOL": true}
            }}
        ]},
        "status": {"S": "active"},
        "logo": {"NULL": true},
        "notes": {"S": "Notas del proveedor de prueba"},
        "tags": {"L": [
            {"S": "test"},
            {"S": "proveedor"},
            {"S": "ejemplo"}
        ]},
        "createdAt": {"S": "'$(date -u +%Y-%m-%dT%H:%M:%S.%3NZ)'"},
        "updatedAt": {"S": "'$(date -u +%Y-%m-%dT%H:%M:%S.%3NZ)'"}
    }' \
    --region "$REGION"

print_info "🎉 DynamoDB configurado exitosamente!"
print_info "📋 Tablas creadas:"
print_info "   - onpoint-admin-providers-dev"
print_info "   - onpoint-admin-users-dev"
print_info "   - onpoint-admin-products-dev"
print_info ""
print_info "📋 Datos de prueba creados:"
print_info "   - Usuario admin: admin@onpoint.com"
print_info "   - Usuario ejecutiva: ejecutiva@onpoint.com"
print_info "   - Proveedor de prueba: proveedor@test.com"
print_info ""
print_info "📋 Próximos pasos:"
print_info "   1. Configurar variables de entorno en Lambda functions"
print_info "   2. Desplegar Lambda functions"
print_info "   3. Configurar API Gateway"
print_info "   4. Probar los endpoints"

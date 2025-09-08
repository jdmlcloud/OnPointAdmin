#!/bin/bash

# Script para configurar DynamoDB separado para cada entorno
set -e

echo "🗄️ Configurando DynamoDB separado para cada entorno..."

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuración
REGION="us-east-1"
PROJECT_NAME="OnPointAdmin"

echo -e "${BLUE}📋 Configuración:${NC}"
echo "  - Región: $REGION"
echo "  - Proyecto: $PROJECT_NAME"
echo ""

# Función para crear tabla DynamoDB
create_dynamodb_table() {
    local env=$1
    local table_name="$PROJECT_NAME-$env"
    
    echo -e "${BLUE}🗄️ Creando tabla DynamoDB para $env...${NC}"
    
    # Crear tabla
    aws dynamodb create-table \
        --table-name "$table_name" \
        --attribute-definitions \
            AttributeName=id,AttributeType=S \
        --key-schema \
            AttributeName=id,KeyType=HASH \
        --billing-mode PAY_PER_REQUEST \
        --region "$REGION" \
        --query 'TableDescription.TableName' \
        --output text
    
    echo -e "${GREEN}✅ Tabla creada: $table_name${NC}"
    
    # Esperar a que la tabla esté activa
    echo -e "${BLUE}⏳ Esperando a que la tabla esté activa...${NC}"
    aws dynamodb wait table-exists \
        --table-name "$table_name" \
        --region "$REGION"
    
    echo -e "${GREEN}✅ Tabla $table_name está activa${NC}"
    
    # Guardar en archivo de configuración
    echo "DYNAMODB_TABLE_$env=$table_name" >> "config/dynamodb-$env.env"
    echo "DYNAMODB_REGION_$env=$REGION" >> "config/dynamodb-$env.env"
}

# Función para crear tabla de usuarios
create_users_table() {
    local env=$1
    local table_name="$PROJECT_NAME-Users-$env"
    
    echo -e "${BLUE}👥 Creando tabla de usuarios para $env...${NC}"
    
    # Crear tabla
    aws dynamodb create-table \
        --table-name "$table_name" \
        --attribute-definitions \
            AttributeName=id,AttributeType=S \
        --key-schema \
            AttributeName=id,KeyType=HASH \
        --billing-mode PAY_PER_REQUEST \
        --region "$REGION" \
        --query 'TableDescription.TableName' \
        --output text
    
    echo -e "${GREEN}✅ Tabla de usuarios creada: $table_name${NC}"
    
    # Esperar a que la tabla esté activa
    echo -e "${BLUE}⏳ Esperando a que la tabla esté activa...${NC}"
    aws dynamodb wait table-exists \
        --table-name "$table_name" \
        --region "$REGION"
    
    echo -e "${GREEN}✅ Tabla $table_name está activa${NC}"
    
    # Guardar en archivo de configuración
    echo "DYNAMODB_USERS_TABLE_$env=$table_name" >> "config/dynamodb-$env.env"
}

# Función para crear tabla de proveedores
create_providers_table() {
    local env=$1
    local table_name="$PROJECT_NAME-Providers-$env"
    
    echo -e "${BLUE}🏢 Creando tabla de proveedores para $env...${NC}"
    
    # Crear tabla
    aws dynamodb create-table \
        --table-name "$table_name" \
        --attribute-definitions \
            AttributeName=id,AttributeType=S \
        --key-schema \
            AttributeName=id,KeyType=HASH \
        --billing-mode PAY_PER_REQUEST \
        --region "$REGION" \
        --query 'TableDescription.TableName' \
        --output text
    
    echo -e "${GREEN}✅ Tabla de proveedores creada: $table_name${NC}"
    
    # Esperar a que la tabla esté activa
    echo -e "${BLUE}⏳ Esperando a que la tabla esté activa...${NC}"
    aws dynamodb wait table-exists \
        --table-name "$table_name" \
        --region "$REGION"
    
    echo -e "${GREEN}✅ Tabla $table_name está activa${NC}"
    
    # Guardar en archivo de configuración
    echo "DYNAMODB_PROVIDERS_TABLE_$env=$table_name" >> "config/dynamodb-$env.env"
}

# Función para crear tabla de productos
create_products_table() {
    local env=$1
    local table_name="$PROJECT_NAME-Products-$env"
    
    echo -e "${BLUE}📦 Creando tabla de productos para $env...${NC}"
    
    # Crear tabla
    aws dynamodb create-table \
        --table-name "$table_name" \
        --attribute-definitions \
            AttributeName=id,AttributeType=S \
        --key-schema \
            AttributeName=id,KeyType=HASH \
        --billing-mode PAY_PER_REQUEST \
        --region "$REGION" \
        --query 'TableDescription.TableName' \
        --output text
    
    echo -e "${GREEN}✅ Tabla de productos creada: $table_name${NC}"
    
    # Esperar a que la tabla esté activa
    echo -e "${BLUE}⏳ Esperando a que la tabla esté activa...${NC}"
    aws dynamodb wait table-exists \
        --table-name "$table_name" \
        --region "$REGION"
    
    echo -e "${GREEN}✅ Tabla $table_name está activa${NC}"
    
    # Guardar en archivo de configuración
    echo "DYNAMODB_PRODUCTS_TABLE_$env=$table_name" >> "config/dynamodb-$env.env"
}

# Función para crear tabla de tags
create_tags_table() {
    local env=$1
    local table_name="$PROJECT_NAME-Tags-$env"
    
    echo -e "${BLUE}🏷️ Creando tabla de tags para $env...${NC}"
    
    # Crear tabla
    aws dynamodb create-table \
        --table-name "$table_name" \
        --attribute-definitions \
            AttributeName=id,AttributeType=S \
        --key-schema \
            AttributeName=id,KeyType=HASH \
        --billing-mode PAY_PER_REQUEST \
        --region "$REGION" \
        --query 'TableDescription.TableName' \
        --output text
    
    echo -e "${GREEN}✅ Tabla de tags creada: $table_name${NC}"
    
    # Esperar a que la tabla esté activa
    echo -e "${BLUE}⏳ Esperando a que la tabla esté activa...${NC}"
    aws dynamodb wait table-exists \
        --table-name "$table_name" \
        --region "$REGION"
    
    echo -e "${GREEN}✅ Tabla $table_name está activa${NC}"
    
    # Guardar en archivo de configuración
    echo "DYNAMODB_TAGS_TABLE_$env=$table_name" >> "config/dynamodb-$env.env"
}

# Función para poblar datos de prueba
populate_test_data() {
    local env=$1
    
    if [ "$env" = "sandbox" ]; then
        echo -e "${BLUE}📊 Poblando datos de prueba para $env...${NC}"
        
        # Datos de prueba para usuarios
        aws dynamodb put-item \
            --table-name "$PROJECT_NAME-Users-$env" \
            --item '{
                "id": {"S": "user-1"},
                "email": {"S": "admin@onpoint.com"},
                "name": {"S": "Administrador"},
                "role": {"S": "admin"},
                "status": {"S": "active"},
                "createdAt": {"S": "'$(date -u +%Y-%m-%dT%H:%M:%S.%3NZ)'"}
            }' \
            --region "$REGION"
        
        aws dynamodb put-item \
            --table-name "$PROJECT_NAME-Users-$env" \
            --item '{
                "id": {"S": "user-2"},
                "email": {"S": "ejecutivo@onpoint.com"},
                "name": {"S": "Ejecutivo"},
                "role": {"S": "ejecutivo"},
                "status": {"S": "active"},
                "createdAt": {"S": "'$(date -u +%Y-%m-%dT%H:%M:%S.%3NZ)'"}
            }' \
            --region "$REGION"
        
        # Datos de prueba para proveedores
        aws dynamodb put-item \
            --table-name "$PROJECT_NAME-Providers-$env" \
            --item '{
                "id": {"S": "provider-1"},
                "name": {"S": "Proveedor de Prueba"},
                "email": {"S": "proveedor@test.com"},
                "phone": {"S": "555-1234"},
                "status": {"S": "active"},
                "createdAt": {"S": "'$(date -u +%Y-%m-%dT%H:%M:%S.%3NZ)'"}
            }' \
            --region "$REGION"
        
        # Datos de prueba para productos
        aws dynamodb put-item \
            --table-name "$PROJECT_NAME-Products-$env" \
            --item '{
                "id": {"S": "product-1"},
                "name": {"S": "Producto de Prueba"},
                "description": {"S": "Descripción del producto de prueba"},
                "price": {"N": "100.00"},
                "status": {"S": "active"},
                "createdAt": {"S": "'$(date -u +%Y-%m-%dT%H:%M:%S.%3NZ)'"}
            }' \
            --region "$REGION"
        
        # Datos de prueba para tags
        aws dynamodb put-item \
            --table-name "$PROJECT_NAME-Tags-$env" \
            --item '{
                "id": {"S": "tag-1"},
                "name": {"S": "Promocionales"},
                "color": {"S": "#3B82F6"},
                "createdAt": {"S": "'$(date -u +%Y-%m-%dT%H:%M:%S.%3NZ)'"}
            }' \
            --region "$REGION"
        
        echo -e "${GREEN}✅ Datos de prueba poblados para $env${NC}"
    fi
}

# Función principal
main() {
    echo -e "${BLUE}🗄️ Configurando DynamoDB separado para cada entorno${NC}"
    echo ""
    
    # Crear directorio de configuración
    mkdir -p config
    
    # Configurar DynamoDB para sandbox
    echo -e "${YELLOW}📋 Configurando DynamoDB para SANDBOX...${NC}"
    create_users_table "sandbox"
    create_providers_table "sandbox"
    create_products_table "sandbox"
    create_tags_table "sandbox"
    populate_test_data "sandbox"
    
    # Configurar DynamoDB para producción
    echo -e "${YELLOW}📋 Configurando DynamoDB para PRODUCCIÓN...${NC}"
    create_users_table "prod"
    create_providers_table "prod"
    create_products_table "prod"
    create_tags_table "prod"
    
    echo ""
    echo -e "${GREEN}🎉 ¡DynamoDB separado configurado exitosamente!${NC}"
    echo ""
    echo -e "${BLUE}📋 Resumen:${NC}"
    echo "  - Sandbox: Tablas separadas con datos de prueba"
    echo "  - Producción: Tablas separadas (vacías)"
    echo ""
    echo -e "${YELLOW}📁 Archivos de configuración creados:${NC}"
    echo "  - config/dynamodb-sandbox.env"
    echo "  - config/dynamodb-prod.env"
    echo ""
    echo -e "${BLUE}🗄️ Tablas creadas:${NC}"
    echo "  - $PROJECT_NAME-Users-sandbox"
    echo "  - $PROJECT_NAME-Providers-sandbox"
    echo "  - $PROJECT_NAME-Products-sandbox"
    echo "  - $PROJECT_NAME-Tags-sandbox"
    echo "  - $PROJECT_NAME-Users-prod"
    echo "  - $PROJECT_NAME-Providers-prod"
    echo "  - $PROJECT_NAME-Products-prod"
    echo "  - $PROJECT_NAME-Tags-prod"
    echo ""
    echo -e "${YELLOW}⚠️  Nota: Asegúrate de actualizar las variables de entorno en las Lambda functions${NC}"
}

# Ejecutar función principal
main "$@"

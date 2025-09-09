#!/bin/bash

# Script para configurar tablas de DynamoDB para desarrollo local
# Versión: v1.1.0

echo "🗄️ Configurando tablas de DynamoDB para desarrollo local..."

# Configuración
REGION="us-east-1"
ENVIRONMENT="local"

# Lista de tablas a crear
TABLES=(
    "OnPointAdmin-Users-local"
    "OnPointAdmin-Roles-local"
    "OnPointAdmin-Permissions-local"
    "OnPointAdmin-Providers-local"
    "OnPointAdmin-Products-local"
)

# Función para crear tabla
create_table() {
    local table_name=$1
    local partition_key=$2
    local sort_key=${3:-""}
    
    echo "📋 Creando tabla: $table_name"
    
    # Verificar si la tabla ya existe
    if aws dynamodb describe-table --table-name "$table_name" --region "$REGION" >/dev/null 2>&1; then
        echo "⚠️ La tabla $table_name ya existe"
        return 0
    fi
    
    # Crear tabla
    if [ -n "$sort_key" ]; then
        # Tabla con sort key
        aws dynamodb create-table \
            --table-name "$table_name" \
            --attribute-definitions \
                AttributeName="$partition_key",AttributeType=S \
                AttributeName="$sort_key",AttributeType=S \
            --key-schema \
                AttributeName="$partition_key",KeyType=HASH \
                AttributeName="$sort_key",KeyType=RANGE \
            --billing-mode PAY_PER_REQUEST \
            --region "$REGION"
    else
        # Tabla solo con partition key
        aws dynamodb create-table \
            --table-name "$table_name" \
            --attribute-definitions \
                AttributeName="$partition_key",AttributeType=S \
            --key-schema \
                AttributeName="$partition_key",KeyType=HASH \
            --billing-mode PAY_PER_REQUEST \
            --region "$REGION"
    fi
    
    if [ $? -eq 0 ]; then
        echo "✅ Tabla $table_name creada exitosamente"
        
        # Esperar a que la tabla esté activa
        echo "⏳ Esperando a que la tabla esté activa..."
        aws dynamodb wait table-exists --table-name "$table_name" --region "$REGION"
        echo "✅ Tabla $table_name está activa"
    else
        echo "❌ Error creando tabla $table_name"
        return 1
    fi
}

# Crear tablas
echo "🚀 Creando tablas de DynamoDB..."

# Tabla de usuarios
create_table "OnPointAdmin-Users-local" "id"

# Tabla de roles
create_table "OnPointAdmin-Roles-local" "id"

# Tabla de permisos
create_table "OnPointAdmin-Permissions-local" "id"

# Tabla de proveedores
create_table "OnPointAdmin-Providers-local" "id"

# Tabla de productos
create_table "OnPointAdmin-Products-local" "id"

echo "🎉 Configuración de tablas completada!"
echo "📋 Tablas creadas:"
for table in "${TABLES[@]}"; do
    echo "  - $table"
done

echo ""
echo "🔧 Próximos pasos:"
echo "1. Configurar variables de entorno en config/local.env"
echo "2. Crear datos de prueba para desarrollo"
echo "3. Probar las Lambda functions localmente"

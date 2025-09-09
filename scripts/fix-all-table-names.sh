#!/bin/bash

# Script para corregir todos los nombres de tabla hardcodeados

echo "🔧 Corrigiendo nombres de tabla hardcodeados en todas las Lambda functions..."

# Función para corregir una Lambda function
fix_table_names() {
    local service_name=$1
    local service_camel=$2
    local file="lambda-functions/${service_name}/index.js"
    
    if [ ! -f "$file" ]; then
        echo "  ⚠️  Archivo no encontrado: $file"
        return
    fi
    
    echo "  🔧 Corrigiendo $service_name..."
    
    # Reemplazar nombres hardcodeados con tableName
    sed -i '' "s/TableName: 'onpoint-admin-${service_name}-dev'/TableName: tableName/g" "$file"
    sed -i '' "s/TableName: \"onpoint-admin-${service_name}-dev\"/TableName: tableName/g" "$file"
    
    echo "    ✅ $service_name corregido"
}

# Lista de servicios a corregir
services=(
    "whatsapp:WhatsApp"
    "analytics:Analytics"
    "reports:Reports"
    "integrations:Integrations"
    "editor:Editor"
    "tracking:Tracking"
    "ai-test:AI-Test"
)

# Corregir cada servicio
for service_info in "${services[@]}"; do
    IFS=':' read -r service_name service_camel <<< "$service_info"
    fix_table_names "$service_name" "$service_camel"
done

echo "✅ Nombres de tabla corregidos en todas las Lambda functions"

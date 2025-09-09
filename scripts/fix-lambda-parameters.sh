#!/bin/bash

# Script para corregir parámetros de tableName en todas las Lambda functions

echo "🔧 Corrigiendo parámetros de tableName en Lambda functions..."

# Función para corregir una Lambda function
fix_lambda_params() {
    local service_name=$1
    local service_camel=$2
    local file="lambda-functions/${service_name}/index.js"
    
    if [ ! -f "$file" ]; then
        echo "  ⚠️  Archivo no encontrado: $file"
        return
    fi
    
    echo "  🔧 Corrigiendo parámetros en $service_name..."
    
    # Agregar tableName como parámetro a todas las funciones
    sed -i '' "s/exports\.get${service_camel} = async (event) => {/exports.get${service_camel} = async (event, tableName) => {/g" "$file"
    sed -i '' "s/exports\.create${service_camel} = async (event) => {/exports.create${service_camel} = async (event, tableName) => {/g" "$file"
    sed -i '' "s/exports\.update${service_camel} = async (event) => {/exports.update${service_camel} = async (event, tableName) => {/g" "$file"
    sed -i '' "s/exports\.delete${service_camel} = async (event) => {/exports.delete${service_camel} = async (event, tableName) => {/g" "$file"
    
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
    fix_lambda_params "$service_name" "$service_camel"
done

echo "✅ Parámetros de tableName corregidos en todas las Lambda functions"

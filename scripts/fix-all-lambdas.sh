#!/bin/bash

# Script para corregir todas las Lambda functions con nombres de tabla incorrectos

echo "🔧 Corrigiendo todas las Lambda functions..."

# Función para corregir una Lambda function
fix_lambda() {
    local service_name=$1
    local service_camel=$2
    local file="lambda-functions/${service_name}/index.js"
    
    if [ ! -f "$file" ]; then
        echo "  ⚠️  Archivo no encontrado: $file"
        return
    fi
    
    echo "  🔧 Corrigiendo $service_name..."
    
    # Corregir nombre de tabla en el handler
    sed -i '' "s/OnPointAdmin-${service_name}-/OnPointAdmin-${service_camel}-/g" "$file"
    
    # Actualizar llamadas a funciones para pasar tableName
    sed -i '' "s/exports\.get${service_camel}(event)/exports.get${service_camel}(event, tableName)/g" "$file"
    sed -i '' "s/exports\.create${service_camel}(event)/exports.create${service_camel}(event, tableName)/g" "$file"
    sed -i '' "s/exports\.update${service_camel}(event)/exports.update${service_camel}(event, tableName)/g" "$file"
    sed -i '' "s/exports\.delete${service_camel}(event)/exports.delete${service_camel}(event, tableName)/g" "$file"
    
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
    fix_lambda "$service_name" "$service_camel"
done

echo "✅ Todas las Lambda functions corregidas"

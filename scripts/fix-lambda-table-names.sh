#!/bin/bash

# Script para corregir nombres de tabla hardcodeados en Lambda functions
# Reemplaza nombres hardcodeados con construcción dinámica basada en stage

echo "🔧 Corrigiendo nombres de tabla en Lambda functions..."

# Función para corregir archivo
fix_lambda_file() {
    local file=$1
    local service_name=$2
    echo "  🔧 Corrigiendo $file"
    
    # Crear archivo temporal
    local temp_file=$(mktemp)
    
    # Leer archivo y hacer reemplazos
    sed "s/TableName: 'onpoint-admin-${service_name}-dev'/TableName: tableName/g" "$file" > "$temp_file"
    sed "s/TableName: \"onpoint-admin-${service_name}-dev\"/TableName: tableName/g" "$temp_file" > "$file"
    
    # Agregar construcción de tableName al handler si no existe
    if ! grep -q "const tableName = \`OnPointAdmin-${service_name}-\${stage}\`" "$file"; then
        # Buscar la línea del handler y agregar tableName después
        sed -i '' '/exports\.handler = async (event) => {/a\
  const stage = event.requestContext.stage; // Obtener el stage de la solicitud\
  const tableName = `OnPointAdmin-'${service_name}'-\${stage}`; // Construir el nombre de la tabla dinámicamente
' "$file"
    fi
    
    # Actualizar llamadas a funciones para pasar tableName
    sed -i '' "s/exports\.get${service_name^}(event)/exports.get${service_name^}(event, tableName)/g" "$file"
    sed -i '' "s/exports\.create${service_name^}(event)/exports.create${service_name^}(event, tableName)/g" "$file"
    sed -i '' "s/exports\.update${service_name^}(event)/exports.update${service_name^}(event, tableName)/g" "$file"
    sed -i '' "s/exports\.delete${service_name^}(event)/exports.delete${service_name^}(event, tableName)/g" "$file"
    
    rm "$temp_file"
}

# Lista de servicios a corregir
services=(
    "proposals:Proposals"
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
    file="lambda-functions/${service_name}/index.js"
    
    if [ -f "$file" ]; then
        fix_lambda_file "$file" "$service_name"
    else
        echo "  ⚠️  Archivo no encontrado: $file"
    fi
done

echo "✅ Corrección completada"

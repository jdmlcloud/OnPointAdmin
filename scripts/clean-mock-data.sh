#!/bin/bash

# Script para limpiar datos de ejemplo del frontend
# Reemplaza números hardcodeados con placeholders

echo "🧹 Limpiando datos de ejemplo del frontend..."

# Función para limpiar archivo
clean_file() {
    local file=$1
    echo "  🔧 Limpiando $file"
    
    # Reemplazar números hardcodeados con placeholders
    sed -i '' 's/[0-9]\{1,\}\.[0-9]\{1,\}% desde el mes pasado/Cargando datos.../g' "$file"
    sed -i '' 's/+[0-9]\{1,\}\.[0-9]\{1,\}% desde el mes pasado/Cargando datos.../g' "$file"
    sed -i '' 's/[0-9]\{1,\},[0-9]\{1,\}/-/g' "$file"
    sed -i '' 's/[0-9]\{1,\}\.[0-9]\{1,\}s/-/g' "$file"
    sed -i '' 's/[0-9]\{1,\}\.[0-9]\{1,\}%/-/g' "$file"
    sed -i '' 's/+[0-9]\{1,\}\.[0-9]\{1,\}%/-/g' "$file"
    sed -i '' 's/[0-9]\{1,\}/-/g' "$file"
}

# Lista de archivos a limpiar
files=(
    "src/app/reports/page.tsx"
    "src/app/quotations/page.tsx"
    "src/app/proposals/page.tsx"
    "src/app/whatsapp/page.tsx"
    "src/app/integrations/page.tsx"
    "src/app/editor/page.tsx"
    "src/app/tracking/page.tsx"
    "src/app/ai-test/page.tsx"
    "src/app/pdf-generator/page.tsx"
)

# Limpiar cada archivo
for file in "${files[@]}"; do
    if [ -f "$file" ]; then
        clean_file "$file"
    else
        echo "  ⚠️  Archivo no encontrado: $file"
    fi
done

echo "✅ Limpieza completada"

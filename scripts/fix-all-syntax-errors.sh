#!/bin/bash

# Script para corregir todos los errores de sintaxis en el frontend

echo "🔧 Corrigiendo errores de sintaxis en todos los archivos..."

# Función para corregir un archivo
fix_file() {
    local file=$1
    if [ ! -f "$file" ]; then
        echo "  ⚠️  Archivo no encontrado: $file"
        return
    fi
    
    echo "  🔧 Corrigiendo $file..."
    
    # Corregir errores comunes de sintaxis
    sed -i '' 's/Edit-/Edit/g' "$file"
    sed -i '' 's/Loader-/Loader/g' "$file"
    sed -i '' 's/h-- w--/h-4 w-4/g' "$file"
    sed -i '' 's/className="h-- w--"/className="h-4 w-4"/g' "$file"
    sed -i '' 's/className="h-- w-- text-/className="h-4 w-4 text-/g' "$file"
    sed -i '' 's/className="h-- w-- text-blue--"/className="h-4 w-4 text-blue-500"/g' "$file"
    sed -i '' 's/className="h-- w-- text-green--"/className="h-4 w-4 text-green-500"/g' "$file"
    sed -i '' 's/className="h-- w-- text-orange--"/className="h-4 w-4 text-orange-500"/g' "$file"
    sed -i '' 's/className="h-- w-- text-purple--"/className="h-4 w-4 text-purple-500"/g' "$file"
    sed -i '' 's/className="h-- w-- text-gray--"/className="h-4 w-4 text-gray-500"/g' "$file"
    sed -i '' 's/className="h-- w-- text-muted-foreground"/className="h-4 w-4 text-muted-foreground"/g' "$file"
    sed -i '' 's/className="h-- w-- animate-spin"/className="h-4 w-4 animate-spin"/g' "$file"
    sed -i '' 's/rows={-}/rows={4}/g' "$file"
    sed -i '' 's/space-y--/space-y-6/g' "$file"
    sed -i '' 's/gap--/gap-2/g' "$file"
    sed -i '' 's/text--xl/text-2xl/g' "$file"
    sed -i '' 's/h-/h1/g' "$file"
    sed -i '' 's/grid-cols--/grid-cols-1/g' "$file"
    sed -i '' 's/md:grid-cols--/md:grid-cols-3/g' "$file"
    sed -i '' 's/p--/p-4/g' "$file"
    sed -i '' 's/mt--/mt-4/g' "$file"
    sed -i '' 's/mb--/mb-2/g' "$file"
    sed -i '' 's/mr--/mr-2/g' "$file"
    sed -i '' 's/bg-orange--/bg-orange-500/g' "$file"
    sed -i '' 's/bg-green--/bg-green-500/g' "$file"
    sed -i '' 's/bg-purple--/bg-purple-500/g' "$file"
    sed -i '' 's/bg-gray--/bg-gray-500/g' "$file"
    sed -i '' 's/\* -).toFixed(-)/\* 100).toFixed(1)/g' "$file"
    sed -i '' 's/Fallback -/Fallback 1/g' "$file"
    sed -i '' 's/hover:bg-primary\/-/hover:bg-primary\/90/g' "$file"
    
    echo "    ✅ $file corregido"
}

# Lista de archivos a corregir
files=(
    "src/app/analytics/page.tsx"
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

# Corregir cada archivo
for file in "${files[@]}"; do
    fix_file "$file"
done

echo "✅ Todos los errores de sintaxis corregidos"

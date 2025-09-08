#!/bin/bash

# Script para reemplazar todas las referencias de localhost con URLs de producción
echo "🔧 Reemplazando referencias de localhost con URLs de producción..."

# URL de producción
PROD_URL="https://sandbox.d3ts6pwgn7uyyh.amplifyapp.com"

# Archivos a procesar
FILES=(
  "src/config/env.ts"
  "src/config/env-dev.ts"
  "next.config.js"
  "README.md"
  "SETUP.md"
  "docs/DEVELOPMENT.md"
  "docs/aws-cognito.md"
  "scripts/setup-cognito.sh"
  "scripts/setup-aws-cognito-real.sh"
  "scripts/configure-aws-step-by-step.sh"
  "scripts/setup-dev.sh"
  "scripts/setup-dynamodb.sh"
)

# Reemplazar localhost:3000 con URL de producción
for file in "${FILES[@]}"; do
  if [ -f "$file" ]; then
    echo "📝 Procesando: $file"
    sed -i '' "s|http://localhost:3000|$PROD_URL|g" "$file"
    sed -i '' "s|localhost:3000|$PROD_URL|g" "$file"
    sed -i '' "s|localhost|$PROD_URL|g" "$file"
  else
    echo "⚠️ Archivo no encontrado: $file"
  fi
done

echo "✅ Reemplazo completado!"
echo "🔍 Verificando cambios..."

# Mostrar archivos modificados
for file in "${FILES[@]}"; do
  if [ -f "$file" ] && grep -q "sandbox.d3ts6pwgn7uyyh.amplifyapp.com" "$file"; then
    echo "✅ $file - Actualizado"
  fi
done

echo "🎉 Script completado!"

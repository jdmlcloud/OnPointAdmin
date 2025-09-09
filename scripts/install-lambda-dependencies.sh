#!/bin/bash

# Script para instalar dependencias de todas las Lambda functions
# Versión: v1.1.0

echo "🚀 Instalando dependencias de Lambda functions..."

# Directorio base
BASE_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
LAMBDA_DIR="$BASE_DIR/lambda-functions"

# Lista de Lambda functions
LAMBDA_FUNCTIONS=(
    "auth"
    "users"
    "roles"
    "permissions"
    "providers"
    "products"
    "stats"
    "tags"
)

# Función para instalar dependencias
install_dependencies() {
    local lambda_name=$1
    local lambda_path="$LAMBDA_DIR/$lambda_name"
    
    if [ -d "$lambda_path" ]; then
        echo "📦 Instalando dependencias para $lambda_name..."
        cd "$lambda_path"
        
        if [ -f "package.json" ]; then
            npm install
            if [ $? -eq 0 ]; then
                echo "✅ Dependencias instaladas para $lambda_name"
            else
                echo "❌ Error instalando dependencias para $lambda_name"
                return 1
            fi
        else
            echo "⚠️ No se encontró package.json en $lambda_name"
        fi
        
        cd "$BASE_DIR"
    else
        echo "⚠️ Directorio $lambda_name no encontrado"
    fi
}

# Instalar dependencias para cada Lambda function
for lambda in "${LAMBDA_FUNCTIONS[@]}"; do
    install_dependencies "$lambda"
done

echo "🎉 Instalación de dependencias completada!"
echo "📋 Lambda functions procesadas:"
for lambda in "${LAMBDA_FUNCTIONS[@]}"; do
    echo "  - $lambda"
done

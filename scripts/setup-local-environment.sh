#!/bin/bash

# Script maestro para configurar el entorno de desarrollo local
# Versión: v1.1.0

echo "🚀 Configurando entorno de desarrollo local para OnPoint Admin v1.1.0"
echo "=================================================================="

# Verificar que estamos en la rama correcta
CURRENT_BRANCH=$(git branch --show-current)
if [ "$CURRENT_BRANCH" != "feature/user-management-v1.1.0" ]; then
    echo "⚠️ Advertencia: No estás en la rama feature/user-management-v1.1.0"
    echo "   Rama actual: $CURRENT_BRANCH"
    echo "   ¿Deseas continuar? (y/N)"
    read -r response
    if [[ ! "$response" =~ ^[Yy]$ ]]; then
        echo "❌ Operación cancelada"
        exit 1
    fi
fi

echo "✅ Rama actual: $CURRENT_BRANCH"
echo ""

# Función para ejecutar script con manejo de errores
run_script() {
    local script_name=$1
    local script_path="scripts/$script_name"
    
    if [ -f "$script_path" ]; then
        echo "🔄 Ejecutando: $script_name"
        if bash "$script_path"; then
            echo "✅ $script_name completado exitosamente"
        else
            echo "❌ Error en $script_name"
            return 1
        fi
    else
        echo "⚠️ Script $script_name no encontrado"
        return 1
    fi
    echo ""
}

# Paso 1: Instalar dependencias de Lambda functions
echo "📦 PASO 1: Instalando dependencias de Lambda functions"
echo "======================================================"
run_script "install-lambda-dependencies.sh"

# Paso 2: Configurar tablas de DynamoDB
echo "🗄️ PASO 2: Configurando tablas de DynamoDB"
echo "=========================================="
run_script "setup-local-dynamodb.sh"

# Paso 3: Poblar tablas con datos de prueba
echo "🌱 PASO 3: Poblando tablas con datos de prueba"
echo "============================================="
run_script "seed-local-data.sh"

# Paso 4: Verificar configuración
echo "🔍 PASO 4: Verificando configuración"
echo "===================================="

# Verificar que las tablas existen
echo "📋 Verificando tablas de DynamoDB..."
TABLES=(
    "OnPointAdmin-Users-local"
    "OnPointAdmin-Roles-local"
    "OnPointAdmin-Permissions-local"
    "OnPointAdmin-Providers-local"
    "OnPointAdmin-Products-local"
)

for table in "${TABLES[@]}"; do
    if aws dynamodb describe-table --table-name "$table" --region "us-east-1" >/dev/null 2>&1; then
        echo "✅ $table - OK"
    else
        echo "❌ $table - NO ENCONTRADA"
    fi
done

echo ""
echo "🎉 CONFIGURACIÓN DEL ENTORNO LOCAL COMPLETADA!"
echo "=============================================="
echo ""
echo "📋 Resumen de lo configurado:"
echo "  ✅ Dependencias de Lambda functions instaladas"
echo "  ✅ Tablas de DynamoDB creadas"
echo "  ✅ Datos de prueba insertados"
echo ""
echo "👤 Usuarios de prueba disponibles:"
echo "  - superadmin@onpoint.com (Super Administrador)"
echo "  - admin@onpoint.com (Administrador)"
echo "  - ejecutivo@onpoint.com (Ejecutivo)"
echo "  - Contraseña para todos: password"
echo ""
echo "🔧 Próximos pasos:"
echo "1. Configurar variables de entorno en config/local.env"
echo "2. Desarrollar el frontend para gestión de usuarios"
echo "3. Probar las Lambda functions localmente"
echo "4. Implementar autenticación y autorización"
echo ""
echo "📁 Archivos importantes:"
echo "  - config/local.env - Configuración local"
echo "  - lambda-functions/ - Funciones Lambda"
echo "  - src/types/users.ts - Tipos TypeScript"
echo "  - data/seed/ - Datos de prueba"
echo ""
echo "🚀 ¡Listo para desarrollar el sistema de usuarios y roles!"

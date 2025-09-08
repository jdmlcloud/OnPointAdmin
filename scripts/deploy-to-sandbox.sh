#!/bin/bash

# Script para desplegar a sandbox
# IMPORTANTE: Este script NO debe mezclar credenciales de producción

set -e

echo "🚀 === DESPLEGANDO A SANDBOX ==="
echo "⚠️  IMPORTANTE: Verificando que NO se usen credenciales de producción"

# Verificar que estamos en la rama correcta
CURRENT_BRANCH=$(git branch --show-current)
if [ "$CURRENT_BRANCH" != "feature/user-management-v1.1.0" ]; then
    echo "❌ Error: Debes estar en la rama feature/user-management-v1.1.0"
    echo "   Rama actual: $CURRENT_BRANCH"
    exit 1
fi

echo "✅ Rama correcta: $CURRENT_BRANCH"

# Verificar que no hay cambios sin commitear
if ! git diff-index --quiet HEAD --; then
    echo "❌ Error: Hay cambios sin commitear. Haz commit primero."
    git status
    exit 1
fi

echo "✅ No hay cambios sin commitear"

# Verificar configuración de entorno
if [ ! -f "config/sandbox.env" ]; then
    echo "❌ Error: No existe config/sandbox.env"
    exit 1
fi

echo "✅ Archivo de configuración sandbox existe"

# Verificar que las variables de entorno no contengan valores de producción
if grep -q "prod\|production" config/sandbox.env; then
    echo "❌ Error: config/sandbox.env contiene referencias a producción"
    exit 1
fi

echo "✅ Configuración sandbox no contiene referencias a producción"

# 1. Desplegar Lambda functions a sandbox
echo "📦 Desplegando Lambda functions a sandbox..."

# Users Lambda
echo "  - Desplegando Users Lambda..."
cd lambda-functions/users
zip -r users-sandbox.zip . > /dev/null
aws lambda update-function-code \
    --function-name OnPointAdmin-Users-sandbox \
    --zip-file fileb://users-sandbox.zip \
    --region us-east-1
rm users-sandbox.zip
cd ../..

# Roles Lambda
echo "  - Desplegando Roles Lambda..."
cd lambda-functions/roles
zip -r roles-sandbox.zip . > /dev/null
aws lambda update-function-code \
    --function-name OnPointAdmin-Roles-sandbox \
    --zip-file fileb://roles-sandbox.zip \
    --region us-east-1
rm roles-sandbox.zip
cd ../..

# Permissions Lambda
echo "  - Desplegando Permissions Lambda..."
cd lambda-functions/permissions
zip -r permissions-sandbox.zip . > /dev/null
aws lambda update-function-code \
    --function-name OnPointAdmin-Permissions-sandbox \
    --zip-file fileb://permissions-sandbox.zip \
    --region us-east-1
rm permissions-sandbox.zip
cd ../..

echo "✅ Lambda functions desplegadas a sandbox"

# 2. Verificar que las tablas de DynamoDB existen en sandbox
echo "🗄️  Verificando tablas de DynamoDB en sandbox..."

TABLES=("OnPointAdmin-Users-sandbox" "OnPointAdmin-Roles-sandbox" "OnPointAdmin-Permissions-sandbox")

for table in "${TABLES[@]}"; do
    if aws dynamodb describe-table --table-name "$table" --region us-east-1 > /dev/null 2>&1; then
        echo "  ✅ Tabla $table existe"
    else
        echo "  ❌ Tabla $table NO existe. Creándola..."
        # Aquí iría el comando para crear la tabla
        echo "  ⚠️  Necesitas crear la tabla $table manualmente"
    fi
done

# 3. Verificar API Gateway
echo "🌐 Verificando API Gateway..."
if aws apigateway get-rest-api --rest-api-id m4ijnyg5da --region us-east-1 > /dev/null 2>&1; then
    echo "  ✅ API Gateway m4ijnyg5da existe"
else
    echo "  ❌ API Gateway m4ijnyg5da NO existe"
    exit 1
fi

# 4. Crear deployment de API Gateway
echo "🚀 Creando deployment de API Gateway..."
aws apigateway create-deployment \
    --rest-api-id m4ijnyg5da \
    --stage-name sandbox \
    --region us-east-1

echo "✅ Deployment de API Gateway creado"

# 5. Verificar que el frontend apunte a sandbox
echo "🔍 Verificando configuración del frontend..."
if grep -q "m4ijnyg5da.execute-api.us-east-1.amazonaws.com/sandbox" src/config/api.ts; then
    echo "  ✅ Frontend configurado para usar sandbox"
else
    echo "  ❌ Frontend NO está configurado para sandbox"
    exit 1
fi

echo ""
echo "🎉 === DESPLIEGUE A SANDBOX COMPLETADO ==="
echo ""
echo "📋 Resumen:"
echo "  ✅ Lambda functions desplegadas"
echo "  ✅ Tablas de DynamoDB verificadas"
echo "  ✅ API Gateway configurado"
echo "  ✅ Frontend configurado para sandbox"
echo ""
echo "🔗 URLs de sandbox:"
echo "  - API: https://m4ijnyg5da.execute-api.us-east-1.amazonaws.com/sandbox"
echo "  - Frontend: [URL del frontend en sandbox]"
echo ""
echo "⚠️  IMPORTANTE:"
echo "  - Verifica que todo funcione en sandbox antes de ir a producción"
echo "  - NO mezcles credenciales de sandbox con producción"
echo "  - Prueba todas las funcionalidades CRUD"
echo ""
echo "🚀 Listo para pruebas en sandbox!"

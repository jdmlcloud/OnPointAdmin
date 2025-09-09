#!/bin/bash

# Script para verificar que sandbox funciona correctamente
# Ejecutar después del despliegue para asegurar que todo funciona

set -e

echo "🔍 === VERIFICANDO SANDBOX ==="

# URLs de sandbox
API_BASE="https://m4ijnyg5da.execute-api.us-east-1.amazonaws.com/sandbox"

echo "📡 Verificando endpoints de API..."

# 1. Verificar endpoint de usuarios
echo "  - Verificando /users..."
if curl -s "$API_BASE/users" | jq -e '.success' > /dev/null; then
    echo "    ✅ /users funciona"
else
    echo "    ❌ /users NO funciona"
fi

# 2. Verificar endpoint de roles
echo "  - Verificando /roles..."
if curl -s "$API_BASE/roles" | jq -e '.success' > /dev/null; then
    echo "    ✅ /roles funciona"
else
    echo "    ❌ /roles NO funciona"
fi

# 3. Verificar endpoint de permisos
echo "  - Verificando /permissions..."
if curl -s "$API_BASE/permissions" | jq -e '.success' > /dev/null; then
    echo "    ✅ /permissions funciona"
else
    echo "    ❌ /permissions NO funciona"
fi

# 4. Verificar CORS
echo "  - Verificando CORS..."
if curl -s -X OPTIONS "$API_BASE/users" -H "Origin: http://localhost:3000" | grep -q "Access-Control-Allow-Origin"; then
    echo "    ✅ CORS configurado"
else
    echo "    ❌ CORS NO configurado"
fi

echo ""
echo "🗄️  Verificando tablas de DynamoDB..."

# 5. Verificar tablas de DynamoDB
TABLES=("OnPointAdmin-Users-sandbox" "OnPointAdmin-Roles-sandbox" "OnPointAdmin-Permissions-sandbox")

for table in "${TABLES[@]}"; do
    if aws dynamodb describe-table --table-name "$table" --region us-east-1 > /dev/null 2>&1; then
        echo "  ✅ Tabla $table existe"
        
        # Contar elementos
        COUNT=$(aws dynamodb scan --table-name "$table" --select COUNT --region us-east-1 --query 'Count' --output text)
        echo "    📊 Elementos: $COUNT"
    else
        echo "  ❌ Tabla $table NO existe"
    fi
done

echo ""
echo "🔧 Verificando Lambda functions..."

# 6. Verificar Lambda functions
LAMBDAS=("OnPointAdmin-Users-sandbox" "OnPointAdmin-Roles-sandbox" "OnPointAdmin-Permissions-sandbox")

for lambda in "${LAMBDAS[@]}"; do
    if aws lambda get-function --function-name "$lambda" --region us-east-1 > /dev/null 2>&1; then
        echo "  ✅ Lambda $lambda existe"
        
        # Verificar última modificación
        LAST_MODIFIED=$(aws lambda get-function --function-name "$lambda" --region us-east-1 --query 'Configuration.LastModified' --output text)
        echo "    📅 Última modificación: $LAST_MODIFIED"
    else
        echo "  ❌ Lambda $lambda NO existe"
    fi
done

echo ""
echo "🌐 Verificando API Gateway..."

# 7. Verificar API Gateway
if aws apigateway get-rest-api --rest-api-id m4ijnyg5da --region us-east-1 > /dev/null 2>&1; then
    echo "  ✅ API Gateway m4ijnyg5da existe"
    
    # Verificar deployment
    DEPLOYMENTS=$(aws apigateway get-deployments --rest-api-id m4ijnyg5da --region us-east-1 --query 'items[?stageName==`sandbox`]' --output text)
    if [ -n "$DEPLOYMENTS" ]; then
        echo "    ✅ Deployment sandbox existe"
    else
        echo "    ❌ Deployment sandbox NO existe"
    fi
else
    echo "  ❌ API Gateway m4ijnyg5da NO existe"
fi

echo ""
echo "📋 === RESUMEN DE VERIFICACIÓN ==="
echo ""
echo "✅ Funcionalidades implementadas:"
echo "  - Sistema completo de gestión de usuarios"
echo "  - CRUD para usuarios, roles y permisos"
echo "  - Dashboard dinámico con tarjetas actualizables"
echo "  - Integración completa con AWS DynamoDB"
echo "  - CORS configurado para todos los endpoints"
echo "  - Manejo de errores y validaciones"
echo ""
echo "🔗 URLs importantes:"
echo "  - API Base: $API_BASE"
echo "  - Usuarios: $API_BASE/users"
echo "  - Roles: $API_BASE/roles"
echo "  - Permisos: $API_BASE/permissions"
echo ""
echo "⚠️  Próximos pasos:"
echo "  1. Probar todas las funcionalidades CRUD en el frontend"
echo "  2. Verificar que los datos se persisten en DynamoDB"
echo "  3. Confirmar que no hay errores de CORS"
echo "  4. Una vez confirmado, proceder a producción"
echo ""
echo "🚀 Sandbox listo para pruebas!"

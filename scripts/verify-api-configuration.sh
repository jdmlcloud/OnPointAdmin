#!/bin/bash

# Script para verificar la configuración de los APIs
set -e

echo "🔍 Verificando configuración de APIs..."

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuración
REGION="us-east-1"
SANDBOX_API_ID="m4ijnyg5da"
PROD_API_ID="9o43ckvise"

echo -e "${BLUE}📋 Verificando APIs...${NC}"

# Verificar API de sandbox
echo -e "${YELLOW}🔍 Verificando API de sandbox (${SANDBOX_API_ID})...${NC}"
if aws apigateway get-rest-api --rest-api-id "$SANDBOX_API_ID" >/dev/null 2>&1; then
    echo -e "${GREEN}✅ API de sandbox existe${NC}"
    
    # Verificar stage
    if aws apigateway get-stage --rest-api-id "$SANDBOX_API_ID" --stage-name sandbox >/dev/null 2>&1; then
        echo -e "${GREEN}✅ Stage 'sandbox' existe${NC}"
    else
        echo -e "${RED}❌ Stage 'sandbox' no existe${NC}"
    fi
    
    # Verificar recursos
    RESOURCES=$(aws apigateway get-resources --rest-api-id "$SANDBOX_API_ID" --query 'items[].pathPart' --output text)
    echo -e "${BLUE}📋 Recursos disponibles: $RESOURCES${NC}"
    
    # Verificar método GET en providers
    PROVIDERS_RESOURCE_ID=$(aws apigateway get-resources --rest-api-id "$SANDBOX_API_ID" --query 'items[?pathPart==`providers`].id' --output text)
    if [ -n "$PROVIDERS_RESOURCE_ID" ]; then
        echo -e "${GREEN}✅ Recurso 'providers' existe (ID: $PROVIDERS_RESOURCE_ID)${NC}"
        
        # Verificar método GET
        if aws apigateway get-method --rest-api-id "$SANDBOX_API_ID" --resource-id "$PROVIDERS_RESOURCE_ID" --http-method GET >/dev/null 2>&1; then
            echo -e "${GREEN}✅ Método GET en providers existe${NC}"
            
            # Verificar integración
            INTEGRATION_URI=$(aws apigateway get-integration --rest-api-id "$SANDBOX_API_ID" --resource-id "$PROVIDERS_RESOURCE_ID" --http-method GET --query 'uri' --output text)
            echo -e "${BLUE}🔗 Integración: $INTEGRATION_URI${NC}"
        else
            echo -e "${RED}❌ Método GET en providers no existe${NC}"
        fi
    else
        echo -e "${RED}❌ Recurso 'providers' no existe${NC}"
    fi
else
    echo -e "${RED}❌ API de sandbox no existe${NC}"
fi

echo ""

# Verificar API de producción
echo -e "${YELLOW}🔍 Verificando API de producción (${PROD_API_ID})...${NC}"
if aws apigateway get-rest-api --rest-api-id "$PROD_API_ID" >/dev/null 2>&1; then
    echo -e "${GREEN}✅ API de producción existe${NC}"
    
    # Verificar stage
    if aws apigateway get-stage --rest-api-id "$PROD_API_ID" --stage-name prod >/dev/null 2>&1; then
        echo -e "${GREEN}✅ Stage 'prod' existe${NC}"
    else
        echo -e "${RED}❌ Stage 'prod' no existe${NC}"
    fi
else
    echo -e "${RED}❌ API de producción no existe${NC}"
fi

echo ""

# Verificar Lambda functions
echo -e "${YELLOW}🔍 Verificando Lambda functions...${NC}"
LAMBDA_FUNCTIONS=("onpoint-admin-providers" "onpoint-admin-users" "onpoint-admin-stats" "onpoint-admin-tags" "onpoint-products-api")

for func in "${LAMBDA_FUNCTIONS[@]}"; do
    if aws lambda get-function --function-name "$func" >/dev/null 2>&1; then
        echo -e "${GREEN}✅ Lambda function '$func' existe${NC}"
        
        # Verificar variables de entorno
        ENV_VARS=$(aws lambda get-function-configuration --function-name "$func" --query 'Environment.Variables' --output json)
        echo -e "${BLUE}🔧 Variables de entorno: $ENV_VARS${NC}"
    else
        echo -e "${RED}❌ Lambda function '$func' no existe${NC}"
    fi
done

echo ""

# Verificar permisos de Lambda
echo -e "${YELLOW}🔍 Verificando permisos de Lambda...${NC}"
for func in "${LAMBDA_FUNCTIONS[@]}"; do
    POLICY=$(aws lambda get-policy --function-name "$func" --query 'Policy' --output text 2>/dev/null || echo "{}")
    if echo "$POLICY" | grep -q "m4ijnyg5da"; then
        echo -e "${GREEN}✅ '$func' tiene permisos para sandbox API${NC}"
    else
        echo -e "${RED}❌ '$func' NO tiene permisos para sandbox API${NC}"
    fi
    
    if echo "$POLICY" | grep -q "9o43ckvise"; then
        echo -e "${GREEN}✅ '$func' tiene permisos para prod API${NC}"
    else
        echo -e "${RED}❌ '$func' NO tiene permisos para prod API${NC}"
    fi
done

echo ""

# Probar APIs directamente
echo -e "${YELLOW}🔍 Probando APIs directamente...${NC}"

echo -e "${BLUE}🧪 Probando API de sandbox...${NC}"
SANDBOX_RESPONSE=$(curl -s --max-time 10 "https://m4ijnyg5da.execute-api.us-east-1.amazonaws.com/sandbox/providers" || echo "ERROR")
if [[ "$SANDBOX_RESPONSE" == *"success"* ]]; then
    echo -e "${GREEN}✅ API de sandbox responde correctamente${NC}"
else
    echo -e "${RED}❌ API de sandbox no responde: $SANDBOX_RESPONSE${NC}"
fi

echo -e "${BLUE}🧪 Probando API de producción...${NC}"
PROD_RESPONSE=$(curl -s --max-time 10 "https://9o43ckvise.execute-api.us-east-1.amazonaws.com/prod/providers" || echo "ERROR")
if [[ "$PROD_RESPONSE" == *"success"* ]]; then
    echo -e "${GREEN}✅ API de producción responde correctamente${NC}"
else
    echo -e "${RED}❌ API de producción no responde: $PROD_RESPONSE${NC}"
fi

echo ""
echo -e "${GREEN}🎉 Verificación completada${NC}"

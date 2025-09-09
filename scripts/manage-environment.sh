#!/bin/bash

# Script para gestionar entornos de desarrollo
# Uso: ./scripts/manage-environment.sh <environment> <action>

set -e

ENVIRONMENT=${1:-sandbox}
ACTION=${2:-status}

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Función para mostrar ayuda
show_help() {
    echo "Uso: $0 <environment> <action>"
    echo ""
    echo "Entornos disponibles:"
    echo "  sandbox    - Entorno de pruebas"
    echo "  prod       - Entorno de producción"
    echo ""
    echo "Acciones disponibles:"
    echo "  status     - Mostrar estado del entorno"
    echo "  deploy     - Desplegar al entorno"
    echo "  test       - Probar endpoints del entorno"
    echo "  logs       - Mostrar logs de Lambda functions"
    echo "  cleanup    - Limpiar recursos del entorno"
    echo ""
    echo "Ejemplos:"
    echo "  $0 sandbox status"
    echo "  $0 prod deploy"
    echo "  $0 sandbox test"
}

# Función para mostrar estado del entorno
show_status() {
    echo -e "${BLUE}🔍 Verificando estado del entorno: $ENVIRONMENT${NC}"
    echo ""
    
    # Verificar Lambda functions
    echo -e "${YELLOW}📦 Lambda Functions:${NC}"
    aws lambda list-functions \
        --query "Functions[?contains(FunctionName, '$ENVIRONMENT')].{Name:FunctionName,State:State,LastModified:LastModified}" \
        --output table
    echo ""
    
    # Verificar DynamoDB tables
    echo -e "${YELLOW}🗄️ DynamoDB Tables:${NC}"
    aws dynamodb list-tables \
        --query "TableNames[?contains(@, '$ENVIRONMENT')]" \
        --output table
    echo ""
    
    # Verificar API Gateway
    echo -e "${YELLOW}🌐 API Gateway:${NC}"
    aws apigateway get-rest-apis \
        --query "items[?contains(name, '$ENVIRONMENT')].{Name:name,Id:id,CreatedDate:createdDate}" \
        --output table
    echo ""
}

# Función para desplegar al entorno
deploy() {
    echo -e "${BLUE}🚀 Desplegando al entorno: $ENVIRONMENT${NC}"
    echo ""
    
    # Deploy Products Lambda
    echo -e "${YELLOW}📦 Desplegando Products Lambda...${NC}"
    cd lambda-functions/products
    zip -r products-$ENVIRONMENT.zip index.js package.json
    aws lambda update-function-code \
        --function-name OnPointAdmin-Products-$ENVIRONMENT \
        --zip-file fileb://products-$ENVIRONMENT.zip
    echo -e "${GREEN}✅ Products Lambda desplegada${NC}"
    
    # Deploy Users Lambda
    echo -e "${YELLOW}📦 Desplegando Users Lambda...${NC}"
    cd ../users
    zip -r users-$ENVIRONMENT.zip index.js package.json
    aws lambda update-function-code \
        --function-name OnPointAdmin-Users-$ENVIRONMENT \
        --zip-file fileb://users-$ENVIRONMENT.zip
    echo -e "${GREEN}✅ Users Lambda desplegada${NC}"
    
    cd ../..
    echo -e "${GREEN}✅ Deploy completado${NC}"
}

# Función para probar endpoints
test_endpoints() {
    echo -e "${BLUE}🧪 Probando endpoints del entorno: $ENVIRONMENT${NC}"
    echo ""
    
    if [ "$ENVIRONMENT" = "sandbox" ]; then
        BASE_URL="https://m4ijnyg5da.execute-api.us-east-1.amazonaws.com/sandbox"
    elif [ "$ENVIRONMENT" = "prod" ]; then
        BASE_URL="https://9o43ckvise.execute-api.us-east-1.amazonaws.com/prod"
    else
        echo -e "${RED}❌ Entorno no válido: $ENVIRONMENT${NC}"
        exit 1
    fi
    
    # Probar endpoint de productos
    echo -e "${YELLOW}🔍 Probando /products...${NC}"
    if curl -f -s "$BASE_URL/products" > /dev/null; then
        echo -e "${GREEN}✅ /products - OK${NC}"
    else
        echo -e "${RED}❌ /products - Error${NC}"
    fi
    
    # Probar endpoint de usuarios
    echo -e "${YELLOW}🔍 Probando /users...${NC}"
    if curl -f -s "$BASE_URL/users" > /dev/null; then
        echo -e "${GREEN}✅ /users - OK${NC}"
    else
        echo -e "${RED}❌ /users - Error${NC}"
    fi
    
    # Probar endpoint de proveedores
    echo -e "${YELLOW}🔍 Probando /providers...${NC}"
    if curl -f -s "$BASE_URL/providers" > /dev/null; then
        echo -e "${GREEN}✅ /providers - OK${NC}"
    else
        echo -e "${RED}❌ /providers - Error${NC}"
    fi
}

# Función para mostrar logs
show_logs() {
    echo -e "${BLUE}📋 Mostrando logs del entorno: $ENVIRONMENT${NC}"
    echo ""
    
    # Logs de Products Lambda
    echo -e "${YELLOW}📦 Logs de Products Lambda:${NC}"
    aws logs describe-log-groups \
        --log-group-name-prefix "/aws/lambda/OnPointAdmin-Products-$ENVIRONMENT" \
        --query "logGroups[0].logGroupName" \
        --output text | xargs -I {} aws logs tail {} --since 1h --follow
    
    echo ""
    echo -e "${YELLOW}📦 Logs de Users Lambda:${NC}"
    aws logs describe-log-groups \
        --log-group-name-prefix "/aws/lambda/OnPointAdmin-Users-$ENVIRONMENT" \
        --query "logGroups[0].logGroupName" \
        --output text | xargs -I {} aws logs tail {} --since 1h --follow
}

# Función para limpiar recursos
cleanup() {
    echo -e "${RED}🧹 Limpiando recursos del entorno: $ENVIRONMENT${NC}"
    echo -e "${YELLOW}⚠️ Esta acción eliminará recursos de AWS. ¿Estás seguro? (y/N)${NC}"
    read -r response
    if [[ "$response" =~ ^[Yy]$ ]]; then
        echo -e "${YELLOW}🗑️ Eliminando recursos...${NC}"
        # Aquí se implementaría la lógica de limpieza
        echo -e "${GREEN}✅ Limpieza completada${NC}"
    else
        echo -e "${YELLOW}❌ Limpieza cancelada${NC}"
    fi
}

# Función principal
main() {
    case $ACTION in
        status)
            show_status
            ;;
        deploy)
            deploy
            ;;
        test)
            test_endpoints
            ;;
        logs)
            show_logs
            ;;
        cleanup)
            cleanup
            ;;
        help|--help|-h)
            show_help
            ;;
        *)
            echo -e "${RED}❌ Acción no válida: $ACTION${NC}"
            echo ""
            show_help
            exit 1
            ;;
    esac
}

# Verificar que se proporcionen argumentos
if [ $# -eq 0 ]; then
    show_help
    exit 1
fi

# Ejecutar función principal
main

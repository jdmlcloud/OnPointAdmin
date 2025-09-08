#!/bin/bash

# Script maestro para configurar entornos completamente separados
set -e

echo "🌍 Configurando entornos completamente separados..."

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
NC='\033[0m' # No Color

# Configuración
REGION="us-east-1"
PROJECT_NAME="OnPointAdmin"

echo -e "${BLUE}📋 Configuración:${NC}"
echo "  - Región: $REGION"
echo "  - Proyecto: $PROJECT_NAME"
echo ""

# Función para mostrar menú
show_menu() {
    echo -e "${BLUE}🌍 Configuración de Entornos Separados${NC}"
    echo ""
    echo -e "${YELLOW}Selecciona una opción:${NC}"
    echo "  1) 🗄️  Configurar DynamoDB separado"
    echo "  2) 🚀 Configurar API Gateway separado"
    echo "  3) ⚡ Configurar Lambda Functions separadas"
    echo "  4) 🔧 Configurar todo (recomendado)"
    echo "  5) 📊 Ver estado actual"
    echo "  6) 🧹 Limpiar recursos de prueba"
    echo "  7) ❌ Salir"
    echo ""
}

# Función para configurar DynamoDB
setup_dynamodb() {
    echo -e "${BLUE}🗄️ Configurando DynamoDB separado...${NC}"
    ./scripts/setup-separate-dynamodb.sh
    echo -e "${GREEN}✅ DynamoDB configurado${NC}"
}

# Función para configurar API Gateway
setup_api_gateway() {
    echo -e "${BLUE}🚀 Configurando API Gateway separado...${NC}"
    ./scripts/setup-separate-apis.sh
    echo -e "${GREEN}✅ API Gateway configurado${NC}"
}

# Función para configurar Lambda Functions
setup_lambda_functions() {
    echo -e "${BLUE}⚡ Configurando Lambda Functions separadas...${NC}"
    
    # Crear directorio de configuración
    mkdir -p config
    
    # Configurar Lambda para sandbox
    echo -e "${YELLOW}📋 Configurando Lambda Functions para SANDBOX...${NC}"
    
    # Crear archivo de configuración para sandbox
    cat > config/lambda-sandbox.env << EOF
ENVIRONMENT=sandbox
REGION=$REGION
PROJECT_NAME=$PROJECT_NAME
DYNAMODB_USERS_TABLE=$PROJECT_NAME-Users-sandbox
DYNAMODB_PROVIDERS_TABLE=$PROJECT_NAME-Providers-sandbox
DYNAMODB_PRODUCTS_TABLE=$PROJECT_NAME-Products-sandbox
DYNAMODB_TAGS_TABLE=$PROJECT_NAME-Tags-sandbox
DYNAMODB_REGION=$REGION
LOG_LEVEL=DEBUG
EOF
    
    # Configurar Lambda para producción
    echo -e "${YELLOW}📋 Configurando Lambda Functions para PRODUCCIÓN...${NC}"
    
    # Crear archivo de configuración para producción
    cat > config/lambda-prod.env << EOF
ENVIRONMENT=prod
REGION=$REGION
PROJECT_NAME=$PROJECT_NAME
DYNAMODB_USERS_TABLE=$PROJECT_NAME-Users-prod
DYNAMODB_PROVIDERS_TABLE=$PROJECT_NAME-Providers-prod
DYNAMODB_PRODUCTS_TABLE=$PROJECT_NAME-Products-prod
DYNAMODB_TAGS_TABLE=$PROJECT_NAME-Tags-prod
DYNAMODB_REGION=$REGION
LOG_LEVEL=INFO
EOF
    
    echo -e "${GREEN}✅ Lambda Functions configuradas${NC}"
}

# Función para configurar todo
setup_all() {
    echo -e "${BLUE}🔧 Configurando todo el entorno separado...${NC}"
    echo ""
    
    # 1. DynamoDB
    echo -e "${PURPLE}1️⃣ Configurando DynamoDB...${NC}"
    setup_dynamodb
    echo ""
    
    # 2. Lambda Functions
    echo -e "${PURPLE}2️⃣ Configurando Lambda Functions...${NC}"
    setup_lambda_functions
    echo ""
    
    # 3. API Gateway
    echo -e "${PURPLE}3️⃣ Configurando API Gateway...${NC}"
    setup_api_gateway
    echo ""
    
    # 4. Crear archivo de configuración maestro
    echo -e "${PURPLE}4️⃣ Creando configuración maestro...${NC}"
    create_master_config
    
    echo -e "${GREEN}🎉 ¡Entornos completamente separados configurados!${NC}"
    show_summary
}

# Función para crear configuración maestro
create_master_config() {
    echo -e "${BLUE}📋 Creando configuración maestro...${NC}"
    
    # Crear archivo de configuración maestro
    cat > config/environments.env << EOF
# Configuración de Entornos Separados
# Generado automáticamente el $(date)

# Región
REGION=$REGION
PROJECT_NAME=$PROJECT_NAME

# Sandbox
SANDBOX_API_ID=\$(cat config/api-sandbox.env | grep API_ID_SANDBOX | cut -d'=' -f2)
SANDBOX_API_URL=\$(cat config/api-sandbox.env | grep API_URL_SANDBOX | cut -d'=' -f2)
SANDBOX_DYNAMODB_USERS_TABLE=$PROJECT_NAME-Users-sandbox
SANDBOX_DYNAMODB_PROVIDERS_TABLE=$PROJECT_NAME-Providers-sandbox
SANDBOX_DYNAMODB_PRODUCTS_TABLE=$PROJECT_NAME-Products-sandbox
SANDBOX_DYNAMODB_TAGS_TABLE=$PROJECT_NAME-Tags-sandbox

# Producción
PROD_API_ID=\$(cat config/api-prod.env | grep API_ID_PROD | cut -d'=' -f2)
PROD_API_URL=\$(cat config/api-prod.env | grep API_URL_PROD | cut -d'=' -f2)
PROD_DYNAMODB_USERS_TABLE=$PROJECT_NAME-Users-prod
PROD_DYNAMODB_PROVIDERS_TABLE=$PROJECT_NAME-Providers-prod
PROD_DYNAMODB_PRODUCTS_TABLE=$PROJECT_NAME-Products-prod
PROD_DYNAMODB_TAGS_TABLE=$PROJECT_NAME-Tags-prod

# URLs de Frontend
SANDBOX_FRONTEND_URL=https://sandbox.d3ts6pwgn7uyyh.amplifyapp.com
PROD_FRONTEND_URL=https://d3ts6pwgn7uyyh.amplifyapp.com
EOF
    
    echo -e "${GREEN}✅ Configuración maestro creada${NC}"
}

# Función para mostrar resumen
show_summary() {
    echo ""
    echo -e "${GREEN}🎉 ¡Configuración completada!${NC}"
    echo ""
    echo -e "${BLUE}📋 Resumen de entornos:${NC}"
    echo ""
    echo -e "${YELLOW}🧪 SANDBOX:${NC}"
    echo "  - Frontend: https://sandbox.d3ts6pwgn7uyyh.amplifyapp.com"
    echo "  - API: $(cat config/api-sandbox.env 2>/dev/null | grep API_URL_SANDBOX | cut -d'=' -f2 || echo 'No configurado')"
    echo "  - DynamoDB: Tablas separadas con datos de prueba"
    echo "  - Lambda: Functions separadas para sandbox"
    echo ""
    echo -e "${YELLOW}🚀 PRODUCCIÓN:${NC}"
    echo "  - Frontend: https://d3ts6pwgn7uyyh.amplifyapp.com"
    echo "  - API: $(cat config/api-prod.env 2>/dev/null | grep API_URL_PROD | cut -d'=' -f2 || echo 'No configurado')"
    echo "  - DynamoDB: Tablas separadas (vacías)"
    echo "  - Lambda: Functions separadas para producción"
    echo ""
    echo -e "${BLUE}📁 Archivos de configuración:${NC}"
    echo "  - config/environments.env (maestro)"
    echo "  - config/dynamodb-sandbox.env"
    echo "  - config/dynamodb-prod.env"
    echo "  - config/api-sandbox.env"
    echo "  - config/api-prod.env"
    echo "  - config/lambda-sandbox.env"
    echo "  - config/lambda-prod.env"
    echo ""
    echo -e "${YELLOW}⚠️  Próximos pasos:${NC}"
    echo "  1. Actualizar variables de entorno en las Lambda functions"
    echo "  2. Actualizar configuración del frontend"
    echo "  3. Probar en sandbox antes de producción"
    echo "  4. Configurar monitoreo y alertas"
}

# Función para ver estado actual
show_status() {
    echo -e "${BLUE}📊 Estado actual de los entornos${NC}"
    echo ""
    
    # Verificar DynamoDB
    echo -e "${YELLOW}🗄️ DynamoDB:${NC}"
    if aws dynamodb describe-table --table-name "$PROJECT_NAME-Users-sandbox" --region "$REGION" >/dev/null 2>&1; then
        echo "  ✅ Sandbox: Tablas creadas"
    else
        echo "  ❌ Sandbox: Tablas no encontradas"
    fi
    
    if aws dynamodb describe-table --table-name "$PROJECT_NAME-Users-prod" --region "$REGION" >/dev/null 2>&1; then
        echo "  ✅ Producción: Tablas creadas"
    else
        echo "  ❌ Producción: Tablas no encontradas"
    fi
    
    # Verificar API Gateway
    echo -e "${YELLOW}🚀 API Gateway:${NC}"
    if [ -f "config/api-sandbox.env" ]; then
        echo "  ✅ Sandbox: Configurado"
    else
        echo "  ❌ Sandbox: No configurado"
    fi
    
    if [ -f "config/api-prod.env" ]; then
        echo "  ✅ Producción: Configurado"
    else
        echo "  ❌ Producción: No configurado"
    fi
    
    # Verificar Lambda Functions
    echo -e "${YELLOW}⚡ Lambda Functions:${NC}"
    if aws lambda get-function --function-name "$PROJECT_NAME-Users-sandbox" --region "$REGION" >/dev/null 2>&1; then
        echo "  ✅ Sandbox: Functions creadas"
    else
        echo "  ❌ Sandbox: Functions no encontradas"
    fi
    
    if aws lambda get-function --function-name "$PROJECT_NAME-Users-prod" --region "$REGION" >/dev/null 2>&1; then
        echo "  ✅ Producción: Functions creadas"
    else
        echo "  ❌ Producción: Functions no encontradas"
    fi
}

# Función para limpiar recursos de prueba
cleanup_test_resources() {
    echo -e "${BLUE}🧹 Limpiando recursos de prueba...${NC}"
    echo ""
    
    read -p "¿Estás seguro de que quieres eliminar los recursos de prueba? (y/n): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        echo -e "${YELLOW}⚠️  Eliminando recursos de prueba...${NC}"
        
        # Eliminar tablas DynamoDB de sandbox
        aws dynamodb delete-table --table-name "$PROJECT_NAME-Users-sandbox" --region "$REGION" 2>/dev/null || echo "Tabla Users-sandbox no encontrada"
        aws dynamodb delete-table --table-name "$PROJECT_NAME-Providers-sandbox" --region "$REGION" 2>/dev/null || echo "Tabla Providers-sandbox no encontrada"
        aws dynamodb delete-table --table-name "$PROJECT_NAME-Products-sandbox" --region "$REGION" 2>/dev/null || echo "Tabla Products-sandbox no encontrada"
        aws dynamodb delete-table --table-name "$PROJECT_NAME-Tags-sandbox" --region "$REGION" 2>/dev/null || echo "Tabla Tags-sandbox no encontrada"
        
        # Eliminar archivos de configuración
        rm -f config/dynamodb-sandbox.env
        rm -f config/api-sandbox.env
        rm -f config/lambda-sandbox.env
        
        echo -e "${GREEN}✅ Recursos de prueba eliminados${NC}"
    else
        echo -e "${YELLOW}❌ Operación cancelada${NC}"
    fi
}

# Función principal
main() {
    while true; do
        show_menu
        read -p "Selecciona una opción (1-7): " choice
        
        case $choice in
            1)
                setup_dynamodb
                ;;
            2)
                setup_api_gateway
                ;;
            3)
                setup_lambda_functions
                ;;
            4)
                setup_all
                break
                ;;
            5)
                show_status
                ;;
            6)
                cleanup_test_resources
                ;;
            7)
                echo -e "${GREEN}👋 ¡Hasta luego!${NC}"
                exit 0
                ;;
            *)
                echo -e "${RED}❌ Opción no válida. Por favor, selecciona 1-7.${NC}"
                ;;
        esac
        
        echo ""
        read -p "Presiona Enter para continuar..."
        echo ""
    done
}

# Ejecutar función principal
main "$@"

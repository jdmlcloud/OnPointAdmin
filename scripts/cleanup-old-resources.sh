#!/bin/bash

# Script para limpiar recursos antiguos en AWS
set -e

echo "🧹 Limpiando recursos antiguos en AWS..."

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuración
REGION="us-east-1"
OLD_API_ID="7z4skk6jy0"

echo -e "${BLUE}📋 Recursos a limpiar:${NC}"
echo "  - API Gateway anterior: $OLD_API_ID"
echo "  - Tablas DynamoDB antiguas"
echo "  - Recursos no utilizados"
echo ""

# Función para confirmar eliminación
confirm_deletion() {
    local resource_type=$1
    local resource_name=$2
    
    echo -e "${YELLOW}⚠️  ¿Eliminar $resource_type: $resource_name? (y/n):${NC}"
    read -p "" -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        return 0
    else
        return 1
    fi
}

# Función para eliminar API Gateway anterior
delete_old_api() {
    echo -e "${BLUE}🗑️  Eliminando API Gateway anterior...${NC}"
    
    if confirm_deletion "API Gateway" "$OLD_API_ID"; then
        echo -e "${BLUE}🔍 Verificando si el API existe...${NC}"
        if aws apigateway get-rest-api --rest-api-id "$OLD_API_ID" >/dev/null 2>&1; then
            echo -e "${BLUE}🗑️  Eliminando API Gateway: $OLD_API_ID${NC}"
            aws apigateway delete-rest-api --rest-api-id "$OLD_API_ID"
            echo -e "${GREEN}✅ API Gateway $OLD_API_ID eliminado${NC}"
        else
            echo -e "${YELLOW}ℹ️  API Gateway $OLD_API_ID no encontrado${NC}"
        fi
    else
        echo -e "${YELLOW}❌ Eliminación de API Gateway cancelada${NC}"
    fi
}

# Función para eliminar tablas DynamoDB antiguas
delete_old_dynamodb_tables() {
    echo -e "${BLUE}🗑️  Eliminando tablas DynamoDB antiguas...${NC}"
    
    # Listar todas las tablas
    TABLES=$(aws dynamodb list-tables --query 'TableNames[?contains(@, `OnPointAdmin`) && !contains(@, `-sandbox`) && !contains(@, `-prod`)]' --output text)
    
    if [ -n "$TABLES" ]; then
        echo -e "${YELLOW}📋 Tablas encontradas para eliminar:${NC}"
        for table in $TABLES; do
            echo "  - $table"
        done
        echo ""
        
        if confirm_deletion "tablas DynamoDB" "todas las tablas antiguas"; then
            for table in $TABLES; do
                echo -e "${BLUE}🗑️  Eliminando tabla: $table${NC}"
                aws dynamodb delete-table --table-name "$table" --region "$REGION"
                echo -e "${GREEN}✅ Tabla $table eliminada${NC}"
            done
        else
            echo -e "${YELLOW}❌ Eliminación de tablas cancelada${NC}"
        fi
    else
        echo -e "${YELLOW}ℹ️  No se encontraron tablas antiguas para eliminar${NC}"
    fi
}

# Función para eliminar Lambda functions no utilizadas
delete_unused_lambda_functions() {
    echo -e "${BLUE}🗑️  Verificando Lambda functions no utilizadas...${NC}"
    
    # Listar todas las Lambda functions
    FUNCTIONS=$(aws lambda list-functions --query 'Functions[?contains(FunctionName, `OnPointAdmin`) || contains(FunctionName, `onpoint`)].FunctionName' --output text)
    
    if [ -n "$FUNCTIONS" ]; then
        echo -e "${YELLOW}📋 Lambda functions encontradas:${NC}"
        for func in $FUNCTIONS; do
            echo "  - $func"
        done
        echo ""
        
        echo -e "${YELLOW}⚠️  Las Lambda functions actuales se mantendrán:${NC}"
        echo "  - onpoint-admin-providers"
        echo "  - onpoint-admin-users"
        echo "  - onpoint-admin-stats"
        echo "  - onpoint-admin-tags"
        echo "  - onpoint-products-api"
        echo ""
        
        echo -e "${YELLOW}ℹ️  No se eliminarán Lambda functions automáticamente${NC}"
        echo -e "${YELLOW}ℹ️  Si hay funciones no utilizadas, elimínalas manualmente${NC}"
    else
        echo -e "${YELLOW}ℹ️  No se encontraron Lambda functions para verificar${NC}"
    fi
}

# Función para limpiar CloudWatch Logs
cleanup_cloudwatch_logs() {
    echo -e "${BLUE}🗑️  Limpiando CloudWatch Logs antiguos...${NC}"
    
    # Listar log groups
    LOG_GROUPS=$(aws logs describe-log-groups --log-group-name-prefix "/aws/lambda" --query 'logGroups[?contains(logGroupName, `OnPointAdmin`) || contains(logGroupName, `onpoint`)].logGroupName' --output text)
    
    if [ -n "$LOG_GROUPS" ]; then
        echo -e "${YELLOW}📋 Log groups encontrados:${NC}"
        for log_group in $LOG_GROUPS; do
            echo "  - $log_group"
        done
        echo ""
        
        if confirm_deletion "CloudWatch Log Groups" "logs antiguos"; then
            for log_group in $LOG_GROUPS; do
                echo -e "${BLUE}🗑️  Eliminando log group: $log_group${NC}"
                aws logs delete-log-group --log-group-name "$log_group"
                echo -e "${GREEN}✅ Log group $log_group eliminado${NC}"
            done
        else
            echo -e "${YELLOW}❌ Eliminación de logs cancelada${NC}"
        fi
    else
        echo -e "${YELLOW}ℹ️  No se encontraron log groups para eliminar${NC}"
    fi
}

# Función para mostrar resumen de recursos actuales
show_current_resources() {
    echo -e "${BLUE}📊 Recursos actuales en AWS:${NC}"
    echo ""
    
    # APIs
    echo -e "${YELLOW}🚀 API Gateways:${NC}"
    aws apigateway get-rest-apis --query 'items[?contains(name, `OnPointAdmin`)].{Name:name,Id:id,Description:description}' --output table 2>/dev/null || echo "  No se pudieron obtener APIs"
    
    # Tablas DynamoDB
    echo -e "${YELLOW}🗄️  Tablas DynamoDB:${NC}"
    aws dynamodb list-tables --query 'TableNames[?contains(@, `OnPointAdmin`)]' --output table 2>/dev/null || echo "  No se pudieron obtener tablas"
    
    # Lambda functions
    echo -e "${YELLOW}⚡ Lambda Functions:${NC}"
    aws lambda list-functions --query 'Functions[?contains(FunctionName, `onpoint`)].{Name:FunctionName,Runtime:Runtime,LastModified:LastModified}' --output table 2>/dev/null || echo "  No se pudieron obtener Lambda functions"
}

# Función principal
main() {
    echo -e "${BLUE}🧹 Limpieza de recursos antiguos en AWS${NC}"
    echo ""
    
    # Mostrar recursos actuales
    show_current_resources
    echo ""
    
    # Eliminar API Gateway anterior
    delete_old_api
    echo ""
    
    # Eliminar tablas DynamoDB antiguas
    delete_old_dynamodb_tables
    echo ""
    
    # Verificar Lambda functions
    delete_unused_lambda_functions
    echo ""
    
    # Limpiar CloudWatch Logs
    cleanup_cloudwatch_logs
    echo ""
    
    echo -e "${GREEN}🎉 ¡Limpieza completada!${NC}"
    echo ""
    echo -e "${BLUE}📋 Recursos mantenidos:${NC}"
    echo "  - API Gateway Sandbox: m4ijnyg5da"
    echo "  - API Gateway Producción: 9o43ckvise"
    echo "  - Tablas DynamoDB separadas por entorno"
    echo "  - Lambda functions configuradas"
    echo ""
    echo -e "${YELLOW}⚠️  Verifica que todos los recursos necesarios estén funcionando${NC}"
}

# Ejecutar función principal
main "$@"

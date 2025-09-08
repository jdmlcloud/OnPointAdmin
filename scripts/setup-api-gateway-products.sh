#!/bin/bash

# Script para configurar API Gateway para productos
set -e

echo "🚀 Configurando API Gateway para productos..."

# Variables
API_ID="7z4skk6jy0"
STAGE="prod"
FUNCTION_NAME="onpoint-products-api"
REGION="us-east-1"

# Obtener el ARN de la función Lambda
FUNCTION_ARN=$(aws lambda get-function --function-name $FUNCTION_NAME --query 'Configuration.FunctionArn' --output text)
echo "✅ Función Lambda encontrada: $FUNCTION_ARN"

# Crear el recurso /products
echo "📁 Creando recurso /products..."
PRODUCTS_RESOURCE_ID=$(aws apigateway create-resource \
    --rest-api-id $API_ID \
    --parent-id $(aws apigateway get-resources --rest-api-id $API_ID --query 'items[?path==`/`].id' --output text) \
    --path-part "products" \
    --query 'id' \
    --output text)

echo "✅ Recurso /products creado: $PRODUCTS_RESOURCE_ID"

# Crear el recurso /products/{id}
echo "📁 Creando recurso /products/{id}..."
PRODUCT_ID_RESOURCE_ID=$(aws apigateway create-resource \
    --rest-api-id $API_ID \
    --parent-id $PRODUCTS_RESOURCE_ID \
    --path-part "{id}" \
    --query 'id' \
    --output text)

echo "✅ Recurso /products/{id} creado: $PRODUCT_ID_RESOURCE_ID"

# Configurar métodos para /products
echo "🔧 Configurando métodos para /products..."

# GET /products
aws apigateway put-method \
    --rest-api-id $API_ID \
    --resource-id $PRODUCTS_RESOURCE_ID \
    --http-method GET \
    --authorization-type NONE

aws apigateway put-integration \
    --rest-api-id $API_ID \
    --resource-id $PRODUCTS_RESOURCE_ID \
    --http-method GET \
    --type AWS_PROXY \
    --integration-http-method POST \
    --uri "arn:aws:apigateway:$REGION:lambda:path/2015-03-31/functions/$FUNCTION_ARN/invocations"

# POST /products
aws apigateway put-method \
    --rest-api-id $API_ID \
    --resource-id $PRODUCTS_RESOURCE_ID \
    --http-method POST \
    --authorization-type NONE

aws apigateway put-integration \
    --rest-api-id $API_ID \
    --resource-id $PRODUCTS_RESOURCE_ID \
    --http-method POST \
    --type AWS_PROXY \
    --integration-http-method POST \
    --uri "arn:aws:apigateway:$REGION:lambda:path/2015-03-31/functions/$FUNCTION_ARN/invocations"

# OPTIONS /products (para CORS)
aws apigateway put-method \
    --rest-api-id $API_ID \
    --resource-id $PRODUCTS_RESOURCE_ID \
    --http-method OPTIONS \
    --authorization-type NONE

aws apigateway put-integration \
    --rest-api-id $API_ID \
    --resource-id $PRODUCTS_RESOURCE_ID \
    --http-method OPTIONS \
    --type MOCK \
    --integration-responses '{"200":{"statusCode":"200","responseParameters":{"method.response.header.Access-Control-Allow-Headers":"'"'"'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token'"'"'","method.response.header.Access-Control-Allow-Origin":"'"'"'*'"'"'","method.response.header.Access-Control-Allow-Methods":"'"'"'GET,POST,PUT,DELETE,OPTIONS'"'"'"},"responseTemplates":{"application/json":"{}"}}}' \
    --request-templates '{"application/json":"{\"statusCode\": 200}"}'

aws apigateway put-method-response \
    --rest-api-id $API_ID \
    --resource-id $PRODUCTS_RESOURCE_ID \
    --http-method OPTIONS \
    --status-code 200 \
    --response-parameters method.response.header.Access-Control-Allow-Headers=false,method.response.header.Access-Control-Allow-Origin=false,method.response.header.Access-Control-Allow-Methods=false

aws apigateway put-integration-response \
    --rest-api-id $API_ID \
    --resource-id $PRODUCTS_RESOURCE_ID \
    --http-method OPTIONS \
    --status-code 200 \
    --response-parameters '{"method.response.header.Access-Control-Allow-Headers":"'"'"'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token'"'"'","method.response.header.Access-Control-Allow-Origin":"'"'"'*'"'"'","method.response.header.Access-Control-Allow-Methods":"'"'"'GET,POST,PUT,DELETE,OPTIONS'"'"'"}'

# Configurar métodos para /products/{id}
echo "🔧 Configurando métodos para /products/{id}..."

# PUT /products/{id}
aws apigateway put-method \
    --rest-api-id $API_ID \
    --resource-id $PRODUCT_ID_RESOURCE_ID \
    --http-method PUT \
    --authorization-type NONE

aws apigateway put-integration \
    --rest-api-id $API_ID \
    --resource-id $PRODUCT_ID_RESOURCE_ID \
    --http-method PUT \
    --type AWS_PROXY \
    --integration-http-method POST \
    --uri "arn:aws:apigateway:$REGION:lambda:path/2015-03-31/functions/$FUNCTION_ARN/invocations"

# DELETE /products/{id}
aws apigateway put-method \
    --rest-api-id $API_ID \
    --resource-id $PRODUCT_ID_RESOURCE_ID \
    --http-method DELETE \
    --authorization-type NONE

aws apigateway put-integration \
    --rest-api-id $API_ID \
    --resource-id $PRODUCT_ID_RESOURCE_ID \
    --http-method DELETE \
    --type AWS_PROXY \
    --integration-http-method POST \
    --uri "arn:aws:apigateway:$REGION:lambda:path/2015-03-31/functions/$FUNCTION_ARN/invocations"

# OPTIONS /products/{id} (para CORS)
aws apigateway put-method \
    --rest-api-id $API_ID \
    --resource-id $PRODUCT_ID_RESOURCE_ID \
    --http-method OPTIONS \
    --authorization-type NONE

aws apigateway put-integration \
    --rest-api-id $API_ID \
    --resource-id $PRODUCT_ID_RESOURCE_ID \
    --http-method OPTIONS \
    --type MOCK \
    --integration-responses '{"200":{"statusCode":"200","responseParameters":{"method.response.header.Access-Control-Allow-Headers":"'"'"'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token'"'"'","method.response.header.Access-Control-Allow-Origin":"'"'"'*'"'"'","method.response.header.Access-Control-Allow-Methods":"'"'"'GET,POST,PUT,DELETE,OPTIONS'"'"'"},"responseTemplates":{"application/json":"{}"}}}' \
    --request-templates '{"application/json":"{\"statusCode\": 200}"}'

aws apigateway put-method-response \
    --rest-api-id $API_ID \
    --resource-id $PRODUCT_ID_RESOURCE_ID \
    --http-method OPTIONS \
    --status-code 200 \
    --response-parameters method.response.header.Access-Control-Allow-Headers=false,method.response.header.Access-Control-Allow-Origin=false,method.response.header.Access-Control-Allow-Methods=false

aws apigateway put-integration-response \
    --rest-api-id $API_ID \
    --resource-id $PRODUCT_ID_RESOURCE_ID \
    --http-method OPTIONS \
    --status-code 200 \
    --response-parameters '{"method.response.header.Access-Control-Allow-Headers":"'"'"'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token'"'"'","method.response.header.Access-Control-Allow-Origin":"'"'"'*'"'"'","method.response.header.Access-Control-Allow-Methods":"'"'"'GET,POST,PUT,DELETE,OPTIONS'"'"'"}'

# Dar permisos a API Gateway para invocar Lambda
echo "🔐 Configurando permisos para API Gateway..."
aws lambda add-permission \
    --function-name $FUNCTION_NAME \
    --statement-id "apigateway-products-$(date +%s)" \
    --action lambda:InvokeFunction \
    --principal apigateway.amazonaws.com \
    --source-arn "arn:aws:execute-api:$REGION:*:$API_ID/*/*" \
    --output text

# Desplegar la API
echo "🚀 Desplegando API Gateway..."
aws apigateway create-deployment \
    --rest-api-id $API_ID \
    --stage-name $STAGE \
    --description "Deploy products endpoints"

echo "✅ API Gateway configurado exitosamente para productos!"
echo ""
echo "🔗 Endpoints disponibles:"
echo "  GET    https://$API_ID.execute-api.$REGION.amazonaws.com/$STAGE/products"
echo "  POST   https://$API_ID.execute-api.$REGION.amazonaws.com/$STAGE/products"
echo "  PUT    https://$API_ID.execute-api.$REGION.amazonaws.com/$STAGE/products/{id}"
echo "  DELETE https://$API_ID.execute-api.$REGION.amazonaws.com/$STAGE/products/{id}"
echo ""
echo "🧪 Probar con:"
echo "  curl https://$API_ID.execute-api.$REGION.amazonaws.com/$STAGE/products"

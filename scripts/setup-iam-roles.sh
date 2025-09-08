#!/bin/bash

# Script para configurar roles de IAM para Lambda functions
echo "🚀 Configurando roles de IAM para OnPoint Admin Lambda functions..."

# Configuración
REGION="us-east-1"
ROLE_NAME="lambda-execution-role"

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Función para imprimir mensajes
print_info() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️ $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

# Verificar que AWS CLI esté configurado
if ! aws sts get-caller-identity > /dev/null 2>&1; then
    print_error "AWS CLI no está configurado. Ejecuta 'aws configure' primero."
    exit 1
fi

print_info "AWS CLI configurado correctamente"

# Crear política de confianza para Lambda
print_info "Creando política de confianza para Lambda..."

TRUST_POLICY='{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Principal": {
        "Service": "lambda.amazonaws.com"
      },
      "Action": "sts:AssumeRole"
    }
  ]
}'

echo "$TRUST_POLICY" > /tmp/trust-policy.json

# Crear política para DynamoDB
print_info "Creando política para DynamoDB..."

DYNAMODB_POLICY='{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "dynamodb:GetItem",
        "dynamodb:PutItem",
        "dynamodb:UpdateItem",
        "dynamodb:DeleteItem",
        "dynamodb:Query",
        "dynamodb:Scan"
      ],
      "Resource": [
        "arn:aws:dynamodb:'$REGION':*:table/onpoint-admin-*"
      ]
    }
  ]
}'

echo "$DYNAMODB_POLICY" > /tmp/dynamodb-policy.json

# Verificar si el rol ya existe
if aws iam get-role --role-name "$ROLE_NAME" > /dev/null 2>&1; then
    print_warning "Rol $ROLE_NAME ya existe, actualizando políticas..."
    
    # Actualizar política de confianza
    aws iam update-assume-role-policy \
        --role-name "$ROLE_NAME" \
        --policy-document file:///tmp/trust-policy.json
    
    print_info "✅ Política de confianza actualizada"
else
    print_info "Creando rol: $ROLE_NAME"
    
    # Crear el rol
    aws iam create-role \
        --role-name "$ROLE_NAME" \
        --assume-role-policy-document file:///tmp/trust-policy.json \
        --description "Rol de ejecución para Lambda functions de OnPoint Admin"
    
    if [ $? -eq 0 ]; then
        print_info "✅ Rol $ROLE_NAME creado exitosamente"
    else
        print_error "❌ Error creando rol $ROLE_NAME"
        exit 1
    fi
fi

# Adjuntar políticas básicas de Lambda
print_info "Adjuntando políticas básicas de Lambda..."

aws iam attach-role-policy \
    --role-name "$ROLE_NAME" \
    --policy-arn "arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole"

if [ $? -eq 0 ]; then
    print_info "✅ Política básica de Lambda adjuntada"
else
    print_error "❌ Error adjuntando política básica de Lambda"
    exit 1
fi

# Crear y adjuntar política personalizada para DynamoDB
print_info "Creando política personalizada para DynamoDB..."

POLICY_NAME="OnPointAdminDynamoDBPolicy"

# Verificar si la política ya existe
if aws iam get-policy --policy-arn "arn:aws:iam::$(aws sts get-caller-identity --query Account --output text):policy/$POLICY_NAME" > /dev/null 2>&1; then
    print_warning "Política $POLICY_NAME ya existe, actualizando..."
    
    # Obtener la versión actual de la política
    CURRENT_VERSION=$(aws iam get-policy --policy-arn "arn:aws:iam::$(aws sts get-caller-identity --query Account --output text):policy/$POLICY_NAME" --query 'Policy.DefaultVersionId' --output text)
    
    # Crear nueva versión de la política
    aws iam create-policy-version \
        --policy-arn "arn:aws:iam::$(aws sts get-caller-identity --query Account --output text):policy/$POLICY_NAME" \
        --policy-document file:///tmp/dynamodb-policy.json \
        --set-as-default
    
    print_info "✅ Política $POLICY_NAME actualizada"
else
    # Crear nueva política
    aws iam create-policy \
        --policy-name "$POLICY_NAME" \
        --policy-document file:///tmp/dynamodb-policy.json \
        --description "Política para acceso a DynamoDB de OnPoint Admin"
    
    if [ $? -eq 0 ]; then
        print_info "✅ Política $POLICY_NAME creada exitosamente"
    else
        print_error "❌ Error creando política $POLICY_NAME"
        exit 1
    fi
fi

# Adjuntar política personalizada al rol
print_info "Adjuntando política personalizada al rol..."

aws iam attach-role-policy \
    --role-name "$ROLE_NAME" \
    --policy-arn "arn:aws:iam::$(aws sts get-caller-identity --query Account --output text):policy/$POLICY_NAME"

if [ $? -eq 0 ]; then
    print_info "✅ Política personalizada adjuntada al rol"
else
    print_error "❌ Error adjuntando política personalizada al rol"
    exit 1
fi

# Limpiar archivos temporales
rm -f /tmp/trust-policy.json /tmp/dynamodb-policy.json

print_info "🎉 Roles de IAM configurados exitosamente!"
print_info "📋 Rol creado: $ROLE_NAME"
print_info "📋 Políticas adjuntadas:"
print_info "   - AWSLambdaBasicExecutionRole"
print_info "   - OnPointAdminDynamoDBPolicy"
print_info ""
print_info "📋 ARN del rol:"
print_info "   arn:aws:iam::$(aws sts get-caller-identity --query Account --output text):role/$ROLE_NAME"
print_info ""
print_info "📋 Próximos pasos:"
print_info "   1. Esperar unos segundos para que el rol se propague"
print_info "   2. Ejecutar el deployment de Lambda functions"
print_info "   3. Configurar API Gateway"

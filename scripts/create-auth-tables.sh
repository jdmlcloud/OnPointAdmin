#!/bin/bash

# Script para crear tablas DynamoDB para autenticación
# OnPoint Admin - Sistema de Autenticación

set -e

ENVIRONMENT=${1:-sandbox}
REGION=${2:-us-east-1}

echo "🚀 Creando tablas DynamoDB para autenticación en entorno: $ENVIRONMENT"

# Crear tabla de tokens de verificación
echo "📝 Creando tabla de tokens de verificación..."
aws dynamodb create-table \
  --table-name "OnPointAdmin-VerificationTokens-$ENVIRONMENT" \
  --attribute-definitions \
    AttributeName=token,AttributeType=S \
    AttributeName=type,AttributeType=S \
    AttributeName=expiresAt,AttributeType=S \
  --key-schema \
    AttributeName=token,KeyType=HASH \
  --global-secondary-indexes \
    'IndexName=TypeIndex,KeySchema=[{AttributeName=type,KeyType=HASH},{AttributeName=expiresAt,KeyType=RANGE}],Projection={ProjectionType=ALL}' \
  --billing-mode PAY_PER_REQUEST \
  --time-to-live-specification \
    'AttributeName=expiresAt,Enabled=true' \
  --region $REGION \
  --tags Key=Environment,Value=$ENVIRONMENT Key=Service,Value=Authentication Key=Project,Value=OnPointAdmin

echo "✅ Tabla de tokens de verificación creada"

# Crear tabla de sesiones
echo "📝 Creando tabla de sesiones..."
aws dynamodb create-table \
  --table-name "OnPointAdmin-Sessions-$ENVIRONMENT" \
  --attribute-definitions \
    AttributeName=sessionId,AttributeType=S \
    AttributeName=userId,AttributeType=S \
    AttributeName=expiresAt,AttributeType=S \
  --key-schema \
    AttributeName=sessionId,KeyType=HASH \
  --global-secondary-indexes \
    'IndexName=UserIdIndex,KeySchema=[{AttributeName=userId,KeyType=HASH},{AttributeName=expiresAt,KeyType=RANGE}],Projection={ProjectionType=ALL}' \
  --billing-mode PAY_PER_REQUEST \
  --time-to-live-specification \
    'AttributeName=expiresAt,Enabled=true' \
  --region $REGION \
  --tags Key=Environment,Value=$ENVIRONMENT Key=Service,Value=Authentication Key=Project,Value=OnPointAdmin

echo "✅ Tabla de sesiones creada"

# Crear tabla de códigos 2FA
echo "📝 Creando tabla de códigos 2FA..."
aws dynamodb create-table \
  --table-name "OnPointAdmin-TwoFACodes-$ENVIRONMENT" \
  --attribute-definitions \
    AttributeName=userId,AttributeType=S \
    AttributeName=code,AttributeType=S \
    AttributeName=expiresAt,AttributeType=S \
  --key-schema \
    AttributeName=userId,KeyType=HASH \
    AttributeName=code,KeyType=RANGE \
  --global-secondary-indexes \
    'IndexName=CodeIndex,KeySchema=[{AttributeName=code,KeyType=HASH},{AttributeName=expiresAt,KeyType=RANGE}],Projection={ProjectionType=ALL}' \
  --billing-mode PAY_PER_REQUEST \
  --time-to-live-specification \
    'AttributeName=expiresAt,Enabled=true' \
  --region $REGION \
  --tags Key=Environment,Value=$ENVIRONMENT Key=Service,Value=Authentication Key=Project,Value=OnPointAdmin

echo "✅ Tabla de códigos 2FA creada"

echo "🎉 Todas las tablas de autenticación han sido creadas exitosamente"
echo "📊 Tablas creadas:"
echo "   - OnPointAdmin-VerificationTokens-$ENVIRONMENT"
echo "   - OnPointAdmin-Sessions-$ENVIRONMENT"
echo "   - OnPointAdmin-TwoFACodes-$ENVIRONMENT"

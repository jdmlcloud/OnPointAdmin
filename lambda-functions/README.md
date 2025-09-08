# OnPoint Admin - API Gateway + Lambda

Esta es la nueva arquitectura de backend para OnPoint Admin usando AWS API Gateway + Lambda functions.

## 🏗️ Arquitectura

```
Frontend (Next.js en Amplify) → API Gateway → Lambda Functions → DynamoDB
```

## 📁 Estructura

```
lambda-functions/
├── providers/
│   └── index.js          # Lambda function para providers
├── users/
│   └── index.js          # Lambda function para users
├── stats/
│   └── index.js          # Lambda function para estadísticas
├── package.json          # Dependencias de las Lambda functions
└── README.md            # Este archivo
```

## 🚀 Deployment

### 1. Configurar AWS CLI
```bash
aws configure
```

### 2. Ejecutar deployment completo
```bash
./scripts/deploy-api-gateway-lambda.sh
```

### 3. Deployment paso a paso
```bash
# Configurar DynamoDB
./scripts/setup-dynamodb-lambda.sh

# Desplegar Lambda functions
./scripts/deploy-lambda.sh

# Configurar API Gateway
./scripts/setup-api-gateway.sh
```

## 📋 Endpoints

Una vez desplegado, tendrás los siguientes endpoints:

- `GET /providers` - Obtener lista de proveedores
- `POST /providers` - Crear nuevo proveedor
- `GET /users` - Obtener lista de usuarios
- `GET /users/stats` - Obtener estadísticas de usuarios
- `GET /stats` - Obtener estadísticas generales

## 🔧 Variables de Entorno

Las Lambda functions necesitan las siguientes variables de entorno:

- `AWS_REGION` - Región de AWS (us-east-1)
- `AWS_ACCESS_KEY_ID` - Access Key ID
- `AWS_SECRET_ACCESS_KEY` - Secret Access Key

## 🗄️ Tablas de DynamoDB

- `onpoint-admin-providers-dev` - Proveedores
- `onpoint-admin-users-dev` - Usuarios
- `onpoint-admin-products-dev` - Productos

## 🧪 Testing

```bash
# Obtener proveedores
curl https://[API-ID].execute-api.us-east-1.amazonaws.com/prod/providers

# Obtener usuarios
curl https://[API-ID].execute-api.us-east-1.amazonaws.com/prod/users

# Obtener estadísticas
curl https://[API-ID].execute-api.us-east-1.amazonaws.com/prod/stats
```

## 🔍 Logs

Los logs de las Lambda functions están disponibles en CloudWatch:
- AWS Console → CloudWatch → Log groups
- Buscar: `/aws/lambda/onpoint-admin-*`

## 🛠️ Desarrollo Local

Para desarrollo local, puedes usar AWS SAM o el AWS CLI:

```bash
# Instalar dependencias
cd lambda-functions
npm install

# Probar función localmente
aws lambda invoke \
  --function-name onpoint-admin-providers \
  --payload '{"httpMethod":"GET","path":"/providers"}' \
  response.json
```

## 📊 Monitoreo

- **CloudWatch Logs**: Logs de las Lambda functions
- **CloudWatch Metrics**: Métricas de rendimiento
- **API Gateway**: Métricas de la API
- **DynamoDB**: Métricas de las tablas

## 🔒 Seguridad

- Las Lambda functions tienen permisos mínimos necesarios
- API Gateway maneja CORS automáticamente
- DynamoDB usa IAM para control de acceso
- Variables de entorno se manejan de forma segura

## 🚀 Ventajas de esta arquitectura

- ✅ **Escalabilidad**: Lambda escala automáticamente
- ✅ **Confiabilidad**: API Gateway es altamente disponible
- ✅ **Costo**: Solo pagas por lo que usas
- ✅ **Mantenimiento**: Sin servidores que mantener
- ✅ **Logs**: CloudWatch integrado
- ✅ **Monitoreo**: Métricas detalladas
- ✅ **Seguridad**: IAM y VPC integrados

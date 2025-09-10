# 🔒 Separación de Entornos

## 📋 Resumen

Los entornos están **completamente aislados** entre sí para garantizar que:

- ✅ **Sandbox** no afecte **Producción**
- ✅ **Producción** no se vea afectada por cambios en **Sandbox**
- ✅ **Datos separados** en cada entorno
- ✅ **Credenciales separadas** para cada entorno
- ✅ **Recursos AWS separados** para cada entorno

## 🏗️ Arquitectura de Separación

### **1. Credenciales AWS Separadas**

#### Sandbox:
- `AWS_ACCESS_KEY_ID_SANDBOX`
- `AWS_SECRET_ACCESS_KEY_SANDBOX`
- **Acceso limitado** solo a recursos de sandbox

#### Producción:
- `AWS_ACCESS_KEY_ID_PROD`
- `AWS_SECRET_ACCESS_KEY_PROD`
- **Acceso limitado** solo a recursos de producción

### **2. Recursos AWS Separados**

#### Sandbox:
- **API Gateway**: `m4ijnyg5da.execute-api.us-east-1.amazonaws.com/sandbox`
- **DynamoDB**: Tablas con prefijo `onpoint-sandbox-`
- **Lambda**: Funciones con sufijo `-sandbox`
- **S3**: Bucket `onpoint-admin-sandbox`
- **Amplify**: `sandbox.d3ts6pwgn7uyyh.amplifyapp.com`

#### Producción:
- **API Gateway**: `9o43ckvise.execute-api.us-east-1.amazonaws.com/prod`
- **DynamoDB**: Tablas con prefijo `onpoint-prod-`
- **Lambda**: Funciones con sufijo `-prod`
- **S3**: Bucket `onpoint-admin-prod`
- **Amplify**: `production.d3ts6pwgn7uyyh.amplifyapp.com`

### **3. Base de Datos Separada**

#### Sandbox:
```typescript
// Tablas de sandbox
onpoint-sandbox-users
onpoint-sandbox-providers
onpoint-sandbox-products
onpoint-sandbox-quotations
onpoint-sandbox-proposals
```

#### Producción:
```typescript
// Tablas de producción
onpoint-prod-users
onpoint-prod-providers
onpoint-prod-products
onpoint-prod-quotations
onpoint-prod-proposals
```

## 🔄 Flujo de Trabajo con Separación

### **Desarrollo → Sandbox:**
1. **Rama**: `develop` → `sandbox`
2. **Credenciales**: `AWS_ACCESS_KEY_ID_SANDBOX`
3. **Recursos**: Solo recursos de sandbox
4. **Datos**: Solo datos de sandbox
5. **URL**: `https://sandbox.d3ts6pwgn7uyyh.amplifyapp.com`

### **Sandbox → Producción:**
1. **Rama**: `sandbox` → `main`
2. **Credenciales**: `AWS_ACCESS_KEY_ID_PROD`
3. **Recursos**: Solo recursos de producción
4. **Datos**: Solo datos de producción
5. **URL**: `https://production.d3ts6pwgn7uyyh.amplifyapp.com`

## 🛡️ Medidas de Seguridad

### **1. IAM Policies Separadas**

#### Sandbox IAM Policy:
```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "dynamodb:*"
      ],
      "Resource": "arn:aws:dynamodb:*:*:table/onpoint-sandbox-*"
    },
    {
      "Effect": "Allow",
      "Action": [
        "lambda:*"
      ],
      "Resource": "arn:aws:lambda:*:*:function/*-sandbox"
    }
  ]
}
```

#### Producción IAM Policy:
```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "dynamodb:*"
      ],
      "Resource": "arn:aws:dynamodb:*:*:table/onpoint-prod-*"
    },
    {
      "Effect": "Allow",
      "Action": [
        "lambda:*"
      ],
      "Resource": "arn:aws:lambda:*:*:function/*-prod"
    }
  ]
}
```

### **2. Variables de Entorno Separadas**

#### Sandbox:
```env
NEXT_PUBLIC_ENVIRONMENT=sandbox
NEXT_PUBLIC_API_URL=https://m4ijnyg5da.execute-api.us-east-1.amazonaws.com/sandbox
NEXT_PUBLIC_CLIENTS_API_URL=https://mkrc6lo043.execute-api.us-east-1.amazonaws.com/sandbox
```

#### Producción:
```env
NEXT_PUBLIC_ENVIRONMENT=prod
NEXT_PUBLIC_API_URL=https://9o43ckvise.execute-api.us-east-1.amazonaws.com/prod
NEXT_PUBLIC_CLIENTS_API_URL=https://mkrc6lo043.execute-api.us-east-1.amazonaws.com/prod
```

## 🚨 Prevención de Contaminación

### **1. Validaciones Automáticas**

#### En Sandbox:
- ✅ Solo puede acceder a recursos con prefijo `sandbox`
- ✅ Solo puede usar credenciales de sandbox
- ✅ Solo puede desplegar a URL de sandbox

#### En Producción:
- ✅ Solo puede acceder a recursos con prefijo `prod`
- ✅ Solo puede usar credenciales de producción
- ✅ Solo puede desplegar a URL de producción

### **2. Monitoreo de Separación**

#### Health Checks:
- Verificar que sandbox use solo recursos de sandbox
- Verificar que producción use solo recursos de producción
- Alertar si hay cruce de entornos

#### Logs:
- Logs separados por entorno
- Alertas si se detecta acceso cruzado
- Auditoría de accesos por entorno

## 📊 Beneficios de la Separación

### **Seguridad:**
- ✅ **Aislamiento completo** entre entornos
- ✅ **Credenciales separadas** por entorno
- ✅ **Acceso limitado** a recursos específicos
- ✅ **Prevención de contaminación** de datos

### **Desarrollo:**
- ✅ **Pruebas seguras** en sandbox
- ✅ **Desarrollo sin riesgo** para producción
- ✅ **Rollback fácil** si hay problemas
- ✅ **Testing exhaustivo** antes de producción

### **Operaciones:**
- ✅ **Despliegue controlado** a producción
- ✅ **Monitoreo independiente** por entorno
- ✅ **Escalabilidad independiente** por entorno
- ✅ **Mantenimiento sin afectar** otros entornos

## 🔧 Configuración Requerida

### **En GitHub Secrets:**
1. `AWS_ACCESS_KEY_ID_SANDBOX` - Usuario IAM para sandbox
2. `AWS_SECRET_ACCESS_KEY_SANDBOX` - Secret para sandbox
3. `AWS_ACCESS_KEY_ID_PROD` - Usuario IAM para producción
4. `AWS_SECRET_ACCESS_KEY_PROD` - Secret para producción

### **En AWS IAM:**
1. Crear usuario `onpoint-sandbox-user` con políticas limitadas
2. Crear usuario `onpoint-prod-user` con políticas limitadas
3. Configurar políticas restrictivas por entorno
4. Habilitar MFA para usuarios de producción

## ✅ Verificación de Separación

### **Comandos de verificación:**
```bash
# Verificar que sandbox use solo recursos de sandbox
aws dynamodb list-tables --profile sandbox
# Debe mostrar solo tablas con prefijo onpoint-sandbox-

# Verificar que producción use solo recursos de producción
aws dynamodb list-tables --profile prod
# Debe mostrar solo tablas con prefijo onpoint-prod-
```

### **Tests automáticos:**
- Health checks verifican separación
- Logs monitorean accesos cruzados
- Alertas si hay contaminación de entornos

---

**¡Los entornos están completamente aislados y seguros!** 🔒

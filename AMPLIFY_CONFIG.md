# 🚀 OnPoint Admin - Configuración de Amplify

## 📋 **Configuración Actual**

Este proyecto usa **API Gateway + Lambda** en lugar del sistema de autenticación de Amplify.

### ✅ **Servicios Configurados:**
- **Frontend**: Next.js desplegado en Amplify
- **Backend**: API Gateway + Lambda functions
- **Base de datos**: DynamoDB
- **Autenticación**: AWS Cognito (configurado manualmente)

### 🔧 **Archivos de Configuración:**

#### `amplify.yml`
- Configuración de build para Amplify
- No incluye autenticación de Amplify
- Solo maneja el frontend Next.js

#### `public/_redirects`
- Redirecciones para SPA
- Manejo de rutas de Next.js

### 🌐 **URLs de la Aplicación:**
- **Frontend**: `https://sandbox.d3ts6pwgn7uyyh.amplifyapp.com`
- **API**: `https://7z4skk6jy0.execute-api.us-east-1.amazonaws.com/prod`

### 📊 **Endpoints Disponibles:**
```
✅ GET /providers    - Lista de proveedores
✅ GET /users        - Lista de usuarios  
✅ GET /stats        - Estadísticas
✅ GET /tags         - Tags únicos
✅ POST /providers   - Crear proveedor
✅ PUT /providers/{id} - Actualizar proveedor
✅ DELETE /providers/{id} - Eliminar proveedor
```

### 🔐 **Autenticación:**
- **Sistema**: AWS Cognito (configurado manualmente)
- **No usar**: Amplify Auth (deshabilitado)
- **Acceso**: Directo al dashboard sin autenticación (para pruebas)

### 🚀 **Despliegue:**
1. **Frontend**: Automático via Amplify (git push)
2. **Backend**: Manual via scripts (`./scripts/deploy-api-gateway-lambda.sh`)

### ⚠️ **Nota Importante:**
Este proyecto **NO usa** el sistema de autenticación de Amplify. 
La autenticación está manejada por AWS Cognito configurado manualmente.

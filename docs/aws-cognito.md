# 🔐 AWS Cognito - Configuración y Setup

## 📋 **Resumen del Servicio**

AWS Cognito será nuestro servicio principal de autenticación, reemplazando NextAuth.js para proporcionar:
- **Autenticación de usuarios** con email/password
- **Gestión de roles** (admin, ejecutivo, cliente)
- **Tokens JWT** seguros
- **Integración con DynamoDB** para datos de usuario

---

## 🛠️ **Configuración AWS CLI**

### **1. Instalar AWS CLI**
```bash
# macOS
brew install awscli

# Verificar instalación
aws --version
```

### **2. Configurar Credenciales**
```bash
aws configure
```

**Datos requeridos:**
- AWS Access Key ID: `[TU_ACCESS_KEY]`
- AWS Secret Access Key: `[TU_SECRET_KEY]`
- Default region: `us-east-1` (o tu región preferida)
- Default output format: `json`

### **3. Verificar Configuración**
```bash
aws sts get-caller-identity
```

---

## 🏗️ **Crear User Pool en AWS Cognito**

### **1. Crear User Pool**
```bash
aws cognito-idp create-user-pool \
  --pool-name "OnPointAdmin-Users" \
  --policies '{
    "PasswordPolicy": {
      "MinimumLength": 8,
      "RequireUppercase": true,
      "RequireLowercase": true,
      "RequireNumbers": true,
      "RequireSymbols": true
    }
  }' \
  --username-attributes email \
  --auto-verified-attributes email \
  --schema '[
    {
      "Name": "email",
      "AttributeDataType": "String",
      "Required": true,
      "Mutable": true
    },
    {
      "Name": "name",
      "AttributeDataType": "String",
      "Required": true,
      "Mutable": true
    },
    {
      "Name": "role",
      "AttributeDataType": "String",
      "Required": true,
      "Mutable": true
    }
  ]'
```

### **2. Crear App Client**
```bash
aws cognito-idp create-user-pool-client \
  --user-pool-id [USER_POOL_ID] \
  --client-name "OnPointAdmin-WebApp" \
  --generate-secret \
  --explicit-auth-flows USER_PASSWORD_AUTH ALLOW_USER_SRP_AUTH \
  --supported-identity-providers COGNITO \
  --callback-urls "https://sandbox-deploy.d3ts6pwgn7uyyh.amplifyapp.com/auth/callback" \
  --logout-urls "https://sandbox-deploy.d3ts6pwgn7uyyh.amplifyapp.com/auth/signin" \
  --allowed-o-auth-flows implicit code \
  --allowed-o-auth-scopes email openid profile \
  --allowed-o-auth-flows-user-pool-client
```

### **3. Obtener IDs Importantes**
```bash
# User Pool ID
aws cognito-idp list-user-pools --max-items 10

# App Client ID
aws cognito-idp list-user-pool-clients --user-pool-id [USER_POOL_ID]
```

---

## 🔧 **Configuración en la Aplicación**

### **1. Variables de Entorno**
```bash
# .env.local
AWS_REGION=us-east-1
AWS_COGNITO_USER_POOL_ID=us-east-1_XXXXXXXXX
AWS_COGNITO_CLIENT_ID=XXXXXXXXXXXXXXXXXXXXXXXXXX
AWS_COGNITO_CLIENT_SECRET=XXXXXXXXXXXXXXXXXXXXXXXXXX
```

### **2. Instalar Dependencias**
```bash
npm install aws-amplify @aws-amplify/ui-react
```

### **3. Configurar Amplify**
```typescript
// src/lib/aws/amplify.ts
import { Amplify } from 'aws-amplify'

Amplify.configure({
  Auth: {
    region: process.env.AWS_REGION,
    userPoolId: process.env.AWS_COGNITO_USER_POOL_ID,
    userPoolWebClientId: process.env.AWS_COGNITO_CLIENT_ID,
  }
})
```

---

## 👤 **Gestión de Usuarios**

### **1. Crear Usuario Admin**
```bash
aws cognito-idp admin-create-user \
  --user-pool-id [USER_POOL_ID] \
  --username "admin@onpoint.com" \
  --user-attributes Name=email,Value=admin@onpoint.com Name=name,Value="Admin User" Name=role,Value=admin \
  --temporary-password "TempPass123!" \
  --message-action SUPPRESS
```

### **2. Establecer Password Permanente**
```bash
aws cognito-idp admin-set-user-password \
  --user-pool-id [USER_POOL_ID] \
  --username "admin@onpoint.com" \
  --password "Admin123!" \
  --permanent
```

### **3. Crear Usuario Ejecutivo**
```bash
aws cognito-idp admin-create-user \
  --user-pool-id [USER_POOL_ID] \
  --username "ejecutivo@onpoint.com" \
  --user-attributes Name=email,Value=ejecutivo@onpoint.com Name=name,Value="Ejecutivo User" Name=role,Value=ejecutivo \
  --temporary-password "TempPass123!" \
  --message-action SUPPRESS

aws cognito-idp admin-set-user-password \
  --user-pool-id [USER_POOL_ID] \
  --username "ejecutivo@onpoint.com" \
  --password "Ejecutivo123!" \
  --permanent
```

---

## 🧪 **Testing y Validación**

### **1. Probar Login en la Aplicación**
- **URL**: `https://sandbox-deploy.d3ts6pwgn7uyyh.amplifyapp.com/auth/signin`
- **Email**: `admin@onpoint.com`
- **Password**: `Admin123!`
- **Resultado esperado**: Login exitoso, redirección a dashboard

### **2. Verificar en AWS Console**
- **AWS Console** → **Cognito** → **User Pools** → **OnPointAdmin-Users**
- **Usuarios**: Deberías ver los usuarios creados
- **App Clients**: Deberías ver "OnPointAdmin-WebApp"

### **3. Verificar Roles en la Aplicación**
- **Admin**: Debería ver todas las secciones (usuarios, proveedores, sistema)
- **Ejecutivo**: Debería ver solo secciones permitidas
- **Sidebar**: Debería mostrar el rol correcto

### **4. Probar Logout**
- **Botón logout**: Debería funcionar correctamente
- **Redirección**: Debería ir a `/auth/signin`
- **Sesión**: Debería limpiarse completamente

---

## 🔍 **Troubleshooting**

### **Error: "User does not exist"**
```bash
# Verificar usuario existe
aws cognito-idp admin-get-user \
  --user-pool-id [USER_POOL_ID] \
  --username "admin@onpoint.com"
```

### **Error: "Invalid password"**
```bash
# Resetear password
aws cognito-idp admin-set-user-password \
  --user-pool-id [USER_POOL_ID] \
  --username "admin@onpoint.com" \
  --password "NewPassword123!" \
  --permanent
```

### **Error: "App client not found"**
```bash
# Verificar app client
aws cognito-idp describe-user-pool-client \
  --user-pool-id [USER_POOL_ID] \
  --client-id [CLIENT_ID]
```

---

## 📊 **Métricas y Monitoreo**

### **CloudWatch Logs**
- **Log Group**: `/aws/cognito/userpool/[USER_POOL_ID]`
- **Métricas**: Login attempts, errors, success rate

### **Dashboard de Métricas**
- **Sign-ins**: Número de logins exitosos
- **Sign-up attempts**: Intentos de registro
- **Authentication errors**: Errores de autenticación

---

## 🚀 **Próximos Pasos**

Una vez que AWS Cognito esté funcionando:
1. **Merge con rama backend**
2. **Testing completo**
3. **Documentación actualizada**
4. **Preparar para siguiente servicio AWS**

---

## 📝 **Comandos de Referencia Rápida**

```bash
# Listar User Pools
aws cognito-idp list-user-pools --max-items 10

# Crear usuario
aws cognito-idp admin-create-user --user-pool-id [POOL_ID] --username [EMAIL] --user-attributes Name=email,Value=[EMAIL] Name=name,Value="[NAME]" Name=role,Value=[ROLE] --temporary-password "TempPass123!" --message-action SUPPRESS

# Establecer password
aws cognito-idp admin-set-user-password --user-pool-id [POOL_ID] --username [EMAIL] --password "[PASSWORD]" --permanent

# Listar usuarios
aws cognito-idp list-users --user-pool-id [POOL_ID]
```

# Guía de CI/CD - OnPoint Admin

## 🚀 Resumen

Este proyecto implementa un pipeline de CI/CD robusto y escalable que separa claramente los entornos de desarrollo, sandbox y producción.

## 📋 Estructura de Entornos

### Sandbox (Desarrollo)
- **Rama:** `sandbox`, `frontend-stable`
- **Deploy:** Automático en push
- **API Gateway:** `https://m4ijnyg5da.execute-api.us-east-1.amazonaws.com/sandbox`
- **Amplify:** Auto-deploy habilitado
- **Aprobación:** No requerida

### Producción
- **Rama:** `main`
- **Deploy:** Manual con `[deploy-prod]` en commit message
- **API Gateway:** `https://9o43ckvise.execute-api.us-east-1.amazonaws.com/prod`
- **Amplify:** Deploy manual
- **Aprobación:** Requerida

## 🔄 Workflows de GitHub Actions

### 1. CI/CD Principal (`.github/workflows/ci-cd.yml`)
- **Trigger:** Push a `main`, `sandbox`, `frontend-stable`
- **Funciones:**
  - Validación de código (TypeScript, ESLint)
  - Deploy automático a sandbox
  - Deploy manual a producción
  - Testing de endpoints

### 2. Frontend Deploy (`.github/workflows/frontend-deploy.yml`)
- **Trigger:** Cambios en archivos del frontend
- **Funciones:**
  - Build y validación del frontend
  - Integración con Amplify
  - Deploy selectivo por paths

### 3. Environment Management (`.github/workflows/environment-management.yml`)
- **Trigger:** Manual (workflow_dispatch)
- **Funciones:**
  - Gestión de entornos
  - Status, deploy, rollback, cleanup
  - Monitoreo de recursos AWS

## 🛠️ Comandos de Gestión

### Script de Entornos
```bash
# Ver estado del entorno sandbox
./scripts/manage-environment.sh sandbox status

# Desplegar a sandbox
./scripts/manage-environment.sh sandbox deploy

# Probar endpoints de sandbox
./scripts/manage-environment.sh sandbox test

# Ver logs de Lambda functions
./scripts/manage-environment.sh sandbox logs

# Limpiar recursos (con confirmación)
./scripts/manage-environment.sh sandbox cleanup
```

### Comandos Git para Deploy

#### Deploy a Sandbox
```bash
# Deploy automático (cualquier push)
git push origin sandbox

# Deploy forzado
git commit -m "feat: nueva funcionalidad [deploy-sandbox]"
git push origin sandbox
```

#### Deploy a Producción
```bash
# Deploy manual (requiere mensaje específico)
git commit -m "feat: nueva funcionalidad [deploy-prod]"
git push origin main
```

## 📁 Estructura de Archivos

```
.github/
├── workflows/
│   ├── ci-cd.yml                    # Pipeline principal
│   ├── frontend-deploy.yml          # Deploy del frontend
│   ├── environment-management.yml   # Gestión de entornos
│   └── config/
│       └── environments.yml         # Configuración de entornos
scripts/
├── manage-environment.sh            # Script de gestión
└── ...                             # Otros scripts
```

## 🔧 Configuración de Secrets

### GitHub Secrets Requeridos
- `AWS_ACCESS_KEY_ID` - Para sandbox
- `AWS_SECRET_ACCESS_KEY` - Para sandbox
- `AWS_PROD_ACCESS_KEY_ID` - Para producción
- `AWS_PROD_SECRET_ACCESS_KEY` - Para producción

### Variables de Entorno
- `AWS_REGION=us-east-1`
- `NODE_VERSION=18`

## 🧪 Testing y Validación

### Validación Automática
- **TypeScript:** `npx tsc --noEmit`
- **ESLint:** `npx eslint src/ --ext .ts,.tsx`
- **Build:** `npm run build`
- **Endpoints:** Testing automático de APIs

### Testing Manual
```bash
# Probar endpoints de sandbox
curl https://m4ijnyg5da.execute-api.us-east-1.amazonaws.com/sandbox/products
curl https://m4ijnyg5da.execute-api.us-east-1.amazonaws.com/sandbox/users

# Probar endpoints de producción
curl https://9o43ckvise.execute-api.us-east-1.amazonaws.com/prod/products
curl https://9o43ckvise.execute-api.us-east-1.amazonaws.com/prod/users
```

## 📊 Monitoreo

### CloudWatch Logs
- **Sandbox:** `/aws/lambda/OnPointAdmin-*-sandbox`
- **Producción:** `/aws/lambda/OnPointAdmin-*-prod`

### Métricas
- **Lambda:** Invocaciones, errores, duración
- **API Gateway:** Requests, 4xx, 5xx
- **DynamoDB:** Read/Write capacity

## 🚨 Troubleshooting

### Problemas Comunes

#### Deploy Fallido
1. Verificar logs en GitHub Actions
2. Revisar CloudWatch Logs
3. Validar configuración de AWS

#### Endpoints No Responden
1. Verificar que Lambda functions estén activas
2. Revisar configuración de API Gateway
3. Probar con curl

#### Frontend No Se Actualiza
1. Verificar que Amplify esté configurado
2. Revisar logs de Amplify
3. Forzar rebuild en Amplify

### Comandos de Diagnóstico
```bash
# Ver estado de Lambda functions
aws lambda list-functions --query "Functions[?contains(FunctionName, 'sandbox')].{Name:FunctionName,State:State}"

# Ver logs de una Lambda específica
aws logs tail /aws/lambda/OnPointAdmin-Products-sandbox --since 1h

# Ver estado de DynamoDB
aws dynamodb list-tables --query "TableNames[?contains(@, 'sandbox')]"
```

## 🔒 Seguridad

### Separación de Entornos
- **Sandbox:** Recursos separados, datos de prueba
- **Producción:** Recursos separados, datos reales
- **Credenciales:** Diferentes para cada entorno

### Control de Acceso
- **Sandbox:** Deploy automático, sin restricciones
- **Producción:** Deploy manual, requiere aprobación

## 📈 Mejoras Futuras

### Próximas Implementaciones
- [ ] Canary deployments
- [ ] Blue-green deployments
- [ ] Rollback automático
- [ ] Notificaciones Slack/Teams
- [ ] Métricas de performance
- [ ] Testing de integración automatizado

### Optimizaciones
- [ ] Cache de dependencias
- [ ] Deploy paralelo
- [ ] Testing de regresión
- [ ] Monitoreo de costos

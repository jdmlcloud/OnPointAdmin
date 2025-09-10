# 🚀 GitHub Actions Workflows

## 📋 Workflows Activos

### 1. **security-cleanup.yml** 🔐
- **Trigger**: Push a cualquier rama, Pull Requests
- **Propósito**: Verificaciones de seguridad y calidad de código
- **Funciones**:
  - Auditoría de seguridad de dependencias
  - Verificación de credenciales hardcodeadas
  - Búsqueda de console.log statements
  - Linting y type checking
  - Tests unitarios

### 2. **develop-to-sandbox.yml** 🔄
- **Trigger**: Push a rama `develop`
- **Propósito**: Integración automática de develop a sandbox
- **Funciones**:
  - Validación y tests automáticos
  - Creación de PR automático a sandbox
  - Despliegue automático a sandbox (via Amplify)
  - Health checks

### 3. **sandbox-to-production.yml** 🚀
- **Trigger**: Push a rama `sandbox`, Pull Requests a `main`
- **Propósito**: Despliegue controlado de sandbox a producción
- **Funciones**:
  - Verificaciones estrictas de seguridad
  - Creación de PR automático a main
  - Despliegue de dependencias (Lambdas, tablas, API Gateway)
  - Despliegue a producción (via Amplify)

### 4. **amplify-deployment.yml** 📊
- **Trigger**: Manual (workflow_dispatch)
- **Propósito**: Monitoreo y verificación de estado de Amplify
- **Funciones**:
  - Verificación de estado de aplicaciones Amplify
  - Health checks de entornos
  - Monitoreo de despliegues

## 🔄 Flujo de Trabajo

```
Develop → Sandbox → Production
   ↓         ↓         ↓
Security  Security  Security
   ↓         ↓         ↓
Tests     Tests     Deploy
   ↓         ↓         ↓
Amplify   Amplify   Amplify
```

## 🛠️ Configuración Requerida

### Secrets de GitHub:
- `AWS_ACCESS_KEY_ID_PROD`
- `AWS_SECRET_ACCESS_KEY_PROD`
- `AWS_ACCESS_KEY_ID_SANDBOX`
- `AWS_SECRET_ACCESS_KEY_SANDBOX`
- `GITHUB_TOKEN`

### Variables de Entorno:
- `AWS_REGION`: us-east-1
- `NODE_VERSION`: 18

## 📊 Monitoreo

### URLs de Entornos:
- **Sandbox**: https://sandbox.d3ts6pwgn7uyyh.amplifyapp.com
- **Production**: https://production.d3ts6pwgn7uyyh.amplifyapp.com

### Logs:
- **GitHub Actions**: En la pestaña "Actions" del repositorio
- **Amplify**: En la consola de AWS Amplify
- **CloudWatch**: Para servicios de backend

## 🚨 Troubleshooting

### Si un workflow falla:
1. Revisa los logs en GitHub Actions
2. Verifica que los secrets estén configurados
3. Ejecuta los scripts localmente para debug
4. Revisa la configuración de Amplify

### Si hay problemas de seguridad:
1. Ejecuta `./scripts/cleanup-for-production.sh`
2. Revisa el archivo `production-checklist.md`
3. Corrige los problemas identificados
4. Haz commit y push nuevamente

## 📝 Notas

- Los workflows están optimizados para AWS Amplify
- No se usa CloudFront (removido)
- Despliegue automático del frontend via Amplify
- Backend se despliega via GitHub Actions
- Verificaciones de seguridad en cada paso

# 🚀 Flujo de Trabajo CI/CD

## 📋 Resumen del Flujo

```
Develop → Sandbox → Production
   ↓         ↓         ↓
  Tests    Tests    Deploy
```

## 🔄 Flujo Completo

### 1. **Desarrollo (Develop)**
- Trabajas en la rama `develop`
- Haces cambios y commits
- Se ejecutan verificaciones automáticas de seguridad y calidad

### 2. **Integración (Develop → Sandbox)**
- Push a `develop` crea automáticamente un PR a `sandbox`
- Se ejecutan tests y verificaciones
- Se despliega automáticamente a sandbox para pruebas

### 3. **Pruebas (Sandbox)**
- Pruebas la funcionalidad en sandbox
- Verificas que todo funcione correctamente
- Si hay problemas, regresas a `develop` para corregir

### 4. **Producción (Sandbox → Production)**
- Push a `sandbox` crea automáticamente un PR a `main`
- Se ejecutan verificaciones de seguridad estrictas
- Se despliegan dependencias (Lambdas, tablas, etc.)
- Se despliega a producción

## 🛠️ Workflows Disponibles

### 1. **Security Cleanup** (`security-cleanup.yml`)
- Se ejecuta en todos los pushes y PRs
- Verifica credenciales hardcodeadas
- Busca console.log statements
- Ejecuta auditoría de seguridad
- Verifica calidad del código

### 2. **Develop to Sandbox** (`develop-to-sandbox.yml`)
- Se ejecuta en push a `develop`
- Crea PR automático a `sandbox`
- Despliega automáticamente a sandbox
- Ejecuta health checks

### 3. **Sandbox to Production** (`sandbox-to-production.yml`)
- Se ejecuta en push a `sandbox`
- Crea PR automático a `main`
- Verificaciones estrictas de seguridad
- Despliega dependencias de producción
- Despliega a producción

## 🔐 Verificaciones de Seguridad

### Automáticas
- ✅ No credenciales hardcodeadas
- ✅ No console.log statements
- ✅ Auditoría de dependencias
- ✅ Linting y type checking
- ✅ Tests unitarios

### Manuales
- ✅ Revisión de PRs
- ✅ Pruebas en sandbox
- ✅ Verificación de funcionalidad

## 📦 Despliegue de Dependencias

### En Producción se despliegan automáticamente:
- 🚀 **Lambda Functions**: Todas las funciones necesarias
- 🗄️ **Base de Datos**: Tablas y configuraciones
- 🌐 **API Gateway**: Endpoints y configuraciones
- 📱 **Frontend**: Aplicación optimizada
- ☁️ **CloudFront**: CDN y cache
- 🏥 **Health Checks**: Verificaciones de salud

## 🚨 Buenas Prácticas

### Antes de hacer push a `develop`:
1. Ejecuta `npm run lint` localmente
2. Ejecuta `npm run test` localmente
3. Ejecuta `npm run build` localmente
4. Verifica que no hay console.log
5. Verifica que no hay credenciales hardcodeadas

### Antes de hacer push a `sandbox`:
1. Prueba la funcionalidad en `develop`
2. Ejecuta `./scripts/cleanup-for-production.sh`
3. Verifica que todos los tests pasen
4. Revisa el PR generado automáticamente

### Antes de hacer push a `main`:
1. Prueba exhaustivamente en `sandbox`
2. Verifica que todas las dependencias estén listas
3. Revisa el PR generado automáticamente
4. Confirma que el despliegue sea seguro

## 🔧 Scripts Disponibles

### `./scripts/cleanup-for-production.sh`
- Remueve console.log statements
- Verifica credenciales hardcodeadas
- Ejecuta auditoría de seguridad
- Crea checklist de producción

### `./scripts/deploy-production-dependencies.sh`
- Despliega Lambda functions
- Crea/actualiza tablas de base de datos
- Configura API Gateway
- Despliega frontend
- Invalida CloudFront
- Ejecuta health checks

## 📊 Monitoreo

### En Sandbox:
- URL: `https://sandbox.d3ts6pwgn7uyyh.amplifyapp.com`
- Logs: CloudWatch Logs
- Health: Health checks automáticos

### En Producción:
- URL: `https://production.d3ts6pwgn7uyyh.amplifyapp.com`
- Logs: CloudWatch Logs
- Health: Health checks automáticos
- Monitoreo: CloudWatch Alarms

## 🚨 Troubleshooting

### Si el despliegue falla:
1. Revisa los logs de GitHub Actions
2. Verifica las credenciales de AWS
3. Ejecuta los scripts localmente
4. Revisa la configuración de Amplify

### Si hay problemas de seguridad:
1. Ejecuta `./scripts/cleanup-for-production.sh`
2. Revisa el archivo `production-checklist.md`
3. Corrige los problemas identificados
4. Haz commit y push nuevamente

## 📝 Ejemplo de Flujo

```bash
# 1. Trabajar en develop
git checkout develop
# ... hacer cambios ...
git add .
git commit -m "feat: add whatsapp integration"
git push origin develop

# 2. Automáticamente se crea PR a sandbox y se despliega

# 3. Probar en sandbox
# ... probar funcionalidad ...

# 4. Si todo está bien, hacer push a sandbox
git checkout sandbox
git merge develop
git push origin sandbox

# 5. Automáticamente se crea PR a main y se despliega a producción
```

## 🎯 Beneficios

- ✅ **Seguridad**: Verificaciones automáticas de seguridad
- ✅ **Calidad**: Tests y linting automáticos
- ✅ **Trazabilidad**: PRs automáticos con historial
- ✅ **Despliegue**: Automático y confiable
- ✅ **Rollback**: Fácil rollback si hay problemas
- ✅ **Monitoreo**: Health checks automáticos

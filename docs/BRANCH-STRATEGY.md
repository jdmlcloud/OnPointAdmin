# 🌿 Estrategia de Ramas

## 📋 Ramas Activas

### 1. **main** 🚀 (Producción)
- **Propósito**: Código en producción
- **Protección**: Solo merge via Pull Requests
- **Despliegue**: Automático a producción via Amplify
- **URL**: https://production.d3ts6pwgn7uyyh.amplifyapp.com

### 2. **sandbox** 🧪 (Testing)
- **Propósito**: Entorno de pruebas y validación
- **Protección**: Solo merge via Pull Requests
- **Despliegue**: Automático a sandbox via Amplify
- **URL**: https://sandbox.d3ts6pwgn7uyyh.amplifyapp.com

### 3. **develop** 💻 (Desarrollo)
- **Propósito**: Desarrollo activo y integración
- **Protección**: Push directo permitido
- **Despliegue**: Automático a sandbox via Amplify
- **URL**: https://sandbox.d3ts6pwgn7uyyh.amplifyapp.com

## 🔄 Flujo de Trabajo

### Para nuevas funcionalidades:
```bash
# 1. Crear rama de feature desde develop
git checkout develop
git pull origin develop
git checkout -b feature/nueva-funcionalidad

# 2. Desarrollar y hacer commits
git add .
git commit -m "feat: add nueva funcionalidad"
git push origin feature/nueva-funcionalidad

# 3. Crear PR a develop
# (Se hace automáticamente o manualmente en GitHub)

# 4. Merge a develop
git checkout develop
git merge feature/nueva-funcionalidad
git push origin develop

# 5. Eliminar rama de feature
git branch -d feature/nueva-funcionalidad
git push origin --delete feature/nueva-funcionalidad
```

### Para despliegue a producción:
```bash
# 1. Desde develop, merge a sandbox
git checkout sandbox
git merge develop
git push origin sandbox

# 2. Probar en sandbox
# 3. Si todo está bien, merge a main
git checkout main
git merge sandbox
git push origin main
```

## 🚫 Ramas Eliminadas

### Ramas que ya no se usan:
- ❌ `chore/ci-arch-refactor`
- ❌ `feature/nueva-seccion`
- ❌ `feature/user-management-v1.1.0`
- ❌ `frontend-stable`

## 📊 Estrategia de Naming

### Ramas de Feature:
- `feature/nombre-funcionalidad`
- `feature/whatsapp-integration`
- `feature/user-dashboard`

### Ramas de Fix:
- `fix/nombre-problema`
- `fix/login-bug`
- `fix/api-endpoint`

### Ramas de Chore:
- `chore/nombre-tarea`
- `chore/update-dependencies`
- `chore/cleanup-code`

## 🔒 Protección de Ramas

### main (Producción):
- ✅ Requiere Pull Request
- ✅ Requiere revisión de código
- ✅ Requiere que los tests pasen
- ✅ Requiere que la seguridad pase

### sandbox (Testing):
- ✅ Requiere Pull Request
- ✅ Requiere que los tests pasen
- ✅ Requiere que la seguridad pase

### develop (Desarrollo):
- ✅ Push directo permitido
- ✅ Tests automáticos
- ✅ Verificaciones de seguridad

## 🚀 Despliegue Automático

### develop → sandbox:
- **Trigger**: Push a develop
- **Acción**: Despliegue automático a sandbox
- **Verificación**: Tests y seguridad

### sandbox → main:
- **Trigger**: Push a sandbox
- **Acción**: Creación de PR a main
- **Verificación**: Tests, seguridad y revisión

### main → producción:
- **Trigger**: Merge a main
- **Acción**: Despliegue automático a producción
- **Verificación**: Tests, seguridad y health checks

## 📝 Buenas Prácticas

### Antes de crear una rama:
1. Asegúrate de estar en `develop`
2. Haz `git pull origin develop`
3. Crea la rama con un nombre descriptivo

### Antes de hacer merge:
1. Ejecuta tests localmente
2. Verifica que no hay conflictos
3. Revisa el código
4. Actualiza la documentación si es necesario

### Antes de eliminar una rama:
1. Asegúrate de que esté mergeada
2. Verifica que no hay cambios pendientes
3. Elimina tanto local como remota

## 🎯 Beneficios

- ✅ **Estructura clara**: Solo 3 ramas principales
- ✅ **Flujo simple**: develop → sandbox → main
- ✅ **Despliegue automático**: Sin intervención manual
- ✅ **Seguridad**: Verificaciones en cada paso
- ✅ **Trazabilidad**: Historial claro de cambios
- ✅ **Mantenimiento**: Fácil de entender y mantener

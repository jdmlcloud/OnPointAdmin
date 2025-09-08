# 🔄 Flujo de Trabajo y Entornos

## 📋 Estructura de Ramas

### **Ramas Oficiales:**
- **`main`** - Producción (solo para releases estables)
- **`sandbox`** - Entorno de pruebas y desarrollo

### **Ramas de Trabajo:**
- **`feature/*`** - Nuevas funcionalidades
- **`fix/*`** - Correcciones de bugs
- **`hotfix/*`** - Correcciones críticas para producción

---

## 🌍 Entornos

### **1. 🚀 Producción (main)**
- **Frontend:** `https://d3ts6pwgn7uyyh.amplifyapp.com`
- **API:** `https://7z4skk6jy0.execute-api.us-east-1.amazonaws.com/prod`
- **Base de Datos:** DynamoDB Producción
- **Amplify:** Producción
- **Estado:** ✅ Estable y funcionando

### **2. 🧪 Sandbox (sandbox)**
- **Frontend:** `https://sandbox.d3ts6pwgn7uyyh.amplifyapp.com`
- **API:** `https://7z4skk6jy0.execute-api.us-east-1.amazonaws.com/prod`
- **Base de Datos:** DynamoDB Producción (compartida)
- **Amplify:** Sandbox
- **Estado:** ✅ Para pruebas y desarrollo

### **3. 🔧 Desarrollo (feature/*)**
- **Frontend:** Local (localhost:3000)
- **API:** Local o Sandbox
- **Base de Datos:** Local o Sandbox
- **Estado:** 🔄 En desarrollo

---

## 🔄 Flujo de Trabajo (CICD)

### **Para Nuevas Funcionalidades:**

```bash
# 1. Crear rama desde sandbox
git checkout sandbox
git pull origin sandbox
git checkout -b feature/nueva-funcionalidad

# 2. Desarrollar y hacer commits
git add .
git commit -m "feat: nueva funcionalidad"

# 3. Subir a GitHub
git push origin feature/nueva-funcionalidad

# 4. Merge a sandbox para pruebas
git checkout sandbox
git merge feature/nueva-funcionalidad
git push origin sandbox

# 5. Probar en sandbox
# https://sandbox.d3ts6pwgn7uyyh.amplifyapp.com

# 6. Si todo está bien, merge a main
git checkout main
git merge sandbox
git push origin main

# 7. Crear tag de release
git tag -a "v2.2.0" -m "Release v2.2.0"
git push origin v2.2.0

# 8. Limpiar rama feature
git branch -D feature/nueva-funcionalidad
git push origin --delete feature/nueva-funcionalidad
```

### **Para Correcciones de Bugs:**

```bash
# 1. Crear rama desde sandbox
git checkout sandbox
git checkout -b fix/correccion-bug

# 2. Desarrollar y hacer commits
git add .
git commit -m "fix: corrección de bug"

# 3. Merge a sandbox para pruebas
git checkout sandbox
git merge fix/correccion-bug
git push origin sandbox

# 4. Probar en sandbox
# 5. Si está bien, merge a main
git checkout main
git merge sandbox
git push origin main
```

### **Para Hotfixes Críticos:**

```bash
# 1. Crear rama desde main
git checkout main
git checkout -b hotfix/correccion-critica

# 2. Desarrollar y hacer commits
git add .
git commit -m "hotfix: corrección crítica"

# 3. Merge a main
git checkout main
git merge hotfix/correccion-critica
git push origin main

# 4. Merge a sandbox
git checkout sandbox
git merge hotfix/correccion-critica
git push origin sandbox

# 5. Crear tag de hotfix
git tag -a "v2.1.1" -m "Hotfix v2.1.1"
git push origin v2.1.1
```

---

## 🏗️ Arquitectura de Entornos

### **Separación de Recursos:**

#### **Producción:**
- **Frontend:** Amplify Producción
- **API:** API Gateway Producción
- **Base de Datos:** DynamoDB Producción
- **Dominio:** `d3ts6pwgn7uyyh.amplifyapp.com`

#### **Sandbox:**
- **Frontend:** Amplify Sandbox
- **API:** API Gateway Sandbox (mismo que producción por ahora)
- **Base de Datos:** DynamoDB Sandbox (mismo que producción por ahora)
- **Dominio:** `sandbox.d3ts6pwgn7uyyh.amplifyapp.com`

#### **Desarrollo:**
- **Frontend:** Local (Next.js dev server)
- **API:** Local o Sandbox
- **Base de Datos:** Local o Sandbox

---

## 📝 Convenciones de Commits

### **Tipos de Commits:**
- `feat:` - Nueva funcionalidad
- `fix:` - Corrección de bug
- `docs:` - Documentación
- `style:` - Formato, espacios, etc.
- `refactor:` - Refactorización de código
- `test:` - Tests
- `chore:` - Tareas de mantenimiento

### **Ejemplos:**
```bash
git commit -m "feat: agregar sistema de notificaciones"
git commit -m "fix: corregir error de CORS en API"
git commit -m "docs: actualizar documentación de API"
git commit -m "refactor: optimizar consultas a DynamoDB"
```

---

## 🚨 Reglas Importantes

### **1. Protección de Producción:**
- ❌ **NUNCA** hacer commits directos a `main`
- ✅ **SIEMPRE** probar en `sandbox` primero
- ✅ **SIEMPRE** hacer merge desde `sandbox` a `main`

### **2. Limpieza de Ramas:**
- ✅ **SIEMPRE** eliminar ramas feature después del merge
- ✅ **SIEMPRE** mantener solo `main` y `sandbox` como ramas oficiales
- ✅ **SIEMPRE** crear ramas de trabajo desde `sandbox`

### **3. Testing:**
- ✅ **SIEMPRE** probar en sandbox antes de producción
- ✅ **SIEMPRE** verificar que no hay errores de consola
- ✅ **SIEMPRE** probar funcionalidades críticas

---

## 🔧 Comandos Útiles

### **Ver estado actual:**
```bash
git status
git branch -a
git log --oneline -10
```

### **Sincronizar con remoto:**
```bash
git fetch origin
git pull origin sandbox
git pull origin main
```

### **Limpiar ramas locales:**
```bash
git branch -D nombre-rama
git push origin --delete nombre-rama
```

### **Ver diferencias:**
```bash
git diff sandbox..main
git diff HEAD~1
```

---

## 📊 Monitoreo

### **Producción:**
- **Amplify:** https://console.aws.amazon.com/amplify/home?region=us-east-1
- **API Gateway:** https://console.aws.amazon.com/apigateway/home?region=us-east-1
- **CloudWatch:** https://console.aws.amazon.com/cloudwatch/home?region=us-east-1

### **Sandbox:**
- **Amplify:** https://console.aws.amazon.com/amplify/home?region=us-east-1
- **API Gateway:** https://console.aws.amazon.com/apigateway/home?region=us-east-1
- **CloudWatch:** https://console.aws.amazon.com/cloudwatch/home?region=us-east-1

---

## 🎯 Próximos Pasos

### **1. Separar APIs:**
- Crear API Gateway separado para sandbox
- Configurar DynamoDB separado para sandbox
- Actualizar variables de entorno

### **2. Automatización:**
- Configurar GitHub Actions para CI/CD
- Automatizar deployment a sandbox
- Automatizar deployment a producción

### **3. Monitoreo:**
- Configurar alertas de CloudWatch
- Configurar métricas de performance
- Configurar logs de errores

---

**¡Mantén este flujo para un desarrollo ordenado y sin problemas!** 🚀

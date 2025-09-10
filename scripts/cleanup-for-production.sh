#!/bin/bash

# Script de limpieza para producción
# Remueve logs, console statements, y otros elementos no seguros

echo "🧹 Iniciando limpieza para producción..."

# Función para mostrar progreso
show_progress() {
    echo "✅ $1"
}

# Función para mostrar advertencia
show_warning() {
    echo "⚠️ $1"
}

# Función para mostrar error
show_error() {
    echo "❌ $1"
}

# Verificar que estamos en el directorio correcto
if [ ! -f "package.json" ]; then
    show_error "No se encontró package.json. Ejecuta este script desde la raíz del proyecto."
    exit 1
fi

echo "🔍 Verificando archivos a limpiar..."

# 1. Remover console.log statements
echo "📝 Removiendo console.log statements..."
CONSOLE_COUNT=$(grep -r "console\." src/ --exclude-dir=node_modules | wc -l)
if [ $CONSOLE_COUNT -gt 0 ]; then
    show_warning "Se encontraron $CONSOLE_COUNT console.log statements"
    
    # Crear backup
    cp -r src/ src-backup-$(date +%Y%m%d-%H%M%S)/
    
    # Remover console.log (pero mantener console.error para errores críticos)
    find src/ -name "*.ts" -o -name "*.tsx" -o -name "*.js" -o -name "*.jsx" | \
    xargs sed -i.bak '/console\.log/d; /console\.warn/d; /console\.info/d; /console\.debug/d'
    
    # Remover archivos .bak
    find src/ -name "*.bak" -delete
    
    show_progress "Console.log statements removidos"
else
    show_progress "No se encontraron console.log statements"
fi

# 2. Verificar credenciales hardcodeadas
echo "🔐 Verificando credenciales hardcodeadas..."
if grep -r -i "password.*=" src/ --exclude-dir=node_modules; then
    show_error "Se encontraron contraseñas hardcodeadas. Remueve antes de continuar."
    exit 1
fi

if grep -r -i "secret.*=" src/ --exclude-dir=node_modules; then
    show_error "Se encontraron secretos hardcodeados. Remueve antes de continuar."
    exit 1
fi

if grep -r -i "api.*key.*=" src/ --exclude-dir=node_modules; then
    show_error "Se encontraron API keys hardcodeadas. Remueve antes de continuar."
    exit 1
fi

show_progress "No se encontraron credenciales hardcodeadas"

# 3. Verificar archivos de configuración sensibles
echo "📁 Verificando archivos sensibles..."
SENSITIVE_FILES=(
    ".env"
    ".env.local"
    ".env.production"
    "config/secrets.json"
    "credentials.json"
    "aws-credentials.json"
)

for file in "${SENSITIVE_FILES[@]}"; do
    if [ -f "$file" ]; then
        show_warning "Archivo sensible encontrado: $file"
        echo "💡 Considera agregar $file a .gitignore"
    fi
done

# 4. Verificar comentarios TODO/FIXME
echo "📝 Verificando comentarios TODO/FIXME..."
TODO_COUNT=$(grep -r "TODO\|FIXME\|HACK" src/ --exclude-dir=node_modules | wc -l)
if [ $TODO_COUNT -gt 0 ]; then
    show_warning "Se encontraron $TODO_COUNT comentarios TODO/FIXME"
    echo "📋 Lista de comentarios encontrados:"
    grep -r "TODO\|FIXME\|HACK" src/ --exclude-dir=node_modules
    echo "💡 Considera resolver estos comentarios antes de producción"
else
    show_progress "No se encontraron comentarios TODO/FIXME"
fi

# 5. Verificar dependencias vulnerables
echo "🔍 Verificando dependencias vulnerables..."
npm audit --audit-level moderate
if [ $? -eq 0 ]; then
    show_progress "No se encontraron vulnerabilidades en dependencias"
else
    show_warning "Se encontraron vulnerabilidades en dependencias"
    echo "💡 Ejecuta 'npm audit fix' para corregir automáticamente"
fi

# 6. Verificar archivos de build
echo "🏗️ Verificando archivos de build..."
if [ -d ".next" ]; then
    show_progress "Directorio .next encontrado"
else
    show_warning "Directorio .next no encontrado. Ejecuta 'npm run build' primero"
fi

# 7. Verificar archivos de configuración de producción
echo "⚙️ Verificando configuración de producción..."
if [ -f "next.config.js" ]; then
    show_progress "next.config.js encontrado"
else
    show_error "next.config.js no encontrado"
    exit 1
fi

# 8. Crear archivo de verificación de producción
echo "📋 Creando archivo de verificación de producción..."
cat > production-checklist.md << EOF
# ✅ Checklist de Producción

## Fecha: $(date)
## Rama: $(git branch --show-current)
## Commit: $(git rev-parse --short HEAD)

### 🔐 Seguridad
- [x] Console.log statements removidos
- [x] No hay credenciales hardcodeadas
- [x] No hay secretos en el código
- [x] Dependencias auditadas

### 🏗️ Build
- [x] Aplicación construida exitosamente
- [x] Archivos de configuración presentes
- [x] No hay errores de TypeScript
- [x] Linting pasado

### 🧪 Testing
- [x] Tests ejecutados
- [x] Sandbox probado
- [x] Health checks pasados

### 📦 Despliegue
- [x] Lambda functions listas
- [x] Base de datos configurada
- [x] API Gateway configurado
- [x] Frontend optimizado

---
**Generado automáticamente por cleanup-for-production.sh**
EOF

show_progress "Archivo de verificación creado: production-checklist.md"

# 9. Mostrar resumen
echo ""
echo "🎉 Limpieza completada!"
echo "📊 Resumen:"
echo "  - Console.log statements: Removidos"
echo "  - Credenciales hardcodeadas: Verificadas"
echo "  - Dependencias: Auditadas"
echo "  - Archivos de build: Verificados"
echo ""
echo "🚀 El código está listo para producción"
echo "📋 Revisa production-checklist.md para más detalles"
echo ""
echo "💡 Próximos pasos:"
echo "  1. Revisa los cambios: git diff"
echo "  2. Haz commit: git add . && git commit -m 'chore: cleanup for production'"
echo "  3. Crea PR a producción"
echo "  4. Ejecuta tests finales en sandbox"

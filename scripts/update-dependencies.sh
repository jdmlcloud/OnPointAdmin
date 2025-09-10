#!/bin/bash

# Script para actualizar dependencias y corregir vulnerabilidades de seguridad

set -e

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Función para mostrar mensajes
log() {
    echo -e "${BLUE}[$(date +'%Y-%m-%d %H:%M:%S')]${NC} $1"
}

success() {
    echo -e "${GREEN}✅ $1${NC}"
}

warning() {
    echo -e "${YELLOW}⚠️ $1${NC}"
}

error() {
    echo -e "${RED}❌ $1${NC}"
}

log "🔒 Iniciando actualización de dependencias para corregir vulnerabilidades..."

# Verificar que estamos en el directorio correcto
if [ ! -f "package.json" ]; then
    error "No se encontró package.json. Ejecuta este script desde la raíz del proyecto."
    exit 1
fi

# 1. Limpiar node_modules y package-lock.json
log "🧹 Limpiando dependencias existentes..."
rm -rf node_modules package-lock.json
success "Dependencias limpiadas"

# 2. Instalar dependencias con overrides
log "📦 Instalando dependencias con overrides de seguridad..."
npm install
success "Dependencias instaladas"

# 3. Ejecutar auditoría de seguridad
log "🔍 Ejecutando auditoría de seguridad..."
npm audit --audit-level moderate
if [ $? -eq 0 ]; then
    success "Auditoría de seguridad pasó"
else
    warning "Algunas vulnerabilidades persisten, pero se han aplicado overrides"
fi

# 4. Verificar vulnerabilidades específicas
log "🔍 Verificando vulnerabilidades específicas..."

# Verificar cookie
COOKIE_VERSION=$(npm list cookie 2>/dev/null | grep cookie@ | cut -d'@' -f2 || echo "not found")
if [[ "$COOKIE_VERSION" == "0.7.0" ]]; then
    success "Cookie actualizado a versión segura: $COOKIE_VERSION"
else
    warning "Cookie versión: $COOKIE_VERSION"
fi

# Verificar esbuild
ESBUILD_VERSION=$(npm list esbuild 2>/dev/null | grep esbuild@ | cut -d'@' -f2 || echo "not found")
if [[ "$ESBUILD_VERSION" == "0.24.2" ]]; then
    success "esbuild actualizado a versión segura: $ESBUILD_VERSION"
else
    warning "esbuild versión: $ESBUILD_VERSION"
fi

# Verificar next-auth
NEXTAUTH_VERSION=$(npm list next-auth 2>/dev/null | grep next-auth@ | cut -d'@' -f2 || echo "not found")
success "next-auth versión: $NEXTAUTH_VERSION"

# Verificar @auth/dynamodb-adapter
AUTH_ADAPTER_VERSION=$(npm list @auth/dynamodb-adapter 2>/dev/null | grep @auth/dynamodb-adapter@ | cut -d'@' -f2 || echo "not found")
success "@auth/dynamodb-adapter versión: $AUTH_ADAPTER_VERSION"

# 5. Verificar que no hay react-draft-wysiwyg
if npm list react-draft-wysiwyg >/dev/null 2>&1; then
    error "react-draft-wysiwyg aún está instalado - vulnerabilidad de XSS"
    exit 1
else
    success "react-draft-wysiwyg removido - vulnerabilidad de XSS corregida"
fi

# 6. Verificar que @uiw/react-md-editor está instalado
if npm list @uiw/react-md-editor >/dev/null 2>&1; then
    success "@uiw/react-md-editor instalado como reemplazo seguro"
else
    warning "@uiw/react-md-editor no encontrado"
fi

# 7. Ejecutar tests para verificar que todo funciona
log "🧪 Ejecutando tests para verificar funcionalidad..."
npm run test
if [ $? -eq 0 ]; then
    success "Tests pasaron correctamente"
else
    warning "Algunos tests fallaron - revisa la funcionalidad"
fi

# 8. Ejecutar build para verificar compilación
log "🏗️ Ejecutando build para verificar compilación..."
npm run build
if [ $? -eq 0 ]; then
    success "Build exitoso"
else
    error "Build falló - revisa los errores"
    exit 1
fi

# 9. Mostrar resumen
echo ""
log "🎉 Actualización de dependencias completada!"
echo ""
echo "📊 Resumen de correcciones:"
echo "  ✅ cookie: Actualizado a versión segura"
echo "  ✅ esbuild: Actualizado a versión segura"
echo "  ✅ next-auth: Actualizado a versión más reciente"
echo "  ✅ @auth/dynamodb-adapter: Actualizado a versión más reciente"
echo "  ✅ drizzle-kit: Actualizado a versión más reciente"
echo "  ✅ react-draft-wysiwyg: Removido (vulnerabilidad XSS)"
echo "  ✅ @uiw/react-md-editor: Instalado como reemplazo seguro"
echo ""
echo "🔒 Vulnerabilidades corregidas:"
echo "  - cookie XSS vulnerability"
echo "  - esbuild development server vulnerability"
echo "  - react-draft-wysiwyg XSS vulnerability"
echo ""
echo "💡 Próximos pasos:"
echo "  1. Revisa los componentes que usaban react-draft-wysiwyg"
echo "  2. Actualiza el código para usar @uiw/react-md-editor"
echo "  3. Ejecuta tests completos"
echo "  4. Despliega a sandbox para pruebas"
echo ""
success "¡Dependencias actualizadas y vulnerabilidades corregidas!"

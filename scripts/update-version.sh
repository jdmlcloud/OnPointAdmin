#!/bin/bash

# Script para actualizar la versión del proyecto
set -e

echo "🔢 Actualizando versión del proyecto..."

# Función para mostrar ayuda
show_help() {
    echo "Uso: $0 [MAJOR|MINOR|PATCH] [mensaje]"
    echo ""
    echo "Argumentos:"
    echo "  MAJOR    - Cambios importantes/breaking changes (1.0.0 -> 2.0.0)"
    echo "  MINOR    - Nuevas features (1.0.0 -> 1.1.0)"
    echo "  PATCH    - Bug fixes (1.0.0 -> 1.0.1)"
    echo "  mensaje  - Mensaje descriptivo del cambio"
    echo ""
    echo "Ejemplos:"
    echo "  $0 PATCH 'Fix login error'"
    echo "  $0 MINOR 'Add new provider features'"
    echo "  $0 MAJOR 'Complete UI redesign'"
}

# Verificar argumentos
if [ $# -lt 1 ]; then
    show_help
    exit 1
fi

TYPE=$1
MESSAGE=${2:-"Version update"}

# Archivo de versión
VERSION_FILE="src/lib/version.ts"

# Obtener versión actual
CURRENT_MAJOR=$(grep "major:" $VERSION_FILE | sed 's/.*major: \([0-9]*\).*/\1/')
CURRENT_MINOR=$(grep "minor:" $VERSION_FILE | sed 's/.*minor: \([0-9]*\).*/\1/')
CURRENT_PATCH=$(grep "patch:" $VERSION_FILE | sed 's/.*patch: \([0-9]*\).*/\1/')

echo "📋 Versión actual: v$CURRENT_MAJOR.$CURRENT_MINOR.$CURRENT_PATCH"

# Calcular nueva versión
case $TYPE in
    MAJOR)
        NEW_MAJOR=$((CURRENT_MAJOR + 1))
        NEW_MINOR=0
        NEW_PATCH=0
        ;;
    MINOR)
        NEW_MAJOR=$CURRENT_MAJOR
        NEW_MINOR=$((CURRENT_MINOR + 1))
        NEW_PATCH=0
        ;;
    PATCH)
        NEW_MAJOR=$CURRENT_MAJOR
        NEW_MINOR=$CURRENT_MINOR
        NEW_PATCH=$((CURRENT_PATCH + 1))
        ;;
    *)
        echo "❌ Tipo de versión inválido: $TYPE"
        echo "Usa: MAJOR, MINOR o PATCH"
        exit 1
        ;;
esac

NEW_VERSION="v$NEW_MAJOR.$NEW_MINOR.$NEW_PATCH"
CURRENT_DATE=$(date +"%Y.%m.%d")

echo "🚀 Nueva versión: $NEW_VERSION"

# Actualizar archivo de versión
sed -i.bak "s/major: $CURRENT_MAJOR/major: $NEW_MAJOR/g" $VERSION_FILE
sed -i.bak "s/minor: $CURRENT_MINOR/minor: $NEW_MINOR/g" $VERSION_FILE
sed -i.bak "s/patch: $CURRENT_PATCH/patch: $NEW_PATCH/g" $VERSION_FILE
sed -i.bak "s/build: '[^']*'/build: '$CURRENT_DATE'/g" $VERSION_FILE

# Limpiar archivo de backup
rm $VERSION_FILE.bak

echo "✅ Archivo de versión actualizado"

# Hacer commit con la nueva versión
echo "📝 Haciendo commit de la nueva versión..."
git add $VERSION_FILE
git commit -m "🔢 $NEW_VERSION - $MESSAGE"

echo ""
echo "🎉 ¡Versión actualizada exitosamente!"
echo "📋 Resumen:"
echo "  - Versión anterior: v$CURRENT_MAJOR.$CURRENT_MINOR.$CURRENT_PATCH"
echo "  - Nueva versión: $NEW_VERSION"
echo "  - Tipo: $TYPE"
echo "  - Mensaje: $MESSAGE"
echo "  - Fecha: $CURRENT_DATE"
echo ""
echo "📋 Próximos pasos:"
echo "  1. Probar la aplicación con la nueva versión"
echo "  2. Hacer push a GitHub: git push origin sandbox"
echo "  3. Si todo está bien, hacer deploy a producción"

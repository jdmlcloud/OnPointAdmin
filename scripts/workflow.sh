#!/bin/bash

# Script para automatizar el flujo de trabajo
set -e

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
NC='\033[0m' # No Color

# Función para mostrar ayuda
show_help() {
    echo -e "${BLUE}🔄 Script de Flujo de Trabajo${NC}"
    echo ""
    echo -e "${YELLOW}Uso:${NC}"
    echo "  ./scripts/workflow.sh [comando] [opciones]"
    echo ""
    echo -e "${YELLOW}Comandos disponibles:${NC}"
    echo "  ${GREEN}new-feature${NC} <nombre>     - Crear nueva funcionalidad"
    echo "  ${GREEN}new-fix${NC} <nombre>         - Crear corrección de bug"
    echo "  ${GREEN}new-hotfix${NC} <nombre>      - Crear hotfix crítico"
    echo "  ${GREEN}merge-sandbox${NC}            - Merge a sandbox"
    echo "  ${GREEN}merge-production${NC}         - Merge a producción"
    echo "  ${GREEN}clean-branches${NC}           - Limpiar ramas innecesarias"
    echo "  ${GREEN}status${NC}                   - Ver estado actual"
    echo "  ${GREEN}sync${NC}                     - Sincronizar con remoto"
    echo "  ${GREEN}help${NC}                     - Mostrar esta ayuda"
    echo ""
    echo -e "${YELLOW}Ejemplos:${NC}"
    echo "  ./scripts/workflow.sh new-feature sistema-notificaciones"
    echo "  ./scripts/workflow.sh new-fix error-cors"
    echo "  ./scripts/workflow.sh merge-sandbox"
    echo "  ./scripts/workflow.sh merge-production"
}

# Función para verificar que estamos en el directorio correcto
check_directory() {
    if [ ! -f "package.json" ] || [ ! -d ".git" ]; then
        echo -e "${RED}❌ Error: Este script debe ejecutarse desde la raíz del proyecto${NC}"
        exit 1
    fi
}

# Función para verificar que no hay cambios sin commitear
check_clean_working_directory() {
    if [ -n "$(git status --porcelain)" ]; then
        echo -e "${RED}❌ Error: Hay cambios sin commitear. Haz commit o stash primero.${NC}"
        git status --short
        exit 1
    fi
}

# Función para crear nueva funcionalidad
new_feature() {
    local feature_name=$1
    if [ -z "$feature_name" ]; then
        echo -e "${RED}❌ Error: Debes especificar el nombre de la funcionalidad${NC}"
        echo "Uso: ./scripts/workflow.sh new-feature <nombre>"
        exit 1
    fi
    
    echo -e "${BLUE}🚀 Creando nueva funcionalidad: $feature_name${NC}"
    
    # Verificar que estamos en sandbox
    current_branch=$(git branch --show-current)
    if [ "$current_branch" != "sandbox" ]; then
        echo -e "${YELLOW}⚠️  Cambiando a rama sandbox...${NC}"
        git checkout sandbox
    fi
    
    # Sincronizar con remoto
    echo -e "${BLUE}🔄 Sincronizando con remoto...${NC}"
    git pull origin sandbox
    
    # Crear nueva rama
    branch_name="feature/$feature_name"
    echo -e "${BLUE}🌿 Creando rama: $branch_name${NC}"
    git checkout -b "$branch_name"
    
    echo -e "${GREEN}✅ Rama creada: $branch_name${NC}"
    echo -e "${YELLOW}📝 Ahora puedes desarrollar tu funcionalidad${NC}"
    echo -e "${YELLOW}💡 Cuando termines, usa: ./scripts/workflow.sh merge-sandbox${NC}"
}

# Función para crear corrección de bug
new_fix() {
    local fix_name=$1
    if [ -z "$fix_name" ]; then
        echo -e "${RED}❌ Error: Debes especificar el nombre de la corrección${NC}"
        echo "Uso: ./scripts/workflow.sh new-fix <nombre>"
        exit 1
    fi
    
    echo -e "${BLUE}🐛 Creando corrección de bug: $fix_name${NC}"
    
    # Verificar que estamos en sandbox
    current_branch=$(git branch --show-current)
    if [ "$current_branch" != "sandbox" ]; then
        echo -e "${YELLOW}⚠️  Cambiando a rama sandbox...${NC}"
        git checkout sandbox
    fi
    
    # Sincronizar con remoto
    echo -e "${BLUE}🔄 Sincronizando con remoto...${NC}"
    git pull origin sandbox
    
    # Crear nueva rama
    branch_name="fix/$fix_name"
    echo -e "${BLUE}🌿 Creando rama: $branch_name${NC}"
    git checkout -b "$branch_name"
    
    echo -e "${GREEN}✅ Rama creada: $branch_name${NC}"
    echo -e "${YELLOW}📝 Ahora puedes desarrollar tu corrección${NC}"
    echo -e "${YELLOW}💡 Cuando termines, usa: ./scripts/workflow.sh merge-sandbox${NC}"
}

# Función para crear hotfix crítico
new_hotfix() {
    local hotfix_name=$1
    if [ -z "$hotfix_name" ]; then
        echo -e "${RED}❌ Error: Debes especificar el nombre del hotfix${NC}"
        echo "Uso: ./scripts/workflow.sh new-hotfix <nombre>"
        exit 1
    fi
    
    echo -e "${BLUE}🚨 Creando hotfix crítico: $hotfix_name${NC}"
    
    # Verificar que estamos en main
    current_branch=$(git branch --show-current)
    if [ "$current_branch" != "main" ]; then
        echo -e "${YELLOW}⚠️  Cambiando a rama main...${NC}"
        git checkout main
    fi
    
    # Sincronizar con remoto
    echo -e "${BLUE}🔄 Sincronizando con remoto...${NC}"
    git pull origin main
    
    # Crear nueva rama
    branch_name="hotfix/$hotfix_name"
    echo -e "${BLUE}🌿 Creando rama: $branch_name${NC}"
    git checkout -b "$branch_name"
    
    echo -e "${GREEN}✅ Rama creada: $branch_name${NC}"
    echo -e "${YELLOW}📝 Ahora puedes desarrollar tu hotfix${NC}"
    echo -e "${YELLOW}💡 Cuando termines, usa: ./scripts/workflow.sh merge-production${NC}"
}

# Función para merge a sandbox
merge_sandbox() {
    current_branch=$(git branch --show-current)
    
    if [[ "$current_branch" != feature/* ]] && [[ "$current_branch" != fix/* ]]; then
        echo -e "${RED}❌ Error: Debes estar en una rama feature/* o fix/*${NC}"
        echo "Rama actual: $current_branch"
        exit 1
    fi
    
    echo -e "${BLUE}🔄 Haciendo merge a sandbox...${NC}"
    
    # Verificar que no hay cambios sin commitear
    check_clean_working_directory
    
    # Cambiar a sandbox
    git checkout sandbox
    git pull origin sandbox
    
    # Hacer merge
    echo -e "${BLUE}🔀 Haciendo merge de $current_branch a sandbox...${NC}"
    git merge "$current_branch"
    
    # Push a remoto
    echo -e "${BLUE}📤 Subiendo a remoto...${NC}"
    git push origin sandbox
    
    echo -e "${GREEN}✅ Merge completado a sandbox${NC}"
    echo -e "${YELLOW}🧪 Ahora puedes probar en: https://sandbox.d3ts6pwgn7uyyh.amplifyapp.com${NC}"
    echo -e "${YELLOW}💡 Si todo está bien, usa: ./scripts/workflow.sh merge-production${NC}"
}

# Función para merge a producción
merge_production() {
    current_branch=$(git branch --show-current)
    
    if [ "$current_branch" != "sandbox" ]; then
        echo -e "${RED}❌ Error: Debes estar en la rama sandbox${NC}"
        echo "Rama actual: $current_branch"
        exit 1
    fi
    
    echo -e "${BLUE}🚀 Haciendo merge a producción...${NC}"
    
    # Verificar que no hay cambios sin commitear
    check_clean_working_directory
    
    # Cambiar a main
    git checkout main
    git pull origin main
    
    # Hacer merge
    echo -e "${BLUE}🔀 Haciendo merge de sandbox a main...${NC}"
    git merge sandbox
    
    # Push a remoto
    echo -e "${BLUE}📤 Subiendo a remoto...${NC}"
    git push origin main
    
    echo -e "${GREEN}✅ Merge completado a producción${NC}"
    echo -e "${YELLOW}🎯 Producción disponible en: https://d3ts6pwgn7uyyh.amplifyapp.com${NC}"
    
    # Preguntar si crear tag
    read -p "¿Quieres crear un tag de release? (y/n): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        read -p "Versión (ej: v2.2.0): " version
        if [ -n "$version" ]; then
            git tag -a "$version" -m "Release $version"
            git push origin "$version"
            echo -e "${GREEN}✅ Tag $version creado${NC}"
        fi
    fi
}

# Función para limpiar ramas
clean_branches() {
    echo -e "${BLUE}🧹 Limpiando ramas innecesarias...${NC}"
    
    # Obtener ramas locales
    local_branches=$(git branch | grep -E "(feature/|fix/|hotfix/)" | sed 's/^[ *]*//')
    
    if [ -z "$local_branches" ]; then
        echo -e "${YELLOW}ℹ️  No hay ramas de trabajo para limpiar${NC}"
        return
    fi
    
    echo -e "${YELLOW}Ramas encontradas:${NC}"
    echo "$local_branches"
    echo ""
    
    read -p "¿Eliminar estas ramas? (y/n): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        for branch in $local_branches; do
            echo -e "${BLUE}🗑️  Eliminando rama: $branch${NC}"
            git branch -D "$branch"
        done
        echo -e "${GREEN}✅ Ramas eliminadas${NC}"
    else
        echo -e "${YELLOW}❌ Operación cancelada${NC}"
    fi
}

# Función para ver estado
show_status() {
    echo -e "${BLUE}📊 Estado actual del proyecto${NC}"
    echo ""
    
    # Rama actual
    current_branch=$(git branch --show-current)
    echo -e "${YELLOW}Rama actual:${NC} $current_branch"
    
    # Estado del working directory
    if [ -n "$(git status --porcelain)" ]; then
        echo -e "${YELLOW}Estado:${NC} ${RED}Hay cambios sin commitear${NC}"
        git status --short
    else
        echo -e "${YELLOW}Estado:${NC} ${GREEN}Working directory limpio${NC}"
    fi
    
    # Últimos commits
    echo ""
    echo -e "${YELLOW}Últimos commits:${NC}"
    git log --oneline -5
    
    # Ramas locales
    echo ""
    echo -e "${YELLOW}Ramas locales:${NC}"
    git branch
    
    # Ramas remotas
    echo ""
    echo -e "${YELLOW}Ramas remotas:${NC}"
    git branch -r
}

# Función para sincronizar
sync_repos() {
    echo -e "${BLUE}🔄 Sincronizando con remoto...${NC}"
    
    # Fetch
    git fetch origin
    
    # Pull sandbox
    echo -e "${BLUE}📥 Actualizando sandbox...${NC}"
    git checkout sandbox
    git pull origin sandbox
    
    # Pull main
    echo -e "${BLUE}📥 Actualizando main...${NC}"
    git checkout main
    git pull origin main
    
    echo -e "${GREEN}✅ Sincronización completada${NC}"
}

# Función principal
main() {
    check_directory
    
    case "$1" in
        "new-feature")
            new_feature "$2"
            ;;
        "new-fix")
            new_fix "$2"
            ;;
        "new-hotfix")
            new_hotfix "$2"
            ;;
        "merge-sandbox")
            merge_sandbox
            ;;
        "merge-production")
            merge_production
            ;;
        "clean-branches")
            clean_branches
            ;;
        "status")
            show_status
            ;;
        "sync")
            sync_repos
            ;;
        "help"|"--help"|"-h"|"")
            show_help
            ;;
        *)
            echo -e "${RED}❌ Comando no reconocido: $1${NC}"
            echo ""
            show_help
            exit 1
            ;;
    esac
}

# Ejecutar función principal
main "$@"

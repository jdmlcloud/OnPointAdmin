# 🚀 Desarrollo Local - Sistema de Usuarios y Roles

## 📋 Información General

**Versión:** v1.1.0  
**Rama:** `feature/user-management-v1.1.0`  
**Entorno:** Desarrollo Local  
**Fecha:** 2024-12-19  

## 🎯 Objetivo

Desarrollar un sistema completo de gestión de usuarios y roles con autenticación y autorización, manteniendo la separación de entornos y siguiendo las mejores prácticas de seguridad.

## 🏗️ Arquitectura

### 📊 Estructura de Roles

```
Super Usuario (SUPER_ADMIN) - Nivel 1
├── Acceso total al sistema
├── Crear/eliminar admins
├── Gestionar todos los usuarios
└── Configurar roles del sistema

Admin (ADMIN) - Nivel 2
├── Gestionar ejecutivos
├── Acceso a todas las funcionalidades
├── Configurar permisos de ejecutivos
└── No puede eliminar super usuarios

Ejecutivo (EXECUTIVE) - Nivel 3
├── Acceso limitado según configuración
├── Gestionar proveedores/productos
└── Sin acceso a gestión de usuarios
```

### 🗄️ Tablas DynamoDB

- `OnPointAdmin-Users-local` - Usuarios del sistema
- `OnPointAdmin-Roles-local` - Roles y sus permisos
- `OnPointAdmin-Permissions-local` - Permisos disponibles
- `OnPointAdmin-Providers-local` - Proveedores (existente)
- `OnPointAdmin-Products-local` - Productos (existente)

### ⚡ Lambda Functions

- `onpoint-admin-auth` - Autenticación y autorización
- `onpoint-admin-users` - Gestión de usuarios
- `onpoint-admin-roles` - Gestión de roles
- `onpoint-admin-permissions` - Gestión de permisos

## 🚀 Configuración Inicial

### 1. Preparar el Entorno

```bash
# Verificar que estás en la rama correcta
git branch --show-current

# Debe mostrar: feature/user-management-v1.1.0
```

### 2. Ejecutar Script de Configuración

```bash
# Ejecutar el script maestro
./scripts/setup-local-environment.sh
```

Este script:
- ✅ Instala dependencias de Lambda functions
- ✅ Crea tablas de DynamoDB
- ✅ Pobla las tablas con datos de prueba
- ✅ Verifica la configuración

### 3. Configurar Variables de Entorno

Editar `config/local.env` con tus credenciales de desarrollo:

```bash
# AWS Local (usar credenciales de desarrollo)
AWS_ACCESS_KEY_ID=your_local_access_key
AWS_SECRET_ACCESS_KEY=your_local_secret_key
AWS_REGION=us-east-1

# JWT Secret para desarrollo
JWT_SECRET=your_local_jwt_secret_key
```

## 👤 Usuarios de Prueba

| Email | Rol | Contraseña | Descripción |
|-------|-----|------------|-------------|
| `superadmin@onpoint.com` | SUPER_ADMIN | `password` | Acceso total al sistema |
| `admin@onpoint.com` | ADMIN | `password` | Administrador del sistema |
| `ejecutivo@onpoint.com` | EXECUTIVE | `password` | Ejecutivo con acceso limitado |

## 🔧 Desarrollo

### Estructura de Directorios

```
src/
├── app/
│   ├── users/           # Páginas de gestión de usuarios
│   ├── roles/           # Páginas de gestión de roles
│   └── auth/            # Páginas de autenticación
├── components/
│   ├── users/           # Componentes de usuarios
│   └── roles/           # Componentes de roles
├── hooks/
│   ├── users/           # Hooks para usuarios
│   └── roles/           # Hooks para roles
├── lib/
│   ├── auth/            # Lógica de autenticación
│   └── roles/           # Lógica de roles
└── types/
    └── users.ts         # Tipos TypeScript

lambda-functions/
├── auth/                # Lambda de autenticación
├── users/               # Lambda de usuarios
├── roles/               # Lambda de roles
└── permissions/         # Lambda de permisos
```

### Campos de Usuario

- **Nombre** - Nombre del usuario
- **Apellido** - Apellido del usuario
- **Teléfono** - Formato: +52XXXXXXXXXX (automático)
- **Rol** - SUPER_ADMIN, ADMIN, EXECUTIVE
- **Departamento** - Configurable por admin/super usuario
- **Posición** - Configurable por admin/super usuario

## 🧪 Pruebas

### Probar Lambda Functions

```bash
# Probar autenticación
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"superadmin@onpoint.com","password":"password"}'

# Probar obtener usuarios
curl -X GET http://localhost:3000/api/users \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### Probar Tablas DynamoDB

```bash
# Listar usuarios
aws dynamodb scan --table-name OnPointAdmin-Users-local --region us-east-1

# Listar roles
aws dynamodb scan --table-name OnPointAdmin-Roles-local --region us-east-1
```

## 🔒 Seguridad

### Consideraciones Importantes

1. **Separación de Entornos**
   - Local: Desarrollo y pruebas
   - Sandbox: Testing antes de producción
   - Producción: Solo código validado

2. **Credenciales**
   - NO usar credenciales de producción en local
   - Usar credenciales de desarrollo específicas
   - Mantener archivos de configuración seguros

3. **Contraseñas**
   - Hash con bcrypt
   - JWT tokens con expiración
   - Validación de permisos en cada request

## 📝 Próximos Pasos

### Módulo 2: Backend (Local)
- [ ] Implementar autenticación JWT
- [ ] Crear middleware de autorización
- [ ] Probar todas las Lambda functions
- [ ] Validar permisos y roles

### Módulo 3: Frontend (Local)
- [ ] Páginas de login y gestión
- [ ] Componentes de usuarios y roles
- [ ] Middleware de autorización
- [ ] Dashboard de administración

### Módulo 4: Pruebas (Sandbox)
- [ ] Merge a sandbox para pruebas
- [ ] Testing completo de funcionalidades
- [ ] Validación de seguridad
- [ ] Corrección de bugs

### Módulo 5: Producción
- [ ] Merge a main solo cuando esté 100% probado
- [ ] Deployment a producción
- [ ] Monitoreo y validación final

## 🆘 Solución de Problemas

### Error: Tabla no encontrada
```bash
# Verificar que la tabla existe
aws dynamodb describe-table --table-name OnPointAdmin-Users-local --region us-east-1

# Si no existe, ejecutar el script de configuración
./scripts/setup-local-dynamodb.sh
```

### Error: Dependencias no instaladas
```bash
# Instalar dependencias
./scripts/install-lambda-dependencies.sh
```

### Error: Credenciales AWS
```bash
# Verificar credenciales
aws sts get-caller-identity

# Configurar credenciales de desarrollo
aws configure
```

## 📞 Soporte

Si encuentras problemas durante el desarrollo:

1. Verificar que estás en la rama correcta
2. Ejecutar el script de configuración completo
3. Revisar los logs de las Lambda functions
4. Validar la configuración de DynamoDB

---

**¡Happy Coding! 🚀**

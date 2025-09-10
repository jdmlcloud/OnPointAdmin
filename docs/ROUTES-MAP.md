# 🗺️ Mapa Completo de Rutas - OnPoint Admin

## 📱 **Rutas Principales (UI)**

### **🏠 Dashboard y Página Principal**
- `/` - Página principal (redirige a login)
- `/dashboard` - Dashboard principal del sistema
- `/dashboard-cognito` - Dashboard con Cognito
- `/dashboard-test` - Dashboard de pruebas
- `/cognito-dashboard` - Dashboard Cognito (legacy)
- `/cognito-dashboard-direct` - Dashboard Cognito directo
- `/cognito-dashboard-real` - Dashboard Cognito real
- `/cognito-dashboard-simple` - Dashboard Cognito simple

### **🔐 Autenticación**
- `/auth/login` - Página de login principal
- `/auth/verify` - Verificación de email
- `/auth/setup-password` - Configuración de contraseña inicial
- `/auth/verify-2fa` - Verificación de código 2FA
- `/auth/cognito-signin` - Login con Cognito (legacy)
- `/auth/cognito-signin-simple` - Login Cognito simple
- `/auth/cognito-direct` - Login Cognito directo
- `/auth/cognito-real` - Login Cognito real

### **👥 Gestión de Usuarios**
- `/users` - Lista de usuarios
- `/users/create` - Crear nuevo usuario
- `/users/management` - Gestión avanzada de usuarios
- `/roles` - Gestión de roles
- `/permissions` - Gestión de permisos

### **🏢 Proveedores**
- `/providers` - Lista de proveedores
- `/providers/new` - Crear nuevo proveedor

### **📦 Productos**
- `/products` - Lista de productos
- `/products/new` - Crear nuevo producto

### **🎨 Logos**
- `/logos` - Lista de logos
- `/logos/new` - Crear nuevo logo

### **📊 Reportes y Analytics**
- `/reports` - Reportes del sistema
- `/analytics` - Analytics y métricas
- `/tracking` - Seguimiento de actividades

### **💼 Gestión de Negocio**
- `/quotations` - Cotizaciones
- `/proposals` - Propuestas
- `/tasks` - Tareas y productividad

### **🔧 Herramientas**
- `/editor` - Editor de documentos
- `/pdf-generator` - Generador de PDFs
- `/whatsapp` - Integración WhatsApp
- `/integrations` - Integraciones del sistema

### **⚙️ Configuración**
- `/settings` - Configuración del sistema
- `/system` - Administración del sistema

### **🧪 Testing y Desarrollo**
- `/test` - Página de pruebas
- `/ai-test` - Pruebas de IA

## 🔌 **Rutas de API**

### **🔐 Autenticación API**
- `/api/auth/login` - Login de usuarios
- `/api/auth/login-existing` - Login con usuarios existentes
- `/api/auth/send-verification` - Enviar email de verificación
- `/api/auth/verify-email` - Verificar email
- `/api/auth/setup-password` - Configurar contraseña
- `/api/auth/verify-2fa` - Verificar código 2FA
- `/api/auth/verify-token` - Verificar token
- `/api/lambda/auth` - Proxy a Lambda de autenticación

### **👥 Usuarios API**
- `/api/users` - CRUD de usuarios

### **🏢 Proveedores API**
- `/api/providers` - CRUD de proveedores

### **📦 Productos API**
- `/api/products` - CRUD de productos
- `/api/products/[id]` - Producto específico

### **🎨 Logos API**
- `/api/logos` - CRUD de logos
- `/api/logos/[id]` - Logo específico

### **📊 Estadísticas API**
- `/api/stats` - Estadísticas del sistema

### **🤖 IA API**
- `/api/ai/test` - Pruebas de IA

## 🎯 **Rutas por Rol de Usuario**

### **👑 SUPERADMIN**
- Acceso completo a todas las rutas
- Gestión de usuarios, roles y permisos
- Configuración del sistema
- Todas las funcionalidades

### **👨‍💼 ADMIN**
- Dashboard, usuarios, proveedores, productos
- Reportes y analytics
- Herramientas de negocio
- **NO** puede gestionar roles y permisos

### **👨‍💻 EXECUTIVE**
- Dashboard básico
- Lectura de proveedores y productos
- Herramientas de ventas
- **NO** puede crear usuarios

## 🔒 **Rutas Protegidas**

### **Autenticación Requerida**
- Todas las rutas excepto `/auth/login` y `/`
- Redirigen a login si no hay sesión activa

### **Permisos Específicos**
- `/users/create` - Requiere permiso `users:manage`
- `/roles` - Requiere permiso `roles:manage`
- `/permissions` - Requiere permiso `permissions:manage`
- `/settings` - Requiere permiso `settings:manage`

## 🚀 **Rutas de Desarrollo vs Producción**

### **Desarrollo Local**
- Todas las rutas funcionan con datos mock
- APIs locales para testing
- Logs detallados habilitados

### **Producción/Sandbox**
- APIs conectadas a AWS Lambda
- Datos reales en DynamoDB
- Autenticación real con JWT

## 📱 **Navegación Principal**

### **Menú Lateral**
1. **Dashboard** - Vista principal
2. **Usuarios** - Gestión de usuarios
3. **Proveedores** - Gestión de proveedores
4. **Productos** - Catálogo de productos
5. **Logos** - Gestión de logos
6. **Reportes** - Reportes y analytics
7. **Configuración** - Ajustes del sistema

### **Menú Superior**
- **Perfil de Usuario** - Información del usuario
- **Notificaciones** - Alertas del sistema
- **Configuración** - Ajustes personales
- **Cerrar Sesión** - Logout

## 🔄 **Flujo de Navegación Típico**

1. **Login** → `/auth/login`
2. **Dashboard** → `/dashboard`
3. **Gestión** → `/users`, `/providers`, `/products`
4. **Crear** → `/users/create`, `/providers/new`, `/products/new`
5. **Reportes** → `/reports`, `/analytics`
6. **Configuración** → `/settings`

## 📝 **Notas Importantes**

- **Rutas legacy** marcadas como "legacy" están en proceso de migración
- **Rutas de testing** solo disponibles en desarrollo
- **Permisos** se validan en cada ruta según el rol del usuario
- **Redirecciones** automáticas según el estado de autenticación

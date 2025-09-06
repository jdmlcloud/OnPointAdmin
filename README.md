# OnPoint Admin - Plataforma de Ventas B2B con IA

Plataforma integral que automatiza el proceso completo de ventas B2B desde WhatsApp hasta PDF final, con IA integrada para análisis de peticiones y generación automática de propuestas comerciales.

## 🚀 Características Principales

- **Frontend & Backend Unificado**: NextJS 14 con App Router
- **Base de Datos**: DynamoDB para almacenamiento NoSQL
- **Autenticación**: NextAuth.js v5 con Amazon Cognito
- **IA Integrada**: OpenAI GPT-4 y Claude 3.5 Sonnet
- **WhatsApp Business API**: Procesamiento automático de mensajes
- **Generación de PDFs**: Puppeteer para propuestas profesionales
- **Storage**: S3 con CloudFront para archivos estáticos

## 📋 Módulos del Sistema

### V1 - Módulos Base (Disponibles)
- ✅ **Autenticación**: Login con Cognito, roles RBAC
- ✅ **Gestión de Proveedores**: CRUD completo con logos
- ✅ **Gestión de Productos**: Variantes, precios escalonados, stock

### V2 - WhatsApp + IA ✅ (Completado Frontend)
- ✅ **Procesamiento de Mensajes**: Análisis automático con GPT-4
- ✅ **Extracción de Datos**: Productos, cantidades, colores, urgencia
- ✅ **Respuestas Automáticas**: Notificaciones al ejecutivo
- ✅ **Microinteracciones**: Botones animados y estados de carga
- ✅ **Notificaciones**: Sistema completo en tiempo real

### V3 - Cotización Inteligente ✅ (Completado Frontend)
- ✅ **Algoritmo de Scoring**: Recomendación de proveedores
- ✅ **Cotizador Automático**: Márgenes y descuentos por volumen
- ✅ **Comparación de Opciones**: Análisis lado a lado
- ✅ **Microinteracciones**: Creación y aprobación con feedback visual
- ✅ **Estados de Carga**: Animaciones para todas las acciones

### V4 - Diseño de Propuestas ✅ (Completado Frontend)
- ✅ **Generación de Mockups**: Aplicación de logos en productos 3D
- ✅ **Editor Visual**: Canvas drag & drop profesional
- ✅ **Templates**: Biblioteca de plantillas por tipo de producto
- ✅ **Microinteracciones**: Generación de mockups con animaciones
- ✅ **Analytics**: Métricas de rendimiento y engagement

### V5 - Generador de PDFs ✅ (Completado Frontend)
- ✅ **Plantillas Responsive**: Diseño profesional automático
- ✅ **Contenido Dinámico**: Integración con DynamoDB
- ✅ **Branding Personalizable**: Por empresa
- ✅ **Microinteracciones**: Generación y descarga con animaciones
- ✅ **Sistema de Plantillas**: Biblioteca completa de templates

### V6 - Envío y Seguimiento ✅ (Completado Frontend)
- ✅ **Multicanal**: WhatsApp, Email, Portal web, SMS
- ✅ **Analytics**: Tracking de aperturas y descargas
- ✅ **Feedback**: Respuestas y seguimiento del cliente
- ✅ **Dashboard de Envíos**: Métricas en tiempo real
- ✅ **Insights Automáticos**: Análisis de rendimiento

### V7 - Editor Visual Avanzado ✅ (Completado Frontend)
- ✅ **Colaboración en Tiempo Real**: Múltiples usuarios
- ✅ **Historial de Versiones**: Rollback automático
- ✅ **Export Múltiple**: Diferentes formatos
- ✅ **Canvas Profesional**: Drag & drop con herramientas
- ✅ **Panel de Propiedades**: Edición avanzada de elementos

## 🛠️ Tecnologías

### Frontend
- **NextJS 14** - Framework principal con App Router
- **TypeScript** - Tipado estático
- **Tailwind CSS** - Styling responsive
- **Shadcn/ui** - Componentes UI profesionales
- **React Hook Form** - Manejo de formularios
- **Zod** - Validación de schemas

### Backend
- **NextJS API Routes** - API endpoints
- **DynamoDB** - Base de datos NoSQL
- **AWS SDK** - Integración con servicios AWS
- **NextAuth.js v5** - Autenticación
- **Amazon Cognito** - Identity provider

### IA & Procesamiento
- **OpenAI GPT-4** - Análisis de peticiones
- **Claude 3.5 Sonnet** - Generación de contenido
- **Puppeteer** - Generación de PDFs
- **Sharp** - Procesamiento de imágenes

### Integraciones
- **WhatsApp Business API** - Mensajería
- **Resend** - Emails transaccionales
- **S3 + CloudFront** - Storage y CDN

## 🚀 Instalación y Configuración

### Prerrequisitos
- Node.js 18+ 
- npm o yarn
- Cuenta AWS con permisos para DynamoDB, S3, Cognito
- API keys de OpenAI y Anthropic
- Token de WhatsApp Business API

### Instalación

1. **Clonar el repositorio**
```bash
git clone <repository-url>
cd onPointAdmin
```

2. **Instalar dependencias**
```bash
npm install
```

3. **Configurar variables de entorno**
```bash
cp .env.example .env.local
# Editar .env.local con tus credenciales
```

4. **Ejecutar en desarrollo**
```bash
npm run dev
```

### Variables de Entorno Requeridas

```env
# Database
DYNAMODB_REGION=us-east-1
DYNAMODB_TABLE_PREFIX=onpoint

# AWS Configuration
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=your_access_key_here
AWS_SECRET_ACCESS_KEY=your_secret_key_here

# S3 Configuration
S3_BUCKET_NAME=onpoint-storage
S3_REGION=us-east-1
CLOUDFRONT_DOMAIN=your_cloudfront_domain

# Authentication
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_nextauth_secret_here
COGNITO_CLIENT_ID=your_cognito_client_id
COGNITO_CLIENT_SECRET=your_cognito_client_secret
COGNITO_ISSUER=https://cognito-idp.us-east-1.amazonaws.com/your_user_pool_id

# AI Services
OPENAI_API_KEY=your_openai_api_key
ANTHROPIC_API_KEY=your_anthropic_api_key

# WhatsApp Business API
WHATSAPP_ACCESS_TOKEN=your_whatsapp_access_token
WHATSAPP_PHONE_NUMBER_ID=your_phone_number_id
WHATSAPP_WEBHOOK_VERIFY_TOKEN=your_webhook_verify_token

# Email Service
RESEND_API_KEY=your_resend_api_key
```

## 📁 Estructura del Proyecto

```
onPointAdmin/
├── src/
│   ├── app/                    # NextJS App Router
│   │   ├── api/               # API endpoints
│   │   ├── auth/              # Páginas de autenticación
│   │   ├── dashboard/         # Dashboard principal
│   │   ├── providers/         # Gestión de proveedores
│   │   ├── products/          # Gestión de productos
│   │   ├── whatsapp/          # WhatsApp + IA
│   │   ├── quotations/        # Cotizaciones
│   │   ├── proposals/         # Propuestas
│   │   └── settings/          # Configuración
│   ├── components/            # Componentes React
│   │   ├── ui/               # Componentes base (Shadcn/ui)
│   │   ├── forms/            # Formularios
│   │   ├── layout/           # Layouts
│   │   └── charts/           # Gráficos
│   ├── lib/                  # Utilidades y configuraciones
│   │   ├── auth.ts           # Configuración NextAuth
│   │   ├── database.ts       # Cliente DynamoDB
│   │   ├── ai.ts            # Servicios de IA
│   │   └── whatsapp.ts      # WhatsApp API
│   ├── types/               # Tipos TypeScript
│   ├── hooks/               # Custom hooks
│   ├── utils/               # Funciones utilitarias
│   ├── config/              # Configuraciones
│   ├── services/            # Servicios de negocio
│   └── store/               # Estado global (Zustand)
├── infrastructure/          # Infraestructura AWS
│   ├── aws/                # Configuraciones AWS
│   ├── terraform/          # Terraform scripts
│   └── cloudformation/     # CloudFormation templates
├── backend/                # Backend services
│   ├── lambda/             # Funciones Lambda
│   ├── api-gateway/        # API Gateway configs
│   └── sqs/               # Colas SQS
└── docs/                   # Documentación
    ├── api/               # Documentación API
    ├── deployment/        # Guías de deployment
    └── architecture/      # Arquitectura del sistema
```

## 🎨 Diseño y UX

### **Paleta de Colores**
- **Tema**: Minimalista en colores blanco y negro
- **Acento**: Verde pastel (#10B981)
- **Modo**: Light/Dark automático
- **Responsive**: Mobile-first design
- **Componentes**: Shadcn/ui para consistencia

### **Microinteracciones y Notificaciones**
- 🔔 **Sistema de Notificaciones**: Dropdown en navbar con contador animado
- ⚡ **Botones Animados**: Estados de carga, hover effects, feedback visual
- 🎯 **Estados de Carga**: Spinners, skeletons, transiciones suaves
- 🎉 **Feedback de Éxito**: Animaciones de celebración y confetti
- 📱 **UX Responsiva**: Microinteracciones adaptadas a cada dispositivo
- 🌙 **Modo Oscuro**: Todas las animaciones compatibles con tema oscuro

### **Componentes de UI Avanzados**
- `AnimatedButton`: Botones con animaciones y estados de carga
- `NotificationDropdown`: Sistema de notificaciones completo
- `LoadingSkeleton`: Esqueletos de carga para mejor UX
- `Confetti`: Animación de celebración para acciones exitosas
- `SuccessToast`: Notificaciones toast personalizadas

## 🔐 Roles y Permisos

- **Admin**: Acceso completo al sistema
- **Ejecutivo**: Gestión de proveedores, productos, cotizaciones
- **Cliente**: Visualización de propuestas (futuro)

## 📊 Roadmap

### ✅ **Completado (Frontend)**
- [x] **V1**: Estructura base, autenticación, proveedores, productos
- [x] **V2**: WhatsApp + IA con microinteracciones
- [x] **V3**: Cotización inteligente con animaciones
- [x] **V4**: Diseño de propuestas con feedback visual
- [x] **V5**: Generador de PDFs con plantillas responsive
- [x] **V6**: Envío y seguimiento multicanal
- [x] **V7**: Editor visual avanzado con colaboración
- [x] **Gestión de Usuarios**: CRUD completo para administradores
- [x] **Analytics y Reportes**: Dashboards completos
- [x] **Sistema de Roles**: Permisos granulares y selector de roles
- [x] **Microinteracciones**: Sistema completo de notificaciones y animaciones

### 🚧 **En Desarrollo (Backend)**
- [ ] **API Routes**: Endpoints para todos los módulos
- [ ] **DynamoDB**: Integración completa con base de datos
- [ ] **Autenticación**: NextAuth.js con Amazon Cognito
- [ ] **IA Integration**: OpenAI GPT-4 y Claude 3.5 Sonnet
- [ ] **WhatsApp API**: Integración con WhatsApp Business API

### 📋 **Pendiente (Infraestructura)**
- [ ] **V5**: Generador de PDFs (Q4 2024)
- [ ] **V6**: Envío y seguimiento (Q1 2025)
- [ ] **V7**: Editor visual avanzado (Q2 2025)
- [ ] **AWS Deployment**: Amplify, Lambda, API Gateway
- [ ] **CI/CD Pipeline**: GitHub Actions y deployment automático

## 🤝 Contribución

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT - ver el archivo [LICENSE](LICENSE) para detalles.

## 📞 Soporte

Para soporte técnico o preguntas, contacta al equipo de desarrollo.

---

**OnPoint Admin** - Automatizando ventas B2B con IA 🚀

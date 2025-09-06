# Guía de Desarrollo - OnPoint Admin

## 🚀 Inicio Rápido

### Prerrequisitos
- Node.js 18+
- npm o yarn
- Git

### Configuración Inicial

1. **Clonar el repositorio**
```bash
git clone <repository-url>
cd onPointAdmin
```

2. **Ejecutar script de configuración**
```bash
./scripts/setup-dev.sh
```

3. **Iniciar servidor de desarrollo**
```bash
npm run dev
```

4. **Acceder a la aplicación**
- URL: http://localhost:3000
- Credenciales demo: admin@onpoint.com / password

## 🏗️ Estructura del Proyecto

```
src/
├── app/                    # NextJS App Router
│   ├── api/               # API endpoints
│   ├── auth/              # Páginas de autenticación
│   ├── dashboard/         # Dashboard principal
│   ├── providers/         # Gestión de proveedores
│   ├── products/          # Gestión de productos
│   └── ...
├── components/            # Componentes React
│   ├── ui/               # Componentes base (Shadcn/ui)
│   ├── forms/            # Formularios
│   └── layout/           # Layouts
├── lib/                  # Utilidades y configuraciones
├── types/                # Tipos TypeScript
├── hooks/                # Custom hooks
├── utils/                # Funciones utilitarias
├── config/               # Configuraciones
├── services/             # Servicios de negocio
└── store/                # Estado global (Zustand)
```

## 🎨 Diseño y UI

### Tema
- **Colores**: Blanco y negro con acento verde pastel (#10B981)
- **Modo**: Light/Dark automático
- **Componentes**: Shadcn/ui para consistencia

### Componentes Disponibles
- Button, Card, Input, Badge, Toast
- Formularios con React Hook Form + Zod
- Iconos con Lucide React

## 🔐 Autenticación

### Modo Desarrollo
- Credenciales por defecto: admin@onpoint.com / password
- Sin necesidad de AWS Cognito
- Roles: admin, ejecutivo, cliente

### Modo Producción
- Amazon Cognito como identity provider
- NextAuth.js v4 para manejo de sesiones
- DynamoDB para almacenamiento de sesiones

## 📊 Módulos Disponibles

### V1 - Módulos Base ✅
- **Dashboard**: Vista principal con estadísticas
- **Proveedores**: CRUD completo con logos
- **Productos**: Gestión de productos y variantes

### V2 - WhatsApp + IA 🔄
- Procesamiento automático de mensajes
- Análisis con OpenAI GPT-4
- Extracción de datos de peticiones

### V3-V7 - Módulos Futuros 📅
- Cotización inteligente
- Diseño de propuestas
- Generador de PDFs
- Envío y seguimiento
- Editor visual avanzado

## 🛠️ Scripts Disponibles

```bash
npm run dev          # Servidor de desarrollo
npm run build        # Build de producción
npm run start        # Servidor de producción
npm run lint         # Linter ESLint
npm run type-check   # Verificación de tipos TypeScript
```

## 🗄️ Base de Datos

### DynamoDB (Producción)
- Tablas: providers, products, quotations, proposals, whatsapp_messages
- Configuración en `src/lib/database.ts`
- Operaciones CRUD con AWS SDK v3

### Datos Mock (Desarrollo)
- Datos de ejemplo en componentes
- Sin conexión a DynamoDB requerida

## 🔧 Configuración

### Variables de Entorno
```env
# Desarrollo (opcional)
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=dev-secret-key

# Producción (requerido)
AWS_ACCESS_KEY_ID=your_key
AWS_SECRET_ACCESS_KEY=your_secret
DYNAMODB_REGION=us-east-1
COGNITO_CLIENT_ID=your_client_id
OPENAI_API_KEY=your_openai_key
# ... más variables
```

### Configuración de Archivos
- `next.config.js`: Configuración de NextJS
- `tailwind.config.ts`: Configuración de Tailwind CSS
- `tsconfig.json`: Configuración de TypeScript

## 🧪 Testing

### Linting
```bash
npm run lint
```

### Type Checking
```bash
npm run type-check
```

### Build Testing
```bash
npm run build
```

## 📝 Convenciones de Código

### TypeScript
- Tipado estricto habilitado
- Interfaces para todos los objetos de datos
- Tipos personalizados en `src/types/`

### React
- Componentes funcionales con hooks
- Props tipadas con TypeScript
- Custom hooks para lógica reutilizable

### Estilos
- Tailwind CSS para estilos
- Clases utilitarias preferidas
- Componentes de Shadcn/ui como base

### Nomenclatura
- Archivos: kebab-case (ej: `user-profile.tsx`)
- Componentes: PascalCase (ej: `UserProfile`)
- Variables: camelCase (ej: `userName`)
- Constantes: UPPER_SNAKE_CASE (ej: `API_URL`)

## 🚀 Deployment

### Desarrollo Local
```bash
npm run dev
```

### Build de Producción
```bash
npm run build
npm run start
```

### AWS Amplify (Futuro)
- Configuración automática con `amplify.yml`
- Variables de entorno en consola AWS
- Deploy automático desde GitHub

## 🐛 Debugging

### Logs de Desarrollo
- Console.log en componentes
- React DevTools para inspección
- Network tab para API calls

### Errores Comunes
1. **Error 500**: Verificar variables de entorno
2. **TypeScript errors**: Ejecutar `npm run type-check`
3. **Build errors**: Verificar imports y dependencias

## 📚 Recursos Adicionales

- [NextJS Documentation](https://nextjs.org/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Shadcn/ui](https://ui.shadcn.com/)
- [NextAuth.js](https://next-auth.js.org/)
- [AWS SDK v3](https://docs.aws.amazon.com/sdk-for-javascript/v3/developer-guide/)

## 🤝 Contribución

1. Crear rama feature: `git checkout -b feature/nueva-funcionalidad`
2. Hacer commits descriptivos
3. Ejecutar tests: `npm run lint && npm run type-check`
4. Crear Pull Request

---

**¡Happy Coding!** 🚀

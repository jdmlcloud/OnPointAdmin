# Configuración de Variables de Entorno

## Archivo .env.local (crear en la raíz del proyecto)

```bash
# Configuración de AWS Cognito
NEXT_PUBLIC_COGNITO_USER_POOL_ID=us-east-1_pnE1wndnB
NEXT_PUBLIC_COGNITO_CLIENT_ID=76ho4o7fqhh3vdsiqqq269jjt5

# Configuración de AWS (lado servidor)
COGNITO_USER_POOL_ID=us-east-1_pnE1wndnB
COGNITO_CLIENT_ID=76ho4o7fqhh3vdsiqqq269jjt5
AWS_REGION=us-east-1

# Configuración de DynamoDB
DYNAMODB_REGION=us-east-1
DYNAMODB_ACCESS_KEY_ID=your-access-key-here
DYNAMODB_SECRET_ACCESS_KEY=your-secret-key-here

# Configuración de Next.js
NEXTAUTH_URL=https://sandbox.d3ts6pwgn7uyyh.amplifyapp.com
NEXTAUTH_SECRET=your-nextauth-secret-here
```

## Archivo scripts/cognito-config.env (para scripts)

```bash
# Configuración de AWS Cognito
COGNITO_USER_POOL_ID=us-east-1_pnE1wndnB
COGNITO_CLIENT_ID=76ho4o7fqhh3vdsiqqq269jjt5
DEFAULT_PASSWORD=OnPoint2024!
ADMIN_EMAIL=admin@onpoint.com
EJECUTIVO_EMAIL=ejecutivo@onpoint.com
```

## Instrucciones

1. Crear archivo `.env.local` en la raíz del proyecto con las variables de arriba
2. Crear archivo `scripts/cognito-config.env` con la configuración de Cognito
3. **IMPORTANTE**: Cambiar las contraseñas en producción
4. **IMPORTANTE**: No subir archivos .env a Git

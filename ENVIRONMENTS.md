# 🌍 Configuración de Entornos

## 📋 Resumen de Entornos

| Entorno | URL | API Gateway | Descripción |
|---------|-----|-------------|-------------|
| **Local** | `http://localhost:3000` | Sandbox | Desarrollo local |
| **Sandbox** | `https://sandbox.d3ts6pwgn7uyyh.amplifyapp.com` | Sandbox | Pruebas y desarrollo |
| **Production** | `https://production.d3ts6pwgn7uyyh.amplifyapp.com` | Production | Producción |

## 🔧 Configuración por Entorno

### 1. Local (Development)
```bash
# Variables de entorno
NEXT_PUBLIC_ENVIRONMENT=local
NEXT_PUBLIC_API_URL=https://m4ijnyg5da.execute-api.us-east-1.amazonaws.com/sandbox
NEXT_PUBLIC_CLIENTS_API_URL=https://mkrc6lo043.execute-api.us-east-1.amazonaws.com/sandbox
```

### 2. Sandbox (Testing)
```bash
# Variables de entorno en Amplify
NEXT_PUBLIC_ENVIRONMENT=sandbox
NEXT_PUBLIC_API_URL=https://m4ijnyg5da.execute-api.us-east-1.amazonaws.com/sandbox
NEXT_PUBLIC_CLIENTS_API_URL=https://mkrc6lo043.execute-api.us-east-1.amazonaws.com/sandbox
```

### 3. Production
```bash
# Variables de entorno en Amplify
NEXT_PUBLIC_ENVIRONMENT=prod
NEXT_PUBLIC_API_URL=https://9o43ckvise.execute-api.us-east-1.amazonaws.com/prod
NEXT_PUBLIC_CLIENTS_API_URL=https://mkrc6lo043.execute-api.us-east-1.amazonaws.com/prod
```

## 🚀 Despliegue

### Amplify (Principal)
- **Producción**: Se despliega automáticamente desde la rama `main`
- **Sandbox**: Se despliega automáticamente desde la rama `sandbox`

### GitHub Actions (Respaldo)
- **Producción**: Se despliega desde la rama `main` o `production`
- **CloudFront**: Como respaldo de Amplify

## 🔍 Verificación

### Logs esperados por entorno:

#### Local:
```
✅ Entorno detectado por variable de entorno: local
🌐 API Request: https://m4ijnyg5da.execute-api.us-east-1.amazonaws.com/sandbox/notifications
```

#### Sandbox:
```
✅ Entorno detectado por variable de entorno: sandbox
🌐 API Request: https://m4ijnyg5da.execute-api.us-east-1.amazonaws.com/sandbox/notifications
```

#### Production:
```
✅ Entorno detectado por variable de entorno: prod
🌐 API Request: https://9o43ckvise.execute-api.us-east-1.amazonaws.com/prod/notifications
```

## ⚠️ Notas Importantes

1. **No mezclar datos**: Cada entorno tiene su propia base de datos y API
2. **Variables de entorno**: Se configuran en Amplify Console
3. **GitHub Actions**: Solo como respaldo, no interfiere con Amplify
4. **Endpoints**: Algunos requieren autenticación (403 es normal)

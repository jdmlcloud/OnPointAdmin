# 🚀 Configuración de AWS Amplify

## 📋 Variables de Entorno Requeridas

Configura estas variables de entorno en la consola de AWS Amplify:

### Variables de Entorno en Amplify Console:

#### Para Producción:
1. **NEXT_PUBLIC_ENVIRONMENT** = `prod`
2. **NEXT_PUBLIC_API_URL** = `https://9o43ckvise.execute-api.us-east-1.amazonaws.com/prod`
3. **NEXT_PUBLIC_CLIENTS_API_URL** = `https://mkrc6lo043.execute-api.us-east-1.amazonaws.com/prod`

#### Para Sandbox:
1. **NEXT_PUBLIC_ENVIRONMENT** = `sandbox`
2. **NEXT_PUBLIC_API_URL** = `https://m4ijnyg5da.execute-api.us-east-1.amazonaws.com/sandbox`
3. **NEXT_PUBLIC_CLIENTS_API_URL** = `https://mkrc6lo043.execute-api.us-east-1.amazonaws.com/sandbox`

## 🔧 Pasos para Configurar:

### 1. Acceder a la Consola de Amplify
- Ve a [AWS Amplify Console](https://console.aws.amazon.com/amplify/)
- Selecciona tu aplicación

### 2. Configurar Variables de Entorno
- Ve a **App settings** → **Environment variables**
- Agrega las variables mencionadas arriba

### 3. Configurar Build Settings
- Ve a **App settings** → **Build settings**
- Asegúrate de que el archivo `amplify.yml` esté configurado correctamente

### 4. Configurar Redirecciones (SPA)
- Ve a **App settings** → **Rewrites and redirects**
- Agrega esta regla:
  ```
  Source address: /<*>
  Target address: /index.html
  Type: 200 (Rewrite)
  ```

## 🌐 URLs de la Aplicación

- **Producción**: `https://production.d3ts6pwgn7uyyh.amplifyapp.com`
- **Sandbox**: `https://sandbox.d3ts6pwgn7uyyh.amplifyapp.com`

## ✅ Verificación

Después de configurar, deberías ver en la consola del navegador:
```
✅ Entorno detectado por variable de entorno: prod
🌐 API Request: https://9o43ckvise.execute-api.us-east-1.amazonaws.com/prod/notifications
```

## 🔄 Despliegue Automático

Amplify se conecta automáticamente con GitHub y despliega cada vez que haces push a la rama `main`.

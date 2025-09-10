// Configuración específica por entorno
export const ENVIRONMENT_CONFIG = {
  local: {
    name: 'Local Development',
    apiUrl: 'https://m4ijnyg5da.execute-api.us-east-1.amazonaws.com/sandbox',
    clientsApiUrl: 'https://mkrc6lo043.execute-api.us-east-1.amazonaws.com/sandbox',
    amplifyUrl: 'http://localhost:3000',
    description: 'Entorno de desarrollo local'
  },
  sandbox: {
    name: 'Sandbox',
    apiUrl: 'https://m4ijnyg5da.execute-api.us-east-1.amazonaws.com/sandbox',
    clientsApiUrl: 'https://mkrc6lo043.execute-api.us-east-1.amazonaws.com/sandbox',
    amplifyUrl: 'https://sandbox.d3ts6pwgn7uyyh.amplifyapp.com',
    description: 'Entorno de pruebas y desarrollo'
  },
  prod: {
    name: 'Production',
    apiUrl: 'https://9o43ckvise.execute-api.us-east-1.amazonaws.com/prod',
    clientsApiUrl: 'https://mkrc6lo043.execute-api.us-east-1.amazonaws.com/prod',
    amplifyUrl: 'https://production.d3ts6pwgn7uyyh.amplifyapp.com',
    description: 'Entorno de producción'
  }
}

// Función para obtener la configuración del entorno actual
export const getEnvironmentConfig = () => {
  const env = process.env.NEXT_PUBLIC_ENVIRONMENT as keyof typeof ENVIRONMENT_CONFIG
  
  if (env && ENVIRONMENT_CONFIG[env]) {
    return ENVIRONMENT_CONFIG[env]
  }
  
  // Fallback a local
  return ENVIRONMENT_CONFIG.local
}

// Función para verificar si estamos en producción
export const isProduction = () => {
  return process.env.NEXT_PUBLIC_ENVIRONMENT === 'prod'
}

// Función para verificar si estamos en sandbox
export const isSandbox = () => {
  return process.env.NEXT_PUBLIC_ENVIRONMENT === 'sandbox'
}

// Función para verificar si estamos en local
export const isLocal = () => {
  return process.env.NEXT_PUBLIC_ENVIRONMENT === 'local' || !process.env.NEXT_PUBLIC_ENVIRONMENT
}

// Configuración de la API Gateway + Lambda
export const API_CONFIG = {
  // URLs base de la API Gateway por entorno
  BASE_URLS: {
    local: 'https://mkrc6lo043.execute-api.us-east-1.amazonaws.com/sandbox', // Local usa sandbox
    sandbox: 'https://mkrc6lo043.execute-api.us-east-1.amazonaws.com/sandbox',
    prod: 'https://9o43ckvise.execute-api.us-east-1.amazonaws.com/prod'
  },
  
  // Endpoints
  ENDPOINTS: {
    PROVIDERS: '/providers',
    USERS: '/users',
    STATS: '/stats',
    TAGS: '/tags',
    PRODUCTS: '/products',
    QUOTATIONS: '/quotations',
    PROPOSALS: '/proposals',
    WHATSAPP: '/whatsapp',
    ANALYTICS: '/analytics',
    REPORTS: '/reports',
    INTEGRATIONS: '/integrations',
    EDITOR: '/editor',
    TRACKING: '/tracking',
    AI_TEST: '/ai-test',
    CLIENTS: '/clients'
  },
  
  // Headers por defecto
  DEFAULT_HEADERS: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
}

// Función para detectar el entorno automáticamente
export const detectEnvironment = (): 'sandbox' | 'prod' | 'local' => {
  // Si estamos en el navegador, detectar por la URL
  if (typeof window !== 'undefined') {
    const hostname = window.location.hostname
    console.log('🔍 Detectando entorno - hostname:', hostname)
    
    // Detectar local específicamente
    if (hostname === 'localhost' || hostname === '127.0.0.1' || hostname.includes('localhost')) {
      console.log('✅ Entorno detectado: local')
      return 'local'
    }
    
    // Detectar sandbox específicamente
    if (hostname.includes('sandbox')) {
      console.log('✅ Entorno detectado: sandbox')
      return 'sandbox'
    }
    
    // Detectar producción específicamente
    if (hostname.includes('main') || hostname === 'd3ts6pwgn7uyyh.amplifyapp.com') {
      console.log('✅ Entorno detectado: prod')
      return 'prod'
    }
  }
  
  // Fallback a variable de entorno o local (NUNCA producción)
  const environment = process.env.NEXT_PUBLIC_ENVIRONMENT || 'local'
  console.log('⚠️ Usando fallback - entorno:', environment)
  
  // Si no es local, sandbox o prod, usar local por defecto
  if (environment !== 'local' && environment !== 'sandbox' && environment !== 'prod') {
    console.log('🚨 Entorno no válido, usando local por seguridad')
    return 'local'
  }
  
  return environment as 'sandbox' | 'prod' | 'local'
}

// Función para obtener la URL base según el entorno
export const getBaseUrl = (): string => {
  const environment = detectEnvironment()
  console.log(`🌍 Entorno detectado: ${environment}`)
  
  // Por seguridad, si no se puede determinar el entorno, usar local
  if (!API_CONFIG.BASE_URLS[environment]) {
    console.log('🚨 Entorno no válido, usando local por seguridad')
    return API_CONFIG.BASE_URLS.local
  }
  
  return API_CONFIG.BASE_URLS[environment]
}

// Función helper para construir URLs completas
export const buildApiUrl = (endpoint: string): string => {
  return `${getBaseUrl()}${endpoint}`
}

// Función helper para hacer requests a la API
export const apiRequest = async <T>(
  endpoint: string, 
  options: RequestInit = {}
): Promise<T> => {
  const url = buildApiUrl(endpoint)
  
  // Debug: mostrar la URL que se está usando
  console.log(`🌐 API Request: ${url}`)
  console.log(`🔍 Endpoint: ${endpoint}`)
  console.log(`🌍 Entorno detectado: ${detectEnvironment()}`)
  
  const config: RequestInit = {
    ...options,
    headers: {
      ...API_CONFIG.DEFAULT_HEADERS,
      ...options.headers
    }
  }
  
  try {
    const response = await fetch(url, config)
    
    if (!response.ok) {
      // Intentar obtener el mensaje de error del response
      let errorMessage = `HTTP error! status: ${response.status}`
      try {
        const errorData = await response.json()
        if (errorData.message) {
          errorMessage = errorData.message
        }
      } catch {
        // Si no se puede parsear el error, usar el mensaje por defecto
      }
      throw new Error(errorMessage)
    }
    
    const data = await response.json()
    return data
  } catch (error) {
    // Mejorar el manejo de errores de red
    if (error instanceof TypeError && error.message.includes('Failed to fetch')) {
      throw new Error('Error de conexión. Verifica tu conexión a internet o contacta al administrador.')
    }
    // Solo mostrar logs en desarrollo
    if (process.env.NODE_ENV === 'development') {
      console.error(`Error en API request a ${endpoint}:`, error)
    }
    throw error
  }
}

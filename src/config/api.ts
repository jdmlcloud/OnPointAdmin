// Configuración de la API Gateway + Lambda
export const API_CONFIG = {
  // URLs base de la API Gateway por entorno
  BASE_URLS: {
    sandbox: 'https://m4ijnyg5da.execute-api.us-east-1.amazonaws.com/sandbox',
    prod: 'https://9o43ckvise.execute-api.us-east-1.amazonaws.com/prod'
  },
  
  // Endpoints
  ENDPOINTS: {
    PROVIDERS: '/providers',
    USERS: '/users',
    STATS: '/stats',
    TAGS: '/tags',
    PRODUCTS: '/products'
  },
  
  // Headers por defecto
  DEFAULT_HEADERS: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
}

// Función para obtener la URL base según el entorno
export const getBaseUrl = (): string => {
  const environment = process.env.NEXT_PUBLIC_ENVIRONMENT || 'prod'
  return API_CONFIG.BASE_URLS[environment as keyof typeof API_CONFIG.BASE_URLS] || API_CONFIG.BASE_URLS.prod
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

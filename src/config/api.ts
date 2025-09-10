// Configuración de la API Gateway + Lambda
export const API_CONFIG = {
  // URLs base de la API Gateway por entorno
  BASE_URLS: {
    local: '', // Local usa endpoints de Next.js
    sandbox: 'https://m4ijnyg5da.execute-api.us-east-1.amazonaws.com/sandbox',
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
    CLIENTS: '/clients',
    // Nuevos endpoints para dashboard
    NOTIFICATIONS: '/stats',
    PRODUCTIVITY: '/productivity',
    SYSTEM_METRICS: '/system/metrics',
    SYSTEM_HEALTH: '/system/health',
    CLOUDWATCH_CPU: '/cloudwatch/cpu-utilization',
    CLOUDWATCH_MEMORY: '/cloudwatch/memory-utilization'
  },
  
  // Headers por defecto
  DEFAULT_HEADERS: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
}

// Función para detectar el entorno automáticamente
export const detectEnvironment = (): 'sandbox' | 'prod' | 'local' => {
  // Primero verificar variable de entorno (prioridad)
  const envVar = process.env.NEXT_PUBLIC_ENVIRONMENT
  if (envVar && ['local', 'sandbox', 'prod'].includes(envVar)) {
    console.log('✅ Entorno detectado por variable de entorno:', envVar)
    return envVar as 'sandbox' | 'prod' | 'local'
  }
  
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
    if (hostname.includes('sandbox') || hostname.includes('sandbox.d3ts6pwgn7uyyh.amplifyapp.com')) {
      console.log('✅ Entorno detectado: sandbox')
      return 'sandbox'
    }
    
    // Detectar producción específicamente (Amplify)
    if (hostname.includes('main') || 
        hostname === 'd3ts6pwgn7uyyh.amplifyapp.com' || 
        hostname.includes('production.d3ts6pwgn7uyyh.amplifyapp.com') ||
        hostname.includes('production')) {
      console.log('✅ Entorno detectado: prod (Amplify)')
      return 'prod'
    }
  }
  
  // Fallback a local por seguridad
  console.log('⚠️ Usando fallback - entorno: local')
  return 'local'
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
  const env = detectEnvironment()
  
  // Para entorno local, usar endpoints de Next.js
  if (env === 'local') {
    return `/api${endpoint}`
  }
  
  // Usar la configuración específica del entorno
  const baseUrl = API_CONFIG.BASE_URLS[env]
  
  // Endpoints especiales que requieren API Gateway específico
  if (endpoint === '/clients') {
    if (env === 'prod') {
      return `https://mkrc6lo043.execute-api.us-east-1.amazonaws.com/prod${endpoint}`
    } else {
      return `https://mkrc6lo043.execute-api.us-east-1.amazonaws.com/sandbox${endpoint}`
    }
  }
  
  return `${baseUrl}${endpoint}`
}

// Función helper para hacer requests a la API
export const apiRequest = async <T>(
  endpoint: string, 
  options: RequestInit = {}
): Promise<T> => {
  const url = buildApiUrl(endpoint)

  // Cache y deduplicación en memoria (solo para GET)
  // TTL ajustado: 5s para navegación fluida entre secciones sin refetchs agresivos
  const CACHE_TTL_MS = 5000
  const method = (options.method || 'GET').toUpperCase()
  const isGet = method === 'GET' && !options.body
  const cacheKey = `${method}:${url}`
  ;(globalThis as any).__apiCache = (globalThis as any).__apiCache || new Map<string, { timestamp: number; data: any }>()
  ;(globalThis as any).__apiInflight = (globalThis as any).__apiInflight || new Map<string, Promise<any>>()
  const requestCache: Map<string, { timestamp: number; data: any }> = (globalThis as any).__apiCache
  const inflight: Map<string, Promise<any>> = (globalThis as any).__apiInflight

  if (process.env.NODE_ENV === 'development' && endpoint !== API_CONFIG.ENDPOINTS.STATS) {
    console.log(`🌐 API Request: ${url}`)
    console.log(`🔍 Endpoint: ${endpoint}`)
    console.log(`🌍 Entorno detectado: ${detectEnvironment()}`)
  }
  
  const config: RequestInit = {
    ...options,
    headers: {
      ...API_CONFIG.DEFAULT_HEADERS,
      ...options.headers
    }
  }
  
  const abortController = new AbortController()
  const signal = abortController.signal

  try {
    // Cache rápido
    if (isGet) {
      const cached = requestCache.get(cacheKey)
      if (cached && Date.now() - cached.timestamp < CACHE_TTL_MS) {
        return cached.data as T
      }
      const pending = inflight.get(cacheKey)
      if (pending) {
        return (await pending) as T
      }
    }

    const fetchPromise = fetch(url, { ...config, signal })
    if (isGet) {
      inflight.set(cacheKey, fetchPromise.then(async (resp) => {
        if (!resp.ok) return Promise.reject(resp)
        const json = await resp.json()
        requestCache.set(cacheKey, { timestamp: Date.now(), data: json })
        return json
      }).finally(() => {
        inflight.delete(cacheKey)
      }))
    }

    const response = await (isGet ? inflight.get(cacheKey)! : fetchPromise)
    
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
    
    if (!isGet) {
      const data = await response.json()
      return data
    }
    return response as T
  } catch (error) {
    if ((error as any).name === 'AbortError') {
      throw new Error('Solicitud cancelada')
    }
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

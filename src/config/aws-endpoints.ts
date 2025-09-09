// Configuración de endpoints de AWS para el dashboard
export const AWS_ENDPOINTS = {
  // CloudWatch Metrics
  CLOUDWATCH: {
    CPU_UTILIZATION: '/cloudwatch/cpu-utilization',
    MEMORY_UTILIZATION: '/cloudwatch/memory-utilization',
    NETWORK_LATENCY: '/cloudwatch/network-latency',
    REQUEST_COUNT: '/cloudwatch/request-count',
    ERROR_RATE: '/cloudwatch/error-rate'
  },
  
  // Notificaciones y Alertas
  NOTIFICATIONS: {
    BASE: '/notifications',
    URGENT: '/notifications/urgent',
    MESSAGES: '/notifications/messages',
    TASKS: '/notifications/tasks',
    PROPOSALS: '/notifications/proposals',
    CLIENTS: '/notifications/clients'
  },
  
  // Métricas de Productividad
  PRODUCTIVITY: {
    BASE: '/productivity',
    TASKS: '/productivity/tasks',
    CONTACTS: '/productivity/contacts',
    METRICS: '/productivity/metrics'
  },
  
  // Health Checks
  HEALTH: {
    BASE: '/health',
    DYNAMODB: '/health/dynamodb',
    S3: '/health/s3',
    LAMBDA: '/health/lambda',
    API_GATEWAY: '/health/api-gateway',
    COGNITO: '/health/cognito'
  },
  
  // Analytics y Reportes
  ANALYTICS: {
    BASE: '/analytics',
    DASHBOARD: '/analytics/dashboard',
    USAGE: '/analytics/usage',
    PERFORMANCE: '/analytics/performance'
  }
}

// Configuración de intervalos de actualización
export const REFRESH_INTERVALS = {
  NOTIFICATIONS: 30000, // 30 segundos
  PRODUCTIVITY: 60000, // 1 minuto
  SYSTEM_METRICS: 30000, // 30 segundos
  HEALTH_CHECKS: 60000 // 1 minuto
}

// Configuración de timeouts
export const TIMEOUTS = {
  DEFAULT: 10000, // 10 segundos
  HEALTH_CHECK: 5000, // 5 segundos
  METRICS: 15000 // 15 segundos
}

// Configuración de reintentos
export const RETRY_CONFIG = {
  MAX_RETRIES: 3,
  RETRY_DELAY: 1000, // 1 segundo
  BACKOFF_MULTIPLIER: 2
}

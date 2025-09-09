const { CloudWatchClient, GetMetricStatisticsCommand } = require('@aws-sdk/client-cloudwatch');

// Configuración de CloudWatch
const cloudwatch = new CloudWatchClient({
  region: process.env.AWS_REGION || 'us-east-1'
});

// Función para generar respuesta CORS
const createResponse = (statusCode, body) => ({
  statusCode,
  headers: {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token',
    'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE,OPTIONS',
    'Access-Control-Max-Age': '86400'
  },
  body: JSON.stringify(body)
});

// GET /system/metrics - Obtener métricas del sistema
exports.getSystemMetrics = async (event) => {
  try {
    console.log('🔍 Lambda: Obteniendo métricas del sistema...');
    
    // Por ahora usar datos mock, después implementar con CloudWatch
    const mockMetrics = {
      cpuUsage: 45,
      memoryUsage: 52,
      storageUsage: 15,
      networkLatency: 245,
      requestsPerMinute: 127,
      errorRate: 0.2,
      uptime: 99.9,
      lastRestart: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
      healthStatus: 'healthy',
      dynamoDbStatus: 'online',
      s3Status: 'online',
      lambdaStatus: 'online',
      apiGatewayStatus: 'online',
      totalRecords: 15420,
      recordsToday: 45,
      recordsThisWeek: 320,
      recordsThisMonth: 1280
    };

    return createResponse(200, {
      success: true,
      metrics: mockMetrics,
      message: 'Métricas del sistema obtenidas exitosamente'
    });
    
  } catch (error) {
    console.error('❌ Error en getSystemMetrics:', error);
    return createResponse(500, {
      success: false,
      error: 'Error al obtener métricas del sistema',
      message: error.message
    });
  }
};

// GET /system/health - Health check del sistema
exports.getSystemHealth = async (event) => {
  try {
    console.log('🔍 Lambda: Verificando salud del sistema...');
    
    // Por ahora usar datos mock, después implementar health checks reales
    const mockHealth = {
      overall: 'healthy',
      services: [
        {
          name: 'DynamoDB',
          status: 'online',
          responseTime: 12,
          lastCheck: new Date().toISOString()
        },
        {
          name: 'S3',
          status: 'online',
          responseTime: 8,
          lastCheck: new Date().toISOString()
        },
        {
          name: 'Lambda',
          status: 'online',
          responseTime: 156,
          lastCheck: new Date().toISOString()
        },
        {
          name: 'API Gateway',
          status: 'online',
          responseTime: 23,
          lastCheck: new Date().toISOString()
        },
        {
          name: 'Cognito',
          status: 'online',
          responseTime: 34,
          lastCheck: new Date().toISOString()
        }
      ],
      lastUpdated: new Date().toISOString()
    };

    return createResponse(200, {
      success: true,
      health: mockHealth,
      message: 'Health check completado exitosamente'
    });
    
  } catch (error) {
    console.error('❌ Error en getSystemHealth:', error);
    return createResponse(500, {
      success: false,
      error: 'Error al verificar salud del sistema',
      message: error.message
    });
  }
};

// GET /cloudwatch/cpu-utilization - Métricas de CPU desde CloudWatch
exports.getCPUMetrics = async (event) => {
  try {
    console.log('🔍 Lambda: Obteniendo métricas de CPU desde CloudWatch...');
    
    // TODO: Implementar con CloudWatch real
    // Por ahora usar datos mock
    const mockCPUMetric = {
      metricName: 'CPUUtilization',
      namespace: 'AWS/EC2',
      value: 45,
      unit: 'Percent',
      timestamp: new Date().toISOString(),
      dimensions: { InstanceId: 'i-1234567890abcdef0' }
    };

    return createResponse(200, {
      success: true,
      metric: mockCPUMetric,
      message: 'Métricas de CPU obtenidas exitosamente'
    });
    
  } catch (error) {
    console.error('❌ Error en getCPUMetrics:', error);
    return createResponse(500, {
      success: false,
      error: 'Error al obtener métricas de CPU',
      message: error.message
    });
  }
};

// GET /cloudwatch/memory-utilization - Métricas de memoria desde CloudWatch
exports.getMemoryMetrics = async (event) => {
  try {
    console.log('🔍 Lambda: Obteniendo métricas de memoria desde CloudWatch...');
    
    // TODO: Implementar con CloudWatch real
    // Por ahora usar datos mock
    const mockMemoryMetric = {
      metricName: 'MemoryUtilization',
      namespace: 'System/Linux',
      value: 52,
      unit: 'Percent',
      timestamp: new Date().toISOString(),
      dimensions: { InstanceId: 'i-1234567890abcdef0' }
    };

    return createResponse(200, {
      success: true,
      metric: mockMemoryMetric,
      message: 'Métricas de memoria obtenidas exitosamente'
    });
    
  } catch (error) {
    console.error('❌ Error en getMemoryMetrics:', error);
    return createResponse(500, {
      success: false,
      error: 'Error al obtener métricas de memoria',
      message: error.message
    });
  }
};

// Handler principal
exports.handler = async (event) => {
  console.log('🔍 Event:', JSON.stringify(event, null, 2));
  
  // Manejar CORS preflight
  if (event.httpMethod === 'OPTIONS') {
    return createResponse(200, { message: 'CORS preflight' });
  }
  
  try {
    const path = event.resource;
    const method = event.httpMethod;
    
    if (method === 'GET' && path === '/system/metrics') {
      return await exports.getSystemMetrics(event);
    } else if (method === 'GET' && path === '/system/health') {
      return await exports.getSystemHealth(event);
    } else if (method === 'GET' && path === '/cloudwatch/cpu-utilization') {
      return await exports.getCPUMetrics(event);
    } else if (method === 'GET' && path === '/cloudwatch/memory-utilization') {
      return await exports.getMemoryMetrics(event);
    } else {
      return createResponse(405, {
        success: false,
        error: 'Método no permitido',
        message: `Método ${method} en ${path} no soportado`
      });
    }
  } catch (error) {
    console.error('❌ Error en handler:', error);
    return createResponse(500, {
      success: false,
      error: 'Error interno del servidor',
      message: error.message
    });
  }
};

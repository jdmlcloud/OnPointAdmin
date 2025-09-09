const { DynamoDBClient } = require('@aws-sdk/client-dynamodb');
const { DynamoDBDocumentClient, ScanCommand } = require('@aws-sdk/lib-dynamodb');
const { LambdaClient, ListFunctionsCommand } = require('@aws-sdk/client-lambda');
const { APIGatewayClient, GetRestApisCommand } = require('@aws-sdk/client-api-gateway');

// Configuración de clientes AWS
const dynamoClient = new DynamoDBClient({
  region: process.env.AWS_REGION || 'us-east-1'
});

const docClient = DynamoDBDocumentClient.from(dynamoClient);
const lambdaClient = new LambdaClient({
  region: process.env.AWS_REGION || 'us-east-1'
});
const apiGatewayClient = new APIGatewayClient({
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

// Health check para DynamoDB
const checkDynamoDB = async () => {
  try {
    const command = new ScanCommand({
      TableName: 'OnPointAdmin-Users-sandbox',
      Limit: 1
    });
    
    await docClient.send(command);
    return { status: 'healthy', message: 'DynamoDB accessible' };
  } catch (error) {
    return { status: 'unhealthy', message: `DynamoDB error: ${error.message}` };
  }
};

// Health check para Lambda
const checkLambda = async () => {
  try {
    const command = new ListFunctionsCommand({
      MaxItems: 1
    });
    
    await lambdaClient.send(command);
    return { status: 'healthy', message: 'Lambda service accessible' };
  } catch (error) {
    return { status: 'unhealthy', message: `Lambda error: ${error.message}` };
  }
};

// Health check para API Gateway
const checkAPIGateway = async () => {
  try {
    const command = new GetRestApisCommand({
      limit: 1
    });
    
    await apiGatewayClient.send(command);
    return { status: 'healthy', message: 'API Gateway accessible' };
  } catch (error) {
    return { status: 'unhealthy', message: `API Gateway error: ${error.message}` };
  }
};

// Health check general del sistema
exports.getSystemHealth = async (event) => {
  try {
    console.log('🔍 Lambda: Verificando salud del sistema...');
    
    const startTime = Date.now();
    
    // Ejecutar todos los health checks en paralelo
    const [dynamoHealth, lambdaHealth, apiHealth] = await Promise.all([
      checkDynamoDB(),
      checkLambda(),
      checkAPIGateway()
    ]);
    
    const endTime = Date.now();
    const responseTime = endTime - startTime;
    
    // Determinar estado general
    const allHealthy = [dynamoHealth, lambdaHealth, apiHealth].every(
      check => check.status === 'healthy'
    );
    
    const overallStatus = allHealthy ? 'healthy' : 'degraded';
    
    const healthData = {
      status: overallStatus,
      timestamp: new Date().toISOString(),
      responseTime: `${responseTime}ms`,
      services: {
        dynamodb: dynamoHealth,
        lambda: lambdaHealth,
        apiGateway: apiHealth
      },
      environment: process.env.STAGE || 'sandbox',
      region: process.env.AWS_REGION || 'us-east-1'
    };
    
    console.log(`✅ Health check completado en ${responseTime}ms - Status: ${overallStatus}`);
    
    return createResponse(200, {
      success: true,
      health: healthData,
      message: 'Health check completado exitosamente'
    });
    
  } catch (error) {
    console.error('❌ Error en health check:', error);
    return createResponse(500, {
      success: false,
      error: 'Error en health check del sistema',
      message: error.message
    });
  }
};

// Health check específico para un servicio
exports.getServiceHealth = async (event) => {
  try {
    const service = event.pathParameters?.service;
    console.log(`🔍 Lambda: Verificando salud del servicio ${service}...`);
    
    let healthResult;
    
    switch (service) {
      case 'dynamodb':
        healthResult = await checkDynamoDB();
        break;
      case 'lambda':
        healthResult = await checkLambda();
        break;
      case 'apigateway':
        healthResult = await checkAPIGateway();
        break;
      default:
        return createResponse(400, {
          success: false,
          error: 'Servicio no soportado',
          message: `Servicio ${service} no es válido. Servicios soportados: dynamodb, lambda, apigateway`
        });
    }
    
    return createResponse(200, {
      success: true,
      service: service,
      health: healthResult,
      timestamp: new Date().toISOString(),
      message: `Health check de ${service} completado`
    });
    
  } catch (error) {
    console.error(`❌ Error en health check de ${service}:`, error);
    return createResponse(500, {
      success: false,
      error: `Error en health check de ${service}`,
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
    
    if (method === 'GET' && path === '/health') {
      return await exports.getSystemHealth(event);
    } else if (method === 'GET' && path === '/health/{service}') {
      return await exports.getServiceHealth(event);
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

const { DynamoDBClient } = require('@aws-sdk/client-dynamodb');
const { DynamoDBDocumentClient, ScanCommand, QueryCommand, PutCommand, UpdateCommand, DeleteCommand } = require('@aws-sdk/lib-dynamodb');

// Configuración de DynamoDB
const client = new DynamoDBClient({
  region: process.env.AWS_REGION || 'us-east-1'
});

const docClient = DynamoDBDocumentClient.from(client);

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

// GET /notifications - Obtener notificaciones
exports.getNotifications = async (event) => {
  try {
    console.log('🔍 Lambda: Obteniendo notificaciones...');
    
    // Por ahora usar datos mock, después implementar con DynamoDB
    const mockNotifications = [
      {
        id: '1',
        type: 'proposal',
        title: 'Propuesta ABC',
        description: 'Vence en 2 horas',
        timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
        status: 'pending',
        priority: 'urgent',
        proposalId: 'prop-123'
      },
      {
        id: '2',
        type: 'proposal',
        title: 'Cotización HBO',
        description: 'Vence mañana',
        timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
        status: 'pending',
        priority: 'high',
        proposalId: 'prop-456'
      },
      {
        id: '3',
        type: 'message',
        title: 'WhatsApp +52 55 1234',
        description: 'Mensaje sin responder',
        timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
        status: 'new',
        priority: 'medium',
        messageId: 'msg-789'
      },
      {
        id: '4',
        type: 'message',
        title: 'Email Netflix',
        description: 'Solicitud de información',
        timestamp: new Date(Date.now() - 60 * 60 * 1000).toISOString(),
        status: 'pending',
        priority: 'medium',
        messageId: 'msg-101'
      },
      {
        id: '5',
        type: 'client',
        title: 'Nuevo cliente registrado',
        description: 'Netflix se registró esta semana',
        timestamp: new Date(Date.now() - 60 * 60 * 1000).toISOString(),
        status: 'new',
        priority: 'low',
        clientId: 'client-123'
      }
    ];

    return createResponse(200, {
      success: true,
      notifications: mockNotifications,
      message: 'Notificaciones obtenidas exitosamente'
    });
    
  } catch (error) {
    console.error('❌ Error en getNotifications:', error);
    return createResponse(500, {
      success: false,
      error: 'Error al obtener notificaciones',
      message: error.message
    });
  }
};

// GET /notifications/stats - Obtener estadísticas de notificaciones
exports.getNotificationStats = async (event) => {
  try {
    console.log('🔍 Lambda: Obteniendo estadísticas de notificaciones...');
    
    // Por ahora usar datos mock, después implementar con DynamoDB
    const mockStats = {
      urgent: 2,
      messages: 2,
      tasks: 0,
      proposals: 2,
      clients: 1
    };

    return createResponse(200, {
      success: true,
      stats: mockStats,
      message: 'Estadísticas de notificaciones obtenidas exitosamente'
    });
    
  } catch (error) {
    console.error('❌ Error en getNotificationStats:', error);
    return createResponse(500, {
      success: false,
      error: 'Error al obtener estadísticas de notificaciones',
      message: error.message
    });
  }
};

// PUT /notifications/:id/read - Marcar notificación como leída
exports.markAsRead = async (event) => {
  try {
    const notificationId = event.pathParameters?.id;
    console.log(`🔍 Lambda: Marcando notificación ${notificationId} como leída...`);
    
    // TODO: Implementar con DynamoDB
    // Por ahora solo retornar éxito
    
    return createResponse(200, {
      success: true,
      message: `Notificación ${notificationId} marcada como leída`
    });
    
  } catch (error) {
    console.error('❌ Error en markAsRead:', error);
    return createResponse(500, {
      success: false,
      error: 'Error al marcar notificación como leída',
      message: error.message
    });
  }
};

// DELETE /notifications/:id - Eliminar notificación
exports.deleteNotification = async (event) => {
  try {
    const notificationId = event.pathParameters?.id;
    console.log(`🔍 Lambda: Eliminando notificación ${notificationId}...`);
    
    // TODO: Implementar con DynamoDB
    // Por ahora solo retornar éxito
    
    return createResponse(200, {
      success: true,
      message: `Notificación ${notificationId} eliminada`
    });
    
  } catch (error) {
    console.error('❌ Error en deleteNotification:', error);
    return createResponse(500, {
      success: false,
      error: 'Error al eliminar notificación',
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
    
    if (method === 'GET' && path === '/notifications') {
      return await exports.getNotifications(event);
    } else if (method === 'GET' && path === '/notifications/stats') {
      return await exports.getNotificationStats(event);
    } else if (method === 'PUT' && path === '/notifications/{id}/read') {
      return await exports.markAsRead(event);
    } else if (method === 'DELETE' && path === '/notifications/{id}') {
      return await exports.deleteNotification(event);
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

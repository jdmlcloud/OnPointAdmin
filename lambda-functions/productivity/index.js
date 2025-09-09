const { DynamoDBClient } = require('@aws-sdk/client-dynamodb');
const { DynamoDBDocumentClient, ScanCommand, QueryCommand, PutCommand, UpdateCommand } = require('@aws-sdk/lib-dynamodb');

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

// GET /productivity/metrics - Obtener métricas de productividad
exports.getProductivityMetrics = async (event) => {
  try {
    console.log('🔍 Lambda: Obteniendo métricas de productividad...');
    
    // Por ahora usar datos mock, después implementar con DynamoDB
    const mockMetrics = {
      tasksCompletedToday: 5,
      clientsContactedThisWeek: 8,
      proposalsSentThisMonth: 12,
      tasksCompletedThisWeek: 23,
      clientsContactedThisMonth: 45,
      proposalsSentThisYear: 156,
      averageResponseTime: 45, // minutos
      completionRate: 87 // porcentaje
    };

    return createResponse(200, {
      success: true,
      metrics: mockMetrics,
      message: 'Métricas de productividad obtenidas exitosamente'
    });
    
  } catch (error) {
    console.error('❌ Error en getProductivityMetrics:', error);
    return createResponse(500, {
      success: false,
      error: 'Error al obtener métricas de productividad',
      message: error.message
    });
  }
};

// GET /productivity/tasks - Obtener tareas recientes
exports.getRecentTasks = async (event) => {
  try {
    console.log('🔍 Lambda: Obteniendo tareas recientes...');
    
    // Por ahora usar datos mock, después implementar con DynamoDB
    const mockTasks = [
      {
        id: '1',
        title: 'Actualizar catálogo de productos',
        description: 'Revisar y actualizar precios del catálogo',
        status: 'completed',
        priority: 'medium',
        assignedTo: 'user-123',
        dueDate: new Date().toISOString(),
        completedAt: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
        createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString()
      },
      {
        id: '2',
        title: 'Revisar propuesta HBO',
        description: 'Analizar propuesta para cliente HBO',
        status: 'in_progress',
        priority: 'high',
        assignedTo: 'user-123',
        dueDate: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
        createdAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString()
      },
      {
        id: '3',
        title: 'Contactar cliente Netflix',
        description: 'Seguimiento de propuesta enviada',
        status: 'pending',
        priority: 'medium',
        assignedTo: 'user-123',
        dueDate: new Date(Date.now() + 48 * 60 * 60 * 1000).toISOString(),
        createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString()
      }
    ];

    return createResponse(200, {
      success: true,
      tasks: mockTasks,
      message: 'Tareas recientes obtenidas exitosamente'
    });
    
  } catch (error) {
    console.error('❌ Error en getRecentTasks:', error);
    return createResponse(500, {
      success: false,
      error: 'Error al obtener tareas recientes',
      message: error.message
    });
  }
};

// GET /productivity/contacts - Obtener contactos recientes
exports.getRecentContacts = async (event) => {
  try {
    console.log('🔍 Lambda: Obteniendo contactos recientes...');
    
    // Por ahora usar datos mock, después implementar con DynamoDB
    const mockContacts = [
      {
        id: '1',
        clientId: 'client-123',
        clientName: 'Netflix',
        contactType: 'email',
        subject: 'Solicitud de información',
        status: 'delivered',
        timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString()
      },
      {
        id: '2',
        clientId: 'client-456',
        clientName: 'HBO',
        contactType: 'whatsapp',
        subject: 'Cotización pendiente',
        status: 'read',
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString()
      },
      {
        id: '3',
        clientId: 'client-789',
        clientName: 'Disney',
        contactType: 'phone',
        subject: 'Llamada de seguimiento',
        status: 'replied',
        timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString()
      }
    ];

    return createResponse(200, {
      success: true,
      contacts: mockContacts,
      message: 'Contactos recientes obtenidos exitosamente'
    });
    
  } catch (error) {
    console.error('❌ Error en getRecentContacts:', error);
    return createResponse(500, {
      success: false,
      error: 'Error al obtener contactos recientes',
      message: error.message
    });
  }
};

// POST /productivity/tasks - Crear nueva tarea
exports.createTask = async (event) => {
  try {
    console.log('🔍 Lambda: Creando nueva tarea...');
    
    const body = JSON.parse(event.body || '{}');
    const task = {
      id: `task-${Date.now()}`,
      ...body,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    // TODO: Implementar con DynamoDB
    // Por ahora solo retornar la tarea creada
    
    return createResponse(201, {
      success: true,
      task,
      message: 'Tarea creada exitosamente'
    });
    
  } catch (error) {
    console.error('❌ Error en createTask:', error);
    return createResponse(500, {
      success: false,
      error: 'Error al crear tarea',
      message: error.message
    });
  }
};

// PUT /productivity/tasks/:id/complete - Completar tarea
exports.completeTask = async (event) => {
  try {
    const taskId = event.pathParameters?.id;
    console.log(`🔍 Lambda: Completando tarea ${taskId}...`);
    
    // TODO: Implementar con DynamoDB
    // Por ahora solo retornar éxito
    
    return createResponse(200, {
      success: true,
      message: `Tarea ${taskId} completada exitosamente`
    });
    
  } catch (error) {
    console.error('❌ Error en completeTask:', error);
    return createResponse(500, {
      success: false,
      error: 'Error al completar tarea',
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
    
    if (method === 'GET' && path === '/productivity/metrics') {
      return await exports.getProductivityMetrics(event);
    } else if (method === 'GET' && path === '/productivity/tasks') {
      return await exports.getRecentTasks(event);
    } else if (method === 'GET' && path === '/productivity/contacts') {
      return await exports.getRecentContacts(event);
    } else if (method === 'POST' && path === '/productivity/tasks') {
      return await exports.createTask(event);
    } else if (method === 'PUT' && path === '/productivity/tasks/{id}/complete') {
      return await exports.completeTask(event);
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

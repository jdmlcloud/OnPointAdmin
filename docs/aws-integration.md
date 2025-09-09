# Integración con AWS - Dashboard

## 📋 Resumen

El dashboard está preparado para conectar con servicios reales de AWS. Actualmente usa datos mock para desarrollo, pero la arquitectura está lista para datos reales.

## 🔧 Hooks Implementados

### 1. `useNotifications` - Notificaciones y Alertas
```typescript
// Ubicación: src/hooks/use-notifications.ts
const { notifications, stats, loading, error } = useNotifications()
```

**Funcionalidades:**
- Propuestas pendientes
- Clientes nuevos
- Mensajes WhatsApp sin responder
- Tareas pendientes
- Estadísticas en tiempo real

**Endpoints AWS necesarios:**
- `GET /notifications` - Lista de notificaciones
- `GET /notifications/stats` - Estadísticas de notificaciones
- `PUT /notifications/:id/read` - Marcar como leído
- `DELETE /notifications/:id` - Eliminar notificación

### 2. `useProductivity` - Métricas de Productividad
```typescript
// Ubicación: src/hooks/use-productivity.ts
const { metrics, recentTasks, recentContacts, loading } = useProductivity()
```

**Funcionalidades:**
- Tareas completadas hoy/semana
- Clientes contactados
- Propuestas enviadas
- Tiempo promedio de respuesta
- Tasa de finalización

**Endpoints AWS necesarios:**
- `GET /productivity/metrics` - Métricas de productividad
- `GET /productivity/tasks` - Lista de tareas
- `GET /productivity/contacts` - Contactos recientes
- `POST /productivity/tasks` - Crear tarea
- `PUT /productivity/tasks/:id/complete` - Completar tarea

### 3. `useSystemMetrics` - Métricas del Sistema
```typescript
// Ubicación: src/hooks/use-system-metrics.ts
const { metrics, services, loading } = useSystemMetrics()
```

**Funcionalidades:**
- Uso de CPU, memoria, almacenamiento
- Latencia de red
- Requests por minuto
- Tasa de errores
- Uptime del sistema

**Endpoints AWS necesarios:**
- `GET /cloudwatch/cpu-utilization` - Uso de CPU
- `GET /cloudwatch/memory-utilization` - Uso de memoria
- `GET /cloudwatch/network-latency` - Latencia de red
- `GET /cloudwatch/request-count` - Requests por minuto
- `GET /cloudwatch/error-rate` - Tasa de errores

### 4. `useCloudWatchMetrics` - CloudWatch Integration
```typescript
// Ubicación: src/hooks/use-cloudwatch-metrics.ts
const { metrics, loading, error } = useCloudWatchMetrics()
```

**Funcionalidades:**
- Integración directa con CloudWatch
- Métricas en tiempo real
- Actualización automática cada 30 segundos

### 5. `useAWSHealth` - Health Checks
```typescript
// Ubicación: src/hooks/use-aws-health.ts
const { healthStatus, loading, isServiceHealthy } = useAWSHealth()
```

**Funcionalidades:**
- Health checks de servicios AWS
- Estado general del sistema
- Tiempo de respuesta de servicios
- Detección de problemas

## 🏗️ Arquitectura AWS Necesaria

### 1. Lambda Functions
```yaml
# services/dashboard-metrics/serverless.yml
functions:
  getNotifications:
    handler: handlers/notifications.get
    events:
      - http:
          path: /notifications
          method: get
          cors: true
  
  getProductivityMetrics:
    handler: handlers/productivity.getMetrics
    events:
      - http:
          path: /productivity/metrics
          method: get
          cors: true
  
  getSystemMetrics:
    handler: handlers/system.getMetrics
    events:
      - http:
          path: /system/metrics
          method: get
          cors: true
```

### 2. DynamoDB Tables
```yaml
# Tablas necesarias
Resources:
  NotificationsTable:
    Type: AWS::DynamoDB::Table
    Properties:
      TableName: ${self:service}-notifications-${self:provider:stage}
      AttributeDefinitions:
        - AttributeName: id
          AttributeType: S
        - AttributeName: userId
          AttributeType: S
        - AttributeName: createdAt
          AttributeType: S
      KeySchema:
        - AttributeName: id
          KeyType: HASH
      GlobalSecondaryIndexes:
        - IndexName: UserCreatedIndex
          KeySchema:
            - AttributeName: userId
              KeyType: HASH
            - AttributeName: createdAt
              KeyType: RANGE
          Projection:
            ProjectionType: ALL

  ProductivityTable:
    Type: AWS::DynamoDB::Table
    Properties:
      TableName: ${self:service}-productivity-${self:provider:stage}
      AttributeDefinitions:
        - AttributeName: id
          AttributeType: S
        - AttributeName: userId
          AttributeType: S
        - AttributeName: date
          AttributeType: S
      KeySchema:
        - AttributeName: id
          KeyType: HASH
      GlobalSecondaryIndexes:
        - IndexName: UserDateIndex
          KeySchema:
            - AttributeName: userId
              KeyType: HASH
            - AttributeName: date
              KeyType: RANGE
          Projection:
            ProjectionType: ALL
```

### 3. CloudWatch Integration
```typescript
// services/dashboard-metrics/handlers/cloudwatch.ts
import { CloudWatchClient, GetMetricStatisticsCommand } from '@aws-sdk/client-cloudwatch'

const cloudwatch = new CloudWatchClient({ region: 'us-east-1' })

export const getCPUMetrics = async () => {
  const command = new GetMetricStatisticsCommand({
    Namespace: 'AWS/EC2',
    MetricName: 'CPUUtilization',
    Dimensions: [
      {
        Name: 'InstanceId',
        Value: process.env.INSTANCE_ID
      }
    ],
    StartTime: new Date(Date.now() - 3600000), // 1 hora atrás
    EndTime: new Date(),
    Period: 300, // 5 minutos
    Statistics: ['Average']
  })

  const response = await cloudwatch.send(command)
  return response.Datapoints
}
```

## 🔄 Flujo de Datos

### 1. Notificaciones
```
Frontend → API Gateway → Lambda → DynamoDB
                ↓
         CloudWatch (logs)
```

### 2. Métricas del Sistema
```
Frontend → API Gateway → Lambda → CloudWatch
                ↓
         DynamoDB (cache)
```

### 3. Health Checks
```
Frontend → API Gateway → Lambda → AWS Services
                ↓
         CloudWatch (monitoring)
```

## 📊 Configuración de Actualización

### Intervalos de Actualización
```typescript
// src/config/aws-endpoints.ts
export const REFRESH_INTERVALS = {
  NOTIFICATIONS: 30000,    // 30 segundos
  PRODUCTIVITY: 60000,     // 1 minuto
  SYSTEM_METRICS: 30000,   // 30 segundos
  HEALTH_CHECKS: 60000     // 1 minuto
}
```

### Timeouts y Reintentos
```typescript
export const TIMEOUTS = {
  DEFAULT: 10000,      // 10 segundos
  HEALTH_CHECK: 5000,  // 5 segundos
  METRICS: 15000       // 15 segundos
}

export const RETRY_CONFIG = {
  MAX_RETRIES: 3,
  RETRY_DELAY: 1000,   // 1 segundo
  BACKOFF_MULTIPLIER: 2
}
```

## 🚀 Próximos Pasos

### 1. Implementar Lambda Functions
- [ ] Crear handlers para notificaciones
- [ ] Implementar métricas de productividad
- [ ] Conectar con CloudWatch
- [ ] Configurar health checks

### 2. Configurar DynamoDB
- [ ] Crear tablas necesarias
- [ ] Configurar índices globales
- [ ] Implementar TTL para datos temporales

### 3. Configurar CloudWatch
- [ ] Crear dashboards personalizados
- [ ] Configurar alarmas
- [ ] Implementar métricas personalizadas

### 4. Testing
- [ ] Pruebas unitarias para hooks
- [ ] Pruebas de integración con AWS
- [ ] Pruebas de rendimiento

## 🔍 Debugging

### Logs del Frontend
```typescript
// Los hooks incluyen logging automático
console.log('🔍 Debug DynamoDB Config:')
console.log('🌐 API Request:', url)
console.log('🌍 Entorno detectado:', environment)
```

### Logs de AWS
- CloudWatch Logs para Lambda functions
- X-Ray para tracing distribuido
- CloudWatch Metrics para monitoreo

## 📈 Monitoreo

### Métricas Clave
- Tiempo de respuesta de API
- Tasa de errores
- Uso de recursos
- Disponibilidad de servicios

### Alertas
- Servicios caídos
- Alto uso de CPU/memoria
- Errores de API
- Latencia alta

---

**Estado Actual:** ✅ Arquitectura preparada, datos mock funcionales
**Siguiente Paso:** 🚀 Implementar Lambda functions y conectar con AWS real

import { useState, useEffect } from 'react'
import { apiRequest } from '@/config/api'
import { AWS_ENDPOINTS, REFRESH_INTERVALS } from '@/config/aws-endpoints'

export interface ServiceHealth {
  serviceName: string
  status: 'healthy' | 'degraded' | 'unhealthy'
  responseTime: number
  lastCheck: string
  errorMessage?: string
  details?: {
    region: string
    endpoint: string
    version?: string
  }
}

export interface AWSHealthStatus {
  overall: 'healthy' | 'degraded' | 'unhealthy'
  services: ServiceHealth[]
  lastUpdated: string
}

export const useAWSHealth = () => {
  const [healthStatus, setHealthStatus] = useState<AWSHealthStatus>({
    overall: 'healthy',
    services: [],
    lastUpdated: new Date().toISOString()
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const checkServiceHealth = async (serviceName: string): Promise<ServiceHealth> => {
    try {
      // TODO: Implementar health check real para cada servicio
      const mockHealth: ServiceHealth = {
        serviceName,
        status: 'healthy',
        responseTime: Math.floor(Math.random() * 100) + 10,
        lastCheck: new Date().toISOString(),
        details: {
          region: 'us-east-1',
          endpoint: `https://${serviceName}.amazonaws.com`
        }
      }

      return mockHealth
    } catch (err) {
      return {
        serviceName,
        status: 'unhealthy',
        responseTime: 0,
        lastCheck: new Date().toISOString(),
        errorMessage: err instanceof Error ? err.message : 'Error desconocido'
      }
    }
  }

  const checkAllServices = async () => {
    try {
      setLoading(true)
      setError(null)

      const services = ['DynamoDB', 'S3', 'Lambda', 'API Gateway', 'Cognito']
      const healthChecks = await Promise.all(
        services.map(service => checkServiceHealth(service))
      )

      const overallStatus = healthChecks.every(s => s.status === 'healthy') 
        ? 'healthy' 
        : healthChecks.some(s => s.status === 'unhealthy') 
          ? 'unhealthy' 
          : 'degraded'

      setHealthStatus({
        overall: overallStatus,
        services: healthChecks,
        lastUpdated: new Date().toISOString()
      })

    } catch (err) {
      console.error('Error checking AWS health:', err)
      setError(err instanceof Error ? err.message : 'Error desconocido')
    } finally {
      setLoading(false)
    }
  }

  const getServiceStatus = (serviceName: string): ServiceHealth | undefined => {
    return healthStatus.services.find(s => s.serviceName === serviceName)
  }

  const isServiceHealthy = (serviceName: string): boolean => {
    const service = getServiceStatus(serviceName)
    return service?.status === 'healthy' || false
  }

  // Actualizar health checks automáticamente
  useEffect(() => {
    checkAllServices()
    
    const interval = setInterval(() => {
      checkAllServices()
    }, REFRESH_INTERVALS.HEALTH_CHECKS)
    
    return () => clearInterval(interval)
  }, [])

  return {
    healthStatus,
    loading,
    error,
    checkAllServices,
    checkServiceHealth,
    getServiceStatus,
    isServiceHealthy
  }
}

import { useState, useEffect } from 'react'
import { apiRequest } from '@/config/api'
import { AWS_ENDPOINTS, REFRESH_INTERVALS } from '@/config/aws-endpoints'

export interface CloudWatchMetric {
  metricName: string
  namespace: string
  value: number
  unit: string
  timestamp: string
  dimensions: Record<string, string>
}

export interface CloudWatchMetrics {
  cpuUtilization: CloudWatchMetric
  memoryUtilization: CloudWatchMetric
  networkLatency: CloudWatchMetric
  requestCount: CloudWatchMetric
  errorRate: CloudWatchMetric
}

export const useCloudWatchMetrics = () => {
  const [metrics, setMetrics] = useState<CloudWatchMetrics | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchCloudWatchMetrics = async () => {
    try {
      setLoading(true)
      setError(null)
      
      // Por ahora usar datos mock, después conectar con CloudWatch real
      const mockMetrics: CloudWatchMetrics = {
        cpuUtilization: {
          metricName: 'CPUUtilization',
          namespace: 'AWS/EC2',
          value: 45,
          unit: 'Percent',
          timestamp: new Date().toISOString(),
          dimensions: { InstanceId: 'i-1234567890abcdef0' }
        },
        memoryUtilization: {
          metricName: 'MemoryUtilization',
          namespace: 'System/Linux',
          value: 52,
          unit: 'Percent',
          timestamp: new Date().toISOString(),
          dimensions: { InstanceId: 'i-1234567890abcdef0' }
        },
        networkLatency: {
          metricName: 'NetworkLatency',
          namespace: 'AWS/ApplicationELB',
          value: 245,
          unit: 'Milliseconds',
          timestamp: new Date().toISOString(),
          dimensions: { LoadBalancer: 'app/my-load-balancer/50dc6c495c0c9188' }
        },
        requestCount: {
          metricName: 'RequestCount',
          namespace: 'AWS/ApplicationELB',
          value: 127,
          unit: 'Count',
          timestamp: new Date().toISOString(),
          dimensions: { LoadBalancer: 'app/my-load-balancer/50dc6c495c0c9188' }
        },
        errorRate: {
          metricName: 'HTTPCode_Target_5XX_Count',
          namespace: 'AWS/ApplicationELB',
          value: 0.2,
          unit: 'Percent',
          timestamp: new Date().toISOString(),
          dimensions: { LoadBalancer: 'app/my-load-balancer/50dc6c495c0c9188' }
        }
      }

      setMetrics(mockMetrics)
      
    } catch (err) {
      console.error('Error fetching CloudWatch metrics:', err)
      setError(err instanceof Error ? err.message : 'Error desconocido')
    } finally {
      setLoading(false)
    }
  }

  const fetchSpecificMetric = async (metricName: string) => {
    try {
      // TODO: Implementar llamada real a CloudWatch
      const endpoint = AWS_ENDPOINTS.CLOUDWATCH[metricName as keyof typeof AWS_ENDPOINTS.CLOUDWATCH]
      if (endpoint) {
        const data = await apiRequest<CloudWatchMetric>(endpoint)
        return data
      }
    } catch (err) {
      console.error(`Error fetching ${metricName}:`, err)
      throw err
    }
  }

  // Actualizar métricas automáticamente
  useEffect(() => {
    fetchCloudWatchMetrics()
    
    const interval = setInterval(() => {
      fetchCloudWatchMetrics()
    }, REFRESH_INTERVALS.SYSTEM_METRICS)
    
    return () => clearInterval(interval)
  }, [])

  return {
    metrics,
    loading,
    error,
    fetchCloudWatchMetrics,
    fetchSpecificMetric
  }
}

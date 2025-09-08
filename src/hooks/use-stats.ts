"use client"

import { useState, useEffect } from 'react'
import { apiRequest, API_CONFIG } from '@/config/api'

interface Stats {
  users: {
    total: number
    active: number
    inactive: number
    pending: number
  }
  products: {
    total: number
    active: number
    inactive: number
  }
  providers: {
    total: number
    active: number
    inactive: number
    pending: number
  }
  overview: {
    totalUsers: number
    totalProviders: number
    totalProducts: number
    totalActiveUsers: number
    totalActiveProviders: number
    totalActiveProducts: number
  }
}

interface UseStatsReturn {
  stats: Stats | null
  loading: boolean
  error: string | null
  refreshStats: () => Promise<void>
}

export function useStats(): UseStatsReturn {
  const [stats, setStats] = useState<Stats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchStats = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const data = await apiRequest<{
        success: boolean
        stats: Stats
        message: string
      }>(API_CONFIG.ENDPOINTS.STATS)
      
      if (data.success) {
        setStats(data.stats)
      } else {
        throw new Error('Error al obtener estadísticas desde la API')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido')
      console.error('Error fetching stats:', err)
    } finally {
      setLoading(false)
    }
  }

  const refreshStats = async () => {
    await fetchStats()
  }

  useEffect(() => {
    fetchStats()
  }, [])

  return {
    stats,
    loading,
    error,
    refreshStats
  }
}

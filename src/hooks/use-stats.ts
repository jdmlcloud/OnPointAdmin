"use client"

import { useState, useEffect } from 'react'

interface Stats {
  users: {
    totalUsers: number
    activeUsers: number
    pendingUsers: number
    inactiveUsers: number
  }
  products: {
    totalProducts: number
    activeProducts: number
    lowStockProducts: number
    totalCategories: number
  }
  providers: {
    totalProviders: number
    activeProviders: number
    pendingProviders: number
    inactiveProviders: number
  }
  summary: {
    totalUsers: number
    totalProducts: number
    totalProviders: number
    activeUsers: number
    activeProducts: number
    activeProviders: number
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
      
      const response = await fetch('/api/stats')
      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`)
      }
      
      const data = await response.json()
      setStats(data.stats)
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

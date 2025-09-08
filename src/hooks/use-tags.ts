"use client"

import { useState, useEffect } from 'react'
import { apiRequest, API_CONFIG } from '@/config/api'

export function useTags() {
  const [tags, setTags] = useState<string[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchTags = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const data = await apiRequest<{
        success: boolean
        tags: string[]
        message: string
      }>(API_CONFIG.ENDPOINTS.TAGS)
      
      if (data.success) {
        setTags(data.tags || [])
      } else {
        throw new Error('Error al obtener tags desde la API')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido')
      console.error('Error fetching tags:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchTags()
  }, [])

  const refreshTags = async () => {
    await fetchTags()
  }

  return {
    tags,
    loading,
    error,
    refreshTags
  }
}

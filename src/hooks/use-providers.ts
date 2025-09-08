"use client"

import { useState, useEffect } from 'react'
import { Provider } from '@/lib/db/repositories/dynamodb-provider-repository'
import { apiRequest, API_CONFIG } from '@/config/api'

interface UseProvidersReturn {
  providers: Provider[]
  loading: boolean
  error: string | null
  createProvider: (providerData: Omit<Provider, 'id' | 'createdAt' | 'updatedAt'>) => Promise<Provider | null>
  updateProvider: (id: string, providerData: Partial<Provider>) => Promise<Provider | null>
  deleteProvider: (id: string) => Promise<boolean>
  refreshProviders: () => Promise<void>
}

export function useProviders(): UseProvidersReturn {
  const [providers, setProviders] = useState<Provider[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchProviders = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const data = await apiRequest<{
        success: boolean
        providers: Provider[]
        pagination: any
        message: string
      }>(API_CONFIG.ENDPOINTS.PROVIDERS)
      
      if (data.success) {
        setProviders(data.providers || [])
      } else {
        throw new Error('Error al obtener proveedores desde la API')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido')
      console.error('Error fetching providers:', err)
    } finally {
      setLoading(false)
    }
  }

  const createProvider = async (providerData: Omit<Provider, 'id' | 'createdAt' | 'updatedAt'>): Promise<Provider | null> => {
    try {
      setError(null)
      
      const data = await apiRequest<{
        success: boolean
        provider: Provider
        message: string
      }>(API_CONFIG.ENDPOINTS.PROVIDERS, {
        method: 'POST',
        body: JSON.stringify(providerData),
      })
      
      if (data.success) {
        setProviders(prev => [...prev, data.provider])
        return data.provider
      } else {
        throw new Error('Error al crear proveedor')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al crear proveedor')
      console.error('Error creating provider:', err)
      return null
    }
  }

  const updateProvider = async (id: string, providerData: Partial<Provider>): Promise<Provider | null> => {
    try {
      setError(null)
      
      const data = await apiRequest<{
        success: boolean
        provider: Provider
        message: string
      }>(`${API_CONFIG.ENDPOINTS.PROVIDERS}/${id}`, {
        method: 'PUT',
        body: JSON.stringify(providerData),
      })
      
      if (data.success) {
        setProviders(prev => prev.map(provider => provider.id === id ? data.provider : provider))
        return data.provider
      } else {
        throw new Error('Error al actualizar proveedor')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al actualizar proveedor')
      console.error('Error updating provider:', err)
      return null
    }
  }

  const deleteProvider = async (id: string): Promise<boolean> => {
    try {
      setError(null)
      
      const data = await apiRequest<{
        success: boolean
        message: string
      }>(`${API_CONFIG.ENDPOINTS.PROVIDERS}/${id}`, {
        method: 'DELETE',
      })
      
      if (data.success) {
        // Actualizar el estado local inmediatamente
        setProviders(prev => prev.filter(provider => provider.id !== id))
        // También refrescar desde la BD para asegurar consistencia
        setTimeout(() => {
          fetchProviders()
        }, 500)
        return true
      } else {
        throw new Error('Error al eliminar proveedor')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al eliminar proveedor')
      console.error('Error deleting provider:', err)
      return false
    }
  }

  const refreshProviders = async () => {
    await fetchProviders()
  }

  useEffect(() => {
    fetchProviders()
  }, [])

  return {
    providers,
    loading,
    error,
    createProvider,
    updateProvider,
    deleteProvider,
    refreshProviders
  }
}

"use client"

import { useState, useEffect } from 'react'
import { Provider } from '@/lib/db/repositories/dynamodb-provider-repository'

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
      
      const response = await fetch('/api/providers')
      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`)
      }
      
      const data = await response.json()
      setProviders(data.providers || [])
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
      
      const response = await fetch('/api/providers', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(providerData),
      })
      
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || `Error ${response.status}`)
      }
      
      const newProvider = await response.json()
      setProviders(prev => [...prev, newProvider])
      return newProvider
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al crear proveedor')
      console.error('Error creating provider:', err)
      return null
    }
  }

  const updateProvider = async (id: string, providerData: Partial<Provider>): Promise<Provider | null> => {
    try {
      setError(null)
      
      const response = await fetch(`/api/providers/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(providerData),
      })
      
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || `Error ${response.status}`)
      }
      
      const data = await response.json()
      const updatedProvider = data.provider
      setProviders(prev => prev.map(provider => provider.id === id ? updatedProvider : provider))
      return updatedProvider
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al actualizar proveedor')
      console.error('Error updating provider:', err)
      return null
    }
  }

  const deleteProvider = async (id: string): Promise<boolean> => {
    try {
      setError(null)
      
      const response = await fetch(`/api/providers/${id}`, {
        method: 'DELETE',
      })
      
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || `Error ${response.status}`)
      }
      
      setProviders(prev => prev.filter(provider => provider.id !== id))
      return true
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

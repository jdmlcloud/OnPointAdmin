import { useState, useEffect } from 'react'
import { apiRequest, API_CONFIG } from '@/config/api'

interface Client {
  id: string
  name: string
  description?: string
  industry?: string
  contactEmail?: string
  logos: any[]
  primaryLogoId?: string
  createdAt: string
  updatedAt?: string
}

interface UseClientsReturn {
  clients: Client[]
  isLoading: boolean
  error: string | null
  refreshClients: () => Promise<void>
  createClient: (clientData: Omit<Client, 'id' | 'createdAt' | 'logos'>) => Promise<boolean>
  updateClient: (id: string, clientData: Partial<Omit<Client, 'id' | 'createdAt' | 'logos'>>) => Promise<boolean>
  deleteClient: (id: string) => Promise<boolean>
}

export function useClients(): UseClientsReturn {
  const [clients, setClients] = useState<Client[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchClients = async () => {
    try {
      setIsLoading(true)
      setError(null)
      
      console.log('🔍 FETCHING CLIENTS: Iniciando consulta a', API_CONFIG.ENDPOINTS.CLIENTS)
      const data = await apiRequest<{
        success: boolean
        clients: Client[]
        pagination: any
        message: string
      }>(API_CONFIG.ENDPOINTS.CLIENTS)
      
      console.log('📡 CLIENTS API RESPONSE:', {
        success: data.success,
        clientsCount: data.clients?.length || 0,
        clients: data.clients,
        message: data.message
      })
      
      if (data.success) {
        console.log('✅ CLIENTS SET:', data.clients || [])
        setClients(data.clients || [])
        setError(null)
      } else {
        throw new Error('Error al obtener clientes desde la API')
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido'
      setError(errorMessage)
      console.error('Error fetching clients:', err)
    } finally {
      setIsLoading(false)
    }
  }

  const createClient = async (clientData: Omit<Client, 'id' | 'createdAt' | 'logos'>): Promise<boolean> => {
    try {
      setError(null)
      
      const data = await apiRequest<{
        success: boolean
        client: Client
        message: string
      }>(API_CONFIG.ENDPOINTS.CLIENTS, {
        method: 'POST',
        body: JSON.stringify(clientData),
      })
      
      if (data.success) {
        setClients(prev => [...prev, data.client])
        return true
      } else {
        throw new Error('Error al crear cliente')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al crear cliente')
      console.error('Error creating client:', err)
      return false
    }
  }

  const updateClient = async (id: string, clientData: Partial<Omit<Client, 'id' | 'createdAt' | 'logos'>>): Promise<boolean> => {
    try {
      setError(null)
      
      const data = await apiRequest<{
        success: boolean
        client: Client
        message: string
      }>(`${API_CONFIG.ENDPOINTS.CLIENTS}/${id}`, {
        method: 'PUT',
        body: JSON.stringify(clientData),
      })
      
      if (data.success) {
        setClients(prev => prev.map(client => client.id === id ? data.client : client))
        return true
      } else {
        throw new Error('Error al actualizar cliente')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al actualizar cliente')
      console.error('Error updating client:', err)
      return false
    }
  }

  const deleteClient = async (id: string): Promise<boolean> => {
    try {
      setError(null)
      
      const data = await apiRequest<{
        success: boolean
        message: string
      }>(`${API_CONFIG.ENDPOINTS.CLIENTS}/${id}`, {
        method: 'DELETE',
      })
      
      if (data.success) {
        setClients(prev => prev.filter(client => client.id !== id))
        return true
      } else {
        throw new Error('Error al eliminar cliente')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al eliminar cliente')
      console.error('Error deleting client:', err)
      return false
    }
  }

  const refreshClients = async () => {
    await fetchClients()
  }

  useEffect(() => {
    fetchClients()
  }, [])

  return {
    clients,
    isLoading,
    error,
    refreshClients,
    createClient,
    updateClient,
    deleteClient,
  }
}
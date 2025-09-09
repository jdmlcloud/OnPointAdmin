import { useState, useEffect } from 'react'

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
      
      // Obtener clientes de la API
      const response = await fetch('/api/clients')
      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.message || 'Error al obtener clientes')
      }
      
      // Los clientes vienen directamente de la API
      setClients(data.clients || [])
    } catch (err) {
      console.error('Error fetching clients:', err)
      setError(err instanceof Error ? err.message : 'Error desconocido')
    } finally {
      setIsLoading(false)
    }
  }

  const createClient = async (clientData: Omit<Client, 'id' | 'createdAt' | 'logos'>): Promise<boolean> => {
    try {
      // Enviar a la API
      const response = await fetch('/api/clients', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(clientData)
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Error al crear cliente')
      }

      // Refrescar la lista para que aparezca en la UI
      await fetchClients()
      
      return true
    } catch (err) {
      console.error('Error creating client:', err)
      setError(err instanceof Error ? err.message : 'Error al crear cliente')
      return false
    }
  }

  const updateClient = async (id: string, clientData: Partial<Omit<Client, 'id' | 'createdAt' | 'logos'>>): Promise<boolean> => {
    try {
      // Enviar a la API
      const response = await fetch(`/api/clients/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(clientData)
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Error al actualizar cliente')
      }

      // Refrescar la lista
      await fetchClients()
      
      return true
    } catch (err) {
      console.error('Error updating client:', err)
      setError(err instanceof Error ? err.message : 'Error al actualizar cliente')
      return false
    }
  }

  const deleteClient = async (id: string): Promise<boolean> => {
    try {
      // Enviar a la API
      const response = await fetch(`/api/clients/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        }
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Error al eliminar cliente')
      }

      // Refrescar la lista
      await fetchClients()
      
      return true
    } catch (err) {
      console.error('Error deleting client:', err)
      setError(err instanceof Error ? err.message : 'Error al eliminar cliente')
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

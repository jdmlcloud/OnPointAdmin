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
      
      // Por ahora, generamos clientes basados en los logos existentes
      // En el futuro, esto vendrá de una API dedicada de clientes
      const response = await fetch('/api/logos')
      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.message || 'Error al obtener logos')
      }
      
      // Agrupar logos por cliente
      const logosByClient = data.logos.reduce((acc: any, logo: any) => {
        if (!acc[logo.clientId]) {
          acc[logo.clientId] = {
            id: logo.clientId,
            name: logo.clientName,
            description: `Cliente con logos de ${logo.brand || logo.clientName}`,
            industry: 'Entertainment',
            contactEmail: `${logo.clientName.toLowerCase().replace(/\s+/g, '')}@example.com`,
            logos: [],
            primaryLogoId: null,
            createdAt: logo.createdAt,
            updatedAt: logo.updatedAt
          }
        }
        acc[logo.clientId].logos.push(logo)
        return acc
      }, {})

      // Encontrar el logo principal de cada cliente
      Object.values(logosByClient).forEach((client: any) => {
        const primaryLogo = client.logos.find((logo: any) => logo.isPrimary)
        if (primaryLogo) {
          client.primaryLogoId = primaryLogo.id
        }
      })

      setClients(Object.values(logosByClient))
    } catch (err) {
      console.error('Error fetching clients:', err)
      setError(err instanceof Error ? err.message : 'Error desconocido')
    } finally {
      setIsLoading(false)
    }
  }

  const createClient = async (clientData: Omit<Client, 'id' | 'createdAt' | 'logos'>): Promise<boolean> => {
    try {
      // Por ahora, simulamos la creación de cliente
      // En el futuro, esto se conectará con una API real de clientes
      const newClient: Client = {
        ...clientData,
        id: `client-${Date.now()}`,
        createdAt: new Date().toISOString(),
        logos: []
      }
      
      setClients(prev => [...prev, newClient])
      return true
    } catch (err) {
      console.error('Error creating client:', err)
      setError(err instanceof Error ? err.message : 'Error al crear cliente')
      return false
    }
  }

  const updateClient = async (id: string, clientData: Partial<Omit<Client, 'id' | 'createdAt' | 'logos'>>): Promise<boolean> => {
    try {
      // Por ahora, simulamos la actualización de cliente
      setClients(prev => prev.map(client => 
        client.id === id 
          ? { ...client, ...clientData, updatedAt: new Date().toISOString() }
          : client
      ))
      return true
    } catch (err) {
      console.error('Error updating client:', err)
      setError(err instanceof Error ? err.message : 'Error al actualizar cliente')
      return false
    }
  }

  const deleteClient = async (id: string): Promise<boolean> => {
    try {
      // Por ahora, simulamos la eliminación de cliente
      setClients(prev => prev.filter(client => client.id !== id))
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

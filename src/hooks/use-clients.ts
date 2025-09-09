import { useState, useEffect } from 'react'
import { useLogos } from './use-logos'

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
  const { logos, isLoading: logosLoading } = useLogos()
  const [clients, setClients] = useState<Client[]>([])
  const [manualClients, setManualClients] = useState<Client[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchClients = async () => {
    try {
      setIsLoading(true)
      setError(null)
      
      // Generar clientes desde logos
      const logosByClient = logos.reduce((acc: any, logo: any) => {
        const clientKey = logo.brand || 'Sin Marca'
        if (!acc[clientKey]) {
          acc[clientKey] = {
            id: clientKey.toLowerCase().replace(/\s+/g, '-'),
            name: clientKey,
            description: `Cliente con logos de ${clientKey}`,
            industry: 'Entertainment',
            contactEmail: `${clientKey.toLowerCase().replace(/\s+/g, '')}@example.com`,
            logos: [],
            primaryLogoId: null,
            createdAt: logo.createdAt,
            updatedAt: logo.updatedAt
          }
        }
        acc[clientKey].logos.push(logo)
        return acc
      }, {})

      // Encontrar el logo principal de cada cliente
      Object.values(logosByClient).forEach((client: any) => {
        const primaryLogo = client.logos.find((logo: any) => logo.isPrimary)
        if (primaryLogo) {
          client.primaryLogoId = primaryLogo.id
        }
      })

      // Combinar clientes generados desde logos con clientes manuales
      const logoClients = Object.values(logosByClient)
      const allClients = [...logoClients, ...manualClients]
      
      // Eliminar duplicados basándose en el nombre del cliente
      const uniqueClients = allClients.reduce((acc, client) => {
        const existingClient = acc.find(c => c.name === client.name)
        if (existingClient) {
          // Si ya existe, combinar logos
          existingClient.logos = [...existingClient.logos, ...client.logos]
          existingClient.primaryLogoId = existingClient.logos.find(logo => logo.isPrimary)?.id || null
        } else {
          acc.push(client)
        }
        return acc
      }, [] as Client[])
      
      setClients(uniqueClients)
      setError(null)
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
      
      // Crear nuevo cliente
      const newClient: Client = {
        ...clientData,
        id: `client-${Date.now()}`,
        createdAt: new Date().toISOString(),
        logos: []
      }
      
      // Agregar a clientes manuales
      setManualClients(prev => [...prev, newClient])
      
      // Refrescar la lista para que aparezca inmediatamente
      await fetchClients()
      
      return true
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al crear cliente')
      console.error('Error creating client:', err)
      return false
    }
  }

  const updateClient = async (id: string, clientData: Partial<Omit<Client, 'id' | 'createdAt' | 'logos'>>): Promise<boolean> => {
    try {
      setError(null)
      
      // Actualizar en clientes manuales
      setManualClients(prev => prev.map(client => 
        client.id === id 
          ? { ...client, ...clientData, updatedAt: new Date().toISOString() }
          : client
      ))
      
      // Refrescar la lista
      await fetchClients()
      
      return true
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al actualizar cliente')
      console.error('Error updating client:', err)
      return false
    }
  }

  const deleteClient = async (id: string): Promise<boolean> => {
    try {
      setError(null)
      
      // Eliminar de clientes manuales
      setManualClients(prev => prev.filter(client => client.id !== id))
      
      // Refrescar la lista
      await fetchClients()
      
      return true
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
  }, [logos])

  useEffect(() => {
    if (!logosLoading) {
      fetchClients()
    }
  }, [logosLoading])

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

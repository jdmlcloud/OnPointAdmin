import { useState, useEffect } from 'react'

interface Logo {
  id: string
  name: string
  description?: string
  category: string
  fileType: string
  fileSize: number
  fileUrl: string
  thumbnailUrl?: string
  tags?: string[]
  status: string
  createdAt: string
  updatedAt?: string
  brand?: string
  version?: string
  colorVariants?: Array<{
    name: string
    hex: string
    fileUrl: string
  }>
  usageRights?: string[]
  dimensions?: {
    width: number
    height: number
  }
  dpi?: number
  format?: string
  isVector?: boolean
  isTransparent?: boolean
  lastUsed?: string
  downloadCount?: number
}

interface UseLogosReturn {
  logos: Logo[]
  isLoading: boolean
  error: string | null
  refreshLogos: () => Promise<void>
  createLogo: (logoData: Omit<Logo, 'id' | 'createdAt'>) => Promise<boolean>
  updateLogo: (id: string, logoData: Partial<Logo>) => Promise<boolean>
  deleteLogo: (id: string) => Promise<boolean>
}

export function useLogos(): UseLogosReturn {
  const [logos, setLogos] = useState<Logo[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchLogos = async () => {
    try {
      setIsLoading(true)
      setError(null)
      
      const response = await fetch('/api/logos')
      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.message || 'Error al obtener logos')
      }
      
      setLogos(data.logos || [])
    } catch (err) {
      console.error('Error fetching logos:', err)
      setError(err instanceof Error ? err.message : 'Error desconocido')
    } finally {
      setIsLoading(false)
    }
  }

  const createLogo = async (logoData: Omit<Logo, 'id' | 'createdAt'>): Promise<boolean> => {
    try {
      const response = await fetch('/api/logos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(logoData),
      })
      
      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.message || 'Error al crear logo')
      }
      
      await fetchLogos() // Refrescar la lista
      return true
    } catch (err) {
      console.error('Error creating logo:', err)
      setError(err instanceof Error ? err.message : 'Error al crear logo')
      return false
    }
  }

  const updateLogo = async (id: string, logoData: Partial<Logo>): Promise<boolean> => {
    try {
      const response = await fetch(`/api/logos/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(logoData),
      })
      
      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.message || 'Error al actualizar logo')
      }
      
      await fetchLogos() // Refrescar la lista
      return true
    } catch (err) {
      console.error('Error updating logo:', err)
      setError(err instanceof Error ? err.message : 'Error al actualizar logo')
      return false
    }
  }

  const deleteLogo = async (id: string): Promise<boolean> => {
    try {
      const response = await fetch(`/api/logos/${id}`, {
        method: 'DELETE',
      })
      
      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.message || 'Error al eliminar logo')
      }
      
      await fetchLogos() // Refrescar la lista
      return true
    } catch (err) {
      console.error('Error deleting logo:', err)
      setError(err instanceof Error ? err.message : 'Error al eliminar logo')
      return false
    }
  }

  const refreshLogos = async () => {
    await fetchLogos()
  }

  useEffect(() => {
    fetchLogos()
  }, [])

  return {
    logos,
    isLoading,
    error,
    refreshLogos,
    createLogo,
    updateLogo,
    deleteLogo,
  }
}

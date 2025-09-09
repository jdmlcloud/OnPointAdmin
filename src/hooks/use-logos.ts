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
  // Campos específicos para logos de clientes
  clientId: string
  clientName: string
  variant?: string // e.g., "Oficial", "Horizontal", "Vertical", "Monocromo"
  isPrimary: boolean // Si es el logo principal del cliente
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

interface Client {
  id: string
  name: string
  description?: string
  industry?: string
  contactEmail?: string
  logos: Logo[]
  primaryLogoId?: string
  createdAt: string
  updatedAt?: string
}

interface UseLogosReturn {
  logos: Logo[]
  isLoading: boolean
  error: string | null
  refreshLogos: () => Promise<void>
  createLogo: (logoData: Omit<Logo, 'id' | 'createdAt' | 'downloadCount' | 'fileUrl'>, file: File) => Promise<boolean>
  updateLogo: (id: string, logoData: Partial<Omit<Logo, 'id' | 'createdAt' | 'downloadCount' | 'fileUrl'>>, file?: File) => Promise<boolean>
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

  const createLogo = async (logoData: Omit<Logo, 'id' | 'createdAt' | 'downloadCount' | 'fileUrl'>, file: File): Promise<boolean> => {
    try {
      // Convert file to base64 for transmission
      const arrayBuffer = await file.arrayBuffer()
      const buffer = Buffer.from(arrayBuffer)
      const base64File = buffer.toString('base64')
      
      // Prepare logo data with file information
      const logoPayload = {
        ...logoData,
        fileType: file.name.split('.').pop()?.toUpperCase() || 'UNKNOWN',
        fileSize: file.size,
        fileUrl: `https://onpoint-logos-sandbox.s3.amazonaws.com/logos/${Date.now()}-${file.name}`,
        thumbnailUrl: `https://onpoint-logos-sandbox.s3.amazonaws.com/logos/${Date.now()}-${file.name.replace(/\.[^/.]+$/, '')}-thumb.png`,
        dimensions: { width: 0, height: 0 }, // Will be set by Lambda
        dpi: 300,
        format: file.name.split('.').pop()?.toUpperCase() || 'PNG',
        isVector: file.name.toLowerCase().endsWith('.svg') || file.name.toLowerCase().endsWith('.ai'),
        isTransparent: file.name.toLowerCase().endsWith('.png') || file.name.toLowerCase().endsWith('.svg'),
        colorVariants: [],
        usageRights: [],
        lastUsed: null,
        downloadCount: 0,
        fileContent: base64File, // Include base64 content for Lambda
        fileName: file.name,
        fileContentType: file.type
      }

      const response = await fetch('/api/logos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(logoPayload),
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

  const updateLogo = async (id: string, logoData: Partial<Omit<Logo, 'id' | 'createdAt' | 'downloadCount' | 'fileUrl'>>, file?: File): Promise<boolean> => {
    try {
      const formData = new FormData()
      if (file) {
        formData.append('file', file)
      }
      formData.append('data', JSON.stringify(logoData))

      const response = await fetch(`/api/logos/${id}`, {
        method: 'PUT',
        body: formData,
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

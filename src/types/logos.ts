// Tipos para el sistema de logos

export interface Logo {
  id: string
  name: string
  description: string
  category: string
  clientId: string
  clientName: string
  variant: string
  brand: string
  version: string
  tags: string[]
  status: LogoStatus
  isPrimary: boolean
  fileUrl: string
  fileType: string
  fileSize: number
  downloadCount: number
  createdAt: string
  updatedAt: string
  createdBy: string
  metadata?: Record<string, any>
}

export type LogoStatus = 'active' | 'inactive' | 'draft' | 'archived'

export interface CreateLogoRequest {
  name: string
  description: string
  category: string
  clientId: string
  clientName: string
  variant: string
  brand: string
  version: string
  tags?: string[]
  status?: LogoStatus
  isPrimary?: boolean
  fileUrl?: string
  fileType?: string
  fileSize?: number
  metadata?: Record<string, any>
}

export interface UpdateLogoRequest {
  id: string
  name?: string
  description?: string
  category?: string
  clientId?: string
  clientName?: string
  variant?: string
  brand?: string
  version?: string
  tags?: string[]
  status?: LogoStatus
  isPrimary?: boolean
  fileUrl?: string
  fileType?: string
  fileSize?: number
  metadata?: Record<string, any>
}

export interface LogoResponse {
  logos: Logo[]
  totalCount: number
  hasMore: boolean
}

export interface LogoFilters {
  category?: string
  status?: LogoStatus
  clientId?: string
  tags?: string[]
  search?: string
  isPrimary?: boolean
  createdBy?: string
  startDate?: string
  endDate?: string
}

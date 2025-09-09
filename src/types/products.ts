// Tipos para el sistema de productos

export interface Product {
  id: string
  name: string
  description: string
  category: string
  price: number
  currency: string
  status: ProductStatus
  tags: string[]
  createdAt: string
  updatedAt: string
  createdBy: string
  imageUrl?: string
  fileUrl?: string
  fileType?: string
  fileSize?: number
  downloadCount: number
  metadata?: Record<string, any>
}

export type ProductStatus = 'active' | 'inactive' | 'draft' | 'archived'

export interface CreateProductRequest {
  name: string
  description: string
  category: string
  price: number
  currency?: string
  status?: ProductStatus
  tags?: string[]
  imageUrl?: string
  fileUrl?: string
  fileType?: string
  fileSize?: number
  metadata?: Record<string, any>
}

export interface UpdateProductRequest {
  id: string
  name?: string
  description?: string
  category?: string
  price?: number
  currency?: string
  status?: ProductStatus
  tags?: string[]
  imageUrl?: string
  fileUrl?: string
  fileType?: string
  fileSize?: number
  metadata?: Record<string, any>
}

export interface ProductResponse {
  products: Product[]
  totalCount: number
  hasMore: boolean
}

export interface ProductFilters {
  category?: string
  status?: ProductStatus
  tags?: string[]
  search?: string
  minPrice?: number
  maxPrice?: number
  createdBy?: string
  startDate?: string
  endDate?: string
}

import { useState, useEffect } from 'react'

interface Product {
  id: string
  name: string
  description?: string
  category: string
  providerName?: string
  price: number
  currency?: string
  stock?: number
  images?: string[]
  status: string
  createdAt: string
}

interface UseProductsReturn {
  products: Product[]
  isLoading: boolean
  error: string | null
  refreshProducts: () => Promise<void>
  createProduct: (productData: Omit<Product, 'id' | 'createdAt'>) => Promise<boolean>
  updateProduct: (id: string, productData: Partial<Product>) => Promise<boolean>
  deleteProduct: (id: string) => Promise<boolean>
}

export function useProducts(): UseProductsReturn {
  const [products, setProducts] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchProducts = async () => {
    try {
      setIsLoading(true)
      setError(null)
      
      const response = await fetch('/api/products')
      
      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`)
      }
      
      const data = await response.json()
      
      if (data.success) {
        setProducts(data.products || [])
      } else {
        throw new Error(data.message || 'Error al obtener productos')
      }
    } catch (err) {
      console.error('Error fetching products:', err)
      setError(err instanceof Error ? err.message : 'Error desconocido')
      setProducts([])
    } finally {
      setIsLoading(false)
    }
  }

  const createProduct = async (productData: Omit<Product, 'id' | 'createdAt'>): Promise<boolean> => {
    try {
      setError(null)
      
      const response = await fetch('/api/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(productData),
      })
      
      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`)
      }
      
      const data = await response.json()
      
      if (data.success) {
        await fetchProducts() // Recargar la lista
        return true
      } else {
        throw new Error(data.message || 'Error al crear producto')
      }
    } catch (err) {
      console.error('Error creating product:', err)
      setError(err instanceof Error ? err.message : 'Error desconocido')
      return false
    }
  }

  const updateProduct = async (id: string, productData: Partial<Product>): Promise<boolean> => {
    try {
      setError(null)
      
      const response = await fetch(`/api/products/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(productData),
      })
      
      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`)
      }
      
      const data = await response.json()
      
      if (data.success) {
        await fetchProducts() // Recargar la lista
        return true
      } else {
        throw new Error(data.message || 'Error al actualizar producto')
      }
    } catch (err) {
      console.error('Error updating product:', err)
      setError(err instanceof Error ? err.message : 'Error desconocido')
      return false
    }
  }

  const deleteProduct = async (id: string): Promise<boolean> => {
    try {
      setError(null)
      
      const response = await fetch(`/api/products/${id}`, {
        method: 'DELETE',
      })
      
      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`)
      }
      
      const data = await response.json()
      
      if (data.success) {
        await fetchProducts() // Recargar la lista
        return true
      } else {
        throw new Error(data.message || 'Error al eliminar producto')
      }
    } catch (err) {
      console.error('Error deleting product:', err)
      setError(err instanceof Error ? err.message : 'Error desconocido')
      return false
    }
  }

  const refreshProducts = async () => {
    await fetchProducts()
  }

  useEffect(() => {
    fetchProducts()
  }, [])

  return {
    products,
    isLoading,
    error,
    refreshProducts,
    createProduct,
    updateProduct,
    deleteProduct,
  }
}

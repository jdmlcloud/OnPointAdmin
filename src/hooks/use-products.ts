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
      const data = await response.json()
      
      if (data.success) {
        setProducts(data.products || [])
      } else {
        throw new Error(data.message || 'Error al obtener productos')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido')
      console.error('Error fetching products:', err)
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
      
      const data = await response.json()
      
      if (data.success) {
        setProducts(prev => [...prev, data.product])
        return true
      } else {
        throw new Error(data.message || 'Error al crear producto')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al crear producto')
      console.error('Error creating product:', err)
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
      
      const data = await response.json()
      
      if (data.success) {
        setProducts(prev => prev.map(product => product.id === id ? data.product : product))
        return true
      } else {
        throw new Error(data.message || 'Error al actualizar producto')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al actualizar producto')
      console.error('Error updating product:', err)
      return false
    }
  }

  const deleteProduct = async (id: string): Promise<boolean> => {
    try {
      setError(null)
      
      const response = await fetch(`/api/products/${id}`, {
        method: 'DELETE',
      })
      
      const data = await response.json()
      
      if (data.success) {
        setProducts(prev => prev.filter(product => product.id !== id))
        return true
      } else {
        throw new Error(data.message || 'Error al eliminar producto')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al eliminar producto')
      console.error('Error deleting product:', err)
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

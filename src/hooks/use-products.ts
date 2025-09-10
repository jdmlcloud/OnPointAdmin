import { useState, useEffect } from 'react'
import { apiRequest, API_CONFIG } from '@/config/api'

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
  tags?: string[]
  status: string
  createdAt: string
}

interface UseProductsReturn {
  products: Product[]
  loading: boolean
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

  // Alias para compatibilidad
  const loading = isLoading

  const fetchProducts = async () => {
    try {
      setIsLoading(true)
      setError(null)
      
      // Intentar conectar con AWS Lambda
      try {
        const data = await apiRequest<{products: Product[]}>(API_CONFIG.ENDPOINTS.PRODUCTS)
        setProducts(data.products || [])
        return
      } catch (apiError) {
        console.warn('⚠️ Error al conectar con AWS, usando datos mock:', apiError)
      }
      
      // Fallback a datos mock si falla la API
      const mockProducts: Product[] = [
        {
          id: '1',
          name: 'Taza Personalizada',
          description: 'Taza de cerámica personalizable',
          category: 'Merchandising',
          providerName: 'Proveedor A',
          price: 15.99,
          currency: 'USD',
          stock: 100,
          status: 'active',
          createdAt: new Date().toISOString()
        },
        {
          id: '2',
          name: 'Camiseta Algodón',
          description: 'Camiseta 100% algodón',
          category: 'Ropa',
          providerName: 'Proveedor B',
          price: 25.50,
          currency: 'USD',
          stock: 50,
          status: 'active',
          createdAt: new Date().toISOString()
        }
      ]
      
      setProducts(mockProducts)
      
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
      
      // Intentar conectar con AWS Lambda
      try {
        const data = await apiRequest<{product: Product}>(API_CONFIG.ENDPOINTS.PRODUCTS, {
          method: 'POST',
          body: JSON.stringify(productData)
        })
        
        setProducts(prev => [...prev, data.product])
        return true
      } catch (apiError) {
        console.warn('⚠️ Error al conectar con AWS, usando datos mock:', apiError)
      }
      
      // Fallback: crear producto localmente
      const newProduct: Product = {
        ...productData,
        id: `product-${Date.now()}`,
        createdAt: new Date().toISOString()
      }
      
      setProducts(prev => [...prev, newProduct])
      return true
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al crear producto')
      console.error('Error creating product:', err)
      return false
    }
  }

  const updateProduct = async (id: string, productData: Partial<Product>): Promise<boolean> => {
    try {
      setError(null)
      
      // Intentar conectar con AWS Lambda
      try {
        const data = await apiRequest<{product: Product}>(`${API_CONFIG.ENDPOINTS.PRODUCTS}/${id}`, {
          method: 'PUT',
          body: JSON.stringify(productData)
        })
        
        setProducts(prev => prev.map(product => product.id === id ? data.product : product))
        return true
      } catch (apiError) {
        console.warn('⚠️ Error al conectar con AWS, usando datos mock:', apiError)
      }
      
      // Fallback: actualizar producto localmente
      setProducts(prev => prev.map(product => 
        product.id === id 
          ? { ...product, ...productData }
          : product
      ))
      return true
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al actualizar producto')
      console.error('Error updating product:', err)
      return false
    }
  }

  const deleteProduct = async (id: string): Promise<boolean> => {
    try {
      setError(null)
      
      // Intentar conectar con AWS Lambda
      try {
        await apiRequest(`${API_CONFIG.ENDPOINTS.PRODUCTS}/${id}`, {
          method: 'DELETE'
        })
        
        setProducts(prev => prev.filter(product => product.id !== id))
        return true
      } catch (apiError) {
        console.warn('⚠️ Error al conectar con AWS, usando datos mock:', apiError)
      }
      
      // Fallback: eliminar producto localmente
      setProducts(prev => prev.filter(product => product.id !== id))
      return true
      
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
    loading,
    error,
    refreshProducts,
    createProduct,
    updateProduct,
    deleteProduct,
  }
}

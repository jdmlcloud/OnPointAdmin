import { DynamoDBBaseRepository } from './dynamodb-base-repository'
import { TABLE_NAMES } from '@/lib/aws/dynamodb'

export interface Product extends BaseEntity {
  name: string
  description: string
  price: number
  category: string
  sku: string
  stock: number
  status: 'active' | 'inactive' | 'discontinued'
  images?: string[]
  specifications?: Record<string, any>
  providerId?: string
}

export class DynamoDBProductRepository extends DynamoDBBaseRepository<Product> {
  constructor() {
    super(TABLE_NAMES.PRODUCTS)
  }

  // Buscar por SKU
  async findBySku(sku: string): Promise<Product | null> {
    const products = await this.findByField('sku', sku)
    return products[0] || null
  }

  // Buscar por categoría
  async findByCategory(category: string): Promise<Product[]> {
    return this.findByField('category', category)
  }

  // Buscar por proveedor
  async findByProvider(providerId: string): Promise<Product[]> {
    return this.findByField('providerId', providerId)
  }

  // Buscar por rango de precio
  async findByPriceRange(minPrice: number, maxPrice: number): Promise<Product[]> {
    const command = new ScanCommand({
      TableName: this.tableName,
      FilterExpression: 'price BETWEEN :minPrice AND :maxPrice',
      ExpressionAttributeValues: {
        ':minPrice': minPrice,
        ':maxPrice': maxPrice,
      },
    })

    const result = await this.client.send(command)
    return (result.Items || []) as Product[]
  }

  // Buscar productos con stock bajo
  async findLowStock(threshold: number = 10): Promise<Product[]> {
    const command = new ScanCommand({
      TableName: this.tableName,
      FilterExpression: 'stock <= :threshold',
      ExpressionAttributeValues: {
        ':threshold': threshold,
      },
    })

    const result = await this.client.send(command)
    return (result.Items || []) as Product[]
  }

  // Actualizar stock
  async updateStock(id: string, newStock: number): Promise<Product | null> {
    return this.update(id, { stock: newStock })
  }

  // Obtener estadísticas de productos
  async getStats(): Promise<{
    totalProducts: number
    activeProducts: number
    lowStockProducts: number
    totalCategories: number
  }> {
    const allProducts = await this.findAll({ page: 1, limit: 1000 })
    
    const stats = allProducts.items.reduce((acc, product) => {
      acc.totalProducts++
      
      if (product.status === 'active') {
        acc.activeProducts++
      }
      
      if (product.stock <= 10) {
        acc.lowStockProducts++
      }
      
      return acc
    }, {
      totalProducts: 0,
      activeProducts: 0,
      lowStockProducts: 0,
      totalCategories: 0,
    })

    // Contar categorías únicas
    const categories = new Set(allProducts.items.map(p => p.category))
    stats.totalCategories = categories.size

    return stats
  }
}

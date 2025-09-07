import { BaseRepository } from './base'
import { Provider, CreateProvider, UpdateProvider } from '../models'
import { TABLES } from '../dynamodb'

export class ProviderRepository extends BaseRepository<Provider> {
  protected tableName = TABLES.PROVIDERS
  protected entityType = 'PROVIDER'

  // Crear proveedor
  async createProvider(providerData: CreateProvider): Promise<Provider> {
    return this.create(providerData as any)
  }

  // Obtener proveedores por categoría
  async getByCategory(category: string): Promise<Provider[]> {
    return this.search({ category })
  }

  // Obtener proveedores activos
  async getActiveProviders(): Promise<Provider[]> {
    return this.search({ status: 'active' })
  }

  // Buscar proveedores por nombre
  async searchByName(name: string): Promise<Provider[]> {
    const allProviders = await this.listAll(1000)
    return allProviders.items.filter(provider => 
      provider.name.toLowerCase().includes(name.toLowerCase())
    )
  }

  // Obtener proveedores con mejor rating
  async getTopRatedProviders(limit: number = 10): Promise<Provider[]> {
    const allProviders = await this.listAll(1000)
    return allProviders.items
      .filter(provider => provider.status === 'active')
      .sort((a, b) => b.rating - a.rating)
      .slice(0, limit)
  }

  // Actualizar rating del proveedor
  async updateRating(id: string, rating: number): Promise<Provider | null> {
    return this.update(id, { rating })
  }

  // Obtener estadísticas de proveedores
  async getProviderStats(): Promise<{
    total: number
    active: number
    inactive: number
    byCategory: Record<string, number>
    averageRating: number
  }> {
    const allProviders = await this.listAll(1000)
    
    const stats = {
      total: allProviders.items.length,
      active: 0,
      inactive: 0,
      byCategory: {} as Record<string, number>,
      averageRating: 0,
    }

    let totalRating = 0
    let ratedProviders = 0

    allProviders.items.forEach(provider => {
      // Contar por estado
      if (provider.status === 'active') stats.active++
      else if (provider.status === 'inactive') stats.inactive++

      // Contar por categoría
      if (provider.category) {
        stats.byCategory[provider.category] = (stats.byCategory[provider.category] || 0) + 1
      }

      // Calcular rating promedio
      if (provider.rating > 0) {
        totalRating += provider.rating
        ratedProviders++
      }
    })

    stats.averageRating = ratedProviders > 0 ? totalRating / ratedProviders : 0

    return stats
  }
}

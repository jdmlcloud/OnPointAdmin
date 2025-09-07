import { DynamoDBBaseRepository } from './dynamodb-base-repository'
import { TABLE_NAMES } from '@/lib/aws/dynamodb'

export interface Provider extends BaseEntity {
  name: string
  email: string
  company: string
  phone: string
  address: string
  status: 'active' | 'inactive' | 'pending'
  contactPerson?: string
  website?: string
  notes?: string
}

export class DynamoDBProviderRepository extends DynamoDBBaseRepository<Provider> {
  constructor() {
    super(TABLE_NAMES.PROVIDERS)
  }

  // Buscar por email
  async findByEmail(email: string): Promise<Provider | null> {
    const providers = await this.findByField('email', email)
    return providers[0] || null
  }

  // Buscar por compañía
  async findByCompany(company: string): Promise<Provider[]> {
    return this.findByField('company', company)
  }

  // Buscar por estado
  async findByStatus(status: Provider['status']): Promise<Provider[]> {
    return this.findByField('status', status)
  }

  // Obtener estadísticas de proveedores
  async getStats(): Promise<{
    totalProviders: number
    activeProviders: number
    pendingProviders: number
    inactiveProviders: number
  }> {
    const allProviders = await this.findAll({ page: 1, limit: 1000 })
    
    const stats = allProviders.items.reduce((acc, provider) => {
      acc.totalProviders++
      
      switch (provider.status) {
        case 'active':
          acc.activeProviders++
          break
        case 'pending':
          acc.pendingProviders++
          break
        case 'inactive':
          acc.inactiveProviders++
          break
      }
      
      return acc
    }, {
      totalProviders: 0,
      activeProviders: 0,
      pendingProviders: 0,
      inactiveProviders: 0,
    })

    return stats
  }

  // Activar/desactivar proveedor
  async updateStatus(id: string, status: Provider['status']): Promise<Provider | null> {
    return this.update(id, { status })
  }
}

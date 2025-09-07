import { DynamoDBBaseRepository, BaseEntity } from './dynamodb-base-repository'
import { TABLE_NAMES } from '@/lib/aws/dynamodb'

export interface User extends BaseEntity {
  name: string
  email: string
  role: 'admin' | 'user' | 'manager'
  status: 'active' | 'inactive' | 'pending'
  lastLogin?: string
  avatar?: string
}

export class DynamoDBUserRepository extends DynamoDBBaseRepository<User> {
  constructor() {
    super(TABLE_NAMES.USERS)
  }

  // Buscar por email
  async findByEmail(email: string): Promise<User | null> {
    const users = await this.findByField('email', email)
    return users[0] || null
  }

  // Buscar por rol
  async findByRole(role: User['role']): Promise<User[]> {
    return this.findByField('role', role)
  }

  // Buscar por estado
  async findByStatus(status: User['status']): Promise<User[]> {
    return this.findByField('status', status)
  }

  // Obtener estadísticas de usuarios
  async getStats(): Promise<{
    totalUsers: number
    activeUsers: number
    pendingUsers: number
    inactiveUsers: number
  }> {
    const allUsers = await this.findAll({ page: 1, limit: 1000 }) // Obtener todos
    
    const stats = allUsers.items.reduce((acc, user) => {
      acc.totalUsers++
      
      switch (user.status) {
        case 'active':
          acc.activeUsers++
          break
        case 'pending':
          acc.pendingUsers++
          break
        case 'inactive':
          acc.inactiveUsers++
          break
      }
      
      return acc
    }, {
      totalUsers: 0,
      activeUsers: 0,
      pendingUsers: 0,
      inactiveUsers: 0,
    })

    return stats
  }

  // Actualizar último login
  async updateLastLogin(id: string): Promise<User | null> {
    return this.update(id, {
      lastLogin: new Date().toISOString(),
    })
  }

  // Activar/desactivar usuario
  async updateStatus(id: string, status: User['status']): Promise<User | null> {
    return this.update(id, { status })
  }
}

import { BaseRepository } from './base'
import { User, CreateUser, UpdateUser } from '../models'
import { TABLES } from '../dynamodb'

export class UserRepository extends BaseRepository<User> {
  protected tableName = TABLES.USERS
  protected entityType = 'USER'

  // Crear usuario
  async createUser(userData: CreateUser): Promise<User> {
    return this.create(userData as any)
  }

  // Obtener usuario por email
  async getByEmail(email: string): Promise<User | null> {
    const users = await this.search({ email })
    return users[0] || null
  }

  // Obtener usuarios por rol
  async getByRole(role: string): Promise<User[]> {
    return this.search({ role })
  }

  // Obtener usuarios activos
  async getActiveUsers(): Promise<User[]> {
    return this.search({ status: 'active' })
  }

  // Actualizar último login
  async updateLastLogin(id: string): Promise<User | null> {
    return this.update(id, {
      lastLogin: new Date().toISOString(),
    })
  }

  // Cambiar estado del usuario
  async changeStatus(id: string, status: 'active' | 'inactive' | 'pending'): Promise<User | null> {
    return this.update(id, { status })
  }

  // Obtener estadísticas de usuarios
  async getUserStats(): Promise<{
    total: number
    active: number
    inactive: number
    pending: number
    byRole: Record<string, number>
  }> {
    const allUsers = await this.listAll(1000) // Obtener todos los usuarios
    
    const stats = {
      total: allUsers.items.length,
      active: 0,
      inactive: 0,
      pending: 0,
      byRole: {} as Record<string, number>,
    }

    allUsers.items.forEach(user => {
      // Contar por estado
      if (user.status === 'active') stats.active++
      else if (user.status === 'inactive') stats.inactive++
      else if (user.status === 'pending') stats.pending++

      // Contar por rol
      stats.byRole[user.role] = (stats.byRole[user.role] || 0) + 1
    })

    return stats
  }
}

'use client'

import { useState, useEffect } from 'react'
import { User, CreateUserRequest, UpdateUserRequest } from '@/types/users'

interface UseUsersReturn {
  users: User[]
  filteredUsers: User[]
  isLoading: boolean
  error: string | null
  searchTerm: string
  setSearchTerm: (term: string) => void
  createUser: (userData: CreateUserRequest) => Promise<boolean>
  updateUser: (userId: string, userData: UpdateUserRequest) => Promise<boolean>
  deleteUser: (userId: string) => Promise<boolean>
  refreshUsers: () => Promise<void>
}

export const useUsers = (): UseUsersReturn => {
  const [users, setUsers] = useState<User[]>([])
  const [filteredUsers, setFilteredUsers] = useState<User[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')

  // Datos de prueba para desarrollo local
  const testUsers: User[] = [
    {
      id: 'user-super-admin',
      email: 'superadmin@onpoint.com',
      password: 'password123',
      firstName: 'Super',
      lastName: 'Administrador',
      phone: '+525512345678',
      role: {
        id: 'role-super-admin',
        name: 'SUPER_ADMIN',
        level: 1,
        permissions: [],
        description: 'Super Administrador',
        createdAt: '2024-12-19T00:00:00.000Z',
        updatedAt: '2024-12-19T00:00:00.000Z',
        createdBy: 'system'
      },
      department: 'Tecnología',
      position: 'Super Administrador',
      status: 'active',
      createdAt: '2024-12-19T00:00:00.000Z',
      updatedAt: '2024-12-19T00:00:00.000Z',
      createdBy: 'system'
    },
    {
      id: 'user-admin',
      email: 'admin@onpoint.com',
      password: 'password123',
      firstName: 'Admin',
      lastName: 'Usuario',
      phone: '+525512345679',
      role: {
        id: 'role-admin',
        name: 'ADMIN',
        level: 2,
        permissions: [],
        description: 'Administrador',
        createdAt: '2024-12-19T00:00:00.000Z',
        updatedAt: '2024-12-19T00:00:00.000Z',
        createdBy: 'system'
      },
      department: 'Administración',
      position: 'Administrador',
      status: 'active',
      createdAt: '2024-12-19T00:00:00.000Z',
      updatedAt: '2024-12-19T00:00:00.000Z',
      createdBy: 'system'
    },
    {
      id: 'user-executive',
      email: 'ejecutivo@onpoint.com',
      password: 'password123',
      firstName: 'Ejecutivo',
      lastName: 'Usuario',
      phone: '+525512345680',
      role: {
        id: 'role-executive',
        name: 'EXECUTIVE',
        level: 3,
        permissions: [],
        description: 'Ejecutivo',
        createdAt: '2024-12-19T00:00:00.000Z',
        updatedAt: '2024-12-19T00:00:00.000Z',
        createdBy: 'system'
      },
      department: 'Ventas',
      position: 'Ejecutivo',
      status: 'active',
      createdAt: '2024-12-19T00:00:00.000Z',
      updatedAt: '2024-12-19T00:00:00.000Z',
      createdBy: 'system'
    }
  ]

  // Cargar usuarios
  const loadUsers = async () => {
    try {
      setIsLoading(true)
      setError(null)
      
      // Simular llamada a API
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      setUsers(testUsers)
      setFilteredUsers(testUsers)
    } catch (err) {
      setError('Error al cargar usuarios')
      console.error('Error loading users:', err)
    } finally {
      setIsLoading(false)
    }
  }

  // Filtrar usuarios
  useEffect(() => {
    const filtered = users.filter(user =>
      user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.position.toLowerCase().includes(searchTerm.toLowerCase())
    )
    setFilteredUsers(filtered)
  }, [searchTerm, users])

  // Cargar usuarios al montar
  useEffect(() => {
    loadUsers()
  }, [])

  // Crear usuario
  const createUser = async (userData: CreateUserRequest): Promise<boolean> => {
    try {
      setIsLoading(true)
      setError(null)

      // Simular llamada a API
      await new Promise(resolve => setTimeout(resolve, 1000))

      const newUser: User = {
        id: `user-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        ...userData,
        role: {
          id: `role-${userData.role.toLowerCase()}`,
          name: userData.role,
          level: userData.role === 'SUPER_ADMIN' ? 1 : userData.role === 'ADMIN' ? 2 : 3,
          permissions: [],
          description: userData.role === 'SUPER_ADMIN' ? 'Super Administrador' : userData.role === 'ADMIN' ? 'Administrador' : 'Ejecutivo',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          createdBy: 'system'
        },
        status: 'active',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        createdBy: 'current-user' // En producción sería el ID del usuario actual
      }

      setUsers(prev => [...prev, newUser])
      return true
    } catch (err) {
      setError('Error al crear usuario')
      console.error('Error creating user:', err)
      return false
    } finally {
      setIsLoading(false)
    }
  }

  // Actualizar usuario
  const updateUser = async (userId: string, userData: UpdateUserRequest): Promise<boolean> => {
    try {
      setIsLoading(true)
      setError(null)

      // Simular llamada a API
      await new Promise(resolve => setTimeout(resolve, 1000))

      setUsers(prev => prev.map(user => 
        user.id === userId 
          ? { 
              ...user, 
              ...userData, 
              role: {
                id: `role-${(userData.role as string).toLowerCase()}`,
                name: userData.role as string,
                level: userData.role === 'SUPER_ADMIN' ? 1 : userData.role === 'ADMIN' ? 2 : 3,
                permissions: [],
                description: userData.role === 'SUPER_ADMIN' ? 'Super Administrador' : userData.role === 'ADMIN' ? 'Administrador' : 'Ejecutivo',
                createdAt: user.role.createdAt,
                updatedAt: new Date().toISOString(),
                createdBy: user.role.createdBy
              },
              updatedAt: new Date().toISOString() 
            }
          : user
      ))
      return true
    } catch (err) {
      setError('Error al actualizar usuario')
      console.error('Error updating user:', err)
      return false
    } finally {
      setIsLoading(false)
    }
  }

  // Eliminar usuario
  const deleteUser = async (userId: string): Promise<boolean> => {
    try {
      setIsLoading(true)
      setError(null)

      // Simular llamada a API
      await new Promise(resolve => setTimeout(resolve, 1000))

      setUsers(prev => prev.filter(user => user.id !== userId))
      return true
    } catch (err) {
      setError('Error al eliminar usuario')
      console.error('Error deleting user:', err)
      return false
    } finally {
      setIsLoading(false)
    }
  }

  // Refrescar usuarios
  const refreshUsers = async () => {
    await loadUsers()
  }

  return {
    users,
    filteredUsers,
    isLoading,
    error,
    searchTerm,
    setSearchTerm,
    createUser,
    updateUser,
    deleteUser,
    refreshUsers
  }
}

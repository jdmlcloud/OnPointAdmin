'use client'

import React, { useState, useEffect } from 'react'
import { User, CreateUserRequest, UpdateUserRequest, UserRoleType } from '@/types/users'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'

interface UserFormProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (userData: CreateUserRequest | UpdateUserRequest) => Promise<boolean>
  user?: User | null
  currentUserRole?: UserRoleType
  isLoading?: boolean
}

export const UserForm: React.FC<UserFormProps> = ({
  isOpen,
  onClose,
  onSubmit,
  user,
  currentUserRole,
  isLoading = false
}) => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    role: 'EXECUTIVE' as UserRoleType,
    department: '',
    position: '',
    password: ''
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

  // Inicializar formulario
  useEffect(() => {
    if (user) {
      setFormData({
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phone: user.phone,
        role: typeof user.role === 'string' ? user.role : user.role.name as UserRoleType,
        department: user.department,
        position: user.position,
        password: ''
      })
    } else {
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        role: 'EXECUTIVE',
        department: '',
        position: '',
        password: ''
      })
    }
    setErrors({})
  }, [user, isOpen])

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.firstName.trim()) {
      newErrors.firstName = 'El nombre es requerido'
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = 'El apellido es requerido'
    }

    if (!formData.email.trim()) {
      newErrors.email = 'El email es requerido'
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'El email no es válido'
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'El teléfono es requerido'
    } else if (!/^\+52\d{10}$/.test(formData.phone)) {
      newErrors.phone = 'El teléfono debe tener formato +52XXXXXXXXXX'
    }

    if (!formData.department.trim()) {
      newErrors.department = 'El departamento es requerido'
    }

    if (!formData.position.trim()) {
      newErrors.position = 'La posición es requerida'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    const success = await onSubmit({
      ...formData,
      password: 'default_password_123' // Password por defecto para nuevos usuarios
    })
    if (success) {
      onClose()
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  const formatPhone = (value: string) => {
    // Remover caracteres no numéricos excepto +
    let formatted = value.replace(/[^\d+]/g, '')
    
    // Si no empieza con +52, agregarlo
    if (!formatted.startsWith('+52')) {
      if (formatted.startsWith('52')) {
        formatted = '+' + formatted
      } else if (formatted.startsWith('+')) {
        formatted = '+52' + formatted.substring(1)
      } else {
        formatted = '+52' + formatted
      }
    }
    
    // Limitar a 13 caracteres (+52 + 10 dígitos)
    if (formatted.length > 13) {
      formatted = formatted.substring(0, 13)
    }
    
    return formatted
  }

  const getRoleOptions = () => {
    const options = [
      { value: 'EXECUTIVE', label: 'Ejecutivo' },
      { value: 'ADMIN', label: 'Administrador' }
    ]

    if (currentUserRole === 'SUPER_ADMIN') {
      options.push({ value: 'SUPER_ADMIN', label: 'Super Administrador' })
    }

    return options
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>
            {user ? 'Editar Usuario' : 'Crear Nuevo Usuario'}
          </DialogTitle>
          <DialogDescription>
            {user 
              ? 'Modifica la información del usuario seleccionado.'
              : 'Completa la información para crear un nuevo usuario en el sistema.'
            }
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="firstName">Nombre *</Label>
              <Input
                id="firstName"
                value={formData.firstName}
                onChange={(e) => handleInputChange('firstName', e.target.value)}
                placeholder="Nombre"
                className={errors.firstName ? 'border-red-500' : ''}
              />
              {errors.firstName && (
                <p className="text-sm text-red-500 mt-1">{errors.firstName}</p>
              )}
            </div>
            <div>
              <Label htmlFor="lastName">Apellido *</Label>
              <Input
                id="lastName"
                value={formData.lastName}
                onChange={(e) => handleInputChange('lastName', e.target.value)}
                placeholder="Apellido"
                className={errors.lastName ? 'border-red-500' : ''}
              />
              {errors.lastName && (
                <p className="text-sm text-red-500 mt-1">{errors.lastName}</p>
              )}
            </div>
          </div>

          <div>
            <Label htmlFor="email">Email *</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              placeholder="usuario@empresa.com"
              className={errors.email ? 'border-red-500' : ''}
            />
            {errors.email && (
              <p className="text-sm text-red-500 mt-1">{errors.email}</p>
            )}
          </div>

          <div>
            <Label htmlFor="phone">Teléfono *</Label>
            <Input
              id="phone"
              value={formData.phone}
              onChange={(e) => handleInputChange('phone', formatPhone(e.target.value))}
              placeholder="+52XXXXXXXXXX"
              className={errors.phone ? 'border-red-500' : ''}
            />
            {errors.phone && (
              <p className="text-sm text-red-500 mt-1">{errors.phone}</p>
            )}
          </div>

          <div>
            <Label htmlFor="role">Rol *</Label>
            <Select
              value={formData.role}
              onValueChange={(value) => handleInputChange('role', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Seleccionar rol" />
              </SelectTrigger>
              <SelectContent>
                {getRoleOptions().map(option => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="department">Departamento *</Label>
            <Input
              id="department"
              value={formData.department}
              onChange={(e) => handleInputChange('department', e.target.value)}
              placeholder="Departamento"
              className={errors.department ? 'border-red-500' : ''}
            />
            {errors.department && (
              <p className="text-sm text-red-500 mt-1">{errors.department}</p>
            )}
          </div>

          <div>
            <Label htmlFor="position">Posición *</Label>
            <Input
              id="position"
              value={formData.position}
              onChange={(e) => handleInputChange('position', e.target.value)}
              placeholder="Posición"
              className={errors.position ? 'border-red-500' : ''}
            />
            {errors.position && (
              <p className="text-sm text-red-500 mt-1">{errors.position}</p>
            )}
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button 
              type="button" 
              variant="outline" 
              onClick={onClose}
              disabled={isLoading}
            >
              Cancelar
            </Button>
            <Button 
              type="submit" 
              disabled={isLoading}
            >
              {isLoading ? 'Guardando...' : (user ? 'Guardar Cambios' : 'Crear Usuario')}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}

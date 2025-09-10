"use client"
// @ts-nocheck

import { useState } from "react"
import { useRouter } from "next/navigation"
import { MainLayout } from "@/components/layout/main-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, ArrowLeft, UserPlus, Mail, Shield } from "lucide-react"
import { useAuthContext } from "@/lib/auth/auth-context"
import { createNewUser, canCreateUsers, getAvailableRoles } from "@/lib/auth/auth-integration"
import { UserRoleType } from "@/types/users"

export default function CreateUserPage() {
  const router = useRouter()
  const { user: currentUser } = useAuthContext()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [formData, setFormData] = useState({
    email: '',
    role: '',
    firstName: '',
    lastName: '',
    department: '',
    position: ''
  })

  // Verificar si el usuario puede crear otros usuarios
  if (!currentUser || !canCreateUsers(currentUser.role as UserRoleType)) {
    return (
      <MainLayout>
        <div className="space-y-6">
          <Card className="max-w-2xl mx-auto">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl text-red-600">Acceso Denegado</CardTitle>
              <CardDescription>
                No tienes permisos para crear usuarios
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </MainLayout>
    )
  }

  // Obtener roles disponibles según el usuario actual
  const availableRoles = getAvailableRoles(currentUser.role as UserRoleType)
  const roles = availableRoles.map(role => ({
    value: role,
    label: role === 'ADMIN' ? 'Administrador' : 'Ejecutivo',
    description: role === 'ADMIN' ? 'Acceso completo al sistema' : 'Acceso a módulos de ventas y clientes'
  }))

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const result = await createNewUser({
        email: formData.email,
        role: formData.role as UserRoleType,
        firstName: formData.firstName,
        lastName: formData.lastName,
        department: formData.department,
        position: formData.position,
        createdBy: currentUser?.email || 'system'
      })

      if (result.success) {
        setSuccess(true)
        // Redirigir a la lista de usuarios después de 3 segundos
        setTimeout(() => {
          router.push('/users')
        }, 3000)
      } else {
        setError(result.message || 'Error creando usuario')
      }
    } catch (error) {
      setError('Error de conexión. Intenta nuevamente.')
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <MainLayout>
        <div className="space-y-6">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.push('/users')}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Volver a Usuarios
            </Button>
          </div>

          <Card className="max-w-2xl mx-auto">
            <CardHeader className="text-center">
              <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <UserPlus className="h-8 w-8 text-green-600" />
              </div>
              <CardTitle className="text-2xl">¡Usuario Creado Exitosamente!</CardTitle>
              <CardDescription>
                Se ha enviado un email de verificación a {formData.email}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="flex items-start">
                  <Mail className="h-5 w-5 text-blue-600 mt-0.5 mr-3" />
                  <div className="text-sm text-blue-800">
                    <p className="font-medium mb-2">Próximos pasos:</p>
                    <ol className="list-decimal list-inside space-y-1">
                      <li>El usuario recibirá un email de verificación</li>
                      <li>Deberá hacer clic en el enlace del email</li>
                      <li>Configurará su contraseña</li>
                      <li>Ingresará el código 2FA que se le enviará</li>
                      <li>Ya tendrá acceso completo a su rol</li>
                    </ol>
                  </div>
                </div>
              </div>
              
              <div className="text-center">
                <p className="text-sm text-muted-foreground">
                  Te redirigiremos a la lista de usuarios en unos segundos...
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </MainLayout>
    )
  }

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.push('/users')}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Volver a Usuarios
          </Button>
        </div>

        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UserPlus className="h-5 w-5" />
              Crear Nuevo Usuario
            </CardTitle>
            <CardDescription>
              Crea un nuevo usuario y envíale las credenciales de acceso
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">Nombre</Label>
                  <Input
                    id="firstName"
                    value={formData.firstName}
                    onChange={(e) => handleInputChange('firstName', e.target.value)}
                    placeholder="Juan"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="lastName">Apellido</Label>
                  <Input
                    id="lastName"
                    value={formData.lastName}
                    onChange={(e) => handleInputChange('lastName', e.target.value)}
                    placeholder="Pérez"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  placeholder="usuario@empresa.com"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="role">Rol</Label>
                <Select value={formData.role} onValueChange={(value) => handleInputChange('role', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona un rol" />
                  </SelectTrigger>
                  <SelectContent>
                    {roles.map((role) => (
                      <SelectItem key={role.value} value={role.value}>
                        <div className="flex flex-col">
                          <span className="font-medium">{role.label}</span>
                          <span className="text-sm text-muted-foreground">{role.description}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="department">Departamento</Label>
                  <Input
                    id="department"
                    value={formData.department}
                    onChange={(e) => handleInputChange('department', e.target.value)}
                    placeholder="Ventas"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="position">Cargo</Label>
                  <Input
                    id="position"
                    value={formData.position}
                    onChange={(e) => handleInputChange('position', e.target.value)}
                    placeholder="Ejecutivo de Ventas"
                    required
                  />
                </div>
              </div>

              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="flex items-start">
                  <Shield className="h-5 w-5 text-blue-600 mt-0.5 mr-3" />
                  <div className="text-sm text-blue-800">
                    <p className="font-medium mb-1">Proceso de activación:</p>
                    <ul className="list-disc list-inside space-y-1">
                      <li>Se enviará un email de verificación al usuario</li>
                      <li>El usuario configurará su contraseña</li>
                      <li>Recibirá un código 2FA para activar su cuenta</li>
                      <li>Tendrá acceso según su rol asignado</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="flex gap-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.push('/users')}
                  className="flex-1"
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  disabled={loading || !formData.email || !formData.role}
                  className="flex-1"
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Creando Usuario...
                    </>
                  ) : (
                    'Crear Usuario'
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  )
}

"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useAuthRoles } from "@/hooks/use-auth-roles"
import { 
  Shield, 
  User, 
  Users, 
  ChevronDown,
  Check,
  Settings,
  BarChart3,
  FileText,
  MessageSquare,
  Building2,
  Package
} from "lucide-react"

const roleIcons = {
  admin: Shield,
  ejecutivo: User,
  cliente: Users
}

const roleColors = {
  admin: "bg-red-500",
  ejecutivo: "bg-blue-500", 
  cliente: "bg-green-500"
}

export function RoleSwitcher() {
  const { 
    currentRole, 
    isDevelopmentMode, 
    switchRole, 
    getRoleDisplayName, 
    getRoleDescription,
    availableRoles,
    permissions
  } = useAuthRoles()
  
  const [isOpen, setIsOpen] = useState(false)

  if (!isDevelopmentMode) {
    return (
      <Badge variant="outline" className="ml-2">
        {getRoleDisplayName(currentRole)}
      </Badge>
    )
  }

  const CurrentIcon = roleIcons[currentRole] || User

  return (
    <div className="relative">
      <Button
        variant="outline"
        size="sm"
        onClick={() => setIsOpen(!isOpen)}
        className="gap-2"
      >
        <CurrentIcon className="h-4 w-4" />
        {getRoleDisplayName(currentRole)}
        <ChevronDown className="h-4 w-4" />
      </Button>

      {isOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 z-40" 
            onClick={() => setIsOpen(false)}
          />
          
          {/* Dropdown */}
          <Card className="absolute right-0 top-12 w-80 z-50 shadow-lg border animate-in slide-in-from-top-2 duration-200">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Selector de Roles</CardTitle>
              <CardDescription>
                Modo desarrollo - Cambia entre diferentes roles para probar funcionalidades
              </CardDescription>
            </CardHeader>
            
            <CardContent className="space-y-3">
              {availableRoles.map((role) => {
                const Icon = roleIcons[role] || User
                const isActive = role === currentRole
                
                return (
                  <div
                    key={role}
                    className={`p-3 rounded-lg border cursor-pointer transition-all ${
                      isActive 
                        ? 'border-primary bg-primary/5' 
                        : 'border-border hover:border-primary/50 hover:bg-muted/50'
                    }`}
                    onClick={() => {
                      switchRole(role)
                      setIsOpen(false)
                    }}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg ${roleColors[role]} text-white`}>
                        <Icon className="h-4 w-4" />
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h4 className="font-medium">{getRoleDisplayName(role)}</h4>
                          {isActive && <Check className="h-4 w-4 text-primary" />}
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {getRoleDescription(role)}
                        </p>
                      </div>
                    </div>
                  </div>
                )
              })}
              
              <div className="pt-3 border-t">
                <h5 className="text-sm font-medium mb-2">Permisos Actuales:</h5>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="flex items-center gap-1">
                    <Building2 className="h-3 w-3" />
                    <span className={permissions.canManageProviders ? 'text-green-600' : 'text-red-600'}>
                      Proveedores
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Package className="h-3 w-3" />
                    <span className={permissions.canManageProducts ? 'text-green-600' : 'text-red-600'}>
                      Productos
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <FileText className="h-3 w-3" />
                    <span className={permissions.canManageQuotations ? 'text-green-600' : 'text-red-600'}>
                      Cotizaciones
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <MessageSquare className="h-3 w-3" />
                    <span className={permissions.canManageWhatsApp ? 'text-green-600' : 'text-red-600'}>
                      WhatsApp
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <BarChart3 className="h-3 w-3" />
                    <span className={permissions.canViewAnalytics ? 'text-green-600' : 'text-red-600'}>
                      Analytics
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Settings className="h-3 w-3" />
                    <span className={permissions.canManageSettings ? 'text-green-600' : 'text-red-600'}>
                      Configuración
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  )
}

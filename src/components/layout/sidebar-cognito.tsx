"use client"

import { usePathname } from "next/navigation"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { 
  LayoutDashboard, 
  Users, 
  Package, 
  MessageSquare, 
  TrendingUp, 
  FileText, 
  Settings, 
  LogOut, 
  ChevronLeft, 
  ChevronRight,
  Building2,
  BarChart3,
  Shield,
  FileBarChart,
  Palette,
  Zap,
  Cpu
} from "lucide-react"
import { useState } from "react"
import { useRoles } from "@/hooks/use-roles"
import { useCognitoAuth } from "@/hooks/use-cognito-auth"

const navigation = [
  {
    name: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
    permission: "canViewDashboard"
  },
  {
    name: "Usuarios",
    href: "/users",
    icon: Users,
    permission: "canManageUsers"
  },
  {
    name: "Proveedores",
    href: "/providers",
    icon: Building2,
    permission: "canManageProviders"
  },
  {
    name: "Productos",
    href: "/products",
    icon: Package,
    permission: "canManageProducts"
  },
  {
    name: "WhatsApp + IA",
    href: "/whatsapp",
    icon: MessageSquare,
    permission: "canManageWhatsApp"
  },
  {
    name: "Cotizaciones",
    href: "/quotations",
    icon: FileText,
    permission: "canManageQuotations"
  },
  {
    name: "Propuestas",
    href: "/proposals",
    icon: TrendingUp,
    permission: "canManageProposals"
  },
  {
    name: "Generador PDF",
    href: "/pdf-generator",
    icon: FileBarChart,
    permission: "canManagePDFs"
  },
  {
    name: "Seguimiento",
    href: "/tracking",
    icon: BarChart3,
    permission: "canViewTracking"
  },
  {
    name: "Analytics",
    href: "/analytics",
    icon: TrendingUp,
    permission: "canViewAnalytics"
  },
  {
    name: "Reportes",
    href: "/reports",
    icon: FileBarChart,
    permission: "canViewReports"
  },
  {
    name: "Editor Visual",
    href: "/visual-editor",
    icon: Palette,
    permission: "canManageTemplates"
  },
  {
    name: "Configuración",
    href: "/settings",
    icon: Settings,
    permission: "canManageSettings"
  },
  {
    name: "Integraciones",
    href: "/integrations",
    icon: Zap,
    permission: "canManageIntegrations"
  },
  {
    name: "Sistema",
    href: "/system",
    icon: Shield,
    permission: "canManageSystem"
  },
  {
    name: "AI Test",
    href: "/ai-test",
    icon: Cpu,
    badge: "TEST",
    permission: "canManageSystem"
  },
]

export function SidebarCognito() {
  const pathname = usePathname()
  const [collapsed, setCollapsed] = useState(false)
  const { hasPermission } = useRoles()
  const { user, signOut } = useCognitoAuth()

  const handleSignOut = async () => {
    try {
      await signOut()
    } catch (error) {
      console.error('Error al cerrar sesión:', error)
    }
  }

  const filteredNavigation = navigation.filter(item => 
    hasPermission(item.permission)
  )

  return (
    <div className={cn(
      "flex flex-col h-full bg-white border-r border-gray-200 transition-all duration-300",
      collapsed ? "w-16" : "w-64"
    )}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        {!collapsed && (
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">OP</span>
            </div>
            <span className="font-semibold text-gray-900">OnPoint Admin</span>
          </div>
        )}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setCollapsed(!collapsed)}
          className="h-8 w-8 p-0"
        >
          {collapsed ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <ChevronLeft className="h-4 w-4" />
          )}
        </Button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto p-4 space-y-2">
        {filteredNavigation.map((item) => {
          const isActive = pathname === item.href
          const Icon = item.icon

          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                isActive
                  ? "bg-primary text-white"
                  : "text-gray-700 hover:bg-gray-100"
              )}
            >
              <Icon className="h-5 w-5 flex-shrink-0" />
              {!collapsed && (
                <>
                  <span className="flex-1">{item.name}</span>
                  {item.badge && (
                    <Badge variant="secondary" className="text-xs">
                      {item.badge}
                    </Badge>
                  )}
                </>
              )}
            </Link>
          )
        })}
      </nav>

      {/* User Info */}
      {user && (
        <div className="border-t border-gray-200 p-4">
          <div className={cn(
            "flex items-center space-x-3",
            collapsed ? "justify-center" : ""
          )}>
            <Avatar className="h-8 w-8">
              <AvatarImage src={user.avatar} />
              <AvatarFallback>
                {user.name?.charAt(0)?.toUpperCase() || 'U'}
              </AvatarFallback>
            </Avatar>
            
            {!collapsed && (
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {user.name}
                </p>
                <p className="text-xs text-gray-500 truncate">
                  {user.email}
                </p>
                <Badge 
                  variant="outline" 
                  className="text-xs mt-1"
                >
                  {user.role === 'admin' ? 'Administrador' : 'Ejecutivo'}
                </Badge>
              </div>
            )}
          </div>
          
          {!collapsed && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleSignOut}
              className="w-full mt-3 text-gray-600 hover:text-gray-900"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Cerrar Sesión
            </Button>
          )}
        </div>
      )}
    </div>
  )
}

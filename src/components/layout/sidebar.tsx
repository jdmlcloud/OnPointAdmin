"use client"

// import { useSession } from "next-auth/react" // Removido - no usamos NextAuth
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
  Cpu,
  Image
} from "lucide-react"
import { useAuthContext } from "@/lib/auth/auth-context"
import { useState, useEffect } from "react"
import { getVersionString } from "@/lib/version"

const navigation = [
  {
    name: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
    badge: null,
    permission: "canViewDashboard"
  },
  {
    name: "Proveedores",
    href: "/providers",
    icon: Building2,
    badge: null,
    permission: "canManageProviders"
  },
  {
    name: "Productos",
    href: "/products",
    icon: Package,
    badge: null,
    permission: "canManageProducts"
  },
  {
    name: "Logos",
    href: "/logos",
    icon: Image,
    badge: null,
    permission: "canManageLogos"
  },
  {
    name: "WhatsApp + IA",
    href: "/whatsapp",
    icon: MessageSquare,
    badge: null,
    permission: "canManageWhatsApp"
  },
  {
    name: "Cotizaciones",
    href: "/quotations",
    icon: TrendingUp,
    badge: null,
    permission: "canManageQuotations"
  },
  {
    name: "Propuestas",
    href: "/proposals",
    icon: FileText,
    badge: null,
    permission: "canManageProposals"
  },
  {
    name: "Generador PDFs",
    href: "/pdf-generator",
    icon: FileBarChart,
    badge: null,
    permission: "canGeneratePDFs"
  },
  {
    name: "Envío y Tracking",
    href: "/tracking",
    icon: BarChart3,
    badge: null,
    permission: "canViewAnalytics"
  },
  {
    name: "Editor Visual",
    href: "/editor",
    icon: Palette,
    badge: null,
    permission: "canManageTemplates"
  },
  {
    name: "Analytics",
    href: "/analytics",
    icon: BarChart3,
    badge: null,
    permission: "canViewAnalytics"
  },
  {
    name: "Reportes",
    href: "/reports",
    icon: FileBarChart,
    badge: null,
    permission: "canViewReports"
  },
  {
    name: "Usuarios",
    href: "/users",
    icon: Users,
    badge: null,
    permission: "canManageUsers"
  },
  {
    name: "Integraciones",
    href: "/integrations",
    icon: Zap,
    badge: null,
    permission: "canManageIntegrations"
  },
  {
    name: "Sistema",
    href: "/system",
    icon: Shield,
    badge: null,
    permission: "canManageSystem"
  },
  {
    name: "Configuración",
    href: "/settings",
    icon: Settings,
    badge: null,
    permission: "canManageSettings"
  },
  {
    name: "AI Test",
    href: "/ai-test",
    icon: Cpu,
    badge: "TEST",
    permission: "canManageSystem"
  },
]

export function Sidebar() {
  const { user, logout, hasPermission } = useAuthContext()
  const pathname = usePathname()
  const [collapsed, setCollapsed] = useState(true) // Iniciar colapsado
  const [isHovered, setIsHovered] = useState(false)
  const [isAutoHidden, setIsAutoHidden] = useState(true)

  const handleSignOut = async () => {
    logout()
  }

  // Auto-ocultar el menú después de 3 segundos sin hover
  useEffect(() => {
    let timeoutId: NodeJS.Timeout

    if (isHovered) {
      setIsAutoHidden(false)
    } else {
      timeoutId = setTimeout(() => {
        setIsAutoHidden(true)
      }, 2000) // 2 segundos
    }

    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId)
      }
    }
  }, [isHovered])

  // Determinar si el sidebar debe estar colapsado
  const shouldCollapse = collapsed && (!isHovered || isAutoHidden)
  
  // Función para manejar el toggle manual del menú
  const handleToggleMenu = () => {
    setCollapsed(!collapsed)
    // Si se está expandiendo manualmente, desactivar auto-hidden temporalmente
    if (collapsed) {
      setIsAutoHidden(false)
    }
  }

  return (
    <div 
      className={cn(
        "flex flex-col h-full bg-card border-r transition-all duration-300",
        shouldCollapse ? "w-16" : "w-64"
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Header */}
      <div className="p-4 border-b">
        <div className="flex items-center justify-between">
          {!shouldCollapse && (
            <div>
              <h1 className="text-xl font-bold text-primary">JDML Cloud</h1>
              <p className="text-xs text-muted-foreground">Servicios de Infraestructura</p>
            </div>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={handleToggleMenu}
            className="h-8 w-8 p-0"
          >
            {shouldCollapse ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          </Button>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {navigation.filter(item => {
          // Mapear permisos del sidebar a nuestro sistema
          const permissionMap: { [key: string]: { resource: string; action: string } } = {
            'canViewDashboard': { resource: 'dashboard', action: 'read' },
            'canManageProviders': { resource: 'providers', action: 'read' },
            'canManageProducts': { resource: 'products', action: 'read' },
            'canManageLogos': { resource: 'logos', action: 'read' },
            'canManageWhatsApp': { resource: 'whatsapp', action: 'read' },
            'canManageQuotations': { resource: 'quotations', action: 'read' },
            'canManageProposals': { resource: 'proposals', action: 'read' },
            'canViewAnalytics': { resource: 'analytics', action: 'read' },
            'canViewReports': { resource: 'reports', action: 'read' },
            'canManageUsers': { resource: 'users', action: 'read' },
            'canManageIntegrations': { resource: 'integrations', action: 'read' },
            'canManageSystem': { resource: 'system', action: 'read' },
            'canManageSettings': { resource: 'settings', action: 'read' }
          }
          
          const mappedPermission = permissionMap[item.permission]
          if (!mappedPermission) return true // Si no hay mapeo, permitir acceso
          
          return hasPermission(mappedPermission.resource, mappedPermission.action)
        }).map((item) => {
          const isActive = pathname === item.href
          const Icon = item.icon
          
          return (
            <Link key={item.name} href={item.href}>
              <Button
                variant={isActive ? "default" : "ghost"}
                className={cn(
                  "w-full justify-start gap-3 h-10",
                  collapsed && "px-2"
                )}
              >
                <Icon className="h-4 w-4 flex-shrink-0" />
                {!shouldCollapse && (
                  <>
                    <span className="flex-1 text-left">{item.name}</span>
                    {item.badge && (
                      <Badge 
                        variant="secondary"
                        className="text-xs"
                      >
                        {item.badge}
                      </Badge>
                    )}
                  </>
                )}
              </Button>
            </Link>
          )
        })}
      </nav>

      {/* User Profile */}
      <div className="p-4 border-t">
        <div className={cn(
        "flex items-center gap-3",
        shouldCollapse && "justify-center"
        )}>
          <Avatar className="h-8 w-8">
            <AvatarImage src="" />
            <AvatarFallback>
              {(user?.firstName?.charAt(0) || user?.lastName?.charAt(0) || "U").toUpperCase()}
            </AvatarFallback>
          </Avatar>
          {!shouldCollapse && (
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">
                {user?.firstName && user?.lastName ? `${user.firstName} ${user.lastName}` : "Usuario"}
              </p>
              <p className="text-xs text-muted-foreground truncate">
                {user?.email || "usuario@onpoint.com"}
              </p>
              <Badge variant="outline" className="text-xs mt-1">
                {typeof user?.role === 'string' ? user.role : user?.role?.name || "usuario"}
              </Badge>
            </div>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={handleSignOut}
            className={cn(
              "h-8 w-8 p-0",
              collapsed && "mx-auto"
            )}
          >
            <LogOut className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Versión */}
      <div className="p-4 border-t">
        <div className={cn(
          "flex items-center justify-center",
          shouldCollapse ? "text-xs" : "text-sm"
        )}>
          {!shouldCollapse && (
            <span className="text-muted-foreground">Versión</span>
          )}
          <Badge variant="outline" className="text-xs ml-2">
            {getVersionString()}
          </Badge>
        </div>
      </div>
    </div>
  )
}

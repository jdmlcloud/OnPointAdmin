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
  Cpu
} from "lucide-react"
import { useAuthContext } from "@/lib/auth/auth-context"
import { useState } from "react"

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
    badge: "V1",
    permission: "canManageProviders"
  },
  {
    name: "Productos",
    href: "/products",
    icon: Package,
    badge: "V1",
    permission: "canManageProducts"
  },
  {
    name: "WhatsApp + IA",
    href: "/whatsapp",
    icon: MessageSquare,
    badge: "V2",
    permission: "canManageWhatsApp"
  },
  {
    name: "Cotizaciones",
    href: "/quotations",
    icon: TrendingUp,
    badge: "V3",
    permission: "canManageQuotations"
  },
  {
    name: "Propuestas",
    href: "/proposals",
    icon: FileText,
    badge: "V4",
    permission: "canManageProposals"
  },
  {
    name: "Generador PDFs",
    href: "/pdf-generator",
    icon: FileBarChart,
    badge: "V5",
    permission: "canGeneratePDFs"
  },
  {
    name: "Envío y Tracking",
    href: "/tracking",
    icon: BarChart3,
    badge: "V6",
    permission: "canViewAnalytics"
  },
  {
    name: "Editor Visual",
    href: "/editor",
    icon: Palette,
    badge: "V7",
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
    badge: "V1",
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
  const [collapsed, setCollapsed] = useState(false)

  const handleSignOut = async () => {
    logout()
  }

  return (
    <div className={cn(
      "flex flex-col h-full bg-card border-r transition-all duration-300",
      collapsed ? "w-16" : "w-64"
    )}>
      {/* Header */}
      <div className="p-4 border-b">
        <div className="flex items-center justify-between">
          {!collapsed && (
            <div>
              <h1 className="text-xl font-bold text-primary">OnPoint</h1>
              <p className="text-xs text-muted-foreground">Admin Platform</p>
            </div>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setCollapsed(!collapsed)}
            className="h-8 w-8 p-0"
          >
            {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
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
                {!collapsed && (
                  <>
                    <span className="flex-1 text-left">{item.name}</span>
                    {item.badge && (
                      <Badge 
                        variant={item.badge === "V1" ? "default" : "secondary"}
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
          collapsed && "justify-center"
        )}>
          <Avatar className="h-8 w-8">
            <AvatarImage src="" />
            <AvatarFallback>
              {(user?.firstName?.charAt(0) || user?.lastName?.charAt(0) || "U").toUpperCase()}
            </AvatarFallback>
          </Avatar>
          {!collapsed && (
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
    </div>
  )
}

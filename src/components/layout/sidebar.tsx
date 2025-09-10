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
  // DASHBOARD
  {
    name: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
    badge: null,
    permission: "canViewDashboard",
    category: "dashboard"
  },
  
  // BASE DE DATOS
  {
    name: "Proveedores",
    href: "/providers",
    icon: Building2,
    badge: null,
    permission: "canManageProviders",
    category: "database"
  },
  {
    name: "Productos",
    href: "/products",
    icon: Package,
    badge: null,
    permission: "canManageProducts",
    category: "database"
  },
  {
    name: "Logos",
    href: "/logos",
    icon: Image,
    badge: null,
    permission: "canManageLogos",
    category: "database"
  },
  {
    name: "Usuarios",
    href: "/users",
    icon: Users,
    badge: null,
    permission: "canManageUsers",
    category: "database"
  },
  
  // OPERACIONES
  {
    name: "Tareas",
    href: "/tasks",
    icon: Cpu,
    badge: null,
    permission: "canManageTasks",
    category: "operations"
  },
  {
    name: "Propuestas",
    href: "/proposals",
    icon: FileText,
    badge: null,
    permission: "canManageProposals",
    category: "operations"
  },
  {
    name: "Cotizaciones",
    href: "/quotations",
    icon: TrendingUp,
    badge: null,
    permission: "canManageQuotations",
    category: "operations"
  },
  {
    name: "WhatsApp + IA",
    href: "/whatsapp",
    icon: MessageSquare,
    badge: null,
    permission: "canManageWhatsApp",
    category: "operations"
  },
  
  // ANÁLISIS Y REPORTES
  {
    name: "Analytics",
    href: "/analytics",
    icon: BarChart3,
    badge: null,
    permission: "canViewAnalytics",
    category: "analytics"
  },
  {
    name: "Reportes",
    href: "/reports",
    icon: FileBarChart,
    badge: null,
    permission: "canViewReports",
    category: "analytics"
  },
  {
    name: "Envío y Tracking",
    href: "/tracking",
    icon: BarChart3,
    badge: null,
    permission: "canViewAnalytics",
    category: "analytics"
  },
  
  // HERRAMIENTAS
  {
    name: "Generador PDFs",
    href: "/pdf-generator",
    icon: FileBarChart,
    badge: null,
    permission: "canGeneratePDFs",
    category: "tools"
  },
  {
    name: "Editor Visual",
    href: "/editor",
    icon: Palette,
    badge: null,
    permission: "canManageTemplates",
    category: "tools"
  },
  {
    name: "Integraciones",
    href: "/integrations",
    icon: Zap,
    badge: null,
    permission: "canManageIntegrations",
    category: "tools"
  },
  
  // SISTEMA
  {
    name: "Sistema",
    href: "/system",
    icon: Shield,
    badge: null,
    permission: "canManageSystem",
    category: "system"
  },
  {
    name: "Configuración",
    href: "/settings",
    icon: Settings,
    badge: null,
    permission: "canManageSettings",
    category: "system"
  }
]

// Agrupar navegación por categorías
const groupedNavigation = {
  dashboard: navigation.filter(item => item.category === "dashboard"),
  database: navigation.filter(item => item.category === "database"),
  operations: navigation.filter(item => item.category === "operations"),
  analytics: navigation.filter(item => item.category === "analytics"),
  tools: navigation.filter(item => item.category === "tools"),
  system: navigation.filter(item => item.category === "system")
}

const categoryLabels = {
  dashboard: "Dashboard",
  database: "Base de Datos",
  operations: "Operaciones",
  analytics: "Análisis y Reportes",
  tools: "Herramientas",
  system: "Sistema"
}

export function Sidebar() {
  const pathname = usePathname()
  const { user, logout } = useAuthContext()
  const [collapsed, setCollapsed] = useState(false)
  const [isHovered, setIsHovered] = useState(false)
  const [isAutoHidden, setIsAutoHidden] = useState(false)

  // Auto-hide functionality
  useEffect(() => {
    if (!collapsed) {
      setIsAutoHidden(false)
      return
    }

    const timer = setTimeout(() => {
      if (!isHovered) {
        setIsAutoHidden(true)
      }
    }, 2000) // 2 segundos

    return () => clearTimeout(timer)
  }, [collapsed, isHovered])

  // Reset auto-hide when hovering
  useEffect(() => {
    if (isHovered) {
      setIsAutoHidden(false)
    }
  }, [isHovered])

  const handleToggleMenu = () => {
    setCollapsed(!collapsed)
    setIsAutoHidden(false)
  }

  const shouldCollapse = collapsed && (!isHovered || isAutoHidden)

  return (
    <div 
      className={cn(
        "flex flex-col h-full bg-background border-r transition-all duration-300 ease-in-out",
        collapsed ? "w-16" : "w-64"
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b">
        {!shouldCollapse && (
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-sm">JD</span>
            </div>
            <div>
              <h1 className="text-lg font-semibold">JDML Cloud</h1>
              <p className="text-xs text-muted-foreground">Servicios de Infraestructura</p>
            </div>
          </div>
        )}
        
        <Button
          variant="ghost"
          size="sm"
          onClick={handleToggleMenu}
          className="ml-auto"
        >
          {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </Button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto p-4 space-y-6 scrollbar-hide">
        {Object.entries(groupedNavigation).map(([category, items]) => (
          <div key={category} className="space-y-2">
            {!shouldCollapse && (
              <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                {categoryLabels[category as keyof typeof categoryLabels]}
              </h3>
            )}
            <div className="space-y-1">
              {items.map((item) => {
                const isActive = pathname === item.href
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={cn(
                      "flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                      isActive
                        ? "bg-primary text-primary-foreground"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground"
                    )}
                  >
                    <item.icon className="h-4 w-4 flex-shrink-0" />
                    {!shouldCollapse && (
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
            </div>
          </div>
        ))}
      </nav>

      {/* User Profile */}
      <div className="p-4 border-t">
        {!shouldCollapse ? (
          <div className="flex items-center space-x-3">
            <Avatar className="h-8 w-8">
              <AvatarImage src={user?.avatar} />
              <AvatarFallback>
                {user?.firstName?.[0] || user?.email?.[0] || "U"}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">
                {user?.firstName || user?.email || "Usuario"}
              </p>
              <p className="text-xs text-muted-foreground truncate">
                {user?.email || "usuario@ejemplo.com"}
              </p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={logout}
              className="text-muted-foreground hover:text-foreground"
            >
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        ) : (
          <div className="flex flex-col items-center space-y-2">
            <Avatar className="h-8 w-8">
              <AvatarImage src={user?.avatar} />
              <AvatarFallback>
                {user?.firstName?.[0] || user?.email?.[0] || "U"}
              </AvatarFallback>
            </Avatar>
            <Button
              variant="ghost"
              size="sm"
              onClick={logout}
              className="text-muted-foreground hover:text-foreground"
            >
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>

      {/* Version */}
      {!shouldCollapse && (
        <div className="px-4 pb-4">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>Versión</span>
            <Badge variant="outline" className="text-xs">
              {getVersionString()}
            </Badge>
          </div>
        </div>
      )}
    </div>
  )
}

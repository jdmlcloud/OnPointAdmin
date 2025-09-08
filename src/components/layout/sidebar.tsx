"use client"

// import { useSession } from "next-auth/react"
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
// import { signOut } from "next-auth/react"
import { useState } from "react"
import { useRoles } from "@/hooks/use-roles"

const navigation = [
  {
    name: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
    badge: null,
    permission: "canViewDashboard",
    status: "ready"
  },
  {
    name: "Proveedores",
    href: "/providers",
    icon: Building2,
    badge: "✅",
    permission: "canManageProviders",
    status: "ready"
  },
  {
    name: "Productos",
    href: "/products",
    icon: Package,
    badge: "✅",
    permission: "canManageProducts",
    status: "ready"
  },
  {
    name: "Usuarios",
    href: "/users",
    icon: Users,
    badge: "✅",
    permission: "canManageUsers",
    status: "ready"
  },
  {
    name: "WhatsApp + IA",
    href: "#",
    icon: MessageSquare,
    badge: "🚧",
    permission: "canManageWhatsApp",
    status: "development"
  },
  {
    name: "Cotizaciones",
    href: "#",
    icon: TrendingUp,
    badge: "🚧",
    permission: "canManageQuotations",
    status: "development"
  },
  {
    name: "Propuestas",
    href: "#",
    icon: FileText,
    badge: "🚧",
    permission: "canManageProposals",
    status: "development"
  },
  {
    name: "Generador PDFs",
    href: "#",
    icon: FileBarChart,
    badge: "🚧",
    permission: "canGeneratePDFs",
    status: "development"
  },
  {
    name: "Envío y Tracking",
    href: "#",
    icon: BarChart3,
    badge: "🚧",
    permission: "canViewAnalytics",
    status: "development"
  },
  {
    name: "Editor Visual",
    href: "#",
    icon: Palette,
    badge: "🚧",
    permission: "canManageTemplates",
    status: "development"
  },
  {
    name: "Analytics",
    href: "#",
    icon: BarChart3,
    badge: "🚧",
    permission: "canViewAnalytics",
    status: "development"
  },
  {
    name: "Reportes",
    href: "#",
    icon: FileBarChart,
    badge: "🚧",
    permission: "canViewReports",
    status: "development"
  },
  {
    name: "Integraciones",
    href: "#",
    icon: Zap,
    badge: "🚧",
    permission: "canManageIntegrations",
    status: "development"
  },
  {
    name: "Sistema",
    href: "/system",
    icon: Shield,
    badge: "✅",
    permission: "canManageSystem",
    status: "ready"
  },
  {
    name: "Configuración",
    href: "/settings",
    icon: Settings,
    badge: "✅",
    permission: "canManageSettings",
    status: "ready"
  },
]

export function Sidebar() {
  // const { data: session } = useSession()
  const pathname = usePathname()
  const [collapsed, setCollapsed] = useState(false)
  const { hasPermission } = useRoles()

  const handleSignOut = () => {
    // Redirigir al login sin NextAuth
    window.location.href = 'https://sandbox-deploy.d3ts6pwgn7uyyh.amplifyapp.com/auth/signin'
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
        {navigation.filter(item => hasPermission(item.permission as any)).map((item) => {
          const isActive = pathname === item.href
          const Icon = item.icon
          const isDevelopment = item.status === "development"
          
          const buttonContent = (
            <Button
              variant={isActive ? "default" : "ghost"}
              className={cn(
                "w-full justify-start gap-3 h-10",
                collapsed && "px-2",
                isDevelopment && "opacity-60 cursor-not-allowed"
              )}
              disabled={isDevelopment}
            >
              <Icon className="h-4 w-4 flex-shrink-0" />
              {!collapsed && (
                <>
                  <span className="flex-1 text-left">{item.name}</span>
                  {item.badge && (
                    <Badge 
                      variant={item.badge === "✅" ? "default" : "secondary"}
                      className="text-xs"
                    >
                      {item.badge}
                    </Badge>
                  )}
                </>
              )}
            </Button>
          )
          
          if (isDevelopment) {
            return (
              <div key={item.name} title="En desarrollo - Próximamente">
                {buttonContent}
              </div>
            )
          }
          
          return (
            <Link key={item.name} href={item.href}>
              {buttonContent}
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
            <AvatarImage src={session?.user?.image || ""} />
            <AvatarFallback>
              {session?.user?.name?.charAt(0) || "U"}
            </AvatarFallback>
          </Avatar>
          {!collapsed && (
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">
                {session?.user?.name || "Usuario"}
              </p>
              <p className="text-xs text-muted-foreground truncate">
                {session?.user?.email || "usuario@ejemplo.com"}
              </p>
              <Badge variant="outline" className="text-xs mt-1">
                {(session as any)?.role || "ejecutivo"}
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

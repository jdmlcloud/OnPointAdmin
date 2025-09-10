"use client"

import { useCognitoReal } from "@/hooks/use-cognito-real"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { 
  Bell, 
  Search, 
  Settings, 
  LogOut,
  Moon,
  Sun,
  Monitor,
  Shield
} from "lucide-react"
import { useRouter } from "next/navigation"
import { useTheme } from "next-themes"
import { Input } from "@/components/ui/input"
import { NotificationDropdown } from "@/components/notifications/notification-dropdown"
import { RoleSwitcher } from "@/components/role-switcher"

export function HeaderCognitoIntegrated() {
  const { user, signOut } = useCognitoReal()
  const { theme, setTheme } = useTheme()
  const router = useRouter()

  const handleSignOut = async () => {
    try {
      await signOut()
      router.push('/auth/cognito-real')
    } catch (error) {
      console.error('Error al cerrar sesión:', error)
    }
  }

  const toggleTheme = () => {
    if (theme === "light") {
      setTheme("dark")
    } else if (theme === "dark") {
      setTheme("system")
    } else if (theme === "system") {
      setTheme("light")
    } else {
      // Si theme es undefined o cualquier otro valor, empezar con light
      setTheme("light")
    }
  }

  const getThemeIcon = () => {
    switch (theme) {
      case "light":
        return <Sun className="h-4 w-4" />
      case "dark":
        return <Moon className="h-4 w-4" />
      case "system":
        return <Monitor className="h-4 w-4" />
      default:
        return <Sun className="h-4 w-4" />
    }
  }

  return (
    <header className="h-16 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-16 items-center justify-between px-6">
        {/* Search */}
        <div className="flex items-center gap-4 flex-1 max-w-md">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Buscar en el sistema..."
              className="pl-10 w-80"
            />
          </div>
        </div>

        {/* Right side */}
        <div className="flex items-center gap-4">
          {/* AWS Cognito Status */}
          <div className="flex items-center gap-2">
            <Shield className="h-4 w-4 text-blue-600" />
            <Badge variant="outline" className="text-xs bg-blue-50 text-blue-700">
              AWS Cognito
            </Badge>
          </div>

          {/* Theme Toggle */}
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleTheme}
            className="h-9 w-9 p-0"
          >
            {getThemeIcon()}
          </Button>

          {/* Notifications */}
          <NotificationDropdown />

          {/* Settings */}
          <Button variant="ghost" size="sm" className="h-9 w-9 p-0">
            <Settings className="h-4 w-4" />
          </Button>

          {/* Role Switcher */}
          <RoleSwitcher />

          {/* User Profile */}
          <div className="flex items-center gap-3 pl-4 border-l">
            <div className="text-right">
              <p className="text-sm font-medium">
                {user?.name || "Usuario"}
              </p>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="text-xs">
                  {typeof user?.role === 'string' ? user.role : (user?.role as any)?.name || "ejecutivo"}
                </Badge>
                <Badge variant="secondary" className="text-xs bg-green-50 text-green-700">
                  Real
                </Badge>
              </div>
            </div>
            <Avatar className="h-8 w-8">
              <AvatarImage src="" />
              <AvatarFallback>
                {user?.name?.charAt(0) || "U"}
              </AvatarFallback>
            </Avatar>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleSignOut}
              className="h-8 w-8 p-0"
            >
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </header>
  )
}

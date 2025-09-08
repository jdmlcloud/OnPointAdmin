"use client"

// import { useSession } from "next-auth/react"
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
  Monitor
} from "lucide-react"
// import { signOut } from "next-auth/react"
import { useTheme } from "next-themes"
import { Input } from "@/components/ui/input"
import { NotificationDropdown } from "@/components/notifications/notification-dropdown"
import { RoleSwitcher } from "@/components/role-switcher"

export function Header() {
  // const { data: session } = useSession()
  const { theme, setTheme } = useTheme()

  const handleSignOut = () => {
    // Redirigir al login sin NextAuth
    window.location.href = 'https://sandbox-deploy.d3ts6pwgn7uyyh.amplifyapp.com/auth/signin'
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
                Usuario Demo
              </p>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="text-xs">
                  admin
                </Badge>
              </div>
            </div>
            <Avatar className="h-8 w-8">
              <AvatarImage src="" />
              <AvatarFallback>
                U
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

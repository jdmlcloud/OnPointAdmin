"use client"

import { useState } from "react"
import { Bell, Check, X, AlertCircle, CheckCircle, Info, AlertTriangle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useNotifications, Notification } from "@/hooks/use-notifications"
import { cn } from "@/lib/utils"

const getNotificationIcon = (type: Notification['type']) => {
  switch (type) {
    case 'success':
      return <CheckCircle className="h-4 w-4 text-green-600" />
    case 'error':
      return <AlertCircle className="h-4 w-4 text-red-600" />
    case 'warning':
      return <AlertTriangle className="h-4 w-4 text-yellow-600" />
    case 'info':
    default:
      return <Info className="h-4 w-4 text-blue-600" />
  }
}

const getNotificationColor = (type: Notification['type']) => {
  switch (type) {
    case 'success':
      return 'border-l-green-500 bg-green-50 dark:bg-green-950/20'
    case 'error':
      return 'border-l-red-500 bg-red-50 dark:bg-red-950/20'
    case 'warning':
      return 'border-l-yellow-500 bg-yellow-50 dark:bg-yellow-950/20'
    case 'info':
    default:
      return 'border-l-blue-500 bg-blue-50 dark:bg-blue-950/20'
  }
}

export function NotificationDropdown() {
  const [isOpen, setIsOpen] = useState(false)
  const { notifications, unreadCount, markAsRead, markAllAsRead, removeNotification } = useNotifications()

  const formatTimeAgo = (date: Date) => {
    const now = new Date()
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60))
    
    if (diffInMinutes < 1) return 'Ahora'
    if (diffInMinutes < 60) return `hace ${diffInMinutes}m`
    if (diffInMinutes < 1440) return `hace ${Math.floor(diffInMinutes / 60)}h`
    return `hace ${Math.floor(diffInMinutes / 1440)}d`
  }

  return (
    <div className="relative">
      <Button
        variant="ghost"
        size="sm"
        className="relative"
        onClick={() => setIsOpen(!isOpen)}
      >
        <Bell className="h-5 w-5" />
        {unreadCount > 0 && (
          <Badge 
            variant="destructive" 
            className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs animate-pulse"
          >
            {unreadCount > 9 ? '9+' : unreadCount}
          </Badge>
        )}
      </Button>

      {isOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 z-40" 
            onClick={() => setIsOpen(false)}
          />
          
          {/* Dropdown */}
          <Card className="absolute right-0 top-12 w-96 z-50 shadow-lg border animate-in slide-in-from-top-2 duration-200">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">Notificaciones</CardTitle>
                <div className="flex gap-2">
                  {unreadCount > 0 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={markAllAsRead}
                      className="text-xs"
                    >
                      <Check className="h-3 w-3 mr-1" />
                      Marcar todas
                    </Button>
                  )}
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="p-0 max-h-96 overflow-y-auto scrollbar-hide">
              {notifications.length === 0 ? (
                <div className="p-6 text-center text-muted-foreground">
                  <Bell className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p>No hay notificaciones</p>
                </div>
              ) : (
                <div className="space-y-1">
                  {notifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={cn(
                        "p-4 border-l-4 transition-all duration-200 hover:bg-muted/50",
                        getNotificationColor(notification.type),
                        !notification.read && "bg-muted/30"
                      )}
                    >
                      <div className="flex items-start gap-3">
                        <div className="flex-shrink-0 mt-0.5">
                          {getNotificationIcon(notification.type)}
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex-1">
                              <h4 className="text-sm font-medium leading-tight">
                                {notification.title}
                              </h4>
                              <p className="text-sm text-muted-foreground mt-1">
                                {notification.message}
                              </p>
                              <div className="flex items-center gap-2 mt-2">
                                <span className="text-xs text-muted-foreground">
                                  {formatTimeAgo(new Date(notification.timestamp))}
                                </span>
                                {!notification.read && (
                                  <div className="w-2 h-2 bg-blue-600 rounded-full animate-pulse" />
                                )}
                              </div>
                            </div>
                            
                            <div className="flex gap-1">
                              {!notification.read && (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => markAsRead(notification.id)}
                                  className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                  <Check className="h-3 w-3" />
                                </Button>
                              )}
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => removeNotification(notification.id)}
                                className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                              >
                                <X className="h-3 w-3" />
                              </Button>
                            </div>
                          </div>
                          
                          {notification.action && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={notification.action.onClick}
                              className="mt-2 h-7 text-xs"
                            >
                              {notification.action.label}
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </>
      )}
    </div>
  )
}

"use client"

import { CardItem, CardItemProps } from "@/components/ui/card-item"
import { Users } from "lucide-react"

export interface UserCardProps extends Omit<CardItemProps, 'type'> {
  // Campos específicos de usuarios
  role?: string
  department?: string
  lastLogin?: string
  isActive?: boolean
}

export function UserCard({
  isActive = true,
  status,
  role,
  department,
  lastLogin,
  ...props
}: UserCardProps) {
  return (
    <CardItem
      {...props}
      type="user"
      status={status || (isActive ? "active" : "inactive")}
      badgeVariant={isActive ? "default" : "secondary"}
      badge={role}
      date={lastLogin}
      location={department}
    />
  )
}

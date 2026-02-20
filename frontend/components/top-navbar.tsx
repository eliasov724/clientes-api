"use client"

import { Bell, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

interface TopNavbarProps {
  title: string
  description?: string
}

export function TopNavbar({ title, description }: TopNavbarProps) {
  return (
    <header className="sticky top-0 z-20 flex items-center justify-between h-16 px-6 bg-card border-b border-border">
      <div className="flex flex-col">
        <h1 className="text-lg font-semibold text-card-foreground tracking-tight">
          {title}
        </h1>
        {description && (
          <p className="text-xs text-muted-foreground">{description}</p>
        )}
      </div>

      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon-sm" className="text-muted-foreground hover:text-foreground">
          <Search className="size-4" />
          <span className="sr-only">Buscar</span>
        </Button>
        <Button variant="ghost" size="icon-sm" className="text-muted-foreground hover:text-foreground relative">
          <Bell className="size-4" />
          <span className="absolute top-1 right-1 size-2 rounded-full bg-primary" />
          <span className="sr-only">Notificaciones</span>
        </Button>
        <div className="ml-2 pl-3 border-l border-border">
          <Avatar className="size-8">
            <AvatarFallback className="bg-primary text-primary-foreground text-xs font-medium">
              AD
            </AvatarFallback>
          </Avatar>
        </div>
      </div>
    </header>
  )
}

"use client"

import { usePathname } from "next/navigation"
import Link from "next/link"
import {
  Users,
  LayoutDashboard,
  Settings,
  HelpCircle,
  Building2,
  ChevronLeft,
  ChevronRight,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { useSidebarState } from "@/components/sidebar-provider"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

const navigation = [
  { name: "Panel", href: "/", icon: LayoutDashboard },
  { name: "Clientes", href: "/clients", icon: Users },
  { name: "Configuración", href: "#", icon: Settings },
  { name: "Ayuda", href: "#", icon: HelpCircle },
]

export function AppSidebar() {
  const pathname = usePathname()
  const { collapsed, toggle } = useSidebarState()

  return (
    <TooltipProvider delayDuration={0}>
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-30 flex flex-col bg-sidebar text-sidebar-foreground border-r border-sidebar-border transition-all duration-300",
          collapsed ? "w-16" : "w-60"
        )}
      >
        <div className={cn("flex items-center h-16 px-4 border-b border-sidebar-border", collapsed ? "justify-center" : "gap-3")}>
          <div className="flex items-center justify-center size-8 rounded-lg bg-sidebar-primary text-sidebar-primary-foreground shrink-0">
            <Building2 className="size-4" />
          </div>
          {!collapsed && (
            <div className="flex flex-col min-w-0">
              <span className="text-sm font-semibold text-sidebar-foreground truncate">
                ClientFlow
              </span>
              <span className="text-[11px] text-sidebar-foreground/50 truncate">
                Gestión
              </span>
            </div>
          )}
        </div>

        <nav className="flex-1 px-2 py-4">
          <ul className="flex flex-col gap-1">
            {navigation.map((item) => {
              const isActive = item.href === "/clients"
                ? pathname.startsWith("/clients")
                : pathname === item.href
              return (
                <li key={item.name}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Link
                        href={item.href}
                        className={cn(
                          "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                          isActive
                            ? "bg-sidebar-accent text-sidebar-accent-foreground"
                            : "text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground",
                          collapsed && "justify-center px-0"
                        )}
                      >
                        <item.icon className="size-[18px] shrink-0" />
                        {!collapsed && <span>{item.name}</span>}
                      </Link>
                    </TooltipTrigger>
                    {collapsed && (
                      <TooltipContent side="right">
                        {item.name}
                      </TooltipContent>
                    )}
                  </Tooltip>
                </li>
              )
            })}
          </ul>
        </nav>

        <div className="px-2 py-3 border-t border-sidebar-border">
          <Button
            variant="ghost"
            size="sm"
            onClick={toggle}
            className={cn(
              "w-full text-sidebar-foreground/60 hover:text-sidebar-foreground hover:bg-sidebar-accent/50",
              collapsed ? "justify-center px-0" : "justify-start"
            )}
          >
            {collapsed ? (
              <ChevronRight className="size-4" />
            ) : (
              <>
                <ChevronLeft className="size-4" />
                <span className="text-xs">Contraer</span>
              </>
            )}
          </Button>
        </div>
      </aside>
    </TooltipProvider>
  )
}

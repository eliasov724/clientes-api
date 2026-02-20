"use client"

import { AppSidebar } from "@/components/app-sidebar"
import { TopNavbar } from "@/components/top-navbar"
import { SidebarProvider, useSidebarState } from "@/components/sidebar-provider"
import { cn } from "@/lib/utils"

interface DashboardLayoutProps {
  children: React.ReactNode
  title: string
  description?: string
}

function LayoutInner({ children, title, description }: DashboardLayoutProps) {
  const { collapsed } = useSidebarState()

  return (
    <div className="min-h-screen bg-background">
      <AppSidebar />
      <div className={cn("transition-all duration-300", collapsed ? "pl-16" : "pl-60")}>
        <TopNavbar title={title} description={description} />
        <main className="p-6">
          {children}
        </main>
      </div>
    </div>
  )
}

export function DashboardLayout(props: DashboardLayoutProps) {
  return (
    <SidebarProvider>
      <LayoutInner {...props} />
    </SidebarProvider>
  )
}

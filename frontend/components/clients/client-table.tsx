"use client"

import { Eye, Pencil, Trash2, MoreHorizontal } from "lucide-react"
import type { Client } from "@/lib/types"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Skeleton } from "@/components/ui/skeleton"

interface ClientTableProps {
  clients: Client[]
  loading?: boolean
  onView: (client: Client) => void
  onEdit: (client: Client) => void
  onDelete: (client: Client) => void
}

export function ClientTable({ clients, loading, onView, onEdit, onDelete }: ClientTableProps) {
  if (loading) {
    return <ClientTableSkeleton />
  }

  if (clients.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="size-12 rounded-full bg-muted flex items-center justify-center mb-3">
          <Eye className="size-5 text-muted-foreground" />
        </div>
        <p className="text-sm font-medium text-foreground">No se encontraron clientes</p>
        <p className="text-xs text-muted-foreground mt-1">
          Intentá ajustar tu búsqueda o agregá un nuevo cliente.
        </p>
      </div>
    )
  }

  return (
    <div className="bg-card rounded-lg border border-border shadow-sm overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/40 hover:bg-muted/40">
            <TableHead className="pl-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Nombre
            </TableHead>
            <TableHead className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Teléfono
            </TableHead>
            <TableHead className="text-xs font-semibold uppercase tracking-wider text-muted-foreground hidden md:table-cell">
              Email
            </TableHead>
            <TableHead className="text-xs font-semibold uppercase tracking-wider text-muted-foreground hidden lg:table-cell">
              CUIT
            </TableHead>
            <TableHead className="text-xs font-semibold uppercase tracking-wider text-muted-foreground hidden xl:table-cell">
              Razón Social
            </TableHead>
            <TableHead className="text-xs font-semibold uppercase tracking-wider text-muted-foreground text-right pr-4">
              Acciones
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {clients.map((client) => (
            <TableRow
              key={client.id}
              className="group cursor-pointer hover:bg-accent/50 transition-colors"
              onClick={() => onView(client)}
            >
              <TableCell className="pl-4">
                <div className="flex items-center gap-3">
                  <div className="size-9 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-semibold shrink-0">
                    {client.firstName[0]}
                    {client.lastName[0]}
                  </div>
                  <div className="flex flex-col min-w-0">
                    <span className="text-sm font-medium text-card-foreground truncate">
                      {client.firstName} {client.lastName}
                    </span>
                    <span className="text-xs text-muted-foreground truncate md:hidden">
                      {client.email}
                    </span>
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <span className="text-sm text-card-foreground">{client.mobilePhone}</span>
              </TableCell>
              <TableCell className="hidden md:table-cell">
                <span className="text-sm text-muted-foreground">{client.email}</span>
              </TableCell>
              <TableCell className="hidden lg:table-cell">
                <span className="text-sm text-muted-foreground font-mono text-xs">{client.cuit}</span>
              </TableCell>
              <TableCell className="hidden xl:table-cell">
                <span className="text-sm text-muted-foreground truncate max-w-[200px] block">
                  {client.businessName}
                </span>
              </TableCell>
              <TableCell className="text-right pr-4">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      className="opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-foreground"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <MoreHorizontal className="size-4" />
                      <span className="sr-only">Abrir menú de acciones</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-40">
                    <DropdownMenuItem
                      onClick={(e) => {
                        e.stopPropagation()
                        onView(client)
                      }}
                    >
                      <Eye className="size-4 mr-2" />
                      Ver
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={(e) => {
                        e.stopPropagation()
                        onEdit(client)
                      }}
                    >
                      <Pencil className="size-4 mr-2" />
                      Editar
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={(e) => {
                        e.stopPropagation()
                        onDelete(client)
                      }}
                      className="text-destructive focus:text-destructive"
                    >
                      <Trash2 className="size-4 mr-2" />
                      Eliminar
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

function ClientTableSkeleton() {
  return (
    <div className="bg-card rounded-lg border border-border shadow-sm overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/40 hover:bg-muted/40">
            <TableHead className="pl-4">
              <Skeleton className="h-3 w-16" />
            </TableHead>
            <TableHead>
              <Skeleton className="h-3 w-12" />
            </TableHead>
            <TableHead className="hidden md:table-cell">
              <Skeleton className="h-3 w-12" />
            </TableHead>
            <TableHead className="hidden lg:table-cell">
              <Skeleton className="h-3 w-10" />
            </TableHead>
            <TableHead className="hidden xl:table-cell">
              <Skeleton className="h-3 w-24" />
            </TableHead>
            <TableHead className="text-right pr-4">
              <Skeleton className="h-3 w-14 ml-auto" />
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {Array.from({ length: 5 }).map((_, i) => (
            <TableRow key={i}>
              <TableCell className="pl-4">
                <div className="flex items-center gap-3">
                  <Skeleton className="size-9 rounded-full" />
                  <div className="flex flex-col gap-1">
                    <Skeleton className="h-3.5 w-28" />
                    <Skeleton className="h-2.5 w-20" />
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <Skeleton className="h-3.5 w-24" />
              </TableCell>
              <TableCell className="hidden md:table-cell">
                <Skeleton className="h-3.5 w-36" />
              </TableCell>
              <TableCell className="hidden lg:table-cell">
                <Skeleton className="h-3.5 w-28" />
              </TableCell>
              <TableCell className="hidden xl:table-cell">
                <Skeleton className="h-3.5 w-40" />
              </TableCell>
              <TableCell className="text-right pr-4">
                <Skeleton className="size-8 rounded-md ml-auto" />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

"use client"

import {
  Mail,
  Phone,
  Building2,
  CreditCard,
  Calendar,
  ArrowLeft,
  Pencil,
  Trash2,
  User,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import type { Client } from "@/lib/types"

interface ClientDetailPanelProps {
  client: Client
  onBack: () => void
  onEdit: (client: Client) => void
  onDelete: (client: Client) => void
}

function formatDate(dateStr?: string): string {
  if (!dateStr) return "N/D"
  return new Intl.DateTimeFormat("es-AR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(new Date(dateStr))
}

export function ClientDetailPanel({ client, onBack, onEdit, onDelete }: ClientDetailPanelProps) {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" onClick={onBack} className="gap-2 text-muted-foreground hover:text-foreground">
          <ArrowLeft className="size-4" />
          Volver al listado
        </Button>
      </div>

      <div className="bg-card rounded-xl border border-border shadow-sm overflow-hidden">
        <div className="relative px-6 py-8 bg-primary/5 border-b border-border">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              <div className="size-16 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xl font-bold">
                {client.firstName[0]}
                {client.lastName[0]}
              </div>
              <div className="flex flex-col gap-1">
                <h2 className="text-xl font-semibold text-card-foreground">
                  {client.firstName} {client.lastName}
                </h2>
                <p className="text-sm text-muted-foreground">{client.businessName}</p>
                <Badge variant="secondary" className="w-fit mt-1 text-xs">
                  Cliente Activo
                </Badge>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={() => onEdit(client)} className="gap-2">
                <Pencil className="size-3.5" />
                Editar
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onDelete(client)}
                className="gap-2 text-destructive border-destructive/30 hover:bg-destructive/10 hover:text-destructive"
              >
                <Trash2 className="size-3.5" />
                Eliminar
              </Button>
            </div>
          </div>
        </div>

        <div className="p-6">
          <h3 className="text-sm font-semibold text-foreground mb-4">Información de Contacto</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <DetailItem
              icon={<User className="size-4" />}
              label="Nombre Completo"
              value={`${client.firstName} ${client.lastName}`}
            />
            <DetailItem
              icon={<Mail className="size-4" />}
              label="Dirección de Email"
              value={client.email}
              href={`mailto:${client.email}`}
            />
            <DetailItem
              icon={<Phone className="size-4" />}
              label="Número de Teléfono"
              value={client.phone}
              href={`tel:${client.phone}`}
            />
            <DetailItem
              icon={<Building2 className="size-4" />}
              label="Razón Social"
              value={client.businessName}
            />
          </div>

          <Separator className="my-6" />

          <h3 className="text-sm font-semibold text-foreground mb-4">Datos del Negocio</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <DetailItem
              icon={<CreditCard className="size-4" />}
              label="CUIT"
              value={client.cuit}
              mono
            />
            <DetailItem
              icon={<Calendar className="size-4" />}
              label="Cliente Desde"
              value={formatDate(client.createdAt)}
            />
          </div>

          {client.updatedAt && (
            <>
              <Separator className="my-6" />
              <p className="text-xs text-muted-foreground">
                Última actualización: {formatDate(client.updatedAt)}
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

function DetailItem({
  icon,
  label,
  value,
  href,
  mono,
}: {
  icon: React.ReactNode
  label: string
  value: string
  href?: string
  mono?: boolean
}) {
  return (
    <div className="flex items-start gap-3">
      <div className="flex items-center justify-center size-9 rounded-lg bg-muted text-muted-foreground shrink-0">
        {icon}
      </div>
      <div className="flex flex-col min-w-0">
        <span className="text-xs text-muted-foreground">{label}</span>
        {href ? (
          <a
            href={href}
            className="text-sm font-medium text-primary hover:underline truncate"
          >
            {value}
          </a>
        ) : (
          <span className={`text-sm font-medium text-card-foreground truncate ${mono ? "font-mono text-xs" : ""}`}>
            {value}
          </span>
        )}
      </div>
    </div>
  )
}

"use client"

import { useCallback, useEffect, useState } from "react"
import { Plus, Users } from "lucide-react"
import { toast } from "sonner"
import { DashboardLayout } from "@/components/dashboard-layout"
import { ClientSearch } from "@/components/clients/client-search"
import { ClientTable } from "@/components/clients/client-table"
import { ClientPagination } from "@/components/clients/client-pagination"
import { ClientFormModal } from "@/components/clients/client-form-modal"
import { DeleteClientDialog } from "@/components/clients/delete-client-dialog"
import { ClientDetailPanel } from "@/components/clients/client-detail-panel"
import { Button } from "@/components/ui/button"
import { useClients } from "@/hooks/use-clients"
import type { Client } from "@/lib/types"
import type { ClientFormValues } from "@/lib/validation"

export default function ClientsPage() {
  const {
    data,
    loading,
    fetchClients,
    createClient,
    updateClient,
    deleteClient,
    searchClients,
  } = useClients()

  const [currentPage, setCurrentPage] = useState(0)
  const [searchQuery, setSearchQuery] = useState("")
  const [formOpen, setFormOpen] = useState(false)
  const [editingClient, setEditingClient] = useState<Client | null>(null)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [deletingClient, setDeletingClient] = useState<Client | null>(null)
  const [selectedClient, setSelectedClient] = useState<Client | null>(null)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    fetchClients(currentPage, searchQuery || undefined)
  }, [currentPage, searchQuery, fetchClients])

  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query)
    setCurrentPage(0)
  }, [])

  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page)
  }, [])

  const handleView = useCallback((client: Client) => {
    setSelectedClient(client)
  }, [])

  const handleEdit = useCallback((client: Client) => {
    setEditingClient(client)
    setFormOpen(true)
  }, [])

  const handleDelete = useCallback((client: Client) => {
    setDeletingClient(client)
    setDeleteDialogOpen(true)
  }, [])

  const handleFormSubmit = useCallback(
    async (formData: ClientFormValues) => {
      setSubmitting(true)
      try {
        if (editingClient) {
          await updateClient(editingClient.id, formData)
          toast.success("Cliente actualizado", {
            description: `${formData.firstName} ${formData.lastName} fue actualizado correctamente.`,
          })
        } else {
          await createClient(formData)
          toast.success("Cliente creado", {
            description: `${formData.firstName} ${formData.lastName} fue agregado correctamente.`,
          })
        }
        setFormOpen(false)
        setEditingClient(null)
        fetchClients(currentPage, searchQuery || undefined)
      } catch (err) {
        toast.error("Error", {
          description: err instanceof Error ? err.message : "Ocurrió un error inesperado.",
        })
      } finally {
        setSubmitting(false)
      }
    },
    [editingClient, updateClient, createClient, fetchClients, currentPage, searchQuery]
  )

  const handleDeleteConfirm = useCallback(async () => {
    if (!deletingClient) return
    setSubmitting(true)
    try {
      await deleteClient(deletingClient.id)
      toast.success("Cliente eliminado", {
        description: `${deletingClient.firstName} ${deletingClient.lastName} fue eliminado correctamente.`,
      })
      setDeleteDialogOpen(false)
      setDeletingClient(null)
      if (selectedClient?.id === deletingClient.id) {
        setSelectedClient(null)
      }
      fetchClients(currentPage, searchQuery || undefined)
    } catch (err) {
      toast.error("Error", {
        description: err instanceof Error ? err.message : "No se pudo eliminar el cliente.",
      })
    } finally {
      setSubmitting(false)
    }
  }, [deletingClient, deleteClient, fetchClients, currentPage, searchQuery, selectedClient])

  if (selectedClient) {
    return (
      <DashboardLayout title="Detalle del Cliente" description="Información completa del cliente">
        <ClientDetailPanel
          client={selectedClient}
          onBack={() => setSelectedClient(null)}
          onEdit={(c) => {
            setSelectedClient(null)
            handleEdit(c)
          }}
          onDelete={handleDelete}
        />
        <DeleteClientDialog
          open={deleteDialogOpen}
          onOpenChange={setDeleteDialogOpen}
          client={deletingClient}
          onConfirm={handleDeleteConfirm}
          loading={submitting}
        />
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout title="Clientes" description="Administrá tu base de clientes">
      <div className="flex flex-col gap-6">
        {/* Stats row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <StatsCard
            label="Total de Clientes"
            value={data?.totalElements ?? 0}
            icon={<Users className="size-4" />}
          />
          <StatsCard
            label="Página Actual"
            value={data ? data.number + 1 : 0}
            suffix={data ? ` de ${data.totalPages}` : ""}
          />
          <StatsCard
            label="Mostrando"
            value={data?.content.length ?? 0}
            suffix=" resultados"
          />
        </div>

        {/* Toolbar */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <ClientSearch
            onSearch={handleSearch}
            onSelectClient={handleView}
            searchFn={async () => []}
          />
          <Button
            onClick={() => {
              setEditingClient(null)
              setFormOpen(true)
            }}
            className="gap-2 shrink-0"
          >
            <Plus className="size-4" />
            Nuevo Cliente
          </Button>
        </div>

        {/* Table */}
        <ClientTable
          clients={data?.content ?? []}
          loading={loading}
          onView={handleView}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />

        {/* Pagination */}
        {data && data.totalPages > 0 && (
          <ClientPagination
            currentPage={data.number}
            totalPages={data.totalPages}
            totalElements={data.totalElements}
            pageSize={data.size}
            onPageChange={handlePageChange}
          />
        )}
      </div>

      {/* Modals */}
      <ClientFormModal
        open={formOpen}
        onOpenChange={(open) => {
          setFormOpen(open)
          if (!open) setEditingClient(null)
        }}
        client={editingClient}
        onSubmit={handleFormSubmit}
        loading={submitting}
      />
      <DeleteClientDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        client={deletingClient}
        onConfirm={handleDeleteConfirm}
        loading={submitting}
      />
    </DashboardLayout>
  )
}

function StatsCard({
  label,
  value,
  suffix,
  icon,
}: {
  label: string
  value: number
  suffix?: string
  icon?: React.ReactNode
}) {
  return (
    <div className="bg-card rounded-lg border border-border shadow-sm px-5 py-4 flex items-center gap-4">
      {icon && (
        <div className="flex items-center justify-center size-10 rounded-lg bg-primary/10 text-primary shrink-0">
          {icon}
        </div>
      )}
      <div className="flex flex-col">
        <span className="text-xs text-muted-foreground font-medium">{label}</span>
        <span className="text-lg font-semibold text-card-foreground tabular-nums">
          {value}
          {suffix && <span className="text-sm font-normal text-muted-foreground">{suffix}</span>}
        </span>
      </div>
    </div>
  )
}

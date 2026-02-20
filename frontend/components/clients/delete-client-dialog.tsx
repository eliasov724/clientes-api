"use client"

import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog"
import type { Client } from "@/lib/types"
import { Loader2, AlertTriangle } from "lucide-react"

interface DeleteClientDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  client: Client | null
  onConfirm: () => Promise<void>
  loading?: boolean
}

export function DeleteClientDialog({
  open,
  onOpenChange,
  client,
  onConfirm,
  loading,
}: DeleteClientDialogProps) {
  if (!client) return null

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <div className="flex items-center gap-3 mb-1">
            <div className="flex items-center justify-center size-10 rounded-full bg-destructive/10">
              <AlertTriangle className="size-5 text-destructive" />
            </div>
            <AlertDialogTitle>Eliminar Cliente</AlertDialogTitle>
          </div>
          <AlertDialogDescription className="text-sm leading-relaxed">
            {"¿Estás seguro de que querés eliminar a "}
            <span className="font-semibold text-foreground">
              {client.firstName} {client.lastName}
            </span>
            {" de "}
            <span className="font-semibold text-foreground">
              {client.businessName}
            </span>
            {"? Esta acción no se puede deshacer y todos los datos asociados serán eliminados permanentemente."}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={loading}>Cancelar</AlertDialogCancel>
          <AlertDialogAction
            onClick={async (e) => {
              e.preventDefault()
              await onConfirm()
            }}
            disabled={loading}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {loading && <Loader2 className="size-4 animate-spin" />}
            Eliminar Cliente
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

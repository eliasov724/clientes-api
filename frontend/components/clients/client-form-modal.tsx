"use client"

import { useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { clientFormSchema, type ClientFormValues } from "@/lib/validation"
import type { Client } from "@/lib/types"
import { cn } from "@/lib/utils"
import { Loader2 } from "lucide-react"

interface ClientFormModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  client?: Client | null
  onSubmit: (data: ClientFormValues) => Promise<void>
  loading?: boolean
}

function applyPhoneMask(value: string): string {
  const digits = value.replace(/\D/g, "")
  if (digits.length <= 2) return digits
  if (digits.length <= 10) return `${digits.slice(0, 2)}-${digits.slice(2)}`
  return `${digits.slice(0, 4)}-${digits.slice(4, 12)}`
}

function applyCuitMask(value: string): string {
  const digits = value.replace(/\D/g, "")
  if (digits.length <= 2) return digits
  if (digits.length <= 10) return `${digits.slice(0, 2)}-${digits.slice(2)}`
  return `${digits.slice(0, 2)}-${digits.slice(2, 10)}-${digits.slice(10, 11)}`
}

export function ClientFormModal({
  open,
  onOpenChange,
  client,
  onSubmit,
  loading,
}: ClientFormModalProps) {
  const isEditing = !!client

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<ClientFormValues>({
    resolver: zodResolver(clientFormSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      mobilePhone: "",
      email: "",
      cuit: "",
      businessName: "",
      fechaNacimiento: "",

    },
  })

 useEffect(() => {
   if (!open) return

   if (client) {
     reset({
       firstName: client.firstName,
       lastName: client.lastName,
       mobilePhone: client.mobilePhone,
       email: client.email,
       cuit: client.cuit,
       businessName: client.businessName,
       fechaNacimiento: client.fechaNacimiento
         ? client.fechaNacimiento.split("T")[0]
         : "",
     })
   } else {
     reset({
       firstName: "",
       lastName: "",
       mobilePhone: "",
       email: "",
       cuit: "",
       businessName: "",
       fechaNacimiento: "",
     })
   }
 }, [open, client, reset])
  const phoneValue = watch("mobilePhone")
  const cuitValue = watch("cuit")

  function handlePhoneChange(e: React.ChangeEvent<HTMLInputElement>) {
    const masked = applyPhoneMask(e.target.value)
    setValue("mobilePhone", masked, { shouldValidate: false })
  }

  function handleCuitChange(e: React.ChangeEvent<HTMLInputElement>) {
    const masked = applyCuitMask(e.target.value)
    setValue("cuit", masked, { shouldValidate: false })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{isEditing ? "Editar Cliente" : "Nuevo Cliente"}</DialogTitle>
          <DialogDescription>
            {isEditing
              ? "Modificá la información del cliente a continuación."
              : "Completá los datos para crear un nuevo cliente."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormField label="Nombre" error={errors.firstName?.message}>
              <Input
                {...register("firstName")}
                placeholder="Ej: Martín"
                aria-invalid={!!errors.firstName}
                className={cn(errors.firstName && "border-destructive")}
              />
            </FormField>

            <FormField label="Apellido" error={errors.lastName?.message}>
              <Input
                {...register("lastName")}
                placeholder="Ej: González"
                aria-invalid={!!errors.lastName}
                className={cn(errors.lastName && "border-destructive")}
              />
            </FormField>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormField label="Teléfono" error={errors.mobilePhone?.message} hint="Formato: XX-XXXXXXXX">
              <Input
                value={phoneValue || ""}
                onChange={handlePhoneChange}
                placeholder="11-45678901"
                aria-invalid={!!errors.mobilePhone}
                className={cn(errors.mobilePhone && "border-destructive")}
              />
            </FormField>

            <FormField label="Email" error={errors.email?.message}>
              <Input
                {...register("email")}
                type="email"
                placeholder="nombre@empresa.com"
                aria-invalid={!!errors.email}
                className={cn(errors.email && "border-destructive")}
              />
            </FormField>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormField label="CUIT" error={errors.cuit?.message} hint="Formato: XX-XXXXXXXX-X">
              <Input
                value={cuitValue || ""}
                onChange={handleCuitChange}
                placeholder="20-34567890-1"
                aria-invalid={!!errors.cuit}
                className={cn(errors.cuit && "border-destructive")}
              />
            </FormField>

            <FormField
              label="Fecha de Nacimiento"
              error={errors.fechaNacimiento?.message}
            >
              <Input
                type="date"
                {...register("fechaNacimiento")}
                aria-invalid={!!errors.fechaNacimiento}
                className={cn(errors.fechaNacimiento && "border-destructive")}
              />
            </FormField>

            <FormField label="Razón Social" error={errors.businessName?.message}>
              <Input
                {...register("businessName")}
                placeholder="Empresa S.R.L."
                aria-invalid={!!errors.businessName}
                className={cn(errors.businessName && "border-destructive")}
              />
            </FormField>
          </div>

          <DialogFooter className="pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={loading}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={loading}>
              {loading && <Loader2 className="size-4 animate-spin" />}
              {isEditing ? "Guardar Cambios" : "Crear Cliente"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

function FormField({
  label,
  error,
  hint,
  children,
}: {
  label: string
  error?: string
  hint?: string
  children: React.ReactNode
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-center justify-between">
        <Label className="text-sm font-medium text-foreground">{label}</Label>
        {hint && <span className="text-[11px] text-muted-foreground">{hint}</span>}
      </div>
      {children}
      {error && (
        <p className="text-xs text-destructive font-medium" role="alert">
          {error}
        </p>
      )}
    </div>
  )
}

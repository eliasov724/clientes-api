import { z } from "zod"

export const clientFormSchema = z.object({
  firstName: z
    .string()
    .min(1, "El nombre es obligatorio")
    .min(2, "El nombre debe tener al menos 2 caracteres")
    .max(50, "El nombre debe tener como máximo 50 caracteres"),
  lastName: z
    .string()
    .min(1, "El apellido es obligatorio")
    .min(2, "El apellido debe tener al menos 2 caracteres")
    .max(50, "El apellido debe tener como máximo 50 caracteres"),
  mobilePhone: z
    .string()
    .min(1, "El teléfono es obligatorio")
    .regex(
      /^\d{2,4}-\d{6,8}$/,
      "El teléfono debe seguir el formato: XX-XXXXXXXX"
    ),
  email: z
    .string()
    .min(1, "El email es obligatorio")
    .email("Ingresá una dirección de email válida"),
  cuit: z
    .string()
    .min(1, "El CUIT es obligatorio")
    .regex(
      /^\d{2}-\d{8}-\d{1}$/,
      "El CUIT debe seguir el formato: XX-XXXXXXXX-X"
    ),
  businessName: z
    .string()
    .min(1, "La razón social es obligatoria")
    .min(2, "La razón social debe tener al menos 2 caracteres")
    .max(100, "La razón social debe tener como máximo 100 caracteres"),

    fechaNacimiento: z
      .string()
      .min(1, "La fecha de nacimiento es obligatoria"),
})

export type ClientFormValues = z.infer<typeof clientFormSchema>

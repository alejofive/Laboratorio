import { z } from 'zod'

const today = new Date()
today.setHours(0, 0, 0, 0)

export const newPatientRequestSchema = z.object({
  nombre: z.string().trim().min(1, 'El nombre es requerido'),
  apellido: z.string().trim().min(1, 'El apellido es requerido'),
  fechaNacimiento: z
    .string()
    .min(1, 'La fecha de nacimiento es requerida')
    .refine(value => {
      const date = new Date(`${value}T00:00:00`)
      return !Number.isNaN(date.getTime()) && date <= today
    }, 'La fecha de nacimiento no es valida'),
  sexo: z
    .string()
    .refine(value => ['female', 'male', 'other'].includes(value), 'El sexo es requerido'),
  telefono: z
    .string()
    .trim()
    .min(1, 'El telefono es requerido')
    .regex(/^\d+$/, 'El telefono debe contener solo numeros'),
  cedula: z
    .string()
    .trim()
    .min(1, 'La cedula es requerida')
    .regex(/^\d+$/, 'La cedula debe contener solo numeros'),
  direccion: z.string().trim().min(1, 'La direccion es requerida'),
  correo: z
    .string()
    .trim()
    .max(120, 'El correo no puede superar los 120 caracteres')
    .refine(
      value => value === '' || z.string().email().safeParse(value).success,
      'El correo no es valido',
    ),
  observaciones: z.string(),
  examenes: z.array(z.string()).min(1, 'Debes seleccionar al menos un examen'),
})

export type NewPatientRequestValues = z.infer<typeof newPatientRequestSchema>

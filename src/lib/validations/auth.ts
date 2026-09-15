import { z } from 'zod'

const emailSchema = z
  .string()
  .trim()
  .min(1, 'El correo es requerido')
  .email('Ingresa un correo valido')
  .max(120, 'El correo no puede superar los 120 caracteres')

const passwordSchema = z
  .string()
  .min(1, 'La contrasena es requerida')
  .min(8, 'Usa al menos 8 caracteres')
  .regex(/[a-z]/, 'Incluye al menos una letra minuscula')
  .regex(/[A-Z]/, 'Incluye al menos una letra mayuscula')
  .regex(/\d/, 'Incluye al menos un numero')

const hexColorSchema = z
  .string()
  .trim()
  .regex(/^#[0-9A-Fa-f]{6}$/, 'Usa un color hexadecimal valido, por ejemplo #0058A8')

export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, 'La contrasena es requerida'),
})

export const registerSchema = z
  .object({
    laboratoryName: z
      .string()
      .trim()
      .min(2, 'Ingresa el nombre del laboratorio')
      .max(100, 'El nombre no puede superar los 100 caracteres'),
    professionalName: z
      .string()
      .trim()
      .min(2, 'Ingresa el nombre del responsable')
      .max(80, 'El nombre no puede superar los 80 caracteres'),
    rif: z
      .string()
      .trim()
      .regex(/^[JVEGP]-\d{8}-\d$/i, 'Usa el formato venezolano, por ejemplo J-12345678-9'),
    location: z
      .string()
      .trim()
      .min(3, 'Ingresa la ubicacion del laboratorio')
      .max(160, 'La ubicacion no puede superar los 160 caracteres'),
    email: emailSchema,
    password: passwordSchema,
    confirmPassword: z.string().min(1, 'Confirma tu contrasena'),
    primaryColor: hexColorSchema,
    secondaryColor: hexColorSchema,
  })
  .refine(values => values.password === values.confirmPassword, {
    message: 'Las contrasenas no coinciden',
    path: ['confirmPassword'],
  })

export type LoginValues = z.infer<typeof loginSchema>
export type RegisterValues = z.infer<typeof registerSchema>

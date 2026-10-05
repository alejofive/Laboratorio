import type { Metadata } from 'next'
import { RegisterForm } from '@/components/auth/RegisterForm'

export const metadata: Metadata = {
  title: 'Crear cuenta | Laboratorio Clinico Dos G',
  description: 'Registro para el sistema de gestion del Laboratorio Clinico Dos G',
}

export default function RegisterPage() {
  return <RegisterForm />
}

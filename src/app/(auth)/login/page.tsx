import type { Metadata } from 'next'
import { LoginForm } from '@/components/auth/LoginForm'

export const metadata: Metadata = {
  title: 'Iniciar sesion | Laboratorio Clinico Dos G',
  description: 'Acceso al sistema de gestion del Laboratorio Clinico Dos G',
}

export default function LoginPage() {
  return <LoginForm />
}

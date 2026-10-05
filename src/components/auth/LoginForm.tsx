'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import Link from 'next/link'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Button } from '@/components/ui/Button/Button'
import { FieldLabel, TextInput } from '@/components/ui/FormField'
import { loginSchema, type LoginValues } from '@/lib/validations/auth'
import { PasswordInput } from './PasswordInput'

export function LoginForm() {
  const [submitted, setSubmitted] = useState(false)
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  })

  const onSubmit = () => setSubmitted(true)

  return (
    <div>
      <p className="text-sm font-semibold text-brand-primary">Bienvenido de nuevo</p>
      <h2 className="mt-2 text-3xl font-semibold tracking-tight text-primary">Inicia sesion</h2>
      <p className="mt-3 text-base leading-6 text-secondary">
        Accede para continuar con la gestion de solicitudes y resultados.
      </p>

      <form
        className="mt-8 space-y-5"
        onSubmit={handleSubmit(onSubmit)}
        onChange={() => setSubmitted(false)}
        noValidate
      >
        <div>
          <FieldLabel htmlFor="login-email">Correo electronico</FieldLabel>
          <TextInput
            id="login-email"
            type="email"
            autoComplete="email"
            placeholder="nombre@laboratorio.com"
            error={errors.email?.message}
            aria-invalid={Boolean(errors.email)}
            aria-describedby={errors.email ? 'login-email-error' : undefined}
            {...register('email')}
          />
          {errors.email ? (
            <p id="login-email-error" className="mt-1.5 text-sm text-red-600" role="alert">
              {errors.email.message}
            </p>
          ) : null}
        </div>

        <div>
          <FieldLabel htmlFor="login-password">Contrasena</FieldLabel>
          <PasswordInput
            id="login-password"
            autoComplete="current-password"
            placeholder="Ingresa tu contrasena"
            error={errors.password?.message}
            aria-invalid={Boolean(errors.password)}
            aria-describedby={errors.password ? 'login-password-error' : undefined}
            {...register('password')}
          />
          {errors.password ? (
            <p id="login-password-error" className="mt-1.5 text-sm text-red-600" role="alert">
              {errors.password.message}
            </p>
          ) : null}
        </div>

        <Button type="submit" className="w-full" loading={isSubmitting}>
          Iniciar sesion
        </Button>

        {submitted ? (
          <div
            className="rounded-xl border border-success/25 bg-success-soft px-4 py-3 text-sm leading-5 text-success"
            role="status"
            aria-live="polite"
          >
            Formulario validado. La conexion con el servicio de autenticacion esta pendiente.
          </div>
        ) : null}
      </form>

      <p className="mt-7 text-center text-sm text-secondary">
        ¿Aun no tienes una cuenta?{' '}
        <Link href="/register" className="font-semibold text-brand-primary hover:underline">
          Crear cuenta
        </Link>
      </p>
    </div>
  )
}

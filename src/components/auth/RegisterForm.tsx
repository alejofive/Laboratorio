'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { Check, ImagePlus, Palette, X } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useRef, useState, type ChangeEvent } from 'react'
import { useForm, useWatch } from 'react-hook-form'
import { Button } from '@/components/ui/Button/Button'
import { FieldLabel, TextInput } from '@/components/ui/FormField'
import { registerSchema, type RegisterValues } from '@/lib/validations/auth'
import { PasswordInput } from './PasswordInput'

const MAX_LOGO_SIZE = 2 * 1024 * 1024
const acceptedLogoTypes = ['image/png', 'image/jpeg', 'image/webp']
const stepOneFields: Array<keyof RegisterValues> = [
  'laboratoryName',
  'professionalName',
  'rif',
  'location',
  'email',
  'password',
  'confirmPassword',
]

function FieldErrorMessage({ id, message }: { id: string; message?: string }) {
  if (!message) return null

  return (
    <p id={id} className="mt-1.5 text-sm text-red-600" role="alert">
      {message}
    </p>
  )
}

const getSafeColor = (color: string, fallback: string) =>
  /^#[0-9A-Fa-f]{6}$/.test(color) ? color : fallback

export function RegisterForm() {
  const [step, setStep] = useState<1 | 2>(1)
  const [submitted, setSubmitted] = useState(false)
  const [logo, setLogo] = useState<File | null>(null)
  const [logoPreview, setLogoPreview] = useState<string | null>(null)
  const [logoError, setLogoError] = useState<string | null>(null)
  const logoInputRef = useRef<HTMLInputElement>(null)
  const {
    register,
    handleSubmit,
    setValue,
    trigger,
    control,
    formState: { errors, isSubmitting },
  } = useForm<RegisterValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      laboratoryName: '',
      professionalName: '',
      rif: '',
      location: '',
      email: '',
      password: '',
      confirmPassword: '',
      primaryColor: '#0058A8',
      secondaryColor: '#7DA9D2',
    },
  })

  const laboratoryName = useWatch({ control, name: 'laboratoryName' })
  const primaryColor = useWatch({ control, name: 'primaryColor' })
  const secondaryColor = useWatch({ control, name: 'secondaryColor' })
  const safePrimaryColor = getSafeColor(primaryColor, '#0058A8')
  const safeSecondaryColor = getSafeColor(secondaryColor, '#7DA9D2')

  const goToNextStep = async () => {
    const isValid = await trigger(stepOneFields, { shouldFocus: true })

    if (isValid) {
      setSubmitted(false)
      setStep(2)
    }
  }

  const handleLogoChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    if (!acceptedLogoTypes.includes(file.type)) {
      setLogoError('Selecciona una imagen PNG, JPG o WebP')
      event.target.value = ''
      return
    }

    if (file.size > MAX_LOGO_SIZE) {
      setLogoError('El logo no puede superar los 2 MB')
      event.target.value = ''
      return
    }

    const reader = new FileReader()
    reader.onload = () => {
      setLogoPreview(typeof reader.result === 'string' ? reader.result : null)
    }
    reader.readAsDataURL(file)

    setLogo(file)
    setLogoError(null)
    setSubmitted(false)
  }

  const removeLogo = () => {
    setLogo(null)
    setLogoPreview(null)
    setLogoError(null)
    setSubmitted(false)

    if (logoInputRef.current) logoInputRef.current.value = ''
  }

  const onSubmit = () => setSubmitted(true)

  return (
    <div>
      <p className="text-sm font-semibold text-brand-primary">Paso {step} de 2</p>
      <h2 className="mt-2 text-3xl font-semibold tracking-tight text-primary">
        {step === 1 ? 'Configura tu laboratorio' : 'Define tu identidad visual'}
      </h2>
      <p className="mt-3 text-base leading-6 text-secondary">
        {step === 1
          ? 'Registra los datos del laboratorio y las credenciales de acceso.'
          : 'Personaliza cómo se verá tu laboratorio dentro del sistema.'}
      </p>

      <ol className="mt-6 grid grid-cols-2 gap-3" aria-label="Progreso del registro">
        {['Información', 'Identidad visual'].map((label, index) => {
          const stepNumber = (index + 1) as 1 | 2
          const isActive = step === stepNumber
          const isComplete = step > stepNumber

          return (
            <li key={label} aria-current={isActive ? 'step' : undefined}>
              <span
                className={`block h-1 rounded-full ${isActive || isComplete ? 'bg-brand-primary' : 'bg-surface-muted'}`}
              />
              <span
                className={`mt-2 flex items-center gap-2 text-sm font-medium ${isActive || isComplete ? 'text-primary' : 'text-secondary'}`}
              >
                <span
                  className={`flex size-5 items-center justify-center rounded-full text-xs ${isActive || isComplete ? 'bg-brand-primary text-white' : 'bg-surface-muted text-secondary'}`}
                >
                  {isComplete ? <Check aria-hidden="true" className="size-3" /> : stepNumber}
                </span>
                {label}
              </span>
            </li>
          )
        })}
      </ol>

      <form
        className="mt-6"
        onSubmit={
          step === 1
            ? event => {
                event.preventDefault()
                void goToNextStep()
              }
            : handleSubmit(onSubmit)
        }
        onChange={() => setSubmitted(false)}
        noValidate
      >
        {step === 1 ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <FieldLabel htmlFor="register-laboratory">Nombre del laboratorio</FieldLabel>
              <TextInput
                id="register-laboratory"
                type="text"
                autoComplete="organization"
                placeholder="Laboratorio Clinico Dos G"
                error={errors.laboratoryName?.message}
                aria-invalid={Boolean(errors.laboratoryName)}
                aria-describedby={errors.laboratoryName ? 'register-laboratory-error' : undefined}
                {...register('laboratoryName')}
              />
              <FieldErrorMessage
                id="register-laboratory-error"
                message={errors.laboratoryName?.message}
              />
            </div>

            <div>
              <FieldLabel htmlFor="register-professional">Licenciado o licenciada</FieldLabel>
              <TextInput
                id="register-professional"
                type="text"
                autoComplete="name"
                placeholder="Nombre completo"
                error={errors.professionalName?.message}
                aria-invalid={Boolean(errors.professionalName)}
                aria-describedby={errors.professionalName ? 'register-professional-error' : undefined}
                {...register('professionalName')}
              />
              <FieldErrorMessage
                id="register-professional-error"
                message={errors.professionalName?.message}
              />
            </div>

            <div>
              <FieldLabel htmlFor="register-rif">RIF</FieldLabel>
              <TextInput
                id="register-rif"
                type="text"
                autoCapitalize="characters"
                placeholder="J-12345678-9"
                className="uppercase"
                error={errors.rif?.message}
                aria-invalid={Boolean(errors.rif)}
                aria-describedby={errors.rif ? 'register-rif-error' : undefined}
                {...register('rif')}
              />
              <FieldErrorMessage id="register-rif-error" message={errors.rif?.message} />
            </div>

            <div>
              <FieldLabel htmlFor="register-location">Ubicación</FieldLabel>
              <TextInput
                id="register-location"
                type="text"
                autoComplete="street-address"
                placeholder="Ciudad y dirección"
                error={errors.location?.message}
                aria-invalid={Boolean(errors.location)}
                aria-describedby={errors.location ? 'register-location-error' : undefined}
                {...register('location')}
              />
              <FieldErrorMessage id="register-location-error" message={errors.location?.message} />
            </div>

            <div>
              <FieldLabel htmlFor="register-email">Correo electrónico</FieldLabel>
              <TextInput
                id="register-email"
                type="email"
                autoComplete="email"
                placeholder="nombre@laboratorio.com"
                error={errors.email?.message}
                aria-invalid={Boolean(errors.email)}
                aria-describedby={errors.email ? 'register-email-error' : undefined}
                {...register('email')}
              />
              <FieldErrorMessage id="register-email-error" message={errors.email?.message} />
            </div>

            <div>
              <FieldLabel htmlFor="register-password">Contraseña</FieldLabel>
              <PasswordInput
                id="register-password"
                autoComplete="new-password"
                placeholder="Crea una contraseña"
                error={errors.password?.message}
                aria-invalid={Boolean(errors.password)}
                aria-describedby="register-password-help"
                {...register('password')}
              />
              <p
                id="register-password-help"
                className={`mt-1.5 text-sm ${errors.password ? 'text-red-600' : 'text-secondary'}`}
                role={errors.password ? 'alert' : undefined}
              >
                {errors.password?.message ?? 'Mínimo 8 caracteres, mayúscula, minúscula y número.'}
              </p>
            </div>

            <div>
              <FieldLabel htmlFor="register-confirm-password">Confirmar contraseña</FieldLabel>
              <PasswordInput
                id="register-confirm-password"
                autoComplete="new-password"
                placeholder="Repite tu contraseña"
                visibilityLabel="confirmación de contraseña"
                error={errors.confirmPassword?.message}
                aria-invalid={Boolean(errors.confirmPassword)}
                aria-describedby={errors.confirmPassword ? 'register-confirm-error' : undefined}
                {...register('confirmPassword')}
              />
              <FieldErrorMessage
                id="register-confirm-error"
                message={errors.confirmPassword?.message}
              />
            </div>

            <Button type="submit" className="w-full sm:col-span-2">
              Continuar
            </Button>
          </div>
        ) : (
          <div className="space-y-5">
            <div>
              <FieldLabel htmlFor="register-logo">Logo del laboratorio (opcional)</FieldLabel>
              <div className="relative">
                <label
                  htmlFor="register-logo"
                  className={`flex min-h-24 cursor-pointer items-center gap-4 rounded-2xl border border-dashed bg-surface-muted px-4 py-3 transition-colors hover:border-brand-primary hover:bg-brand-active/40 ${logoError ? 'border-red-500' : 'border-border-input'}`}
                >
                  {logoPreview ? (
                    <span className="flex size-16 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-border-default bg-white p-2">
                      <Image
                        src={logoPreview}
                        alt="Vista previa del logo"
                        width={56}
                        height={56}
                        unoptimized
                        className="size-full object-contain"
                      />
                    </span>
                  ) : (
                    <span className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-brand-active text-brand-primary">
                      <ImagePlus aria-hidden="true" className="size-5" />
                    </span>
                  )}
                  <span className="min-w-0">
                    <span className="block truncate text-sm font-medium text-primary">
                      {logo ? logo.name : 'Selecciona el logo del laboratorio'}
                    </span>
                    <span className="mt-1 block text-xs leading-5 text-secondary">
                      PNG, JPG o WebP. Máximo 2 MB.
                    </span>
                  </span>
                </label>
                <input
                  ref={logoInputRef}
                  id="register-logo"
                  type="file"
                  accept="image/png,image/jpeg,image/webp"
                  className="sr-only"
                  aria-invalid={Boolean(logoError)}
                  aria-describedby={logoError ? 'register-logo-error' : undefined}
                  onChange={handleLogoChange}
                />
                {logo ? (
                  <button
                    type="button"
                    className="absolute right-3 top-3 flex size-8 cursor-pointer items-center justify-center rounded-full border border-border-default bg-white text-secondary transition-colors hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary/30"
                    aria-label="Eliminar logo"
                    onClick={removeLogo}
                  >
                    <X aria-hidden="true" className="size-4" />
                  </button>
                ) : null}
              </div>
              <FieldErrorMessage id="register-logo-error" message={logoError ?? undefined} />
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <FieldLabel htmlFor="register-primary-color">Color primario</FieldLabel>
                <div className="flex gap-2">
                  <label
                    className="relative size-[42px] shrink-0 cursor-pointer overflow-hidden rounded-xl border border-border-input"
                    style={{ backgroundColor: safePrimaryColor }}
                    aria-label="Seleccionar color primario"
                  >
                    <input
                      type="color"
                      value={safePrimaryColor}
                      className="absolute inset-0 size-full cursor-pointer opacity-0"
                      onChange={event =>
                        setValue('primaryColor', event.target.value.toUpperCase(), {
                          shouldDirty: true,
                          shouldValidate: true,
                        })
                      }
                    />
                  </label>
                  <TextInput
                    id="register-primary-color"
                    type="text"
                    maxLength={7}
                    className="uppercase"
                    error={errors.primaryColor?.message}
                    aria-invalid={Boolean(errors.primaryColor)}
                    aria-describedby={errors.primaryColor ? 'register-primary-color-error' : undefined}
                    {...register('primaryColor')}
                  />
                </div>
                <FieldErrorMessage
                  id="register-primary-color-error"
                  message={errors.primaryColor?.message}
                />
              </div>

              <div>
                <FieldLabel htmlFor="register-secondary-color">Color secundario</FieldLabel>
                <div className="flex gap-2">
                  <label
                    className="relative size-[42px] shrink-0 cursor-pointer overflow-hidden rounded-xl border border-border-input"
                    style={{ backgroundColor: safeSecondaryColor }}
                    aria-label="Seleccionar color secundario"
                  >
                    <input
                      type="color"
                      value={safeSecondaryColor}
                      className="absolute inset-0 size-full cursor-pointer opacity-0"
                      onChange={event =>
                        setValue('secondaryColor', event.target.value.toUpperCase(), {
                          shouldDirty: true,
                          shouldValidate: true,
                        })
                      }
                    />
                  </label>
                  <TextInput
                    id="register-secondary-color"
                    type="text"
                    maxLength={7}
                    className="uppercase"
                    error={errors.secondaryColor?.message}
                    aria-invalid={Boolean(errors.secondaryColor)}
                    aria-describedby={
                      errors.secondaryColor ? 'register-secondary-color-error' : undefined
                    }
                    {...register('secondaryColor')}
                  />
                </div>
                <FieldErrorMessage
                  id="register-secondary-color-error"
                  message={errors.secondaryColor?.message}
                />
              </div>
            </div>

            <div>
              <div className="mb-2 flex items-center gap-2 text-sm font-medium text-tertiary">
                <Palette aria-hidden="true" className="size-4 text-brand-primary" />
                Vista previa
              </div>
              <div className="overflow-hidden rounded-2xl border border-border-default bg-white">
                <div className="h-2" style={{ backgroundColor: safePrimaryColor }} />
                <div className="flex items-center gap-3 px-4 py-4">
                  {logoPreview ? (
                    <span className="flex size-12 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-border-default bg-white p-1.5">
                      <Image
                        src={logoPreview}
                        alt=""
                        width={44}
                        height={44}
                        unoptimized
                        className="size-full object-contain"
                      />
                    </span>
                  ) : (
                    <span
                      className="flex size-12 shrink-0 items-center justify-center rounded-xl text-lg font-semibold text-white"
                      style={{ backgroundColor: safePrimaryColor }}
                    >
                      {laboratoryName.trim().charAt(0).toUpperCase() || 'L'}
                    </span>
                  )}
                  <span className="min-w-0">
                    <span className="block truncate font-semibold text-primary">
                      {laboratoryName.trim() || 'Tu laboratorio'}
                    </span>
                    <span className="mt-0.5 block text-sm text-secondary">Sistema de gestión clínica</span>
                  </span>
                </div>
                <div className="h-1" style={{ backgroundColor: safeSecondaryColor }} />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <Button
                type="button"
                variant="outline"
                className="w-full"
                onClick={() => {
                  setSubmitted(false)
                  setStep(1)
                }}
              >
                Volver
              </Button>
              <Button type="submit" className="w-full" loading={isSubmitting}>
                Crear cuenta
              </Button>
            </div>

            {submitted ? (
              <div
                className="rounded-xl border border-success/25 bg-success-soft px-4 py-3 text-sm leading-5 text-success"
                role="status"
                aria-live="polite"
              >
                Registro validado. La creación del laboratorio se conectará cuando el backend esté
                disponible.
              </div>
            ) : null}
          </div>
        )}
      </form>

      <p className="mt-6 text-center text-sm text-secondary">
        ¿Ya tienes una cuenta?{' '}
        <Link href="/login" className="font-semibold text-brand-primary hover:underline">
          Iniciar sesión
        </Link>
      </p>
    </div>
  )
}

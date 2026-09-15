import { ChartNoAxesCombined, FilePlus2, Microscope } from 'lucide-react'
import Image from 'next/image'
import type { ReactNode } from 'react'

const features = [
  {
    title: 'Registro ágil de solicitudes',
    description: 'Admisión instantánea y asignación de pruebas.',
    icon: FilePlus2,
  },
  {
    title: 'Control de reactivos y muestras',
    description: 'Supervisión de lotes, caducidad y calidad.',
    icon: Microscope,
  },
  {
    title: 'Trazabilidad en tiempo real',
    description: 'Seguimiento del análisis y validación de resultados.',
    icon: ChartNoAxesCombined,
  },
]

export function AuthShell({ children }: { children: ReactNode }) {
  return (
    <main className="min-h-screen bg-canvas px-4 py-6 sm:px-6 lg:grid lg:grid-cols-[minmax(320px,0.85fr)_minmax(520px,1.15fr)] lg:p-0">
      <section className="relative hidden min-h-screen overflow-hidden border-r border-border-default bg-brand-primary px-10 py-12 text-white lg:block xl:px-16">
        <div className="absolute -right-24 top-24 size-72 rounded-full border border-white/10" />
        <div className="absolute -right-10 top-38 size-44 rounded-full border border-white/10" />

        <div className="relative max-w-md">
          <p className="mb-4 text-sm font-semibold  tracking-[0.18em] text-white/65">
            Sistema de Gestión de Laboratorio
          </p>
          <h1 className="text-4xl font-semibold  leading-tight tracking-tight xl:text-5xl">
            Lab System
          </h1>
          <p className="mt-5 max-w-sm text-base leading-7 text-white/75">
            Un espacio de trabajo claro para registrar solicitudes, procesar examenes y entregar
            resultados con confianza.
          </p>

          <ul className="mt-10 space-y-4" aria-label="Ventajas del sistema de laboratorio">
            {features.map(({ title, description, icon: Icon }) => (
              <li
                key={title}
                className="group relative left-0 flex items-center gap-4 overflow-hidden rounded-2xl border border-white/70 bg-linear-to-br from-white via-white/95 to-brand-active px-5 py-4 text-primary transition-[left,transform,border-color] duration-500 ease-out hover:left-5 hover:border-white motion-safe:hover:-translate-y-1 motion-reduce:transition-normal"
              >
                <span
                  aria-hidden="true"
                  className="absolute inset-0 bg-linear-to-br from-white/0 via-brand-active/45 to-brand-soft/35 opacity-0 transition-opacity duration-500 ease-out motion-safe:group-hover:opacity-100 motion-reduce:transition-none"
                />
                <span className="relative flex size-12 shrink-0 items-center justify-center rounded-xl bg-brand-active text-brand-primary transition-transform duration-500 ease-out motion-safe:group-hover:-translate-y-0.5 motion-safe:group-hover:scale-105 motion-reduce:transition-none">
                  <Icon aria-hidden="true" className="size-5" strokeWidth={2.25} />
                </span>
                <span className="relative min-w-0">
                  <span className="block text-base font-medium leading-6">{title}</span>
                  <span className="mt-0.5 block text-sm leading-5 text-secondary">{description}</span>
                </span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="flex min-h-[calc(100vh-3rem)] items-start justify-center lg:min-h-screen">
        <div className="my-auto w-full max-w-md rounded-3xl border border-border-default bg-surface px-6 py-8 sm:px-10 sm:py-10 lg:border-0 lg:bg-transparent">
          <div className="mb-8 flex items-center gap-3 lg:hidden">
            <Image src="/png/logo.png" alt="Laboratorio Clinico Dos G" width={36} height={43} priority />
            <p className="text-sm font-semibold leading-tight text-brand-logo">
              Lab. Clinico
              <span className="block font-bold">DOS G</span>
            </p>
          </div>
          {children}
        </div>
      </section>
    </main>
  )
}

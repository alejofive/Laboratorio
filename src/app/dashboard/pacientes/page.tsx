'use client'

import { Button } from '@/components/ui/Button'
import { TextInput } from '@/components/ui/FormField'
import { usePatients } from '@/data/createPatients'
import { ChevronRight, Search } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

const PATIENTS_PER_PAGE = 10

const PatientsTableSkeleton = () => (
  <tbody className='divide-y divide-border-default'>
    {Array.from({ length: 8 }).map((_, index) => (
      <tr key={index} className='animate-pulse'>
        <td className='px-4 py-3'>
          <div className='space-y-2'>
            <div className='h-4 w-44 rounded bg-gray-200' />
            <div className='h-3 w-24 rounded bg-gray-200' />
          </div>
        </td>
        <td className='px-4 py-3'>
          <div className='h-4 w-28 rounded bg-gray-200' />
        </td>
        <td className='px-4 py-3'>
          <div className='h-4 w-12 rounded bg-gray-200' />
        </td>
      </tr>
    ))}
  </tbody>
)

export default function PacientesPage() {
  const router = useRouter()
  const [busqueda, setBusqueda] = useState('')
  const [page, setPage] = useState(1)
  const { data, isFetching, error } = usePatients({
    page,
    limit: PATIENTS_PER_PAGE,
    search: busqueda.trim(),
  })

  const pacientes = data?.data ?? []
  const meta = data?.meta

  return (
    <div className='mx-auto min-h-dvh w-full max-w-7xl px-4 py-6 sm:px-6 lg:p-9'>
      <div className='mb-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between'>
        <div>
          <h1 className='text-2xl font-bold text-primary'>Pacientes</h1>
          <p className='text-base font-normal text-secondary'>
            {meta?.total ?? pacientes.length} pacientes registrados
          </p>
        </div>

        <div className='relative w-full sm:max-w-sm'>
          <Search aria-hidden='true' className='pointer-events-none absolute left-3 top-1/2 size-5 -translate-y-1/2 text-secondary' />
          <TextInput
            aria-label='Buscar pacientes'
            type='text'
            value={busqueda}
            onChange={e => {
              setBusqueda(e.target.value)
              setPage(1)
            }}
            className='w-full pl-11'
            placeholder='Buscar por cédula, nombre o teléfono...'
          />
        </div>
      </div>

      {error ? (
        <div className='mb-5 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700'>
          No se pudieron cargar los pacientes. {error instanceof Error ? error.message : null}
        </div>
      ) : null}

      <div className='space-y-3 md:hidden'>
        {isFetching ? Array.from({ length: 4 }).map((_, index) => (
          <div key={index} className='h-28 animate-pulse rounded-2xl border border-border-default bg-surface p-4'>
            <div className='h-5 w-2/3 rounded bg-surface-muted' />
            <div className='mt-4 h-4 w-1/2 rounded bg-surface-muted' />
          </div>
        )) : pacientes.map(paciente => (
          <Link key={paciente._id} href={`/dashboard/pacientes/${encodeURIComponent(paciente.document_number)}`}
            className='flex min-h-28 items-center justify-between gap-3 rounded-2xl border border-border-default bg-surface p-4 transition-colors active:bg-brand-active focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary'>
            <span className='min-w-0'>
              <span className='block break-words text-base font-semibold text-primary'>{paciente.first_name} {paciente.last_name}</span>
              <span className='mt-1 block text-sm text-secondary'>{paciente.document_number}</span>
              <span className='mt-2 block text-sm text-secondary'>{paciente.phone || 'Sin teléfono'} · {paciente.age ?? '-'} años</span>
            </span>
            <ChevronRight aria-hidden='true' className='size-5 shrink-0 text-brand-primary' />
          </Link>
        ))}
      </div>

      {!isFetching && !error && pacientes.length === 0 ? (
        <div className='rounded-2xl border border-border-default bg-surface p-8 text-center'>
          <p className='text-secondary'>{busqueda.trim() ? 'No hay pacientes para esa búsqueda.' : 'No hay pacientes registrados.'}</p>
          {!busqueda.trim() && <Link href='/dashboard' className='mt-3 inline-flex min-h-11 items-center text-brand-primary underline-offset-4 hover:underline'>Registrar primer paciente</Link>}
        </div>
      ) : null}

      <div className='hidden overflow-hidden rounded-3xl border border-border-default bg-surface md:block'>
        <table className='w-full'>
          <thead className='border-b border-border-default bg-surface-muted'>
            <tr>
              <th className='px-4 py-3 text-left text-sm font-medium text-secondary'>Paciente</th>
              <th className='px-4 py-3 text-left text-sm font-medium text-secondary'>Teléfono</th>
              <th className='px-4 py-3 text-left text-sm font-medium text-secondary'>Edad</th>
            </tr>
          </thead>
          {isFetching ? (
            <PatientsTableSkeleton />
          ) : (
            <tbody className='divide-y divide-border-default'>
              {pacientes.map(paciente => (
                <tr
                  key={paciente._id}
                  onClick={() => router.push(`/dashboard/pacientes/${paciente.document_number}`)}
                  onKeyDown={event => {
                    if (event.key === 'Enter' || event.key === ' ') {
                      event.preventDefault()
                      router.push(`/dashboard/pacientes/${paciente.document_number}`)
                    }
                  }}
                  tabIndex={0}
                  className='cursor-pointer hover:bg-surface-muted'
                >
                  <td className='px-4 py-3'>
                    <p className='font-medium text-tertiary'>
                      {`${paciente.first_name} ${paciente.last_name}`.trim()}
                    </p>
                    <p className='text-xs text-secondary'>{paciente.document_number}</p>
                  </td>
                  <td className='px-4 py-3 text-sm text-tertiary'>{paciente.phone || '-'}</td>
                  <td className='px-4 py-3 text-sm text-tertiary'>{paciente.age ?? '-'}</td>
                </tr>
              ))}
            </tbody>
          )}
        </table>
      </div>

      {!isFetching && meta && meta.totalPages > 1 ? (
        <div className='mt-5 flex items-center justify-end gap-3'>
          <Button
            type='button'
            disabled={!meta.hasPrevPage}
            onClick={() => setPage(currentPage => Math.max(1, currentPage - 1))}
            variant='outline'
            size='sm'
          >
            Anterior
          </Button>
          <span className='text-sm text-secondary'>
            Página {meta.page} de {meta.totalPages}
          </span>
          <Button
            type='button'
            disabled={!meta.hasNextPage}
            onClick={() => setPage(currentPage => currentPage + 1)}
            variant='outline'
            size='sm'
          >
            Siguiente
          </Button>
        </div>
      ) : null}
    </div>
  )
}

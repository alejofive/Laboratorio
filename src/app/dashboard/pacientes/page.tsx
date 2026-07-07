'use client'

import { Button } from '@/components/ui/Button'
import { TextInput } from '@/components/ui/FormField'
import { usePatients } from '@/data/createPatients'
import { Search } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'

const PATIENTS_PER_PAGE = 10

export default function PacientesPage() {
  const [busqueda, setBusqueda] = useState('')
  const [page, setPage] = useState(1)
  const { data, isLoading, error } = usePatients({
    page,
    limit: PATIENTS_PER_PAGE,
    search: busqueda.trim(),
  })

  const pacientes = data?.data ?? []
  const meta = data?.meta

  if (!isLoading && !error && pacientes.length === 0) {
    return (
      <div className='p-9 w-full min-h-screen'>
        <div className='flex items-center justify-between mb-5'>
          <div>
            <h1 className='text-2xl font-bold text-primary'>Pacientes</h1>
            <p className='text-secondary text-lg font-normal'>0 pacientes registrados</p>
          </div>

          <div className='relative'>
            <Search className='text-gray-400 absolute top-2.5 left-3 w-5 h-5' />
            <TextInput
              type='text'
              value={busqueda}
              onChange={e => {
                setBusqueda(e.target.value)
                setPage(1)
              }}
              className='w-[470px] pl-11'
              placeholder='Buscar por cédula, nombre o teléfono...'
            />
          </div>
        </div>

        <div className='bg-white rounded-lg border border-gray-200 p-8 text-center'>
          <p className='text-gray-500'>
            {busqueda.trim()
              ? 'No hay pacientes para esa busqueda.'
              : 'No hay pacientes registrados.'}
          </p>
          <Link
            href='/dashboard'
            className='mt-2 inline-block text-brand-primary underline-offset-4 hover:underline'
          >
            Registrar primer paciente
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className='p-9 w-full min-h-screen'>
      <div className='flex items-center justify-between mb-5'>
        <div>
          <h1 className='text-2xl font-bold text-primary'>Pacientes</h1>
          <p className='text-secondary text-lg font-normal'>
            {meta?.total ?? pacientes.length} pacientes registrados
          </p>
        </div>

        <div className='relative'>
          <Search className='text-gray-400 absolute top-2.5 left-3 w-5 h-5' />
          <TextInput
            type='text'
            value={busqueda}
            onChange={e => {
              setBusqueda(e.target.value)
              setPage(1)
            }}
            className='w-[470px] pl-11'
            placeholder='Buscar por cédula, nombre o teléfono...'
          />
        </div>
      </div>

      {error ? (
        <div className='mb-5 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700'>
          No se pudieron cargar los pacientes. {error instanceof Error ? error.message : null}
        </div>
      ) : null}

      <div className='overflow-hidden rounded-3xl border border-border-default bg-surface'>
        {isLoading ? <p className='p-6 text-sm text-secondary'>Cargando pacientes...</p> : null}

        <table className='w-full'>
          <thead className='border-b border-border-default bg-surface-muted'>
            <tr>
              <th className='px-4 py-3 text-left text-sm font-medium text-secondary'>Paciente</th>
              <th className='px-4 py-3 text-left text-sm font-medium text-secondary'>Teléfono</th>
              <th className='px-4 py-3 text-left text-sm font-medium text-secondary'>Edad</th>
            </tr>
          </thead>
          <tbody className='divide-y divide-border-default'>
            {pacientes.map(paciente => (
              <tr key={paciente._id} className='hover:bg-surface-muted'>
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
        </table>
      </div>

      {meta && meta.totalPages > 1 ? (
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

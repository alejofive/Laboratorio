'use client'

import EstadoBadge from '@/components/EstadoBadge'
import { useOrders, usePatients } from '@/data/createPatients'
import { OrderStatusApi } from '@/types/create'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'

const PacienteCardSkeleton = () => (
  <div className='bg-white rounded-3xl border border-gray-200 p-6 mb-5 animate-pulse'>
    <div className='flex justify-between mb-4'>
      <div className='h-7 w-24 rounded bg-gray-200' />
    </div>

    <div className='space-y-4'>
      <div className='h-6 w-56 rounded bg-gray-200' />
      <div className='flex flex-wrap items-center gap-3'>
        <div className='h-5 w-32 rounded bg-gray-200' />
        <div className='h-5 w-36 rounded bg-gray-200' />
        <div className='h-5 w-20 rounded bg-gray-200' />
        <div className='h-5 w-52 rounded bg-gray-200' />
      </div>
    </div>
  </div>
)

const PatientHistoryTableSkeleton = () => (
  <tbody className='divide-y divide-border-default'>
    {Array.from({ length: 8 }).map((_, index) => (
      <tr key={index} className='animate-pulse'>
        <td className='px-4 py-3'>
          <div className='h-4 w-24 rounded bg-gray-200' />
        </td>
        <td className='px-4 py-3'>
          <div className='h-4 w-20 rounded bg-gray-200' />
        </td>
        <td className='px-4 py-3'>
          <div className='flex items-center gap-2'>
            <div className='h-1.5 w-20 rounded-full bg-gray-200' />
            <div className='h-3 w-8 rounded bg-gray-200' />
          </div>
        </td>
        <td className='px-4 py-3'>
          <div className='h-5 w-16 rounded-full bg-gray-200' />
        </td>
        <td className='px-4 py-3'>
          <div className='ml-auto h-5 w-5 rounded bg-gray-200' />
        </td>
      </tr>
    ))}
  </tbody>
)

const getEstadoSolicitud = (status: OrderStatusApi) => {
  if (status === 'completed' || status === 'sent') return 'completo'
  if (status === 'in_progress') return 'en_proceso'
  return 'pendiente'
}

export default function PacienteHistorialPage() {
  const router = useRouter()
  const params = useParams()
  const cedula = decodeURIComponent(params.cedula as string)

  const { data: patientsData, isLoading: isLoadingPatients } = usePatients({
    page: 1,
    limit: 1,
    search: cedula,
  })
  const { data: orders = [], isLoading: isLoadingOrders, error } = useOrders({
    page: 1,
    limit: 100,
    search: cedula,
  })

  const pacienteData = patientsData?.data.find(patient => patient.document_number === cedula)
  const historialSolicitudes = orders
    .filter(order => order.patient.document_number === cedula)
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())

  const handleVolver = () => {
    router.push('/dashboard/pacientes')
  }

  if (!isLoadingPatients && !pacienteData) {
    return (
      <div className='mx-auto min-h-dvh w-full max-w-7xl px-4 py-6 sm:px-6 lg:p-9'>
        <Link href='/dashboard/pacientes' className='inline-flex items-center gap-1 hover:underline mb-4'>
          <ArrowLeft className='w-4 h-4' />
          Volver
        </Link>
        <div className='bg-white rounded-lg border border-gray-200 p-8 text-center'>
          <p className='text-gray-500'>Paciente no encontrado.</p>
        </div>
      </div>
    )
  }

  return (
    <div className='mx-auto min-h-dvh w-full max-w-7xl px-4 py-6 sm:px-6 lg:p-9'>
      <div className='flex items-center mb-4 gap-4'>
         <button type='button' onClick={handleVolver} aria-label='Volver a pacientes' className='flex size-11 cursor-pointer items-center justify-center rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary'>
          <ArrowLeft className='text-gray-700' />
        </button>
        <p className='text-primary text-2xl font-semibold'>Paciente</p>
      </div>

      {isLoadingPatients ? (
        <PacienteCardSkeleton />
      ) : pacienteData ? (
         <div className='mb-5 rounded-3xl border border-border-default bg-surface p-4 sm:p-6'>
          <div className='md:items-center md:justify-between gap-4'>
            <div className='flex justify-between mb-4'>
              <span className='text-xl text-secondary'>Paciente</span>
            </div>

            <div className='flex justify-between items-end'>
              <div>
                <p className='text-xl font-semibold'>
                  {`${pacienteData.first_name} ${pacienteData.last_name}`.trim()}
                </p>
                 <p className='mt-4 flex flex-wrap items-center gap-x-4 gap-y-3 text-sm text-secondary sm:text-base'>
                  <span className='flex items-center gap-2'>
                    <img src='/svg/paciente/cedula.svg' alt='' /> {pacienteData.document_number}
                  </span>
                  <span className='flex items-center gap-2'>
                    <img src='/svg/paciente/phone.svg' alt='' /> {pacienteData.phone || '-'}
                  </span>
                  <span className='flex items-center gap-2'>
                    <img src='/svg/paciente/calendar.svg' alt='' /> {pacienteData.age ?? '-'} años
                  </span>
                  <span className='flex items-center gap-2'>
                    <img src='/svg/paciente/location.svg' alt='' /> {pacienteData.address || '-'}
                  </span>
                </p>
              </div>
            </div>
          </div>
        </div>
      ) : null}

       <h1 className='mb-2 mt-5 text-xl font-bold text-primary sm:text-2xl'>Historial de solicitudes</h1>

      {error ? (
        <div className='mb-5 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700'>
          No se pudo cargar el historial. {error instanceof Error ? error.message : null}
        </div>
      ) : null}

       <div className='mt-4 space-y-3 md:hidden'>
         {isLoadingOrders ? Array.from({ length: 3 }).map((_, index) => (
           <div key={index} className='h-28 animate-pulse rounded-2xl border border-border-default bg-surface p-4'>
             <div className='h-5 w-1/2 rounded bg-surface-muted' />
             <div className='mt-4 h-4 w-2/3 rounded bg-surface-muted' />
           </div>
         )) : historialSolicitudes.map(order => (
           <Link key={order.id} href={`/dashboard/examen/${order.id}?cedula=${encodeURIComponent(cedula)}`}
             className='block rounded-2xl border border-border-default bg-surface p-4 transition-colors active:bg-brand-active focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary'>
             <div className='flex flex-wrap items-center justify-between gap-2'>
               <span className='font-semibold text-primary'>Solicitud #{order.order_number}</span>
               <EstadoBadge estado={getEstadoSolicitud(order.status)} />
             </div>
             <p className='mt-2 text-sm text-secondary'>{new Date(order.created_at).toLocaleDateString('es-VE')}</p>
             <p className='mt-3 border-t border-border-default pt-3 text-sm text-secondary'>Exámenes completados: <span className='font-semibold text-primary'>{order.exams.completed} de {order.exams.total}</span></p>
           </Link>
         ))}
         {!isLoadingOrders && historialSolicitudes.length === 0 && <p className='rounded-2xl border border-border-default bg-surface p-6 text-center text-secondary'>No hay solicitudes registradas.</p>}
       </div>

       <div className='mt-4 hidden overflow-hidden rounded-3xl border border-border-default bg-surface md:block'>
        <table className='w-full'>
          <thead className='border-b border-border-default bg-surface-muted'>
            <tr>
              <th className='px-4 py-3 text-left text-sm font-medium text-secondary'># Solicitud</th>
              <th className='px-4 py-3 text-left text-sm font-medium text-secondary'>Fecha</th>
              <th className='px-4 py-3 text-left text-sm font-medium text-secondary'>Exámenes</th>
              <th className='px-4 py-3 text-left text-sm font-medium text-secondary'>Estado</th>
              <th className='px-4 py-3 text-right text-sm font-medium text-secondary'></th>
            </tr>
          </thead>
          {isLoadingOrders ? (
            <PatientHistoryTableSkeleton />
          ) : (
            <tbody className='divide-y divide-border-default'>
              {historialSolicitudes.map(order => {
                const completados = order.exams.completed
                const total = order.exams.total
                const porcentaje = total > 0 ? Math.round((completados / total) * 100) : 0
                const estadoMostrado = getEstadoSolicitud(order.status)

                return (
                  <tr
                    key={order.id}
                    onClick={() => router.push(`/dashboard/examen/${order.id}?cedula=${cedula}`)}
                    onKeyDown={event => {
                      if (event.key === 'Enter' || event.key === ' ') {
                        event.preventDefault()
                        router.push(`/dashboard/examen/${order.id}?cedula=${cedula}`)
                      }
                    }}
                    tabIndex={0}
                    className='cursor-pointer hover:bg-surface-muted'
                  >
                    <td className='px-4 py-3 text-sm font-medium text-tertiary'>
                      {order.order_number}
                    </td>
                    <td className='px-4 py-3 text-sm text-secondary'>
                      {new Date(order.created_at).toLocaleDateString('es-VE')}
                    </td>
                    <td className='px-4 py-3'>
                      <div className='flex items-center gap-2'>
                        <div className='h-1.5 w-20 overflow-hidden rounded-full bg-gray-200'>
                          <div
                            className='h-full rounded-full bg-brand-primary transition-all'
                            style={{ width: `${porcentaje}%` }}
                          />
                        </div>
                        <span className='text-xs text-secondary'>{`${completados}/${total}`}</span>
                      </div>
                    </td>
                    <td className='px-4 py-3'>
                      <EstadoBadge estado={estadoMostrado} />
                    </td>
                    <td className='px-4 py-3 text-right'>
                      <img src='/svg/arrow-up-2.svg' alt='' />
                    </td>
                  </tr>
                )
              })}
            </tbody>
          )}
        </table>

        {!isLoadingOrders && historialSolicitudes.length === 0 ? (
          <div className='p-8 text-center text-gray-500'>No hay solicitudes registradas.</div>
        ) : null}
      </div>
    </div>
  )
}

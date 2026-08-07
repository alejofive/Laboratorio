'use client'

import EstadoBadge from '@/components/EstadoBadge'
import { useOrders, usePatients } from '@/data/createPatients'
import { OrderStatusApi } from '@/types/create'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'

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
  const isLoading = isLoadingPatients || isLoadingOrders

  const handleVolver = () => {
    router.push('/dashboard/pacientes')
  }

  if (isLoading) {
    return (
      <div className='p-9 w-full min-h-screen'>
        <Link href='/dashboard/pacientes' className='inline-flex items-center gap-1 hover:underline mb-4'>
          <ArrowLeft className='w-4 h-4' />
          Volver
        </Link>
        <div className='bg-white rounded-lg border border-gray-200 p-8 text-center'>
          <p className='text-gray-500'>Cargando historial del paciente...</p>
        </div>
      </div>
    )
  }

  if (!pacienteData) {
    return (
      <div className='p-9 w-full min-h-screen'>
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
    <div className='p-9 w-full min-h-screen'>
      <div className='flex items-center mb-4 gap-4'>
        <button type='button' onClick={handleVolver} className='cursor-pointer'>
          <ArrowLeft className='text-gray-700' />
        </button>
        <p className='text-primary text-2xl font-semibold'>Paciente</p>
      </div>

      <div className='bg-white rounded-3xl border border-gray-200 p-6 mb-5'>
        <div className='md:items-center md:justify-between gap-4'>
          <div className='flex justify-between mb-4'>
            <span className='text-xl text-secondary'>Paciente</span>
          </div>

          <div className='flex justify-between items-end'>
            <div>
              <p className='text-xl font-semibold'>
                {`${pacienteData.first_name} ${pacienteData.last_name}`.trim()}
              </p>
              <p className='text-secondary text-base flex items-center gap-3 mt-4'>
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

      <h1 className='text-2xl font-bold text-gray-900 mb-2 mt-5'>Historial de solicitudes</h1>

      {error ? (
        <div className='mb-5 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700'>
          No se pudo cargar el historial. {error instanceof Error ? error.message : null}
        </div>
      ) : null}

      <div className='mt-4 overflow-hidden rounded-3xl border border-border-default bg-surface'>
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
        </table>

        {historialSolicitudes.length === 0 ? (
          <div className='p-8 text-center text-gray-500'>No hay solicitudes registradas.</div>
        ) : null}
      </div>
    </div>
  )
}

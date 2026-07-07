'use client'

import { Examen, TipoExamen } from '@/types'
import { Calendar } from 'lucide-react'
import { FieldLabel, TextInput } from './ui/FormField'

interface ExamenTabsProps {
  examenes: { id: string; tipo: TipoExamen }[]
  examenActualId: string
  examen: Examen
  examenNombre: string
  readOnly: boolean
  doctorOrdenante: string
  onDoctorOrdenanteChange: (value: string) => void
}

export default function ExamenTabs({
  examen,
  readOnly,
  doctorOrdenante,
  onDoctorOrdenanteChange,
}: ExamenTabsProps) {
  const doctorOrdenanteMostrado = doctorOrdenante.trim() || 'Sin orden médica'
  const fechaExamen = new Date(examen.fechaCreacion).toLocaleDateString('es-ES')

  return (
    <div className='rounded-2xl border border-border-default bg-white px-4 py-4 md:px-5'>
      <div className='flex flex-col gap-4 md:flex-row md:items-end md:justify-between'>
        <div className='grid w-full gap-6 grid-cols-1 md:grid-cols-4'>
          <div>
            <FieldLabel className='font-medium'>Ordenado por:</FieldLabel>
            {readOnly ? (
              <span className='flex w-full items-center text-primary wrap-break-word font-semibold'>
                {doctorOrdenanteMostrado}
              </span>
            ) : (
              <TextInput
                type='text'
                value={doctorOrdenante}
                onChange={event => onDoctorOrdenanteChange(event.target.value)}
                readOnly={readOnly}
                className='h-12'
                placeholder='Nombre del doctor'
              />
            )}
          </div>
          <div>
            <FieldLabel className='font-medium'>Fecha del examen</FieldLabel>
            <div
              className={
                readOnly
                  ? 'flex w-full items-center text-primary wrap-break-word font-semibold'
                  : 'flex h-12 items-center justify-between rounded-xl border border-border-input px-4 text-base text-primary'
              }
            >
              <span>{fechaExamen}</span>
              {!readOnly && <Calendar className='h-4 w-4 text-secondary' />}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

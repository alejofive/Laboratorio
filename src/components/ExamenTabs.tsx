'use client'

import { Examen, TipoExamen } from '@/types'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import { Calendar } from 'lucide-react'
import DatePicker, { registerLocale } from 'react-datepicker'
import { FieldLabel, TextInput } from './ui/FormField'

registerLocale('es', es)

interface ExamenTabsProps {
  examenes: { id: string; tipo: TipoExamen }[]
  examenActualId: string
  examen: Examen
  examenNombre: string
  readOnly: boolean
  numeroOrden: string
  onNumeroOrdenChange: (value: string) => void
  doctorOrdenante: string
  onDoctorOrdenanteChange: (value: string) => void
  examDate: string
  onExamDateChange: (value: string) => void
  examTime: string
  onExamTimeChange: (value: string) => void
  bloodCollectionTime: string
  onBloodCollectionTimeChange: (value: string) => void
}

function parseIsoDateOnly(dateStr: string): Date | null {
  const [year, month, day] = dateStr.split('-').map(Number)
  if (!year || !month || !day) return null
  return new Date(year, month - 1, day)
}

function formatIsoDateOnly(date: Date): string {
  return format(date, 'yyyy-MM-dd')
}

function formatTimeDisplay(timeStr: string): string {
  const [hours, minutes] = timeStr.split(':').map(Number)
  if (Number.isNaN(hours) || Number.isNaN(minutes)) return timeStr

  const period = hours >= 12 ? 'PM' : 'AM'
  const hour12 = hours % 12 === 0 ? 12 : hours % 12
  return `${hour12}:${String(minutes).padStart(2, '0')} ${period}`
}

export default function ExamenTabs({
  examen,
  readOnly,
  numeroOrden,
  onNumeroOrdenChange,
  doctorOrdenante,
  onDoctorOrdenanteChange,
  examDate,
  onExamDateChange,
  examTime,
  onExamTimeChange,
  bloodCollectionTime,
  onBloodCollectionTimeChange,
}: ExamenTabsProps) {
  const numeroOrdenMostrado = numeroOrden.trim() || 'Sin número'
  const doctorOrdenanteMostrado = doctorOrdenante.trim() || 'Sin orden médica'
  const selectedExamDate = examDate ? parseIsoDateOnly(examDate) : null
  const fechaExamenMostrada = format(
    selectedExamDate ?? new Date(examen.fechaCreacion),
    'dd/MM/yyyy',
    { locale: es },
  )
  const horaExamenMostrada = examTime ? formatTimeDisplay(examTime) : null
  const horaTomaSangreMostrada = bloodCollectionTime ? formatTimeDisplay(bloodCollectionTime) : null

  return (
    <div className='rounded-2xl border border-border-default bg-white px-4 py-4 md:px-5'>
      <div className='flex flex-col gap-4 md:flex-row md:items-end md:justify-between'>
        <div className='grid w-full gap-6 grid-cols-1 md:grid-cols-6'>
          <div className='md:col-span-2'>
            <FieldLabel className='font-medium'>Número de orden</FieldLabel>
            {readOnly ? (
              <span className='flex w-full items-center text-primary wrap-break-word font-semibold'>
                {numeroOrdenMostrado}
              </span>
            ) : (
              <TextInput
                type='text'
                value={numeroOrden}
                onChange={event => onNumeroOrdenChange(event.target.value)}
                maxLength={40}
                className='h-12'
                placeholder='N°'
              />
            )}
          </div>
          <div className='md:col-span-2'>
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
          <div className='md:col-span-2 md:col-start-1'>
            <FieldLabel className='font-medium'>Fecha del examen</FieldLabel>
            {readOnly ? (
              <span className='flex w-full items-center text-primary wrap-break-word font-semibold'>
                {fechaExamenMostrada}
              </span>
            ) : (
              <div className='relative'>
                <DatePicker
                  selected={selectedExamDate}
                  onChange={(date: Date | null) =>
                    onExamDateChange(date ? formatIsoDateOnly(date) : '')
                  }
                  locale='es'
                  dateFormat='dd/MM/yyyy'
                  placeholderText='dd/mm/aaaa'
                  wrapperClassName='w-full'
                  calendarClassName='app-datepicker'
                  popperClassName='app-datepicker-popper'
                  customInput={<TextInput className='h-12 pr-10' />}
                />
                <Calendar className='pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-secondary' />
              </div>
            )}
          </div>
          <div className='md:col-span-2'>
            <FieldLabel className='font-medium'>Hora toma de muestra</FieldLabel>
            {readOnly ? (
              <span className='flex w-full items-center text-primary wrap-break-word font-semibold'>
                {horaExamenMostrada ?? 'Sin hora'}
              </span>
            ) : (
              <TextInput
                type='time'
                value={examTime}
                onChange={event => onExamTimeChange(event.target.value)}
                className='h-12'
              />
            )}
          </div>
          <div className='md:col-span-2'>
            <FieldLabel className='font-medium'>2da hora toma de muestra</FieldLabel>
            {readOnly ? (
              <span className='flex w-full items-center text-primary wrap-break-word font-semibold'>
                {horaTomaSangreMostrada ?? 'Sin hora'}
              </span>
            ) : (
              <TextInput
                type='time'
                value={bloodCollectionTime}
                onChange={event => onBloodCollectionTimeChange(event.target.value)}
                className='h-12'
              />
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

'use client'

import { useOrders } from '@/data/createPatients'
import { OrderItem } from '@/types/create'
import { Search } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useEffect, useMemo, useRef, useState } from 'react'
import { DateRange, DayPicker } from 'react-day-picker'
import 'react-day-picker/style.css'
import EstadoBadge from './EstadoBadge'
import { Button } from './ui/Button'
import { TextInput } from './ui/FormField'
import SvgIcon from './ui/SvgIcon'

const EMPTY_ORDERS: OrderItem[] = []
const CALENDAR_OPTION_STORAGE_KEY = 'exam-table-calendar-option'
const DATE_RANGE_STORAGE_KEY = 'exam-table-date-range'
type CalendarOption = 'hoy' | 'ayer' | 'ultimos7' | 'rango'

const isCalendarOption = (value: string | null): value is CalendarOption => {
  return value === 'hoy' || value === 'ayer' || value === 'ultimos7' || value === 'rango'
}

const getStoredCalendarOption = (fallback: CalendarOption): CalendarOption => {
  if (typeof window === 'undefined') return fallback

  const storedOption = window.sessionStorage.getItem(CALENDAR_OPTION_STORAGE_KEY)
  return isCalendarOption(storedOption) ? storedOption : fallback
}

const getStoredDateRange = (): DateRange | undefined => {
  if (typeof window === 'undefined') return undefined

  const storedRange = window.sessionStorage.getItem(DATE_RANGE_STORAGE_KEY)
  if (!storedRange) return undefined

  try {
    const parsed = JSON.parse(storedRange) as { from?: string; to?: string }
    return {
      from: parsed.from ? new Date(parsed.from) : undefined,
      to: parsed.to ? new Date(parsed.to) : undefined,
    }
  } catch {
    return undefined
  }
}

const formatRangeDate = (date: Date) => {
  const day = String(date.getDate()).padStart(2, '0')
  const month = String(date.getMonth() + 1).padStart(2, '0')
  return `${day}/${month}`
}

interface ExamTableProps {
  anterior: boolean
  mostrarAnteriores: boolean
  onToggleMostrarAnteriores: (checked: boolean) => void
  filtroEstado?: 'pendiente' | 'completo'
  onSummaryChange?: (summary: { totalSolicitudes: number; totalParaImprimir: number }) => void
}

export default function ExamTable({
  anterior,
  mostrarAnteriores,
  onToggleMostrarAnteriores,
  filtroEstado,
  onSummaryChange,
}: ExamTableProps) {
  const router = useRouter()
  const [paginaActual, setPaginaActual] = useState(1)
  const [busqueda, setBusqueda] = useState('')
  const [busquedaDebounced, setBusquedaDebounced] = useState('')
  const [dateRange, setDateRange] = useState<DateRange | undefined>(() => getStoredDateRange())
  const [showRangePicker, setShowRangePicker] = useState(false)
  const [activeCalendarOption, setActiveCalendarOption] = useState<CalendarOption>(() =>
    getStoredCalendarOption(mostrarAnteriores ? 'ayer' : 'hoy'),
  )
  const rangePickerRef = useRef<HTMLDivElement>(null)

  const PACIENTES_POR_PAGINA = 12
  const calendarOptions = [
    { value: 'hoy', label: 'Hoy' },
    { value: 'ayer', label: 'Ayer' },
    { value: 'ultimos7', label: 'Ultimos 7 dias' },
  ] as const

  const dayPickerClassNames = {
    months: 'flex flex-col',
    month: 'space-y-3',
    caption: 'flex items-center justify-between px-1 py-1',
    caption_label: 'text-lg font-semibold text-tertiary',
    nav: 'flex items-center justify-end gap-1',
    button_previous:
      'h-8 w-8 rounded-md !text-secondary hover:bg-gray-200 hover:text-tertiary transition-colors',
    button_next:
      'h-8 w-8 rounded-md !text-secondary hover:bg-gray-200 hover:text-tertiary transition-colors',
    chevron: 'text-secondary',
    month_grid: 'w-full border-collapse',
    weekdays: 'mb-1',
    weekday: 'text-[14px] font-medium text-secondary px-1 pb-1',
    week: 'mt-1',
    day: 'h-9 w-9 text-sm p-0 text-tertiary  rounded-md transition-colors',
    day_button:
      'h-9 w-[42px] rounded-md font-medium hover:bg-gray-200 hover:text-tertiary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-soft/50',
    today: 'ring-1 border border-brand-soft/20',
    selected: 'bg-primary text-white !rounded-md hover:bg-primary hover:text-white',
    range_start: 'bg-primary text-white !rounded-md  hover:bg-primary',
    range_middle: 'bg-primary/30 text-tertiary rounded-none hover:bg-primary/20',
    range_end: 'bg-primary text-white !rounded-md rounded-l-none hover:bg-primary',
    outside: 'text-gray-300',
    disabled: 'text-gray-300 opacity-50',
  }

  const getEstadoSolicitud = (status: OrderItem['status']): 'pendiente' | 'completo' => {
    if (status === 'completed' || status === 'sent') return 'completo'
    return 'pendiente'
  }

  const toApiDate = (date: Date) => {
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    return `${year}-${month}-${day}`
  }

  const { startDate, endDate } = useMemo(() => {
    const hoy = new Date()
    hoy.setHours(0, 0, 0, 0)

    if (activeCalendarOption === 'hoy') {
      const date = toApiDate(hoy)
      return { startDate: date, endDate: date }
    }

    if (activeCalendarOption === 'ayer') {
      const ayer = new Date(hoy)
      ayer.setDate(ayer.getDate() - 1)
      const date = toApiDate(ayer)
      return { startDate: date, endDate: date }
    }

    if (activeCalendarOption === 'ultimos7') {
      const inicio = new Date(hoy)
      inicio.setDate(inicio.getDate() - 6)
      return { startDate: toApiDate(inicio), endDate: toApiDate(hoy) }
    }

    const from = dateRange?.from ? new Date(dateRange.from) : new Date(hoy)
    from.setHours(0, 0, 0, 0)
    const to = dateRange?.to ? new Date(dateRange.to) : new Date(from)
    to.setHours(0, 0, 0, 0)

    return { startDate: toApiDate(from), endDate: toApiDate(to) }
  }, [activeCalendarOption, dateRange])

  const { data: orders } = useOrders({
    page: 1,
    limit: 100,
    search: busquedaDebounced.trim(),
    start_date: startDate,
    end_date: endDate,
  })

  const safeOrders = orders ?? EMPTY_ORDERS

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      setBusquedaDebounced(busqueda)
    }, 400)

    return () => {
      window.clearTimeout(timeoutId)
    }
  }, [busqueda])

  useEffect(() => {
    window.sessionStorage.setItem(CALENDAR_OPTION_STORAGE_KEY, activeCalendarOption)
    onToggleMostrarAnteriores(activeCalendarOption !== 'hoy')
  }, [activeCalendarOption, onToggleMostrarAnteriores])

  useEffect(() => {
    if (!dateRange) {
      window.sessionStorage.removeItem(DATE_RANGE_STORAGE_KEY)
      return
    }

    window.sessionStorage.setItem(
      DATE_RANGE_STORAGE_KEY,
      JSON.stringify({
        from: dateRange.from?.toISOString(),
        to: dateRange.to?.toISOString(),
      }),
    )
  }, [dateRange])

  useEffect(() => {
    if (!showRangePicker) return

    const handleClickOutside = (event: MouseEvent) => {
      if (!rangePickerRef.current?.contains(event.target as Node)) {
        setShowRangePicker(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [showRangePicker])

  const compareByFechaDescThenNombreAsc = (a: OrderItem, b: OrderItem) => {
    const fechaDiff = new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    if (fechaDiff !== 0) return fechaDiff
    return a.patient.name.localeCompare(b.patient.name, 'es', { sensitivity: 'base' })
  }

  const sortedOrders = useMemo(() => {
    return [...safeOrders]
      .filter(order => {
        if (!filtroEstado) return true
        return getEstadoSolicitud(order.status) === filtroEstado
      })
      .sort((a, b) => {
        if (activeCalendarOption === 'hoy') {
          return compareByFechaDescThenNombreAsc(a, b)
        }

        const estadoA = getEstadoSolicitud(a.status)
        const estadoB = getEstadoSolicitud(b.status)

        if (estadoA !== estadoB) {
          return estadoA === 'pendiente' ? -1 : 1
        }

        return compareByFechaDescThenNombreAsc(a, b)
      })
  }, [safeOrders, activeCalendarOption, filtroEstado])

  useEffect(() => {
    if (!onSummaryChange) return

    const totalSolicitudes = filtroEstado
      ? sortedOrders.length
      : sortedOrders.filter(order => getEstadoSolicitud(order.status) === 'pendiente').length

    const totalParaImprimir = sortedOrders.filter(
      order => getEstadoSolicitud(order.status) === 'completo',
    ).length

    onSummaryChange({ totalSolicitudes, totalParaImprimir })
  }, [sortedOrders, filtroEstado, onSummaryChange])

  const totalPaginas = Math.ceil(sortedOrders.length / PACIENTES_POR_PAGINA)
  const ordersPaginados = sortedOrders.slice(
    (paginaActual - 1) * PACIENTES_POR_PAGINA,
    paginaActual * PACIENTES_POR_PAGINA,
  )
  const calendarButtonLabel = dateRange?.from
    ? dateRange.to
      ? `${formatRangeDate(dateRange.from)} - ${formatRangeDate(dateRange.to)}`
      : formatRangeDate(dateRange.from)
    : null

  // if (orders.length === 0) {
  //   return (
  //     <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
  //       <p className="text-secondary">No hay pacientes registrados.</p>
  //       <Link href="/dashboard" className="text-emerald-600 hover:underline mt-2 inline-block">
  //         Registrar primer paciente
  //       </Link>
  //     </div>
  //   );
  // }

  const handleCalendarOptionClick = (value: Exclude<CalendarOption, 'rango'>) => {
    setActiveCalendarOption(value)
    setShowRangePicker(false)
    setPaginaActual(1)
  }

  const handleRangeChange = (range: DateRange | undefined) => {
    setDateRange(range)
    setActiveCalendarOption('rango')
    setPaginaActual(1)
  }

  const handleClearRange = () => {
    setDateRange(undefined)
    setActiveCalendarOption('hoy')
    setPaginaActual(1)
  }

  return (
    <div className='space-y-4 mt-6'>
      <div className='flex flex-wrap items-center justify-between gap-3'>
        <div className='flex flex-wrap items-center gap-3'>
          {anterior ? (
            <>
              <div className='bg-white flex rounded-xl overflow-hidden'>
                {calendarOptions.map(option => (
                  <button
                    type='button'
                    key={option.value}
                    onClick={() => handleCalendarOptionClick(option.value)}
                    className={`py-2.5 px-6 text-base transition-colors ${
                      activeCalendarOption === option.value
                        ? 'bg-brand-primary font-semibold text-white'
                        : 'cursor-pointer font-medium text-tertiary hover:bg-brand-active hover:text-brand-primary'
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
              <div ref={rangePickerRef} className='relative'>
                <button
                  type='button'
                  onClick={() => setShowRangePicker(prev => !prev)}
                  className={`h-10 rounded-lg flex justify-center items-center cursor-pointer transition-colors ${
                    activeCalendarOption === 'rango'
                      ? 'min-w-[126px] bg-brand-primary px-4 text-base font-semibold text-white hover:bg-brand-primary/90'
                      : 'w-[68px] bg-white hover:bg-brand-active'
                  }`}
                >
                  {activeCalendarOption === 'rango' && calendarButtonLabel ? (
                    calendarButtonLabel
                  ) : (
                    <SvgIcon src='/svg/paciente/calendar.svg' size={20} />
                  )}
                </button>

                {showRangePicker && (
                  <div className='absolute right-0 left-0  z-20 mt-2 w-[320px] rounded-xl border border-gray-200 bg-white p-3'>
                    <DayPicker
                      mode='range'
                      selected={dateRange}
                      onSelect={handleRangeChange}
                      numberOfMonths={1}
                      classNames={dayPickerClassNames}
                    />
                    <div className='mt-2 flex justify-between'>
                      <Button type='button' variant='link' size='sm' onClick={handleClearRange}>
                        Limpiar
                      </Button>
                      <Button
                        type='button'
                        variant='link'
                        size='sm'
                        onClick={() => setShowRangePicker(false)}
                      >
                        Cerrar
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </>
          ) : null}
        </div>

        <div className='relative'>
          <Search className='text-gray-400 absolute top-2.5 left-3 w-5 h-5' />
          <TextInput
            type='text'
            value={busqueda}
            onChange={e => {
              setBusqueda(e.target.value)
              setPaginaActual(1)
            }}
            className='w-[470px] pl-11'
            placeholder='Buscar por cédula, nombre o teléfono...'
          />
        </div>
      </div>

      <div className='overflow-hidden rounded-3xl border border-border-default bg-surface'>
        <table className='w-full'>
          <thead className='border-b border-border-default bg-surface-muted'>
            <tr>
              <th className='px-4 py-3 text-left text-sm font-medium text-secondary'>
                # Solicitud
              </th>
              <th className='px-4 py-3 text-left text-sm font-medium text-secondary'>Paciente</th>
              <th className='px-4 py-3 text-left text-sm font-medium text-secondary'>Fecha</th>
              <th className='px-4 py-3 text-left text-sm font-medium text-secondary'>Examenes</th>
              <th className='px-4 py-3 text-left text-sm font-medium text-secondary'>Estado</th>
              <th className='px-4 py-3 text-right text-sm font-medium text-secondary'></th>
            </tr>
          </thead>
          <tbody className='divide-y divide-border-default'>
            {ordersPaginados.map(order => {
              const estadoMostrado = getEstadoSolicitud(order.status)
              const completados = order.exams.completed
              const total = order.exams.total
              const porcentaje = total > 0 ? Math.round((completados / total) * 100) : 0

              return (
                <tr
                  onClick={() => router.push(`/dashboard/examen/${order.id}`)}
                  key={order.id}
                  className='cursor-pointer hover:bg-surface-muted'
                >
                  <td className='px-4 py-3 text-sm font-medium text-tertiary'>
                    {order.order_number}
                  </td>
                  <td className='px-4 py-3'>
                    <div className='flex flex-col'>
                      <span className='font-medium text-tertiary'>{order.patient.name}</span>
                      <span className='text-[11px] text-secondary'>
                        {order.patient.document_number}
                      </span>
                    </div>
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
                  <td className='px-4 py-3 text-right'></td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {sortedOrders.length === 0 && (
        <div className='p-8 text-center text-secondary'>
          {activeCalendarOption === 'hoy'
            ? 'No hay pacientes de hoy.'
            : activeCalendarOption === 'ayer'
              ? 'No hay pacientes de ayer.'
              : activeCalendarOption === 'ultimos7'
                ? 'No hay pacientes en los ultimos 7 dias.'
                : 'No hay pacientes para el rango seleccionado.'}
        </div>
      )}

      {totalPaginas > 1 && (
        <div className='flex items-center justify-center gap-2 mt-4'>
          <Button
            onClick={() => setPaginaActual(p => Math.max(1, p - 1))}
            disabled={paginaActual === 1}
            variant='outline'
            size='sm'
          >
            Anterior
          </Button>
          <span className='text-sm text-gray-600'>
            Página {paginaActual} de {totalPaginas}
          </span>
          <Button
            onClick={() => setPaginaActual(p => Math.min(totalPaginas, p + 1))}
            disabled={paginaActual === totalPaginas}
            variant='outline'
            size='sm'
          >
            Siguiente
          </Button>
        </div>
      )}
    </div>
  )
}

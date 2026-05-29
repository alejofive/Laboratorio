'use client';

import { useOrders } from '@/data/createPatients';
import { OrderItem } from '@/types/create';
import { Search } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import { DateRange, DayPicker } from 'react-day-picker';
import 'react-day-picker/style.css';
import EstadoBadge from './EstadoBadge';
import SvgIcon from './ui/SvgIcon';

const EMPTY_ORDERS: OrderItem[] = [];

interface ExamTableProps {
  anterior: boolean;
  mostrarAnteriores: boolean;
  onToggleMostrarAnteriores: (checked: boolean) => void;
  filtroEstado?: 'pendiente' | 'completo';
  onSummaryChange?: (summary: { totalSolicitudes: number; totalParaImprimir: number }) => void;
}

export default function ExamTable({ anterior, mostrarAnteriores, onToggleMostrarAnteriores, filtroEstado, onSummaryChange }: ExamTableProps) {
  const router = useRouter();
  const [paginaActual, setPaginaActual] = useState(1);
  const [busqueda, setBusqueda] = useState('');
  const [dateRange, setDateRange] = useState<DateRange | undefined>();
  const [showRangePicker, setShowRangePicker] = useState(false);
  const [activeCalendarOption, setActiveCalendarOption] = useState<'hoy' | 'ayer' | 'ultimos7' | 'rango'>(
    mostrarAnteriores ? 'ayer' : 'hoy'
  );

  const PACIENTES_POR_PAGINA = 12;
  const calendarOptions = [
    { value: 'hoy', label: 'Hoy' },
    { value: 'ayer', label: 'Ayer' },
    { value: 'ultimos7', label: 'Ultimos 7 dias' },
  ] as const;

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
  };

  const getEstadoSolicitud = (status: OrderItem['status']): 'pendiente' | 'completo' => {
    if (status === 'completed' || status === 'sent') return 'completo';
    return 'pendiente';
  };

  const toApiDate = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const { startDate, endDate } = useMemo(() => {
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);

    if (activeCalendarOption === 'hoy') {
      const date = toApiDate(hoy);
      return { startDate: date, endDate: date };
    }

    if (activeCalendarOption === 'ayer') {
      const ayer = new Date(hoy);
      ayer.setDate(ayer.getDate() - 1);
      const date = toApiDate(ayer);
      return { startDate: date, endDate: date };
    }

    if (activeCalendarOption === 'ultimos7') {
      const inicio = new Date(hoy);
      inicio.setDate(inicio.getDate() - 6);
      return { startDate: toApiDate(inicio), endDate: toApiDate(hoy) };
    }

    const from = dateRange?.from ? new Date(dateRange.from) : new Date(hoy);
    from.setHours(0, 0, 0, 0);
    const to = dateRange?.to ? new Date(dateRange.to) : new Date(from);
    to.setHours(0, 0, 0, 0);

    return { startDate: toApiDate(from), endDate: toApiDate(to) };
  }, [activeCalendarOption, dateRange]);

  const { data: orders } = useOrders({
    page: 1,
    limit: 100,
    search: busqueda.trim(),
    start_date: startDate,
    end_date: endDate,
  });

  const safeOrders = orders ?? EMPTY_ORDERS;

  const compareByFechaDescThenNombreAsc = (a: OrderItem, b: OrderItem) => {
    const fechaDiff = new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    if (fechaDiff !== 0) return fechaDiff;
    return a.patient.name.localeCompare(b.patient.name, 'es', { sensitivity: 'base' });
  };

  const sortedOrders = useMemo(() => {
    return [...safeOrders]
      .filter((order) => {
        if (!filtroEstado) return true;
        return getEstadoSolicitud(order.status) === filtroEstado;
      })
      .sort((a, b) => {
        if (activeCalendarOption === 'hoy') {
          return compareByFechaDescThenNombreAsc(a, b);
        }

        const estadoA = getEstadoSolicitud(a.status);
        const estadoB = getEstadoSolicitud(b.status);

        if (estadoA !== estadoB) {
          return estadoA === 'pendiente' ? -1 : 1;
        }

        return compareByFechaDescThenNombreAsc(a, b);
      });
  }, [safeOrders, activeCalendarOption, filtroEstado]);

  useEffect(() => {
    if (!onSummaryChange) return;

    const totalSolicitudes = filtroEstado
      ? sortedOrders.length
      : sortedOrders.filter((order) => getEstadoSolicitud(order.status) === 'pendiente').length;

    const totalParaImprimir = sortedOrders.filter((order) => getEstadoSolicitud(order.status) === 'completo').length;

    onSummaryChange({ totalSolicitudes, totalParaImprimir });
  }, [sortedOrders, filtroEstado, onSummaryChange]);

  const totalPaginas = Math.ceil(sortedOrders.length / PACIENTES_POR_PAGINA);
  const ordersPaginados = sortedOrders.slice(
    (paginaActual - 1) * PACIENTES_POR_PAGINA,
    paginaActual * PACIENTES_POR_PAGINA
  );

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

  const handleCalendarOptionClick = (value: 'hoy' | 'ayer' | 'ultimos7') => {
    setActiveCalendarOption(value);
    onToggleMostrarAnteriores(value !== 'hoy');
    setShowRangePicker(false);
    setPaginaActual(1);
  };

  const handleRangeChange = (range: DateRange | undefined) => {
    setDateRange(range);
    setActiveCalendarOption('rango');
    onToggleMostrarAnteriores(true);
    setPaginaActual(1);
  };

  return (
    <div className="space-y-4 mt-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-3">
          {anterior ? (
            <>
              <div className="bg-white flex shadow-sm rounded-xl overflow-hidden">
                {calendarOptions.map((option) => (
                  <button
                    type="button"
                    key={option.value}
                    onClick={() => handleCalendarOptionClick(option.value)}
                    className={`py-2.5 px-6 text-base transition-colors ${activeCalendarOption === option.value
                      ? 'bg-primary font-semibold text-white'
                      : 'text-tertiary font-medium cursor-pointer hover:bg-gray-200'
                      }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setShowRangePicker((prev) => !prev)}
                  className="h-10 w-[68px] rounded-lg flex justify-center items-center cursor-pointer bg-white shadow-sm hover:bg-gray-100"
                >
                  <SvgIcon src='/svg/paciente/calendar.svg' size={20} />
                </button>

                {showRangePicker && (
                  <div className="absolute right-0 left-0  z-20 mt-2 w-[320px] rounded-xl border border-gray-200 bg-white p-3 shadow-[0_8px_30px_rgba(15,23,42,0.12)]">
                    <DayPicker
                      mode="range"
                      selected={dateRange}
                      onSelect={handleRangeChange}
                      numberOfMonths={1}
                      classNames={dayPickerClassNames}
                    />
                    <div className="mt-2 flex justify-end">
                      <button
                        type="button"
                        className="rounded-md px-2 py-1 text-base font-bold text-secondary transition-colors hover:bg-gray-200"
                        onClick={() => setShowRangePicker(false)}
                      >
                        Cerrar
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </>
          ) : null}
        </div>

        <div className="relative">
          <Search className="text-gray-400 absolute top-2.5 left-3 w-5 h-5" />
          <input
            type="text"
            value={busqueda}
            onChange={(e) => {
              setBusqueda(e.target.value);
              setPaginaActual(1);
            }}
            className="text-secondary border-border-input w-[470px] rounded-xl border bg-white px-4 py-2 pl-11 text-base focus:outline-none focus:border-brand-soft"
            placeholder="Buscar por cédula, nombre o teléfono..."
          />
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
        <table className="w-full">
          <thead className="bg-surface-muted border-b border-surface-muted">
            <tr>
              <th className="px-4 py-3 text-left text-base font-medium text-secondary tracking-wider"># Solicitud</th>
              <th className="px-4 py-3 text-left text-base font-medium text-secondary tracking-wider">Paciente</th>
              <th className="px-4 py-3 text-left text-base font-medium text-secondary tracking-wider">Fecha</th>
              <th className="px-4 py-3 text-left text-base font-medium text-secondary tracking-wider">Examenes</th>
              <th className="px-4 py-3 text-left text-base font-medium text-secondary tracking-wider">Estado</th>
              <th className="px-4 py-3 text-right text-base font-medium text-secondary tracking-wider"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {ordersPaginados.map((order) => {
              const estadoMostrado = getEstadoSolicitud(order.status);
              const completados = order.exams.completed;
              const total = order.exams.total;
              const porcentaje = total > 0 ? Math.round((completados / total) * 100) : 0;

              return (
                <tr onClick={() => router.push(`/dashboard/examen/${order.id}`)} key={order.id} className="hover:bg-gray-50 cursor-pointer">
                  <td className="px-4 py-3 text-sm text-gray-700">{order.order_number}</td>
                  <td className="px-4 py-3">
                    <div className="flex flex-col">
                      <span className="font-medium text-tertiary">{order.patient.name}</span>
                      <span className="text-[11px] text-secondary">{order.patient.document_number}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-secondary">{new Date(order.created_at).toLocaleDateString('es-VE')}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="h-1.5 w-20 overflow-hidden rounded-full bg-gray-200">
                        <div className="h-full rounded-full bg-brand-primary transition-all" style={{ width: `${porcentaje}%` }} />
                      </div>
                      <span className="text-xs text-secondary">{`${completados}/${total}`}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <EstadoBadge estado={estadoMostrado} />
                  </td>
                  <td className="px-4 py-3 text-right"></td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {sortedOrders.length === 0 && (
        <div className="p-8 text-center text-secondary">
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
        <div className="flex items-center justify-center gap-2 mt-4">
          <button
            onClick={() => setPaginaActual((p) => Math.max(1, p - 1))}
            disabled={paginaActual === 1}
            className="px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 rounded disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Anterior
          </button>
          <span className="text-sm text-gray-600">
            Página {paginaActual} de {totalPaginas}
          </span>
          <button
            onClick={() => setPaginaActual((p) => Math.min(totalPaginas, p + 1))}
            disabled={paginaActual === totalPaginas}
            className="px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 rounded disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Siguiente
          </button>
        </div>
      )}
    </div>
  );
}

'use client';

import Link from 'next/link';
import { useLab } from '@/context/LabContext';
import EstadoBadge from './EstadoBadge';
import { Search } from 'lucide-react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Datepicker } from 'flowbite-react';
import type { SVGProps } from 'react';
import SvgIcon from './ui/SvgIcon';

interface ExamTableProps {
  anterior: boolean;
  mostrarAnteriores: boolean;
  onToggleMostrarAnteriores: (checked: boolean) => void;
  filtroEstado?: 'pendiente' | 'completo';
}

export default function ExamTable({ anterior, mostrarAnteriores, onToggleMostrarAnteriores, filtroEstado }: ExamTableProps) {

  const router = useRouter();

  const { examenes, pacientes } = useLab();
  const [paginaActual, setPaginaActual] = useState(1);
  const [busqueda, setBusqueda] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [activeCalendarOption, setActiveCalendarOption] = useState<'hoy' | 'ayer' | 'ultimos7' | 'fecha'>(
    mostrarAnteriores ? 'ayer' : 'hoy'
  );
  const PACIENTES_POR_PAGINA = 12;
  const calendarOptions = [
    { value: 'hoy', label: 'Hoy' },
    { value: 'ayer', label: 'Ayer' },
    { value: 'ultimos7', label: 'Ultimos 7 dias' },
  ] as const;

  const CalendarIcon = (props: SVGProps<SVGSVGElement>) => (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12.7754 0.917969C13.1896 0.917969 13.5254 1.25378 13.5254 1.66797V2.57129C16.8596 3.08659 18.0178 4.66563 18.2744 8.58105C18.3054 9.05313 18.3231 9.55938 18.3301 10.1016L18.334 10.6553C18.334 11.4104 18.3156 12.1003 18.2744 12.7295C17.9838 17.1633 16.5376 18.6032 12.084 18.8926C11.452 18.9336 10.7584 18.9512 10 18.9512C3.13779 18.9511 1.667 17.4869 1.66699 10.6553C1.66699 9.90014 1.68533 9.2103 1.72656 8.58105C1.98321 4.66556 3.14042 3.08655 6.47461 2.57129V1.66797C6.47463 1.25378 6.81041 0.917969 7.22461 0.917969C7.63862 0.918193 7.97459 1.25391 7.97461 1.66797V2.41504C8.59094 2.37661 9.26467 2.35938 10 2.35938C10.7355 2.35938 11.409 2.37659 12.0254 2.41504V1.66797C12.0254 1.25391 12.3614 0.918192 12.7754 0.917969ZM3.19141 9.33105C3.1759 9.74199 3.16699 10.1826 3.16699 10.6553C3.16699 12.3288 3.25882 13.5708 3.46777 14.5068C3.67281 15.4253 3.97025 15.9551 4.31836 16.3018C4.66709 16.6489 5.20153 16.9466 6.12695 17.1514C7.06914 17.3598 8.31876 17.4512 10 17.4512C10.479 17.4512 10.9258 17.4435 11.3418 17.4277C11.3526 17.3067 11.3666 17.181 11.3838 17.0518C11.5234 16.0018 11.9056 14.6131 12.9434 13.5801C13.9805 12.5478 15.3736 12.1681 16.4268 12.0293C16.5583 12.012 16.6864 11.9981 16.8096 11.9873C16.8253 11.5741 16.834 11.131 16.834 10.6553C16.834 10.1826 16.8251 9.74199 16.8096 9.33105H3.19141ZM16.6221 13.5156C15.7086 13.6361 14.7007 13.9481 14.002 14.6436C13.3036 15.3388 12.9909 16.3409 12.8701 17.249C12.8671 17.2715 12.865 17.2941 12.8623 17.3164C14.4168 17.1329 15.2123 16.769 15.6816 16.3018C16.149 15.8364 16.5121 15.0489 16.6963 13.5078C16.672 13.5108 16.6467 13.5124 16.6221 13.5156ZM10 3.85938C9.23217 3.85938 8.56132 3.87859 7.97461 3.91797V4.43359C7.97444 4.84753 7.63853 5.18337 7.22461 5.18359C6.8105 5.18359 6.47478 4.84766 6.47461 4.43359V4.09082C5.5928 4.24652 5.00001 4.47894 4.58301 4.7832C3.97345 5.2281 3.51171 6.01363 3.29883 7.83105H16.7021C16.4893 6.01403 16.0273 5.22818 15.418 4.7832C15.001 4.47886 14.4075 4.24655 13.5254 4.09082V4.43359C13.5252 4.84766 13.1895 5.18359 12.7754 5.18359C12.3615 5.18337 12.0256 4.84753 12.0254 4.43359V3.91797C11.4386 3.87857 10.7679 3.85938 10 3.85938Z" fill="#545454" />
    </svg>

  );

  const getExamenesDelPaciente = (pacienteId: string) =>
    examenes.filter(e => e.pacienteId === pacienteId);

  const isExamenCompleto = (estado: string) => estado === 'completo' || estado === 'enviado';

  const parseFechaToTimestamp = (fecha: string) => {
    const [dia, mes, anio] = fecha.split('/').map(Number);

    if (!dia || !mes || !anio) {
      return 0;
    }

    return Date.UTC(anio, mes - 1, dia);
  };

  const parseFechaToDate = (fecha: string) => {
    const [dia, mes, anio] = fecha.split('/').map(Number);
    if (!dia || !mes || !anio) return null;
    const date = new Date(anio, mes - 1, dia);
    date.setHours(0, 0, 0, 0);
    return date;
  };

  const isSameDay = (a: Date, b: Date) => {
    return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
  };

  const estadoPacienteCache = new Map<string, 'pendiente' | 'completo'>();
  const getEstadoPaciente = (pacienteId: string): 'pendiente' | 'completo' => {
    const estadoCacheado = estadoPacienteCache.get(pacienteId);
    if (estadoCacheado) return estadoCacheado;

    const examenesPaciente = getExamenesDelPaciente(pacienteId);
    const todosCompletos = examenesPaciente.every(e => isExamenCompleto(e.estado));
    const estado: 'pendiente' | 'completo' = todosCompletos ? 'completo' : 'pendiente';
    estadoPacienteCache.set(pacienteId, estado);
    return estado;
  };

  const compareByFechaDescThenNombreAsc = (a: (typeof pacientes)[number], b: (typeof pacientes)[number]) => {
    const fechaDiff = parseFechaToTimestamp(b.fecha) - parseFechaToTimestamp(a.fecha);
    if (fechaDiff !== 0) return fechaDiff;
    return a.nombre.localeCompare(b.nombre, 'es', { sensitivity: 'base' });
  };

  const sortedPacientes = [...pacientes]
    .filter(paciente => {
      const fechaPaciente = parseFechaToDate(paciente.fecha);
      if (!fechaPaciente) return false;

      const hoy = new Date();
      hoy.setHours(0, 0, 0, 0);

      if (activeCalendarOption === 'hoy') {
        return isSameDay(fechaPaciente, hoy);
      }

      if (activeCalendarOption === 'ayer') {
        const ayer = new Date(hoy);
        ayer.setDate(ayer.getDate() - 1);
        return isSameDay(fechaPaciente, ayer);
      }

      if (activeCalendarOption === 'ultimos7') {
        const inicio = new Date(hoy);
        inicio.setDate(inicio.getDate() - 6);
        return fechaPaciente >= inicio && fechaPaciente <= hoy;
      }

      const fechaSeleccionada = new Date(selectedDate);
      fechaSeleccionada.setHours(0, 0, 0, 0);
      return isSameDay(fechaPaciente, fechaSeleccionada);
    })
    .filter(paciente => {
      if (!busqueda) return true;
      const texto = busqueda.toLowerCase();
      return (
        paciente.nombre.toLowerCase().includes(texto) ||
        paciente.cedula.toLowerCase().includes(texto)
      );
    })
    .filter(paciente => {
      if (!filtroEstado) return true;
      return getEstadoPaciente(paciente.id) === filtroEstado;
    })
    .sort((a, b) => {
      if (activeCalendarOption === 'hoy') {
        return compareByFechaDescThenNombreAsc(a, b);
      }

      const estadoA = getEstadoPaciente(a.id);
      const estadoB = getEstadoPaciente(b.id);

      if (estadoA !== estadoB) {
        return estadoA === 'pendiente' ? -1 : 1;
      }

      return compareByFechaDescThenNombreAsc(a, b);
    });

  const totalPaginas = Math.ceil(sortedPacientes.length / PACIENTES_POR_PAGINA);
  const pacientesPaginados = sortedPacientes.slice(
    (paginaActual - 1) * PACIENTES_POR_PAGINA,
    paginaActual * PACIENTES_POR_PAGINA
  );

  if (pacientes.length === 0) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
        <p className="text-secondary">No hay pacientes registrados.</p>
        <Link href="/dashboard" className="text-emerald-600 hover:underline mt-2 inline-block">
          Registrar primer paciente
        </Link>
      </div>
    );
  }

  const handleCalendarOptionClick = (value: 'hoy' | 'ayer' | 'ultimos7') => {
    setActiveCalendarOption(value);
    onToggleMostrarAnteriores(value !== 'hoy');
    setPaginaActual(1);
  };

  const formatDateToDayOfYear = (isoDate: string) => {
    const date = new Date(isoDate);
    const year = date.getFullYear();

    // Calcular el día del año
    const startOfYear = new Date(year, 0, 1);
    const diff = date.getTime() - startOfYear.getTime();
    const dayOfYear = Math.floor(diff / (1000 * 60 * 60 * 24)) + 1;

    // Formatear con ceros a la izquierda (3 dígitos)
    const dayFormatted = String(dayOfYear).padStart(3, '0');

    return `${year}-${dayFormatted}`;
  }


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
              <Datepicker
                icon={CalendarIcon}
                className="w-11 [&_input]:h-10 [&_input]:w-16 [&_input]:cursor-pointer [&_input]:rounded-lg [&_input]:border-0 [&_input]:bg-white [&_input]:hover:bg-gray-200 [&_input]:px-0 [&_input]:text-transparent [&_input]:shadow-sm [&_input]:[text-indent:-9999px] [&_input]:focus:border-brand-soft [&_input]:focus:ring-2 [&_input]:focus:ring-brand-soft/30 [&_svg]:left-[10px] [&_svg]:top-[10px] [&_svg]:h-5 [&_svg]:w-5 [&_svg]:translate-y-[11px] [&_svg]:translate-x-[21px]"
                language="es-ES"
                showTodayButton
                showClearButton
                theme={{
                  popup: {
                    root: {
                      base: 'absolute top-10 z-50 block',
                      inline: 'relative top-0 z-auto',
                      inner: 'inline-block rounded-lg !bg-white border border-gray-200  p-4 shadow-lg',
                    },
                    header: {
                      base: '',
                      title: 'px-2 py-3 text-center font-semibold text-black',
                      selectors: {
                        base: 'mb-2 flex justify-between ',
                        button: {
                          base: 'rounded-lg [&_svg]:translate-y-[px] [&_svg]:translate-x-[px] px-5 py-2.5 text-sm font-semibold text-black hover:bg-gray-100 focus:outline-none',
                          prev: 'cursor-pointer',
                          next: 'cursor-pointer',
                          view: 'cursor-pointer',
                        },
                      },
                    },
                    view: {
                      base: 'p-1 ',
                    },
                    footer: {
                      base: 'mt-2 flex space-x-2',
                      button: {
                        base: 'w-full rounded-lg px-5 py-2 text-center text-sm font-medium',
                        today: 'bg-primary text-white hover:opacity-90',
                        clear: 'border border-gray-300 bg-white text-black hover:bg-gray-100',
                      },
                    },
                  },
                  views: {
                    days: {
                      header: {
                        base: 'mb-1 grid grid-cols-7',
                        title: 'h-6 text-center text-sm font-medium leading-6 text-black',
                      },
                      items: {
                        base: 'grid w-64 grid-cols-7',
                        item: {
                          base: 'block flex-1 cursor-pointer rounded-lg border-0 text-center text-sm font-semibold leading-9 !text-black hover:bg-gray-100',
                          selected: 'bg-primary !text-white hover:opacity-90',
                          disabled: 'text-gray-400',
                          today: '',
                        },
                      },
                    },
                  },
                }}
                value={selectedDate}
                onChange={(date) => {
                  setActiveCalendarOption('fecha');
                  setSelectedDate(date ?? new Date());
                  setPaginaActual(1);
                }}
              />
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
            {pacientesPaginados.map(paciente => {
              const examenesPaciente = getExamenesDelPaciente(paciente.id);
              const primerExamen = examenesPaciente[0];
              const estadoMostrado = getEstadoPaciente(paciente.id);
              const completados = examenesPaciente.filter((examen) => isExamenCompleto(examen.estado)).length;
              const total = examenesPaciente.length;
              const porcentaje = total > 0 ? Math.round((completados / total) * 100) : 0;

              return (
                <tr onClick={() => router.push(`/dashboard/examen/${primerExamen?.id}`)} key={paciente.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm text-gray-700">{formatDateToDayOfYear(primerExamen?.fechaCreacion)}</td>
                  <td className="px-4 py-3">
                    <div className="flex flex-col">
                      <span className="font-medium text-tertiary">{paciente.nombre}</span>
                      <span className="text-[11px] text-secondary">{paciente.cedula}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-secondary">{paciente.fecha}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="h-1.5 w-20 overflow-hidden rounded-full bg-gray-200">
                        <div className="h-full rounded-full bg-brand-primary transition-all" style={{ width: `${porcentaje}%` }} />
                      </div>
                      <span className="text-xs text-secondary">{`${completados}/${total}`}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    {primerExamen && <EstadoBadge estado={estadoMostrado} />}
                  </td>
                  <td className="px-4 py-3 text-right">

                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {sortedPacientes.length === 0 && (
        <div className="p-8 text-center text-secondary">
          {activeCalendarOption === 'hoy'
            ? 'No hay pacientes de hoy.'
            : activeCalendarOption === 'ayer'
              ? 'No hay pacientes de ayer.'
              : activeCalendarOption === 'ultimos7'
                ? 'No hay pacientes en los ultimos 7 dias.'
                : 'No hay pacientes para la fecha seleccionada.'}
        </div>
      )}

      {totalPaginas > 1 && (
        <div className="flex items-center justify-center gap-2 mt-4">
          <button
            onClick={() => setPaginaActual(p => Math.max(1, p - 1))}
            disabled={paginaActual === 1}
            className="px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 rounded disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Anterior
          </button>
          <span className="text-sm text-gray-600">
            Página {paginaActual} de {totalPaginas}
          </span>
          <button
            onClick={() => setPaginaActual(p => Math.min(totalPaginas, p + 1))}
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

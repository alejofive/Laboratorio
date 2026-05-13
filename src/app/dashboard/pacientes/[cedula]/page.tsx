'use client';

import { useLab } from '@/context/LabContext';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { ArrowLeft, Eye, Plus, Check } from 'lucide-react';
import EstadoBadge from '@/components/EstadoBadge';
import { TipoExamen } from '@/types';
import { useRouter } from 'next/navigation';

const examLabels: Record<TipoExamen, string> = {
  dengue: 'Dengue',
  frotis_sangre: 'Frotis de sangre periferica',
  glicemia_pre_post: 'GLICEMIA PRE POST',
  heces: 'Heces',
  hematologia: 'Hematología',
  helicobacter_pylori: 'Helicobacter Pylori',
  hematologia_quimica: 'Hematología y Química',
  hematologia_serologia: 'Hematología y Serología',
  hemoglobina_hematocritos: 'Hemoglobina Hematocritos',
  hemoparasitos: 'Hemoparasitos',
  nuevo_completo: 'Nuevo Completo',
  orina_heces: 'Orina y Heces',
  orina: 'Orina',
  prueba_embarazo: 'PRUEBA DE EMBARAZO',
  quimica_colinesterasa: 'Química Colinesterasa',
  quimica_corta: 'QUIMICA SANGUINEA MAS CORTA',
  quimica_heces: 'Química y Heces',
  quimica_orina: 'Química y Orina',
  quimica_serologia: 'Química y Serología',
  quimica: 'Química Sanguínea',
  serologia_asto_psa_pylori: 'Serologia ASTO PSA Pylori',
  serologia_heces: 'Serología y Heces',
  serologia_orina: 'Serología y Orina',
  serologia: 'Serología',
  tipo_sangre: 'Tipo de sangre',
  vdrl_hepatitis: 'VDRL Hepatitis y demas',
};

export default function PacienteHistorialPage() {
  const router = useRouter();
  const params = useParams();
  const cedula = params.cedula as string;
  const { pacientes, examenes } = useLab();

  const parseFechaPaciente = (fecha: string) => {
    const [dia, mes, anio] = fecha.split('/').map(Number);
    return new Date(anio, (mes || 1) - 1, dia || 1).getTime();
  };

  const pacientesDelHistorial = pacientes
    .filter(p => p.cedula === cedula)
    .sort((a, b) => parseFechaPaciente(b.fecha) - parseFechaPaciente(a.fecha));

  const pacienteData = pacientesDelHistorial[0];

  if (!pacienteData) {
    return (
      <div className="px-8 py-5 w-full min-h-screen">
        <Link href="/dashboard/pacientes" className="inline-flex items-center gap-1hover:underline mb-4">
          <ArrowLeft className="w-4 h-4" />
          Volver
        </Link>
        <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
          <p className="text-gray-500">Paciente no encontrado.</p>
        </div>
      </div>
    );
  }

  const isExamenCompleto = (estado: string) => estado === 'completo' || estado === 'enviado';

  const historialVisitas = pacientesDelHistorial.map((visita) => {
    const examenesVisita = examenes
      .filter(examen => examen.pacienteId === visita.id)
      .sort((a, b) => new Date(b.fechaCreacion).getTime() - new Date(a.fechaCreacion).getTime());

    return { visita, examenesVisita };
  });

  const handleVolver = () => {
    router.push(`/dashboard/pacientes`);
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
    <div className="px-8 py-5 w-full min-h-screen">

      <div className='flex items-center mb-4 gap-4'>
        <button
          onClick={handleVolver}
          className="cursor-pointer"
        >
          <ArrowLeft className="text-gray-700" />
        </button>
        <p className='text-primary text-2xl font-semibold'>Paciente</p>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm mb-5">
        <div className=" md:items-center md:justify-between gap-4 ">
          <div className='flex justify-between mb-4'>
            <span className='text-xl text-secondary'>Paciente</span>
            <div className="flex items-center gap-2">

            </div>
          </div>

          <div className='flex justify-between items-end'>
            <div>
              <div className="flex items-center justify-between">
                <p className="text-xl font-semibold">{pacienteData.nombre}</p>
              </div>
              <p className="text-secondary text-base  flex items-center gap-3 mt-4">
                <span className="flex items-center gap-2"><img src="/svg/paciente/cedula.svg" alt="" /> {pacienteData.cedula}</span>
                <span className="flex items-center gap-2"><img src="/svg/paciente/phone.svg" alt="" /> {pacienteData.telefono}</span>
                <span className="flex items-center gap-2"><img src="/svg/paciente/calendar.svg" alt="" /> {pacienteData.edad} años</span>
                <span className="flex items-center gap-2"><img src="/svg/paciente/location.svg" alt="" /> {pacienteData.direccion}</span>
              </p>
            </div>

          </div>
        </div>
      </div>


      <h1 className="text-2xl font-bold text-gray-900 mb-2 mt-5">Historial de visitas</h1>
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm">

        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-bold text-secondary uppercase tracking-wider"># Solicitud</th>
              <th className="px-4 py-3 text-left text-xs font-bold text-secondary uppercase tracking-wider">Fecha</th>
              <th className="px-4 py-3 text-left text-xs font-bold text-secondary uppercase tracking-wider">Exámenes</th>
              <th className="px-4 py-3 text-left text-xs font-bold text-secondary uppercase tracking-wider">Estado</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {historialVisitas.map(({ visita, examenesVisita }) => {
              const examenesVisibles = examenesVisita.slice(0, 2);
              const examenesRestantes = examenesVisita.length - examenesVisibles.length;
              const primerExamen = examenesVisita[0];
              const completados = examenesVisita.filter((examen) => isExamenCompleto(examen.estado)).length;
              const total = examenesVisita.length;
              const porcentaje = total > 0 ? Math.round((completados / total) * 100) : 0;
              const todosCompletos =
                examenesVisita.length > 0 &&
                examenesVisita.every(examen => examen.estado === 'completo' || examen.estado === 'enviado');
              const estadoMostrado: 'pendiente' | 'completo' = todosCompletos ? 'completo' : 'pendiente';

              return (
                <tr
                  key={visita.id}
                  onClick={() => {
                    if (primerExamen) {
                      router.push(`/dashboard/examen/${primerExamen.id}?cedula=${cedula}`);
                    }
                  }}
                  onKeyDown={(event) => {
                    if (!primerExamen) return;
                    if (event.key === 'Enter' || event.key === ' ') {
                      event.preventDefault();
                      router.push(`/dashboard/examen/${primerExamen.id}?cedula=${cedula}`);
                    }
                  }}
                  tabIndex={primerExamen ? 0 : -1}
                  className={`hover:bg-gray-50 ${primerExamen ? 'cursor-pointer' : ''}`}
                >
                  <td className="px-4 py-3 text-sm text-gray-700">{formatDateToDayOfYear(primerExamen?.fechaCreacion)}</td>
                  <td className="px-4 py-3 text-sm text-gray-500">{visita.fecha}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="h-1.5 w-20 overflow-hidden rounded-full bg-gray-200">
                        <div className="h-full rounded-full bg-brand-primary transition-all" style={{ width: `${porcentaje}%` }} />
                      </div>
                      <span className="text-xs text-secondary">{`${completados}/${total}`}</span>
                    </div>
                  </td>

                  <td className="px-4 py-3">
                    {examenesVisita.length > 0 && <EstadoBadge estado={estadoMostrado} />}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {historialVisitas.length === 0 && (
          <div className="p-8 text-center text-gray-500">No hay exámenes registrados.</div>
        )}
      </div>
    </div>
  );
}

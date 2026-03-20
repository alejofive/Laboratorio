'use client';

import { useLab } from '@/context/LabContext';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { ArrowLeft, Eye, Plus, Check } from 'lucide-react';
import EstadoBadge from '@/components/EstadoBadge';
import { TipoExamen } from '@/types';

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
      <div className="px-32 py-5 w-full min-h-screen">
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

  const historialVisitas = pacientesDelHistorial.map((visita) => {
    const examenesVisita = examenes
      .filter(examen => examen.pacienteId === visita.id)
      .sort((a, b) => new Date(b.fechaCreacion).getTime() - new Date(a.fechaCreacion).getTime());

    return { visita, examenesVisita };
  });

  return (
    <div className="px-32 py-5 w-full min-h-screen">


      <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm mb-5">
        <Link href="/dashboard/pacientes" className="inline-flex items-center gap-1 hover:underline mb-4">
          <ArrowLeft className="" />
        </Link>
        <h1 className="text-2xl font-bold text-gray-900 mb-4">{pacienteData.nombre}</h1>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <p className="text-xs text-gray-500 uppercase">Cédula</p>
            <p className="text-gray-900">{pacienteData.cedula}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500 uppercase">Teléfono</p>
            <p className="text-gray-900">{pacienteData.telefono}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500 uppercase">Edad</p>
            <p className="text-gray-900">{pacienteData.edad} años</p>
          </div>
          <div>
            <p className="text-xs text-gray-500 uppercase">Dirección</p>
            <p className="text-gray-900">{pacienteData.direccion}</p>
          </div>
        </div>
      </div>


      <h1 className="text-2xl font-bold text-gray-900 mb-2 mt-5">Historial de visitas</h1>
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm">

        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Paciente</th>
              <th className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Exámenes</th>
              <th className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Fecha</th>
              <th className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Estado</th>
              <th className="px-4 py-3 text-right text-xs font-bold text-gray-500 uppercase tracking-wider">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {historialVisitas.map(({ visita, examenesVisita }) => {
              const examenesVisibles = examenesVisita.slice(0, 2);
              const examenesRestantes = examenesVisita.length - examenesVisibles.length;
              const primerExamen = examenesVisita[0];
              const todosCompletos =
                examenesVisita.length > 0 &&
                examenesVisita.every(examen => examen.estado === 'completo' || examen.estado === 'enviado');
              const estadoMostrado: 'pendiente' | 'completo' = todosCompletos ? 'completo' : 'pendiente';

              return (
                <tr key={visita.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <p className="font-medium text-gray-900">{visita.nombre}</p>
                    <p className="text-xs text-gray-500">{visita.cedula}</p>
                  </td>
                  <td className="px-4 py-3">
                    {examenesVisita.length === 0 ? (
                      <span className="text-xs text-gray-500">Sin exámenes asociados</span>
                    ) : (
                      <div className="flex flex-wrap items-center gap-1">
                        {examenesVisibles.map((examen) => {
                          const estaCompleto = examen.estado === 'completo' || examen.estado === 'enviado';

                          return (
                            <span
                              key={examen.id}
                              className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium ${estaCompleto ? 'bg-green-100 text-green-500' : 'bg-orange-100 text-orange-700'
                                }`}
                            >
                              {estaCompleto && <Check className="w-3 h-3" />}
                              {examLabels[examen.tipo]}
                            </span>
                          );
                        })}
                        {examenesRestantes > 0 && (
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-cyan-100 text-cyan-700">
                            +{examenesRestantes} más
                          </span>
                        )}
                      </div>
                    )}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-500">{visita.fecha}</td>
                  <td className="px-4 py-3">
                    {examenesVisita.length > 0 && <EstadoBadge estado={estadoMostrado} />}
                  </td>
                  <td className="px-4 py-3 text-right">
                    {primerExamen ? (
                      !todosCompletos ? (
                        <Link
                          href={`/dashboard/examen/${primerExamen.id}?cedula=${cedula}`}
                          className="inline-flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-md transition-colors"
                        >
                          <Plus className="w-4 h-4" />
                          Agregar Resultados
                        </Link>
                      ) : (
                        <Link
                          href={`/dashboard/examen/${primerExamen.id}?cedula=${cedula}`}
                          className="inline-flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-emerald-700 bg-emerald-50 hover:bg-emerald-100 rounded-md transition-colors"
                        >
                          <Eye className="w-4 h-4" />
                          Ver
                        </Link>
                      )
                    ) : (
                      <span className="text-xs text-gray-500">Sin acciones</span>
                    )}
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

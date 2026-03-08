'use client';

import { useLab } from '@/context/LabContext';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { ArrowLeft, Eye } from 'lucide-react';
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

  const pacienteData = pacientes.find(p => p.cedula === cedula);

  if (!pacienteData) {
    return (
      <div className="px-32 py-5 w-full min-h-screen">
        <Link href="/dashboard/pacientes" className="inline-flex items-center gap-1 text-cyan-600 hover:underline mb-4">
          <ArrowLeft className="w-4 h-4" />
          Volver
        </Link>
        <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
          <p className="text-gray-500">Paciente no encontrado.</p>
        </div>
      </div>
    );
  }

  const examenesDelPaciente = examenes
    .filter(e => e.pacienteId === pacienteData.id)
    .sort((a, b) => new Date(b.fechaCreacion).getTime() - new Date(a.fechaCreacion).getTime());

  const examenesAgrupados = examenesDelPaciente.reduce((acc, examen) => {
    const fecha = examen.fechaCreacion.split('T')[0];
    if (!acc[fecha]) {
      acc[fecha] = [];
    }
    acc[fecha].push(examen);
    return acc;
  }, {} as Record<string, typeof examenesDelPaciente>);

  const fechasOrdenadas = Object.keys(examenesAgrupados).sort((a, b) => 
    new Date(b).getTime() - new Date(a).getTime()
  );

  return (
    <div className="px-32 py-5 w-full min-h-screen">
      <Link href="/dashboard/pacientes" className="inline-flex items-center gap-1 text-cyan-600 hover:underline mb-4">
        <ArrowLeft className="w-4 h-4" />
        Volver
      </Link>

      <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm mb-5">
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

      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-bold text-gray-900">Historial de Exámenes</h2>
        </div>
        
        {fechasOrdenadas.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            No hay exámenes registrados.
          </div>
        ) : (
          fechasOrdenadas.map(fecha => (
            <div key={fecha} className="border-b border-gray-200 last:border-b-0">
              <div className="px-6 py-3 bg-gray-50">
                <p className="text-sm font-medium text-gray-700">
                  {new Date(fecha).toLocaleDateString('es-ES')}
                </p>
              </div>
              <div className="divide-y divide-gray-200">
                {examenesAgrupados[fecha].map(examen => {
                  const estaCompleto = examen.estado === 'completo' || examen.estado === 'enviado';
                  return (
                    <div key={examen.id} className="px-6 py-4 flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${
                          estaCompleto ? 'bg-cyan-100 text-cyan-700' : 'bg-gray-100 text-gray-700'
                        }`}>
                          {examLabels[examen.tipo]}
                        </span>
                        <EstadoBadge estado={examen.estado} />
                      </div>
                      <Link
                        href={`/dashboard/examen/${examen.id}?cedula=${cedula}`}
                        className="inline-flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-emerald-700 bg-emerald-50 hover:bg-emerald-100 rounded-md transition-colors"
                      >
                        <Eye className="w-4 h-4" />
                        Ver Resultados
                      </Link>
                    </div>
                  );
                })}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

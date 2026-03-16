'use client';

import Link from 'next/link';
import { useLab } from '@/context/LabContext';
import EstadoBadge from './EstadoBadge';
import { TipoExamen } from '@/types';
import { Search, Plus, Eye, Printer, MoreHorizontal, Check } from 'lucide-react';
import * as Switch from '@radix-ui/react-switch';
import { useState } from 'react';

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

export default function ExamTable({ anterior }: { anterior: boolean }) {
  const { examenes, pacientes } = useLab();
  const [filtroPendientes, setFiltroPendientes] = useState(false);
  const [paginaActual, setPaginaActual] = useState(1);
  const [busqueda, setBusqueda] = useState('');
  const PACIENTES_POR_PAGINA = 12;

  const getFechaHoy = () => {
    const hoy = new Date();
    return `${hoy.getDate()}/${hoy.getMonth() + 1}/${hoy.getFullYear()}`;
  };

  const getExamenesDelPaciente = (pacienteId: string) =>
    examenes.filter(e => e.pacienteId === pacienteId);

  const sortedPacientes = [...pacientes]
    .filter(paciente => {
      const fechaHoy = getFechaHoy();
      const esFechaAnterior = paciente.fecha !== fechaHoy;

      if (!filtroPendientes) {
        return paciente.fecha === fechaHoy;
      }
      return esFechaAnterior;
    })
    .filter(paciente => {
      if (!busqueda) return true;
      const texto = busqueda.toLowerCase();
      return (
        paciente.nombre.toLowerCase().includes(texto) ||
        paciente.cedula.toLowerCase().includes(texto)
      );
    })
    .sort((a, b) =>
      new Date(b.fecha).getTime() - new Date(a.fecha).getTime()
    );

  const totalPaginas = Math.ceil(sortedPacientes.length / PACIENTES_POR_PAGINA);
  const pacientesPaginados = sortedPacientes.slice(
    (paginaActual - 1) * PACIENTES_POR_PAGINA,
    paginaActual * PACIENTES_POR_PAGINA
  );

  if (pacientes.length === 0) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
        <p className="text-gray-500">No hay pacientes registrados.</p>
        <Link href="/dashboard" className="text-emerald-600 hover:underline mt-2 inline-block">
          Registrar primer paciente
        </Link>
      </div>
    );
  }

  return (
    <div className='mt-10'>
      <div className='flex items-center justify-between gap-5'>
        <h1 className="text-2xl font-bold text-gray-900">Tabla de Pacientes {filtroPendientes ? 'Anteriores' : 'de Hoy'}</h1>

        <div className='flex gap-4 items-center'>
          <div className='relative'>
            <Search className='text-gray-400 absolute top-1.5 right-3' />
            <input
              type="text"
              value={busqueda}
              onChange={(e) => {
                setBusqueda(e.target.value);
                setPaginaActual(1);
              }}
              className='border border-gray-300 bg-white rounded-lg h-9 w-80 pl-5 pr-10 text-gray-700 focus:outline-none focus:border-cyan-500'
              placeholder='Buscar Nombre o Cédula...'
            />
          </div>

          {anterior && (
            <div className='flex items-center gap-2'>
              <span className='text-sm text-gray-600'>Hoy</span>
              <Switch.Root
                checked={filtroPendientes}
                onCheckedChange={(checked) => {
                  setFiltroPendientes(checked);
                  setPaginaActual(1);
                }}
                className="w-11 h-6 bg-gray-300 rounded-full relative data-[state=checked]:bg-cyan-600 transition-colors outline-none cursor-pointer"
              >
                <Switch.Thumb className="block w-5 h-5 bg-white rounded-full shadow-md transition-transform duration-100 translate-x-0.5 will-change-transform data-[state=checked]:translate-x-[22px]" />
              </Switch.Root>
              <span className='text-sm text-gray-600'>Anterior</span>
            </div>
          )}
        </div>
      </div>



      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm mt-5">
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
            {pacientesPaginados.map(paciente => {
              const examenesPaciente = getExamenesDelPaciente(paciente.id);
              const examenesVisibles = examenesPaciente.slice(0, 2);
              const examenesRestantes = examenesPaciente.length - examenesVisibles.length;
              const primerExamen = examenesPaciente[0];

              const todosCompletos = examenesPaciente.every(e => e.estado === 'completo' || e.estado === 'enviado');
              const algunosCompletos = examenesPaciente.some(e => e.estado === 'completo' || e.estado === 'enviado');

              let estadoMostrado: 'pendiente' | 'en_proceso' | 'completo';
              if (todosCompletos) {
                estadoMostrado = 'completo';
              } else if (algunosCompletos) {
                estadoMostrado = 'en_proceso';
              } else {
                estadoMostrado = 'pendiente';
              }

              return (
                <tr key={paciente.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <p className="font-medium text-gray-900">{paciente.nombre}</p>
                    <p className="text-xs text-gray-500">{paciente.cedula}</p>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap items-center gap-1">
                      {examenesVisibles.map((examen, idx) => {
                        const estaCompleto = examen.estado === 'completo' || examen.estado === 'enviado';
                        return (
                          <span key={idx} className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium ${estaCompleto ? 'bg-cyan-100 text-cyan-700' : 'bg-gray-100 text-gray-700'
                            }`}>
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
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-500">
                    {paciente.fecha}
                  </td>
                  <td className="px-4 py-3">
                    {primerExamen && <EstadoBadge estado={estadoMostrado} />}
                  </td>
                  <td className="px-4 py-3 text-right">
                    {!todosCompletos ? (
                      <Link
                        href={`/dashboard/examen/${primerExamen?.id}`}
                        className="inline-flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-md transition-colors"
                      >
                        <Plus className="w-4 h-4" />
                        Agregar Resultados
                      </Link>
                    ) : (
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/dashboard/examen/${primerExamen?.id}`}
                          className="inline-flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-emerald-700 bg-emerald-50 hover:bg-emerald-100 rounded-md transition-colors"
                        >
                          <Eye className="w-4 h-4" />
                          Ver
                        </Link>

                      </div>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {sortedPacientes.length === 0 && (
        <div className="p-8 text-center text-gray-500">
          {filtroPendientes
            ? 'No hay pacientes de días anteriores.'
            : 'No hay pacientes de hoy.'}
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

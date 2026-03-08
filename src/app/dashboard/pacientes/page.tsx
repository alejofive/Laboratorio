'use client';

import { useLab } from '@/context/LabContext';
import { Search } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

export default function PacientesPage() {
  const { getPacientesUnicos, pacientes } = useLab();
  const [busqueda, setBusqueda] = useState('');

  const pacientesUnicos = getPacientesUnicos();
  
  const pacientesArray = Array.from(pacientesUnicos.entries()).map(([cedula, data]) => ({
    cedula,
    nombre: data.paciente.nombre,
    telefono: data.paciente.telefono,
    direccion: data.paciente.direccion,
    ultimaFecha: data.paciente.fecha,
    totalVisitas: data.examenes.length,
    pacienteId: data.paciente.id,
  }));

  const pacientesFiltrados = pacientesArray.filter(paciente => {
    if (!busqueda) return true;
    const texto = busqueda.toLowerCase();
    return (
      paciente.nombre.toLowerCase().includes(texto) ||
      paciente.cedula.toLowerCase().includes(texto)
    );
  });

  if (pacientes.length === 0) {
    return (
      <div className="px-32 py-5 w-full min-h-screen">
        <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
          <p className="text-gray-500">No hay pacientes registrados.</p>
          <Link href="/dashboard" className="text-emerald-600 hover:underline mt-2 inline-block">
            Registrar primer paciente
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="px-32 py-5 w-full min-h-screen">
      <div className="flex items-center justify-between mb-5">
        <h1 className="text-2xl font-bold text-gray-900">Historial de Pacientes</h1>
        
        <div className='relative'>
          <Search className='text-gray-400 absolute top-1.5 right-3' />
          <input
            type="text"
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            className='border border-gray-300 bg-white rounded-lg h-9 w-80 pl-5 pr-10 text-gray-700 focus:outline-none focus:border-cyan-500'
            placeholder='Buscar Nombre o Cédula...'
          />
        </div>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Paciente</th>
              <th className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Teléfono</th>
              <th className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Última Fecha</th>
              <th className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Total Visitas</th>
              <th className="px-4 py-3 text-right text-xs font-bold text-gray-500 uppercase tracking-wider">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {pacientesFiltrados.map((paciente) => (
              <tr key={paciente.cedula} className="hover:bg-gray-50">
                <td className="px-4 py-3">
                  <p className="font-medium text-gray-900">{paciente.nombre}</p>
                  <p className="text-xs text-gray-500">{paciente.cedula}</p>
                </td>
                <td className="px-4 py-3 text-sm text-gray-500">
                  {paciente.telefono}
                </td>
                <td className="px-4 py-3 text-sm text-gray-500">
                  {paciente.ultimaFecha}
                </td>
                <td className="px-4 py-3 text-sm text-gray-500">
                  {paciente.totalVisitas} exámenes
                </td>
                <td className="px-4 py-3 text-right">
                  <Link
                    href={`/dashboard/pacientes/${paciente.cedula}`}
                    className="inline-flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-emerald-700 bg-emerald-50 hover:bg-emerald-100 rounded-md transition-colors"
                  >
                    Ver Historial
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

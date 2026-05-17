'use client';

import { useLab } from '@/context/LabContext';
import { Search } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function PacientesPage() {
  const { getPacientesUnicos, pacientes } = useLab();
  const router = useRouter();
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
      paciente.cedula.toLowerCase().includes(texto) ||
      paciente.telefono.toLowerCase().includes(texto)
    );
  });

  if (pacientes.length === 0) {
    return (
      <div className=" py-5 w-full min-h-screen">
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
    <div className="px-8 py-5 w-full min-h-screen">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h1 className="text-2xl font-bold text-primary">Pacientes</h1>
          <p className='text-secondary text-lg font-normal'>{pacientesArray.length} pacientes registrados</p>
        </div>

        <div className='relative'>
          <Search className="text-gray-400 absolute top-2.5 left-3 w-5 h-5" />
          <input
            type="text"
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            className="text-secondary border-border-input w-[470px] rounded-xl border bg-white px-4 py-2 pl-11 text-base focus:outline-none focus:border-brand-soft"
            placeholder="Buscar por cédula, nombre o teléfono..."
          />
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
        <table className="w-full">
          <thead className="bg-surface-muted border-b border-gray-200">
            <tr>
              <th className="px-4 py-3 text-left text-base font-medium text-secondary tracking-wider">Paciente</th>
              <th className="px-4 py-3 text-left text-base font-medium text-secondary tracking-wider">Teléfono</th>
              <th className="px-4 py-3 text-left text-base font-medium text-secondary tracking-wider">Última Fecha</th>
              <th className="px-4 py-3 text-left text-base font-medium text-secondary tracking-wider"># Solicitudes</th>
              <th className="px-4 py-3 text-right text-base font-medium text-secondary tracking-wider"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {pacientesFiltrados.map((paciente) => (
              <tr
                key={paciente.cedula}
                onClick={() => router.push(`/dashboard/pacientes/${paciente.cedula}`)}
                className="hover:bg-gray-50 cursor-pointer"
              >
                <td className="px-4 py-3">
                  <p className="font-medium text-tertiary">{paciente.nombre}</p>
                  <p className="text-xs text-secondary">{paciente.cedula}</p>
                </td>
                <td className="px-4 py-3 text-sm text-tertiary">
                  {paciente.telefono}
                </td>
                <td className="px-4 py-3 text-sm text-tertiary">
                  {paciente.ultimaFecha}
                </td>
                <td className="px-4 py-3 text-sm text-tertiary">
                  {paciente.totalVisitas}
                </td>
                <td className="text-right">
                  <img src="/svg/arrow-up-2.svg" alt="" />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

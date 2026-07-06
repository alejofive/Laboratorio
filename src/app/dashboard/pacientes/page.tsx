'use client';

import { usePatients } from '@/data/createPatients';
import { Search } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

const PATIENTS_PER_PAGE = 10;

export default function PacientesPage() {
  const [busqueda, setBusqueda] = useState('');
  const [page, setPage] = useState(1);
  const { data, isLoading, error } = usePatients({
    page,
    limit: PATIENTS_PER_PAGE,
    search: busqueda.trim(),
  });

  const pacientes = data?.data ?? [];
  const meta = data?.meta;

  if (!isLoading && !error && pacientes.length === 0) {
    return (
      <div className="px-8 py-5 w-full min-h-screen">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h1 className="text-2xl font-bold text-primary">Pacientes</h1>
            <p className='text-secondary text-lg font-normal'>0 pacientes registrados</p>
          </div>

          <div className='relative'>
            <Search className="text-gray-400 absolute top-2.5 left-3 w-5 h-5" />
            <input
              type="text"
              value={busqueda}
              onChange={(e) => {
                setBusqueda(e.target.value);
                setPage(1);
              }}
              className="text-secondary border-border-input w-[470px] rounded-xl border bg-white px-4 py-2 pl-11 text-base focus:outline-none focus:border-brand-soft"
              placeholder="Buscar por cédula, nombre o teléfono..."
            />
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
          <p className="text-gray-500">{busqueda.trim() ? 'No hay pacientes para esa busqueda.' : 'No hay pacientes registrados.'}</p>
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
          <p className='text-secondary text-lg font-normal'>{meta?.total ?? pacientes.length} pacientes registrados</p>
        </div>

        <div className='relative'>
          <Search className="text-gray-400 absolute top-2.5 left-3 w-5 h-5" />
          <input
            type="text"
            value={busqueda}
            onChange={(e) => {
              setBusqueda(e.target.value);
              setPage(1);
            }}
            className="text-secondary border-border-input w-[470px] rounded-xl border bg-white px-4 py-2 pl-11 text-base focus:outline-none focus:border-brand-soft"
            placeholder="Buscar por cédula, nombre o teléfono..."
          />
        </div>
      </div>

      {error ? (
        <div className="mb-5 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          No se pudieron cargar los pacientes. {error instanceof Error ? error.message : null}
        </div>
      ) : null}

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
        {isLoading ? <p className="p-6 text-sm text-secondary">Cargando pacientes...</p> : null}

        <table className="w-full">
          <thead className="bg-surface-muted border-b border-gray-200">
            <tr>
              <th className="px-4 py-3 text-left text-base font-medium text-secondary tracking-wider">Paciente</th>
              <th className="px-4 py-3 text-left text-base font-medium text-secondary tracking-wider">Teléfono</th>
              <th className="px-4 py-3 text-left text-base font-medium text-secondary tracking-wider">Edad</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {pacientes.map((paciente) => (
              <tr
                key={paciente._id}
                className="hover:bg-gray-50"
              >
                <td className="px-4 py-3">
                  <p className="font-medium text-tertiary">{`${paciente.first_name} ${paciente.last_name}`.trim()}</p>
                  <p className="text-xs text-secondary">{paciente.document_number}</p>
                </td>
                <td className="px-4 py-3 text-sm text-tertiary">
                  {paciente.phone || '-'}
                </td>
                <td className="px-4 py-3 text-sm text-tertiary">
                  {paciente.age ?? '-'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {meta && meta.totalPages > 1 ? (
        <div className="mt-5 flex items-center justify-end gap-3">
          <button
            type="button"
            disabled={!meta.hasPrevPage}
            onClick={() => setPage((currentPage) => Math.max(1, currentPage - 1))}
            className="rounded-xl border border-border-input px-4 py-2 text-sm font-semibold text-secondary disabled:cursor-not-allowed disabled:opacity-50"
          >
            Anterior
          </button>
          <span className="text-sm text-secondary">
            Página {meta.page} de {meta.totalPages}
          </span>
          <button
            type="button"
            disabled={!meta.hasNextPage}
            onClick={() => setPage((currentPage) => currentPage + 1)}
            className="rounded-xl border border-border-input px-4 py-2 text-sm font-semibold text-secondary disabled:cursor-not-allowed disabled:opacity-50"
          >
            Siguiente
          </button>
        </div>
      ) : null}
    </div>
  );
}

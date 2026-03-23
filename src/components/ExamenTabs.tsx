'use client';

import { Examen, TipoExamen } from '@/types';
import { Pencil } from 'lucide-react';

interface ExamenTabsProps {
  examenes: { id: string; tipo: TipoExamen }[];
  examenActualId: string;
  examen: Examen;
  readOnly: boolean;
  setCurrentReadOnly: (nextValue: boolean) => void;
  doctorOrdenante: string;
  onDoctorOrdenanteChange: (value: string) => void;
}

const examLabels: Record<TipoExamen, string> = {
  dengue: 'Dengue',
  frotis_sangre: 'Frotis de sangre periferica',
  glicemia_pre_post: 'Glicemia pre post',
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
  prueba_embarazo: 'Prueba de embarazo',
  quimica_colinesterasa: 'Química Colinesterasa',
  quimica_corta: 'Quimica sanguinea mas corta',
  quimica_heces: 'Química y Heces',
  quimica_orina: 'Química y Orina',
  quimica_serologia: 'Química y Serología',
  quimica: 'Química',
  serologia_asto_psa_pylori: 'Serologia ASTO PSA Pylori',
  serologia_heces: 'Serología y Heces',
  serologia_orina: 'Serología y Orina',
  serologia: 'Serología',
  tipo_sangre: 'Tipo de sangre',
  vdrl_hepatitis: 'VDRL Hepatitis y demas',
};

export default function ExamenTabs({
  examenes,
  examenActualId,
  examen,
  readOnly,
  setCurrentReadOnly,
  doctorOrdenante,
  onDoctorOrdenanteChange,
}: ExamenTabsProps) {
  const capitalize = (str: string) => str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();


  return (
    <div className="">
      {examenes.length > 1 && (
        <nav className="-mb-px flex bg-white border-b border-gray-200">
          {examenes.map(ex => (
            <a
              key={ex.id}
              href={`/dashboard/examen/${ex.id}`}
              className={`py-3 px-8 border-b-2 font-medium text-sm transition-colors ${ex.id === examenActualId
                ? 'border-cyan-500 text-cyan-600 bg-cyan-100 '
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
            >
              {examLabels[ex.tipo]}

            </a>
          ))}
        </nav>
      )}
      <div className="flex flex-col gap-4 p-4 md:flex-row md:items-end md:justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Examen: {capitalize(examen.tipo)}</h1>
        <div className="flex flex-col gap-3 md:flex-row md:items-end">
          <label className="flex flex-col gap-1 text-sm font-medium text-gray-700">
            Ordenado por
            <input
              type="text"
              value={doctorOrdenante}
              onChange={(event) => onDoctorOrdenanteChange(event.target.value)}
              readOnly={readOnly}
              className="w-full rounded-md border border-gray-300 px-3 py-1.5 text-sm text-gray-900 md:w-72"
              placeholder="Nombre del doctor"
            />
          </label>
          <button
            onClick={() => setCurrentReadOnly(!readOnly)}
            className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors flex gap-2 items-center h-9 justify-center ${readOnly ? 'bg-amber-100 text-amber-700 hover:bg-amber-200' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
          >
            <Pencil className="w-4 h-4" />
            {readOnly ? 'Editar' : 'Solo lectura'}
          </button>
        </div>
      </div>
    </div>
  );
}

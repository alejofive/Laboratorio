'use client';

import { TipoExamen } from '@/types';

interface ExamenTabsProps {
  examenes: { id: string; tipo: TipoExamen }[];
  examenActualId: string;
}

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
  quimica: 'Química',
  serologia_asto_psa_pylori: 'Serologia ASTO PSA Pylori',
  serologia_heces: 'Serología y Heces',
  serologia_orina: 'Serología y Orina',
  serologia: 'Serología',
  tipo_sangre: 'Tipo de sangre',
  vdrl_hepatitis: 'VDRL Hepatitis y demas',
};

export default function ExamenTabs({ examenes, examenActualId }: ExamenTabsProps) {
  if (examenes.length <= 1) return null;

  console.log(examenes);


  return (
    <div className="border-b border-gray-200">
      <nav className="-mb-px flex bg-white">
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
    </div>
  );
}

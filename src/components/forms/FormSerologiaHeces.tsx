'use client';

import { ResultadosSerologiaHeces } from '@/types';

interface FormSerologiaHecesProps {
  resultados?: ResultadosSerologiaHeces;
  onChange: (resultados: ResultadosSerologiaHeces) => void;
}

const camposSerologia = [
  { key: 'vdrl', label: 'VDRL', placeholder: 'No reactivo' },
  { key: 'rpr', label: 'RPR', placeholder: 'No reactivo' },
  { key: 'vih', label: 'VIH', placeholder: 'No reactivo' },
  { key: 'hepatitisB', label: 'Hepatitis B', placeholder: 'Negativo' },
  { key: 'hepatitisC', label: 'Hepatitis C', placeholder: 'Negativo' },
];

const camposHeces = [
  { key: 'colorHeces', label: 'Color', placeholder: 'Marrón' },
  { key: 'consistenciaHeces', label: 'Consistencia', placeholder: 'Formada' },
  { key: 'mucusHeces', label: 'Mucus', placeholder: 'Ausente' },
  { key: 'sangreHeces', label: 'Sangre', placeholder: 'Ausente' },
  { key: 'phHeces', label: 'pH', placeholder: '7.0' },
  { key: 'leucocitosHeces', label: 'Leucocitos', placeholder: 'Negativo' },
  { key: 'parasitos', label: 'Parásitos', placeholder: 'No observados' },
];

export default function FormSerologiaHeces({ resultados, onChange }: FormSerologiaHecesProps) {
  const defaultData: ResultadosSerologiaHeces = {
    vdrl: '', rpr: '', vih: '', hepatitisB: '', hepatitisC: '',
    colorHeces: '', consistenciaHeces: '', mucusHeces: '',
    sangreHeces: '', phHeces: '', leucocitosHeces: '', parasitos: '',
    observaciones: '',
  };
  const data = resultados || defaultData;

  const handleChange = (key: keyof ResultadosSerologiaHeces, value: string) => {
    onChange({ ...data, [key]: value });
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-sm font-semibold text-gray-800 mb-3 border-b pb-1">Serología</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {camposSerologia.map(campo => (
            <div key={campo.key}>
              <label className="block text-sm font-medium text-gray-700 mb-1">{campo.label}</label>
              <input
                type="text"
                value={data[campo.key as keyof ResultadosSerologiaHeces] as string}
                onChange={e => handleChange(campo.key as keyof ResultadosSerologiaHeces, e.target.value)}
                placeholder={campo.placeholder}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:border-transparent"
              />
            </div>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-sm font-semibold text-gray-800 mb-3 border-b pb-1">Examen de Heces</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {camposHeces.map(campo => (
            <div key={campo.key}>
              <label className="block text-sm font-medium text-gray-700 mb-1">{campo.label}</label>
              <input
                type="text"
                value={data[campo.key as keyof ResultadosSerologiaHeces] as string}
                onChange={e => handleChange(campo.key as keyof ResultadosSerologiaHeces, e.target.value)}
                placeholder={campo.placeholder}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:border-transparent"
              />
            </div>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Observaciones</label>
        <textarea
          value={data.observaciones}
          onChange={e => handleChange('observaciones', e.target.value)}
          rows={3}
          placeholder="Observaciones adicionales..."
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:border-transparent"
        />
      </div>
    </div>
  );
}

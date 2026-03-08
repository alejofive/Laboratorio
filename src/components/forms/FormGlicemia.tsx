'use client';

import { ResultadosGlicemia } from '@/types';

interface FormGlicemiaProps {
  resultados?: ResultadosGlicemia;
  onChange: (resultados: ResultadosGlicemia) => void;
}

const camposGlicemia = [
  { key: 'glucosaAyunas', label: 'Glucosa en Ayunas', placeholder: '100' },
  { key: 'glucosaPostprandial', label: 'Glucosa Postprandial', placeholder: '140' },
];

export default function FormGlicemia({ resultados, onChange }: FormGlicemiaProps) {
  const data = resultados || {
    glucosaAyunas: '',
    glucosaPostprandial: '',
    observaciones: '',
  };

  const handleChange = (key: keyof ResultadosGlicemia, value: string) => {
    onChange({ ...data, [key]: value });
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {camposGlicemia.map(campo => (
          <div key={campo.key}>
            <label className="block text-sm font-medium text-gray-700 mb-1">{campo.label}</label>
            <input
              type="text"
              value={data[campo.key as keyof ResultadosGlicemia] as string}
              onChange={e => handleChange(campo.key as keyof ResultadosGlicemia, e.target.value)}
              placeholder={campo.placeholder}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:border-transparent"
            />
          </div>
        ))}
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

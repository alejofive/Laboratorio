'use client';

import { ResultadosHemoglobinaHematocritos } from '@/types';

interface FormHemoglobinaHematocritosProps {
  resultados?: ResultadosHemoglobinaHematocritos;
  onChange: (resultados: ResultadosHemoglobinaHematocritos) => void;
}

const campos = [
  { key: 'hemoglobina', label: 'Hemoglobina', placeholder: '14.5' },
  { key: 'hematocrito', label: 'Hematocrito', placeholder: '42.0' },
  { key: 'globulosRojos', label: 'Glóbulos Rojos', placeholder: '4500000' },
];

export default function FormHemoglobinaHematocritos({ resultados, onChange }: FormHemoglobinaHematocritosProps) {
  const data = resultados || {
    hemoglobina: '',
    hematocrito: '',
    globulosRojos: '',
    observaciones: '',
  };

  const handleChange = (key: keyof ResultadosHemoglobinaHematocritos, value: string) => {
    onChange({ ...data, [key]: value });
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {campos.map(campo => (
          <div key={campo.key}>
            <label className="block text-sm font-medium text-gray-700 mb-1">{campo.label}</label>
            <input
              type="text"
              value={data[campo.key as keyof ResultadosHemoglobinaHematocritos] as string}
              onChange={e => handleChange(campo.key as keyof ResultadosHemoglobinaHematocritos, e.target.value)}
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

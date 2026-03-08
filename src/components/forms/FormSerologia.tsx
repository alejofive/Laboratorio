'use client';

import { ResultadosSerologia } from '@/types';

interface FormSerologiaProps {
  resultados?: ResultadosSerologia;
  onChange: (resultados: ResultadosSerologia) => void;
}

const camposSerologia = [
  { key: 'vdrl', label: 'VDRL', placeholder: 'No reactivo' },
  { key: 'rpr', label: 'RPR', placeholder: 'No reactivo' },
  { key: 'vih', label: 'VIH', placeholder: 'No reactivo' },
  { key: 'hepatitisB', label: 'Hepatitis B', placeholder: 'Negativo' },
  { key: 'hepatitisC', label: 'Hepatitis C', placeholder: 'Negativo' },
  { key: 'toxoplasmosis', label: 'Toxoplasmosis', placeholder: 'Negativo' },
  { key: 'rubéola', label: 'Rubéola', placeholder: 'Negativo' },
  { key: 'cmv', label: 'CMV', placeholder: 'Negativo' },
  { key: 'herpes', label: 'Herpes', placeholder: 'Negativo' },
];

export default function FormSerologia({ resultados, onChange }: FormSerologiaProps) {
  const data = resultados || {
    vdrl: '',
    rpr: '',
    vih: '',
    hepatitisB: '',
    hepatitisC: '',
    toxoplasmosis: '',
    rubéola: '',
    cmv: '',
    herpes: '',
    observaciones: '',
  };

  const handleChange = (key: keyof ResultadosSerologia, value: string) => {
    onChange({ ...data, [key]: value });
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {camposSerologia.map(campo => (
          <div key={campo.key}>
            <label className="block text-sm font-medium text-gray-700 mb-1">{campo.label}</label>
            <input
              type="text"
              value={data[campo.key as keyof ResultadosSerologia] as string}
              onChange={e => handleChange(campo.key as keyof ResultadosSerologia, e.target.value)}
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

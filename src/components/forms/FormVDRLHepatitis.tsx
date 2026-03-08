'use client';

import { ResultadosVDRLHepatitis } from '@/types';

interface FormVDRLHepatitisProps {
  resultados?: ResultadosVDRLHepatitis;
  onChange: (resultados: ResultadosVDRLHepatitis) => void;
}

const campos = [
  { key: 'vdrl', label: 'VDRL', placeholder: 'No reactivo' },
  { key: 'rpr', label: 'RPR', placeholder: 'No reactivo' },
  { key: 'hepatitisB', label: 'Hepatitis B', placeholder: 'Negativo' },
  { key: 'hepatitisC', label: 'Hepatitis C', placeholder: 'Negativo' },
  { key: 'hepatitisA', label: 'Hepatitis A', placeholder: 'Negativo' },
];

export default function FormVDRLHepatitis({ resultados, onChange }: FormVDRLHepatitisProps) {
  const data = resultados || {
    vdrl: '',
    rpr: '',
    hepatitisB: '',
    hepatitisC: '',
    hepatitisA: '',
    observaciones: '',
  };

  const handleChange = (key: keyof ResultadosVDRLHepatitis, value: string) => {
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
              value={data[campo.key as keyof ResultadosVDRLHepatitis] as string}
              onChange={e => handleChange(campo.key as keyof ResultadosVDRLHepatitis, e.target.value)}
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

'use client';

import { ResultadosQuimicaCorta } from '@/types';

interface FormQuimicaCortaProps {
  resultados?: ResultadosQuimicaCorta;
  onChange: (resultados: ResultadosQuimicaCorta) => void;
}

const camposQuimicaCorta = [
  { key: 'glucosa', label: 'Glucosa', placeholder: '100' },
  { key: 'urea', label: 'Urea', placeholder: '35' },
  { key: 'creatinina', label: 'Creatinina', placeholder: '1.0' },
  { key: 'acidoUrico', label: 'Ácido Úrico', placeholder: '6.0' },
  { key: 'colesterolTotal', label: 'Colesterol Total', placeholder: '200' },
  { key: 'trigliceridos', label: 'Triglicéridos', placeholder: '150' },
];

export default function FormQuimicaCorta({ resultados, onChange }: FormQuimicaCortaProps) {
  const data = resultados || {
    glucosa: '',
    urea: '',
    creatinina: '',
    acidoUrico: '',
    colesterolTotal: '',
    trigliceridos: '',
    observaciones: '',
  };

  const handleChange = (key: keyof ResultadosQuimicaCorta, value: string) => {
    onChange({ ...data, [key]: value });
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {camposQuimicaCorta.map(campo => (
          <div key={campo.key}>
            <label className="block text-sm font-medium text-gray-700 mb-1">{campo.label}</label>
            <input
              type="text"
              value={data[campo.key as keyof ResultadosQuimicaCorta] as string}
              onChange={e => handleChange(campo.key as keyof ResultadosQuimicaCorta, e.target.value)}
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

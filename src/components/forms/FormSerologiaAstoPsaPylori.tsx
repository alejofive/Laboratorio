'use client';

import { ResultadosSerologiaAstoPsaPylori } from '@/types';

interface FormSerologiaAstoPsaPyloriProps {
  resultados?: ResultadosSerologiaAstoPsaPylori;
  onChange: (resultados: ResultadosSerologiaAstoPsaPylori) => void;
}

const campos = [
  { key: 'asto', label: 'ASTO', placeholder: '100' },
  { key: 'psa', label: 'PSA', placeholder: '1.0' },
  { key: 'helicobacter', label: 'Helicobacter Pylori', placeholder: 'Negativo' },
];

export default function FormSerologiaAstoPsaPylori({ resultados, onChange }: FormSerologiaAstoPsaPyloriProps) {
  const data = resultados || {
    asto: '',
    psa: '',
    helicobacter: '',
    observaciones: '',
  };

  const handleChange = (key: keyof ResultadosSerologiaAstoPsaPylori, value: string) => {
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
              value={data[campo.key as keyof ResultadosSerologiaAstoPsaPylori] as string}
              onChange={e => handleChange(campo.key as keyof ResultadosSerologiaAstoPsaPylori, e.target.value)}
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

'use client';

import { ResultadosFrotisSangre } from '@/types';

interface FormFrotisSangreProps {
  resultados?: ResultadosFrotisSangre;
  onChange: (resultados: ResultadosFrotisSangre) => void;
}

export default function FormFrotisSangre({ resultados, onChange }: FormFrotisSangreProps) {
  const data = resultados || {
    morfologia: '',
    parasites: '',
    observaciones: '',
  };

  const handleChange = (key: keyof ResultadosFrotisSangre, value: string) => {
    onChange({ ...data, [key]: value });
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Morfología</label>
        <textarea
          value={data.morfologia}
          onChange={e => handleChange('morfologia', e.target.value)}
          rows={3}
          placeholder="Descripción morfológica..."
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:border-transparent"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Parásitos</label>
        <input
          type="text"
          value={data.parasites}
          onChange={e => handleChange('parasites', e.target.value)}
          placeholder="Parásitos encontrados"
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:border-transparent"
        />
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

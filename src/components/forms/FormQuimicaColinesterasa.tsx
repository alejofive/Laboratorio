'use client';

import { ResultadosQuimicaColinesterasa } from '@/types';

interface FormQuimicaColinesterasaProps {
  resultados?: ResultadosQuimicaColinesterasa;
  onChange: (resultados: ResultadosQuimicaColinesterasa) => void;
}

export default function FormQuimicaColinesterasa({ resultados, onChange }: FormQuimicaColinesterasaProps) {
  const data = resultados || {
    Colinesterasa: '',
    observaciones: '',
  };

  const handleChange = (key: keyof ResultadosQuimicaColinesterasa, value: string) => {
    onChange({ ...data, [key]: value });
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Colinesterasa (U/L)</label>
          <input
            type="text"
            value={data.Colinesterasa}
            onChange={e => handleChange('Colinesterasa', e.target.value)}
            placeholder="5000"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:border-transparent"
          />
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

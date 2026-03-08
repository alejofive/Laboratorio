'use client';

import { ResultadosHemoparasitos } from '@/types';

interface FormHemoparasitosProps {
  resultados?: ResultadosHemoparasitos;
  onChange: (resultados: ResultadosHemoparasitos) => void;
}

export default function FormHemoparasitos({ resultados, onChange }: FormHemoparasitosProps) {
  const data = resultados || {
    plasmodium: '',
    resultado: '',
    observaciones: '',
  };

  const handleChange = (key: keyof ResultadosHemoparasitos, value: string) => {
    onChange({ ...data, [key]: value });
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Plasmodium</label>
          <select
            value={data.plasmodium}
            onChange={e => handleChange('plasmodium', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:border-transparent"
          >
            <option value="">Seleccionar</option>
            <option value="negativo">Negativo</option>
            <option value="p_falciparum">P. falciparum</option>
            <option value="p_vivax">P. vivax</option>
            <option value="p_malariae">P. malariae</option>
            <option value="p_ovale">P. ovale</option>
            <option value="mixto">Mixto</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Resultado</label>
          <input
            type="text"
            value={data.resultado}
            onChange={e => handleChange('resultado', e.target.value)}
            placeholder="Resultado del examen"
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

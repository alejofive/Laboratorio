'use client';

import { ResultadosTipoSangre } from '@/types';

interface FormTipoSangreProps {
  resultados?: ResultadosTipoSangre;
  onChange: (resultados: ResultadosTipoSangre) => void;
}

export default function FormTipoSangre({ resultados, onChange }: FormTipoSangreProps) {
  const data = resultados || {
    grupo: '',
    factor: '',
    observaciones: '',
  };

  const handleChange = (key: keyof ResultadosTipoSangre, value: string) => {
    onChange({ ...data, [key]: value });
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Grupo Sanguíneo</label>
          <select
            value={data.grupo}
            onChange={e => handleChange('grupo', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:border-transparent"
          >
            <option value="">Seleccionar</option>
            <option value="A">A</option>
            <option value="B">B</option>
            <option value="AB">AB</option>
            <option value="O">O</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Factor Rh</label>
          <select
            value={data.factor}
            onChange={e => handleChange('factor', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:border-transparent"
          >
            <option value="">Seleccionar</option>
            <option value="positivo">Positivo (+)</option>
            <option value="negativo">Negativo (-)</option>
          </select>
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

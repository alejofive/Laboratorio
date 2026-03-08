'use client';

import { ResultadosPruebaEmbarazo } from '@/types';

interface FormPruebaEmbarazoProps {
  resultados?: ResultadosPruebaEmbarazo;
  onChange: (resultados: ResultadosPruebaEmbarazo) => void;
}

export default function FormPruebaEmbarazo({ resultados, onChange }: FormPruebaEmbarazoProps) {
  const data = resultados || {
    resultado: '',
    valor: '',
    observaciones: '',
  };

  const handleChange = (key: keyof ResultadosPruebaEmbarazo, value: string) => {
    onChange({ ...data, [key]: value });
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Resultado</label>
          <select
            value={data.resultado}
            onChange={e => handleChange('resultado', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:border-transparent"
          >
            <option value="">Seleccionar</option>
            <option value="positivo">Positivo</option>
            <option value="negativo">Negativo</option>
            <option value="inválido">Inválido</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Valor (mUI/mL)</label>
          <input
            type="text"
            value={data.valor}
            onChange={e => handleChange('valor', e.target.value)}
            placeholder="25.0"
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

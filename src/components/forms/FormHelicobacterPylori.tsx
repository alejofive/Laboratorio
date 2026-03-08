'use client';

import { ResultadosHelicobacterPylori } from '@/types';

interface FormHelicobacterPyloriProps {
  resultados?: ResultadosHelicobacterPylori;
  onChange: (resultados: ResultadosHelicobacterPylori) => void;
}

export default function FormHelicobacterPylori({ resultados, onChange }: FormHelicobacterPyloriProps) {
  const data = resultados || {
    resultado: '',
    metodo: '',
    observaciones: '',
  };

  const handleChange = (key: keyof ResultadosHelicobacterPylori, value: string) => {
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
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Método</label>
          <select
            value={data.metodo}
            onChange={e => handleChange('metodo', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:border-transparent"
          >
            <option value="">Seleccionar</option>
            <option value="serologia">Serología</option>
            <option value="test_aire">Test de aire expirado</option>
            <option value="heces">Antígeno en heces</option>
            <option value="biopsia">Biopsia</option>
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

'use client';

import { useState, useEffect } from 'react';
import { ResultadosHeces } from '@/types';

interface FormHecesProps {
  resultados?: ResultadosHeces;
  onChange: (resultados: ResultadosHeces) => void;
  onValidChange?: (isValid: boolean) => void;
}

const camposHeces = [
  { key: 'color', label: 'Color', placeholder: 'Marrón' },
  { key: 'consistencia', label: 'Consistencia', placeholder: 'Formada' },
  { key: 'mucus', label: 'Mucus', placeholder: 'Ausente' },
  { key: 'sangre', label: 'Sangre', placeholder: 'Negativo' },
  { key: 'ph', label: 'pH', placeholder: '7.0' },
  { key: 'leucocitos', label: 'Leucocitos', placeholder: 'Negativo' },
  { key: 'parasitos', label: 'Parásitos', placeholder: 'No observados' },
];

const requiredFields: (keyof ResultadosHeces)[] = ['color', 'consistencia', 'mucus', 'sangre', 'ph', 'leucocitos', 'parasitos'];

function validateForm(data: ResultadosHeces): boolean {
  return requiredFields.every(field => data[field]?.trim() !== '');
}

export default function FormHeces({ resultados, onChange, onValidChange }: FormHecesProps) {
  const [isValid, setIsValid] = useState(false);
  
  const data = resultados || {
    color: '',
    consistencia: '',
    mucus: '',
    sangre: '',
    ph: '',
    leucocitos: '',
    parasitos: '',
    observaciones: '',
  };

  useEffect(() => {
    const valid = validateForm(data);
    setIsValid(valid);
    onValidChange?.(valid);
  }, [data, onValidChange]);

  const handleChange = (key: keyof ResultadosHeces, value: string) => {
    onChange({ ...data, [key]: value });
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {camposHeces.map(campo => (
          <div key={campo.key}>
            <label className="block text-sm font-medium text-gray-700 mb-1">{campo.label}</label>
            <input
              type="text"
              value={data[campo.key as keyof ResultadosHeces] as string}
              onChange={e => handleChange(campo.key as keyof ResultadosHeces, e.target.value)}
              placeholder={campo.placeholder}
              className="w-full px-3 py-2 border border-gray-300 rounded-md  focus:border-transparent"
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
          className="w-full px-3 py-2 border border-gray-300 rounded-md  focus:border-transparent"
        />
      </div>
    </div>
  );
}

'use client';

import { useState, useEffect } from 'react';
import { ResultadosDengue } from '@/types';
import { Select } from '@/components/ui/Select';

interface FormDengueProps {
  resultados?: ResultadosDengue;
  onChange: (resultados: ResultadosDengue) => void;
  onValidChange?: (isValid: boolean) => void;
}

const camposDengue = [
  { key: 'IgG', label: 'IgG' },
  { key: 'IgM', label: 'IgM' },
];

const opciones = [
  { value: 'Negativo', label: 'Negativo' },
  { value: 'Positivo', label: 'Positivo' },
];

const requiredFields: (keyof ResultadosDengue)[] = ['IgG', 'IgM'];

function validateForm(data: ResultadosDengue): boolean {
  return requiredFields.every(field => data[field]?.trim() !== '');
}

export default function FormDengue({ resultados, onChange, onValidChange }: FormDengueProps) {
  const [isValid, setIsValid] = useState(false);
  
  const data = resultados || {
    IgG: '',
    IgM: '',
    observaciones: '',
  };

  useEffect(() => {
    const valid = validateForm(data);
    setIsValid(valid);
    onValidChange?.(valid);
  }, [data, onValidChange]);

  const handleChange = (key: keyof ResultadosDengue, value: string) => {
    onChange({ ...data, [key]: value });
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {camposDengue.map(campo => (
          <Select
            key={campo.key}
            label={campo.label}
            value={data[campo.key as keyof ResultadosDengue] as string}
            onChange={value => handleChange(campo.key as keyof ResultadosDengue, value)}
            options={opciones}
          />
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

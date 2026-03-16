'use client';

import { useState, useEffect } from 'react';
import { ResultadosDengue } from '@/types';
import { Select } from '@/components/ui/Select';

interface FormDengueProps {
  resultados?: ResultadosDengue;
  onChange: (resultados: ResultadosDengue) => void;
  onValidChange?: (isValid: boolean) => void;
  readOnly?: boolean;
}

const opciones = [
  { value: 'Negativo', label: 'Negativo' },
  { value: 'Positivo', label: 'Positivo' },
];

const requiredFields: (keyof ResultadosDengue)[] = ['IgG', 'IgM'];

function validateForm(data: ResultadosDengue): boolean {
  return requiredFields.every(field => data[field]?.trim() !== '');
}

interface CampoEditable {
  key: string;
  label: string;
}

export default function FormDengue({ resultados, onChange, onValidChange, readOnly = false }: FormDengueProps) {
  const [isValid, setIsValid] = useState(false);
  const [labels, setLabels] = useState<Record<string, string>>({
    IgG: 'IgG',
    IgM: 'IgM',
  });

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

  const handleLabelChange = (key: string, newLabel: string) => {
    setLabels(prev => ({ ...prev, [key]: newLabel }));
  };

  const campos: CampoEditable[] = [
    { key: 'IgG', label: labels.IgG },
    { key: 'IgM', label: labels.IgM },
  ];

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {campos.map(campo => (
          <Select
            key={campo.key}
            label={campo.label}
            value={data[campo.key as keyof ResultadosDengue] as string}
            onChange={value => handleChange(campo.key as keyof ResultadosDengue, value)}
            options={opciones}
            readOnly={readOnly}
            onLabelChange={!readOnly ? (newLabel) => handleLabelChange(campo.key, newLabel) : undefined}
          />
        ))}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Observaciones</label>
        <textarea
          value={data.observaciones}
          onChange={e => handleChange('observaciones', e.target.value)}
          disabled={readOnly}
          rows={3}
          placeholder="Observaciones adicionales..."
          className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:border-transparent ${readOnly ? 'bg-gray-100 opacity-60 cursor-not-allowed' : ''}`}
        />
      </div>
    </div>
  );
}

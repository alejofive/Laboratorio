'use client';

import { ResultadosOrina } from '@/types';

interface FormOrinaProps {
  resultados?: ResultadosOrina;
  onChange: (resultados: ResultadosOrina) => void;
}

const camposOrina = [
  { key: 'color', label: 'Color', placeholder: 'Amarillo claro' },
  { key: 'aspecto', label: 'Aspecto', placeholder: 'Limpio' },
  { key: 'densidad', label: 'Densidad', placeholder: '1.010' },
  { key: 'ph', label: 'pH', placeholder: '6.0' },
  { key: 'proteinas', label: 'Proteínas', placeholder: 'Negativo' },
  { key: 'glucosa', label: 'Glucosa', placeholder: 'Negativo' },
  { key: 'cetonas', label: 'Cetonas', placeholder: 'Negativo' },
  { key: 'sangre', label: 'Sangre', placeholder: 'Negativo' },
  { key: 'leucocitos', label: 'Leucocitos', placeholder: 'Negativo' },
  { key: 'nitritos', label: 'Nitritos', placeholder: 'Negativo' },
];

export default function FormOrina({ resultados, onChange }: FormOrinaProps) {
  const data = resultados || {
    color: '',
    aspecto: '',
    densidad: '',
    ph: '',
    proteinas: '',
    glucosa: '',
    cetonas: '',
    sangre: '',
    leucocitos: '',
    nitritos: '',
    observaciones: '',
  };

  const handleChange = (key: keyof ResultadosOrina, value: string) => {
    onChange({ ...data, [key]: value });
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {camposOrina.map(campo => (
          <div key={campo.key}>
            <label className="block text-sm font-medium text-gray-700 mb-1">{campo.label}</label>
            <input
              type="text"
              value={data[campo.key as keyof ResultadosOrina] as string}
              onChange={e => handleChange(campo.key as keyof ResultadosOrina, e.target.value)}
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

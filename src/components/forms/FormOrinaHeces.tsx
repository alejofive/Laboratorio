'use client';

import { ResultadosOrinaHeces } from '@/types';

interface FormOrinaHecesProps {
  resultados?: ResultadosOrinaHeces;
  onChange: (resultados: ResultadosOrinaHeces) => void;
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

const camposHeces = [
  { key: 'colorHeces', label: 'Color Heces', placeholder: 'Marrón' },
  { key: 'consistenciaHeces', label: 'Consistencia', placeholder: 'Formada' },
  { key: 'mucusHeces', label: 'Mucus', placeholder: 'Ausente' },
  { key: 'sangreHeces', label: 'Sangre', placeholder: 'Ausente' },
  { key: 'phHeces', label: 'pH Heces', placeholder: '7.0' },
  { key: 'leucocitosHeces', label: 'Leucocitos', placeholder: 'Negativo' },
  { key: 'parasitos', label: 'Parásitos', placeholder: 'No observados' },
];

export default function FormOrinaHeces({ resultados, onChange }: FormOrinaHecesProps) {
  const defaultData: ResultadosOrinaHeces = {
    color: '', aspecto: '', densidad: '', ph: '',
    proteinas: '', glucosa: '', cetonas: '', sangre: '',
    leucocitos: '', nitritos: '',
    colorHeces: '', consistenciaHeces: '', mucusHeces: '',
    sangreHeces: '', phHeces: '', leucocitosHeces: '', parasitos: '',
    observaciones: '',
  };
  const data = resultados || defaultData;

  const handleChange = (key: keyof ResultadosOrinaHeces, value: string) => {
    onChange({ ...data, [key]: value });
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-sm font-semibold text-gray-800 mb-3 border-b pb-1">Análisis de Orina</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {camposOrina.map(campo => (
            <div key={campo.key}>
              <label className="block text-sm font-medium text-gray-700 mb-1">{campo.label}</label>
              <input
                type="text"
                value={data[campo.key as keyof ResultadosOrinaHeces] as string}
                onChange={e => handleChange(campo.key as keyof ResultadosOrinaHeces, e.target.value)}
                placeholder={campo.placeholder}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:border-transparent"
              />
            </div>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-sm font-semibold text-gray-800 mb-3 border-b pb-1">Examen de Heces</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {camposHeces.map(campo => (
            <div key={campo.key}>
              <label className="block text-sm font-medium text-gray-700 mb-1">{campo.label}</label>
              <input
                type="text"
                value={data[campo.key as keyof ResultadosOrinaHeces] as string}
                onChange={e => handleChange(campo.key as keyof ResultadosOrinaHeces, e.target.value)}
                placeholder={campo.placeholder}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:border-transparent"
              />
            </div>
          ))}
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

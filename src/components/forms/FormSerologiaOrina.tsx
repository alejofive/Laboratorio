'use client';

import { ResultadosSerologiaOrina } from '@/types';

interface FormSerologiaOrinaProps {
  resultados?: ResultadosSerologiaOrina;
  onChange: (resultados: ResultadosSerologiaOrina) => void;
}

const camposSerologia = [
  { key: 'vdrl', label: 'VDRL', placeholder: 'No reactivo' },
  { key: 'rpr', label: 'RPR', placeholder: 'No reactivo' },
  { key: 'vih', label: 'VIH', placeholder: 'No reactivo' },
  { key: 'hepatitisB', label: 'Hepatitis B', placeholder: 'Negativo' },
  { key: 'hepatitisC', label: 'Hepatitis C', placeholder: 'Negativo' },
];

const camposOrina = [
  { key: 'colorOrina', label: 'Color', placeholder: 'Amarillo claro' },
  { key: 'aspectoOrina', label: 'Aspecto', placeholder: 'Limpio' },
  { key: 'densidadOrina', label: 'Densidad', placeholder: '1.010' },
  { key: 'phOrina', label: 'pH', placeholder: '6.0' },
  { key: 'proteinasOrina', label: 'Proteínas', placeholder: 'Negativo' },
  { key: 'glucosaOrina', label: 'Glucosa', placeholder: 'Negativo' },
  { key: 'cetonasOrina', label: 'Cetonas', placeholder: 'Negativo' },
  { key: 'sangreOrina', label: 'Sangre', placeholder: 'Negativo' },
  { key: 'leucocitosOrina', label: 'Leucocitos', placeholder: 'Negativo' },
  { key: 'nitritosOrina', label: 'Nitritos', placeholder: 'Negativo' },
];

export default function FormSerologiaOrina({ resultados, onChange }: FormSerologiaOrinaProps) {
  const defaultData: ResultadosSerologiaOrina = {
    vdrl: '', rpr: '', vih: '', hepatitisB: '', hepatitisC: '',
    colorOrina: '', aspectoOrina: '', densidadOrina: '',
    phOrina: '', proteinasOrina: '', glucosaOrina: '',
    cetonasOrina: '', sangreOrina: '', leucocitosOrina: '',
    nitritosOrina: '', observaciones: '',
  };
  const data = resultados || defaultData;

  const handleChange = (key: keyof ResultadosSerologiaOrina, value: string) => {
    onChange({ ...data, [key]: value });
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-sm font-semibold text-gray-800 mb-3 border-b pb-1">Serología</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {camposSerologia.map(campo => (
            <div key={campo.key}>
              <label className="block text-sm font-medium text-gray-700 mb-1">{campo.label}</label>
              <input
                type="text"
                value={data[campo.key as keyof ResultadosSerologiaOrina] as string}
                onChange={e => handleChange(campo.key as keyof ResultadosSerologiaOrina, e.target.value)}
                placeholder={campo.placeholder}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:border-transparent"
              />
            </div>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-sm font-semibold text-gray-800 mb-3 border-b pb-1">Análisis de Orina</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {camposOrina.map(campo => (
            <div key={campo.key}>
              <label className="block text-sm font-medium text-gray-700 mb-1">{campo.label}</label>
              <input
                type="text"
                value={data[campo.key as keyof ResultadosSerologiaOrina] as string}
                onChange={e => handleChange(campo.key as keyof ResultadosSerologiaOrina, e.target.value)}
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

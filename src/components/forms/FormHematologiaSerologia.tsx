'use client';

import { ResultadosHematologiaSerologia } from '@/types';

interface FormHematologiaSerologiaProps {
  resultados?: ResultadosHematologiaSerologia;
  onChange: (resultados: ResultadosHematologiaSerologia) => void;
}

const camposHematologia = [
  { key: 'hemoglobina', label: 'Hemoglobina', placeholder: '14.5' },
  { key: 'hematocrito', label: 'Hematocrito', placeholder: '42.0' },
  { key: 'leucocitos', label: 'Leucocitos', placeholder: '7000' },
  { key: 'neutrofilos', label: 'Neutrófilos', placeholder: '60' },
  { key: 'linfocitos', label: 'Linfocitos', placeholder: '30' },
  { key: 'monocitos', label: 'Monocitos', placeholder: '5' },
  { key: 'eosinofilos', label: 'Eosinófilos', placeholder: '3' },
  { key: 'plaquetas', label: 'Plaquetas', placeholder: '250000' },
  { key: 'vcm', label: 'VCM', placeholder: '90' },
  { key: 'hcm', label: 'HCM', placeholder: '30' },
  { key: 'chcm', label: 'CHCM', placeholder: '34' },
  { key: 'rdw', label: 'RDW', placeholder: '12.5' },
  { key: 'mpv', label: 'MPV', placeholder: '7.5' },
];

const camposSerologia = [
  { key: 'vdrl', label: 'VDRL', placeholder: 'No reactivo' },
  { key: 'rpr', label: 'RPR', placeholder: 'No reactivo' },
  { key: 'vih', label: 'VIH', placeholder: 'No reactivo' },
  { key: 'hepatitisB', label: 'Hepatitis B', placeholder: 'Negativo' },
  { key: 'hepatitisC', label: 'Hepatitis C', placeholder: 'Negativo' },
];

export default function FormHematologiaSerologia({ resultados, onChange }: FormHematologiaSerologiaProps) {
  const data = resultados || {
    hemoglobina: '',
    hematocrito: '',
    leucocitos: '',
    neutrofilos: '',
    linfocitos: '',
    monocitos: '',
    eosinofilos: '',
    plaquetas: '',
    vcm: '',
    hcm: '',
    chcm: '',
    rdw: '',
    mpv: '',
    vdrl: '',
    rpr: '',
    vih: '',
    hepatitisB: '',
    hepatitisC: '',
    observaciones: '',
  };

  const handleChange = (key: keyof ResultadosHematologiaSerologia, value: string) => {
    onChange({ ...data, [key]: value });
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-sm font-semibold text-gray-800 mb-3 border-b pb-1">Hematología</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {camposHematologia.map(campo => (
            <div key={campo.key}>
              <label className="block text-sm font-medium text-gray-700 mb-1">{campo.label}</label>
              <input
                type="text"
                value={data[campo.key as keyof ResultadosHematologiaSerologia] as string}
                onChange={e => handleChange(campo.key as keyof ResultadosHematologiaSerologia, e.target.value)}
                placeholder={campo.placeholder}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:border-transparent"
              />
            </div>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-sm font-semibold text-gray-800 mb-3 border-b pb-1">Serología</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {camposSerologia.map(campo => (
            <div key={campo.key}>
              <label className="block text-sm font-medium text-gray-700 mb-1">{campo.label}</label>
              <input
                type="text"
                value={data[campo.key as keyof ResultadosHematologiaSerologia] as string}
                onChange={e => handleChange(campo.key as keyof ResultadosHematologiaSerologia, e.target.value)}
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

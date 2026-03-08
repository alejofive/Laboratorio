'use client';

import { ResultadosHematologiaCompleta } from '@/types';

interface FormHematologiaCompletaProps {
  resultados?: ResultadosHematologiaCompleta;
  onChange: (resultados: ResultadosHematologiaCompleta) => void;
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

export default function FormHematologiaCompleta({ resultados, onChange }: FormHematologiaCompletaProps) {
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
    observaciones: '',
  };

  const handleChange = (key: keyof ResultadosHematologiaCompleta, value: string) => {
    onChange({ ...data, [key]: value });
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {camposHematologia.map(campo => (
          <div key={campo.key}>
            <label className="block text-sm font-medium text-gray-700 mb-1">{campo.label}</label>
            <input
              type="text"
              value={data[campo.key as keyof ResultadosHematologiaCompleta] as string}
              onChange={e => handleChange(campo.key as keyof ResultadosHematologiaCompleta, e.target.value)}
              placeholder={campo.placeholder}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:border-transparent"
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
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:border-transparent"
        />
      </div>
    </div>
  );
}

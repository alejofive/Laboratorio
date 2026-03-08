'use client';

import { ResultadosQuimicaOrina } from '@/types';

interface FormQuimicaOrinaProps {
  resultados?: ResultadosQuimicaOrina;
  onChange: (resultados: ResultadosQuimicaOrina) => void;
}

const camposQuimica = [
  { key: 'glucosa', label: 'Glucosa', placeholder: '100' },
  { key: 'urea', label: 'Urea', placeholder: '35' },
  { key: 'creatinina', label: 'Creatinina', placeholder: '1.0' },
  { key: 'acidoUrico', label: 'Ácido Úrico', placeholder: '6.0' },
  { key: 'colesterolTotal', label: 'Colesterol Total', placeholder: '200' },
  { key: 'trigliceridos', label: 'Triglicéridos', placeholder: '150' },
  { key: 'hdl', label: 'HDL', placeholder: '50' },
  { key: 'ldl', label: 'LDL', placeholder: '130' },
  { key: 'proteinasTotales', label: 'Proteínas Totales', placeholder: '7.0' },
  { key: 'albumina', label: 'Albúmina', placeholder: '4.5' },
  { key: 'bilirrubinaTotal', label: 'Bilirrubina Total', placeholder: '1.0' },
  { key: 'bilirrubinaDirecta', label: 'Bilirrubina Directa', placeholder: '0.3' },
  { key: 'tgo', label: 'TGO/AST', placeholder: '25' },
  { key: 'tgp', label: 'TGP/ALT', placeholder: '30' },
  { key: 'fosfatasaAlcalina', label: 'Fosfatasa Alcalina', placeholder: '80' },
  { key: 'ggt', label: 'GGT', placeholder: '40' },
  { key: 'ldh', label: 'LDH', placeholder: '200' },
  { key: 'amilasa', label: 'Amilasa', placeholder: '100' },
  { key: 'lipasa', label: 'Lipasa', placeholder: '50' },
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

export default function FormQuimicaOrina({ resultados, onChange }: FormQuimicaOrinaProps) {
  const defaultData: ResultadosQuimicaOrina = {
    glucosa: '', urea: '', creatinina: '', acidoUrico: '',
    colesterolTotal: '', trigliceridos: '', hdl: '', ldl: '',
    proteinasTotales: '', albumina: '', bilirrubinaTotal: '',
    bilirrubinaDirecta: '', tgo: '', tgp: '', fosfatasaAlcalina: '',
    ggt: '', ldh: '', amilasa: '', lipasa: '',
    colorOrina: '', aspectoOrina: '', densidadOrina: '',
    phOrina: '', proteinasOrina: '', glucosaOrina: '',
    cetonasOrina: '', sangreOrina: '', leucocitosOrina: '',
    nitritosOrina: '', observaciones: '',
  };
  const data = resultados || defaultData;

  const handleChange = (key: keyof ResultadosQuimicaOrina, value: string) => {
    onChange({ ...data, [key]: value });
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-sm font-semibold text-gray-800 mb-3 border-b pb-1">Química Sanguínea</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {camposQuimica.map(campo => (
            <div key={campo.key}>
              <label className="block text-sm font-medium text-gray-700 mb-1">{campo.label}</label>              <input
                type="text"
                value={data[campo.key as keyof ResultadosQuimicaOrina] as string}
                onChange={e => handleChange(campo.key as keyof ResultadosQuimicaOrina, e.target.value)}
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
                value={data[campo.key as keyof ResultadosQuimicaOrina] as string}
                onChange={e => handleChange(campo.key as keyof ResultadosQuimicaOrina, e.target.value)}
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

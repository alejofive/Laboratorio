'use client';

import { ResultadosQuimica } from '@/types';

interface FormQuimicaCompletaProps {
  resultados?: ResultadosQuimica;
  onChange: (resultados: ResultadosQuimica) => void;
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
  { key: 'sodio', label: 'Sodio', placeholder: '140' },
  { key: 'potasio', label: 'Potasio', placeholder: '4.5' },
  { key: 'cloro', label: 'Cloro', placeholder: '100' },
  { key: 'calcio', label: 'Calcio', placeholder: '9.5' },
  { key: 'fosforo', label: 'Fósforo', placeholder: '3.5' },
];

export default function FormQuimicaCompleta({ resultados, onChange }: FormQuimicaCompletaProps) {
  const data = resultados || {
    glucosa: '',
    urea: '',
    creatinina: '',
    acidoUrico: '',
    colesterolTotal: '',
    trigliceridos: '',
    hdl: '',
    ldl: '',
    proteinasTotales: '',
    albumina: '',
    bilirrubinaTotal: '',
    bilirrubinaDirecta: '',
    tgo: '',
    tgp: '',
    fosfatasaAlcalina: '',
    ggt: '',
    ldh: '',
    amilasa: '',
    lipasa: '',
    sodio: '',
    potasio: '',
    cloro: '',
    calcio: '',
    fosforo: '',
    observaciones: '',
  };

  const handleChange = (key: keyof ResultadosQuimica, value: string) => {
    onChange({ ...data, [key]: value });
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {camposQuimica.map(campo => (
          <div key={campo.key}>
            <label className="block text-sm font-medium text-gray-700 mb-1">{campo.label}</label>
            <input
              type="text"
              value={data[campo.key as keyof ResultadosQuimica] as string}
              onChange={e => handleChange(campo.key as keyof ResultadosQuimica, e.target.value)}
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

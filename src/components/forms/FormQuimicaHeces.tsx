'use client';

import { ResultadosQuimicaHeces } from '@/types';

interface FormQuimicaHecesProps {
  resultados?: ResultadosQuimicaHeces;
  onChange: (resultados: ResultadosQuimicaHeces) => void;
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

const camposHeces = [
  { key: 'colorHeces', label: 'Color', placeholder: 'Marrón' },
  { key: 'consistenciaHeces', label: 'Consistencia', placeholder: 'Formada' },
  { key: 'mucusHeces', label: 'Mucus', placeholder: 'Ausente' },
  { key: 'sangreHeces', label: 'Sangre', placeholder: 'Ausente' },
  { key: 'phHeces', label: 'pH', placeholder: '7.0' },
  { key: 'leucocitosHeces', label: 'Leucocitos', placeholder: 'Negativo' },
  { key: 'parasitos', label: 'Parásitos', placeholder: 'No observados' },
];

export default function FormQuimicaHeces({ resultados, onChange }: FormQuimicaHecesProps) {
  const defaultData: ResultadosQuimicaHeces = {
    glucosa: '', urea: '', creatinina: '', acidoUrico: '',
    colesterolTotal: '', trigliceridos: '', hdl: '', ldl: '',
    proteinasTotales: '', albumina: '', bilirrubinaTotal: '',
    bilirrubinaDirecta: '', tgo: '', tgp: '', fosfatasaAlcalina: '',
    ggt: '', ldh: '', amilasa: '', lipasa: '',
    colorHeces: '', consistenciaHeces: '', mucusHeces: '',
    sangreHeces: '', phHeces: '', leucocitosHeces: '', parasitos: '',
    observaciones: '',
  };
  const data = resultados || defaultData;

  const handleChange = (key: keyof ResultadosQuimicaHeces, value: string) => {
    onChange({ ...data, [key]: value });
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-sm font-semibold text-gray-800 mb-3 border-b pb-1">Química Sanguínea</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {camposQuimica.map(campo => (
            <div key={campo.key}>
              <label className="block text-sm font-medium text-gray-700 mb-1">{campo.label}</label>
              <input
                type="text"
                value={data[campo.key as keyof ResultadosQuimicaHeces] as string}
                onChange={e => handleChange(campo.key as keyof ResultadosQuimicaHeces, e.target.value)}
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
                value={data[campo.key as keyof ResultadosQuimicaHeces] as string}
                onChange={e => handleChange(campo.key as keyof ResultadosQuimicaHeces, e.target.value)}
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

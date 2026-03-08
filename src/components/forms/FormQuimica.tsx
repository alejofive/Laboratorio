'use client';

import { ResultadosQuimica } from '@/types';

interface FormQuimicaProps {
  resultados?: ResultadosQuimica;
  onChange: (resultados: ResultadosQuimica) => void;
}

const secciones = [
  {
    titulo: 'Perfil Renal',
    campos: [
      { key: 'glucosa', label: 'Glucosa', placeholder: '100' },
      { key: 'urea', label: 'Urea', placeholder: '15' },
      { key: 'creatinina', label: 'Creatinina', placeholder: '0.9' },
      { key: 'acidoUrico', label: 'Ácido Úrico', placeholder: '5.0' },
    ],
  },
  {
    titulo: 'Perfil Lipídico',
    campos: [
      { key: 'colesterolTotal', label: 'Colesterol Total', placeholder: '180' },
      { key: 'trigliceridos', label: 'Triglicéridos', placeholder: '150' },
      { key: 'hdl', label: 'HDL', placeholder: '50' },
      { key: 'ldl', label: 'LDL', placeholder: '100' },
    ],
  },
  {
    titulo: 'Proteínas',
    campos: [
      { key: 'proteinasTotales', label: 'Proteínas Totales', placeholder: '7.0' },
      { key: 'albumina', label: 'Albúmina', placeholder: '4.0' },
    ],
  },
  {
    titulo: 'Función Hepática',
    campos: [
      { key: 'bilirrubinaTotal', label: 'Bilirrubina Total', placeholder: '0.8' },
      { key: 'bilirrubinaDirecta', label: 'Bilirrubina Directa', placeholder: '0.2' },
      { key: 'tgo', label: 'TGO/AST', placeholder: '25' },
      { key: 'tgp', label: 'TGP/ALT', placeholder: '30' },
      { key: 'fosfatasaAlcalina', label: 'Fosfatasa Alcalina', placeholder: '80' },
      { key: 'ggt', label: 'GGT', placeholder: '35' },
      { key: 'ldh', label: 'LDH', placeholder: '200' },
    ],
  },
  {
    titulo: 'Enzimas Pancreáticas',
    campos: [
      { key: 'amilasa', label: 'Amilasa', placeholder: '80' },
      { key: 'lipasa', label: 'Lipasa', placeholder: '50' },
    ],
  },
  {
    titulo: 'Electrolitos',
    campos: [
      { key: 'sodio', label: 'Sodio (Na)', placeholder: '140' },
      { key: 'potasio', label: 'Potasio (K)', placeholder: '4.5' },
      { key: 'cloro', label: 'Cloro (Cl)', placeholder: '100' },
      { key: 'calcio', label: 'Calcio', placeholder: '9.5' },
      { key: 'fosforo', label: 'Fósforo', placeholder: '3.5' },
    ],
  },
];

export default function FormQuimica({ resultados, onChange }: FormQuimicaProps) {
  const defaultData: ResultadosQuimica = {
    glucosa: '', urea: '', creatinina: '', acidoUrico: '',
    colesterolTotal: '', trigliceridos: '', hdl: '', ldl: '',
    proteinasTotales: '', albumina: '',
    bilirrubinaTotal: '', bilirrubinaDirecta: '',
    tgo: '', tgp: '', fosfatasaAlcalina: '', ggt: '', ldh: '',
    amilasa: '', lipasa: '',
    sodio: '', potasio: '', cloro: '', calcio: '', fosforo: '',
    observaciones: '',
  };

  const data = resultados || defaultData;

  const handleChange = (key: keyof ResultadosQuimica, value: string) => {
    onChange({ ...data, [key]: value });
  };

  return (
    <div className="space-y-6">
      {secciones.map(seccion => (
        <div key={seccion.titulo} className="bg-gray-50 rounded-lg p-4">
          <h3 className="text-sm font-medium text-gray-900 mb-3">{seccion.titulo}</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {seccion.campos.map(campo => (
              <div key={campo.key}>
                <label className="block text-xs text-gray-600 mb-1">{campo.label}</label>
                <input
                  type="text"
                  value={data[campo.key as keyof ResultadosQuimica] as string}
                  onChange={e => handleChange(campo.key as keyof ResultadosQuimica, e.target.value)}
                  placeholder={campo.placeholder}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md  focus:border-transparent text-sm"
                />
              </div>
            ))}
          </div>
        </div>
      ))}

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

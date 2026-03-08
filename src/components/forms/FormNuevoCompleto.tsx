'use client';

import { ResultadosNuevoCompleto } from '@/types';

interface FormNuevoCompletoProps {
  resultados?: ResultadosNuevoCompleto;
  onChange: (resultados: ResultadosNuevoCompleto) => void;
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

const camposHeces = [
  { key: 'colorHeces', label: 'Color', placeholder: 'Marrón' },
  { key: 'consistenciaHeces', label: 'Consistencia', placeholder: 'Formada' },
  { key: 'mucusHeces', label: 'Mucus', placeholder: 'Ausente' },
  { key: 'sangreHeces', label: 'Sangre', placeholder: 'Ausente' },
  { key: 'phHeces', label: 'pH', placeholder: '7.0' },
  { key: 'leucocitosHeces', label: 'Leucocitos', placeholder: 'Negativo' },
  { key: 'parasitos', label: 'Parásitos', placeholder: 'No observados' },
];

const defaultData: ResultadosNuevoCompleto = {
  hemoglobina: '', hematocrito: '', leucocitos: '', neutrofilos: '', linfocitos: '',
  monocitos: '', eosinofilos: '', plaquetas: '', vcm: '', hcm: '', chcm: '',
  rdw: '', mpv: '', glucosa: '', urea: '', creatinina: '', acidoUrico: '',
  colesterolTotal: '', trigliceridos: '', hdl: '', ldl: '', proteinasTotales: '',
  albumina: '', bilirrubinaTotal: '', bilirrubinaDirecta: '', tgo: '', tgp: '',
  fosfatasaAlcalina: '', ggt: '', ldh: '', amilasa: '', lipasa: '',
  vdrl: '', rpr: '',
  colorOrina: '', aspectoOrina: '', densidadOrina: '', phOrina: '',
  proteinasOrina: '', glucosaOrina: '', cetonasOrina: '', sangreOrina: '',
  leucocitosOrina: '', nitritosOrina: '',
  colorHeces: '', consistenciaHeces: '', mucusHeces: '', sangreHeces: '',
  phHeces: '', leucocitosHeces: '', parasitos: '',
  observaciones: '',
};

export default function FormNuevoCompleto({ resultados, onChange }: FormNuevoCompletoProps) {
  const data = resultados || defaultData;

  const handleChange = (key: keyof ResultadosNuevoCompleto, value: string) => {
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
                value={data[campo.key as keyof ResultadosNuevoCompleto] as string}
                onChange={e => handleChange(campo.key as keyof ResultadosNuevoCompleto, e.target.value)}
                placeholder={campo.placeholder}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:border-transparent"
              />
            </div>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-sm font-semibold text-gray-800 mb-3 border-b pb-1">Química Sanguínea</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {camposQuimica.map(campo => (
            <div key={campo.key}>
              <label className="block text-sm font-medium text-gray-700 mb-1">{campo.label}</label>
              <input
                type="text"
                value={data[campo.key as keyof ResultadosNuevoCompleto] as string}
                onChange={e => handleChange(campo.key as keyof ResultadosNuevoCompleto, e.target.value)}
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
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">VDRL</label>
            <input
              type="text"
              value={data.vdrl}
              onChange={e => handleChange('vdrl', e.target.value)}
              placeholder="No reactivo"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">RPR</label>
            <input
              type="text"
              value={data.rpr}
              onChange={e => handleChange('rpr', e.target.value)}
              placeholder="No reactivo"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:border-transparent"
            />
          </div>
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
                value={data[campo.key as keyof ResultadosNuevoCompleto] as string}
                onChange={e => handleChange(campo.key as keyof ResultadosNuevoCompleto, e.target.value)}
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
                value={data[campo.key as keyof ResultadosNuevoCompleto] as string}
                onChange={e => handleChange(campo.key as keyof ResultadosNuevoCompleto, e.target.value)}
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

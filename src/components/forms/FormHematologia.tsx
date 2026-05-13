'use client';

import { useState, useEffect } from 'react';
import { ResultadosHematologia } from '@/types';
import { InputNumber } from '@/components/ui/InputNumber';

interface FormHematologiaProps {
  resultados?: ResultadosHematologia;
  onChange: (resultados: ResultadosHematologia) => void;
  onValidChange?: (isValid: boolean) => void;
  readOnly?: boolean;
}

type CampoKey = Exclude<keyof ResultadosHematologia, 'observaciones'>;
type EditableKey = keyof ResultadosHematologia;

interface CampoEditable {
  key: CampoKey;
  label: string;
}

const defaultLabels: Record<CampoKey, string> = {
  leucocitos: 'Leucocitos (mm³)',
  hematies: 'Hematíes (mm³)',
  hemoglobina: 'Hemoglobina (grs%)',
  hematocrito: 'Hematocrito (%)',
  segmentados: 'Segmentados (%)',
  linfocitos: 'Linfocitos (%)',
  eosinofilos: 'Eosinófilos (%)',
  otros: 'Otros (%)',
  sedimentacion_1h: '1 hora (mm)',
  sedimentacion_2h: '2 horas (mm)',
  plaquetas: 'Plaquetas (mm³)',
  t_protrombina: 'T. Protrombina (seg)',
  t_protrombina_control: 'Control T. Protrombina (seg)',
  inr: 'INR',
  razon_pc: 'Razón P/C',
  ptt: 'PTT (seg)',
  ptt_control: 'Control PTT (seg)',
  t_sangria: 'Tiempo de Sangría (min)',
  t_coagulacion: 'Tiempo de Coagulación (min)',
};

const placeholders: Record<CampoKey, string> = {
  leucocitos: 'Ej: 7500',
  hematies: 'Ej: 4.8',
  hemoglobina: 'Ej: 13.5',
  hematocrito: 'Ej: 40',
  segmentados: 'Ej: 55',
  linfocitos: 'Ej: 35',
  eosinofilos: 'Ej: 3',
  otros: 'Ej: 7',
  sedimentacion_1h: 'Ej: 10',
  sedimentacion_2h: 'Ej: 20',
  plaquetas: 'Ej: 250000',
  t_protrombina: 'Ej: 12',
  t_protrombina_control: 'Ej: 12',
  inr: 'Ej: 1.0',
  razon_pc: 'Ej: 1.0',
  ptt: 'Ej: 30',
  ptt_control: 'Ej: 30',
  t_sangria: 'Ej: 3',
  t_coagulacion: 'Ej: 7',
};

const requiredFields: CampoKey[] = [
  'leucocitos', 'hematies', 'hemoglobina', 'hematocrito',
  'segmentados', 'linfocitos', 'eosinofilos', 'otros',
  'sedimentacion_1h', 'sedimentacion_2h', 'plaquetas',
  't_protrombina', 't_protrombina_control', 'inr', 'razon_pc',
  'ptt', 'ptt_control', 't_sangria', 't_coagulacion'
];

function validateForm(data: ResultadosHematologia): boolean {
  return requiredFields.every(field => data[field]?.trim() !== '');
}

export default function FormHematologia({ resultados, onChange, onValidChange, readOnly = false }: FormHematologiaProps) {
  const [isValid, setIsValid] = useState(false);

  const data = resultados || {
    leucocitos: '',
    hematies: '',
    hemoglobina: '',
    hematocrito: '',
    segmentados: '',
    linfocitos: '',
    eosinofilos: '',
    otros: '',
    sedimentacion_1h: '',
    sedimentacion_2h: '',
    plaquetas: '',
    t_protrombina: '',
    t_protrombina_control: '',
    inr: '',
    razon_pc: '',
    ptt: '',
    ptt_control: '',
    t_sangria: '',
    t_coagulacion: '',
    observaciones: '',
  };

  useEffect(() => {
    const valid = validateForm(data);
    setIsValid(valid);
    onValidChange?.(valid);
  }, [data, onValidChange]);

  const handleChange = (key: EditableKey, value: string) => {
    onChange({ ...data, [key]: value });
  };

  const campos: CampoEditable[] = [
    { key: 'leucocitos', label: defaultLabels.leucocitos },
    { key: 'hematies', label: defaultLabels.hematies },
    { key: 'hemoglobina', label: defaultLabels.hemoglobina },
    { key: 'hematocrito', label: defaultLabels.hematocrito },
  ];

  const formulaLeucocitaria: CampoEditable[] = [
    { key: 'segmentados', label: defaultLabels.segmentados },
    { key: 'linfocitos', label: defaultLabels.linfocitos },
    { key: 'eosinofilos', label: defaultLabels.eosinofilos },
    { key: 'otros', label: defaultLabels.otros },
  ];

  const sedimentacion: CampoEditable[] = [
    { key: 'sedimentacion_1h', label: defaultLabels.sedimentacion_1h },
    { key: 'sedimentacion_2h', label: defaultLabels.sedimentacion_2h },
  ];

  const coagulacion: CampoEditable[] = [
    { key: 't_protrombina', label: defaultLabels.t_protrombina },
    { key: 't_protrombina_control', label: defaultLabels.t_protrombina_control },
    { key: 'inr', label: defaultLabels.inr },
    { key: 'razon_pc', label: defaultLabels.razon_pc },
    { key: 'ptt', label: defaultLabels.ptt },
    { key: 'ptt_control', label: defaultLabels.ptt_control },
    { key: 't_sangria', label: defaultLabels.t_sangria },
    { key: 't_coagulacion', label: defaultLabels.t_coagulacion },
  ];

  return (
    <div className="space-y-6">
      <div className='border border-surface-muted  rounded-3xl '>
        <h3 className="text-base font-bold text-primary mb-3 bg-surface-muted py-2 px-5 rounded-t-3xl">Datos principales</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-6">
          {campos.map(campo => (
            <InputNumber
              key={campo.key}
              label={campo.label}
              value={data[campo.key]}
              onChange={v => handleChange(campo.key, v)}
              placeholder={placeholders[campo.key]}
              readOnly={readOnly}
            />
          ))}
        </div>
      </div>

      <div className='border border-surface-muted  rounded-3xl '>
        <h3 className="text-base font-bold text-primary mb-3 bg-surface-muted py-2 px-5 rounded-t-3xl">Fórmula Leucocitaria (%)</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-6">
          {formulaLeucocitaria.map(campo => (
            <InputNumber
              key={campo.key}
              label={campo.label}
              value={data[campo.key]}
              onChange={v => handleChange(campo.key, v)}
              placeholder={placeholders[campo.key]}
              readOnly={readOnly}
            />
          ))}
        </div>
      </div>

      <div className='border border-surface-muted  rounded-3xl '>
        <h3 className="text-base font-bold text-primary mb-3 bg-surface-muted py-2 px-5 rounded-t-3xl">Sedimentación</h3>
        <div className="grid grid-cols-2 md:grid-cols-2 gap-4 p-6">
          {sedimentacion.map(campo => (
            <InputNumber
              key={campo.key}
              label={campo.label}
              value={data[campo.key]}
              onChange={v => handleChange(campo.key, v)}
              placeholder={placeholders[campo.key]}
              readOnly={readOnly}
            />
          ))}
        </div>
      </div>

      <div className='border border-surface-muted  rounded-3xl '>
        <h3 className="text-base font-bold text-primary mb-3 bg-surface-muted py-2 px-5 rounded-t-3xl">Plaquetas</h3>
        <div className="grid grid-cols-2 md:grid-cols-2 gap-4 p-6">
          <InputNumber
            label={defaultLabels.plaquetas}
            value={data.plaquetas}
            onChange={v => handleChange('plaquetas', v)}
            placeholder={placeholders.plaquetas}
            readOnly={readOnly}
          />
        </div>
      </div>

      <div className='border border-surface-muted  rounded-3xl '>
        <h3 className="text-base font-bold text-primary mb-3 bg-surface-muted py-2 px-5 rounded-t-3xl">Coagulación</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 p-6">
          {coagulacion.map(campo => (
            <InputNumber
              key={campo.key}
              label={campo.label}
              value={data[campo.key]}
              onChange={v => handleChange(campo.key, v)}
              placeholder={placeholders[campo.key]}
              readOnly={readOnly}
            />
          ))}
        </div>
      </div>


      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Observaciones</label>
        <textarea
          value={data.observaciones}
          onChange={e => handleChange('observaciones', e.target.value)}
          readOnly={readOnly}
          rows={3}
          placeholder="Observaciones adicionales..."
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:border-transparent"
        />
      </div>
    </div>
  );
}

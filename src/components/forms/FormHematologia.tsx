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
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {campos.map(campo => (
          <InputNumber
            key={campo.key}
            label={campo.label}
            value={data[campo.key]}
            onChange={v => handleChange(campo.key, v)}
            placeholder=""
            readOnly={readOnly}
          />
        ))}
      </div>

      <hr className="border-gray-200" />

      <div>
        <h3 className="text-sm font-semibold text-gray-900 mb-3">Fórmula Leucocitaria (%)</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {formulaLeucocitaria.map(campo => (
            <InputNumber
              key={campo.key}
              label={campo.label}
              value={data[campo.key]}
              onChange={v => handleChange(campo.key, v)}
              placeholder=""
              readOnly={readOnly}
            />
          ))}
        </div>
      </div>

      <hr className="border-gray-200" />

      <div>
        <h3 className="text-sm font-semibold text-gray-900 mb-3">Sedimentación</h3>
        <div className="grid grid-cols-2 md:grid-cols-2 gap-4">
          {sedimentacion.map(campo => (
            <InputNumber
              key={campo.key}
              label={campo.label}
              value={data[campo.key]}
              onChange={v => handleChange(campo.key, v)}
              placeholder=""
              readOnly={readOnly}
            />
          ))}
        </div>
      </div>

      <hr className="border-gray-200" />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <InputNumber
          label={defaultLabels.plaquetas}
          value={data.plaquetas}
          onChange={v => handleChange('plaquetas', v)}
          placeholder=""
          readOnly={readOnly}
        />
      </div>

      <hr className="border-gray-200" />

      <div>
        <h3 className="text-sm font-semibold text-gray-900 mb-3">Coagulación</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {coagulacion.map(campo => (
            <InputNumber
              key={campo.key}
              label={campo.label}
              value={data[campo.key]}
              onChange={v => handleChange(campo.key, v)}
              placeholder=""
              readOnly={readOnly}
            />
          ))}
        </div>
      </div>

      <hr className="border-gray-200" />

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

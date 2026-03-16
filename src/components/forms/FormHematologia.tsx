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

interface CampoEditable {
  key: keyof ResultadosHematologia;
  label: string;
}

const defaultLabels: Record<string, string> = {
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

const requiredFields: (keyof ResultadosHematologia)[] = [
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
  const [labels, setLabels] = useState<Record<string, string>>(defaultLabels);

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

  const handleChange = (key: keyof ResultadosHematologia, value: string) => {
    onChange({ ...data, [key]: value });
  };

  const handleLabelChange = (key: string, newLabel: string) => {
    setLabels(prev => ({ ...prev, [key]: newLabel }));
  };

  const campos: CampoEditable[] = [
    { key: 'leucocitos', label: labels.leucocitos },
    { key: 'hematies', label: labels.hematies },
    { key: 'hemoglobina', label: labels.hemoglobina },
    { key: 'hematocrito', label: labels.hematocrito },
  ];

  const formulaLeucocitaria: CampoEditable[] = [
    { key: 'segmentados', label: labels.segmentados },
    { key: 'linfocitos', label: labels.linfocitos },
    { key: 'eosinofilos', label: labels.eosinofilos },
    { key: 'otros', label: labels.otros },
  ];

  const sedimentacion: CampoEditable[] = [
    { key: 'sedimentacion_1h', label: labels.sedimentacion_1h },
    { key: 'sedimentacion_2h', label: labels.sedimentacion_2h },
  ];

  const coagulacion: CampoEditable[] = [
    { key: 't_protrombina', label: labels.t_protrombina },
    { key: 't_protrombina_control', label: labels.t_protrombina_control },
    { key: 'inr', label: labels.inr },
    { key: 'razon_pc', label: labels.razon_pc },
    { key: 'ptt', label: labels.ptt },
    { key: 'ptt_control', label: labels.ptt_control },
    { key: 't_sangria', label: labels.t_sangria },
    { key: 't_coagulacion', label: labels.t_coagulacion },
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
            onLabelChange={!readOnly ? (newLabel) => handleLabelChange(campo.key, newLabel) : undefined}
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
              onLabelChange={!readOnly ? (newLabel) => handleLabelChange(campo.key, newLabel) : undefined}
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
              onLabelChange={!readOnly ? (newLabel) => handleLabelChange(campo.key, newLabel) : undefined}
            />
          ))}
        </div>
      </div>

      <hr className="border-gray-200" />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <InputNumber
          label={labels.plaquetas}
          value={data.plaquetas}
          onChange={v => handleChange('plaquetas', v)}
          placeholder=""
          readOnly={readOnly}
          onLabelChange={!readOnly ? (newLabel) => handleLabelChange('plaquetas', newLabel) : undefined}
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
              onLabelChange={!readOnly ? (newLabel) => handleLabelChange(campo.key, newLabel) : undefined}
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
          disabled={readOnly}
          rows={3}
          placeholder="Observaciones adicionales..."
          className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:border-transparent ${readOnly ? 'bg-gray-100 opacity-60 cursor-not-allowed' : ''}`}
        />
      </div>
    </div>
  );
}

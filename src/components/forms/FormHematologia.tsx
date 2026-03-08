'use client';

import { useState, useEffect } from 'react';
import { ResultadosHematologia } from '@/types';
import { InputNumber } from '@/components/ui/InputNumber';

interface FormHematologiaProps {
  resultados?: ResultadosHematologia;
  onChange: (resultados: ResultadosHematologia) => void;
  onValidChange?: (isValid: boolean) => void;
}

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

export default function FormHematologia({ resultados, onChange, onValidChange }: FormHematologiaProps) {
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

  const handleChange = (key: keyof ResultadosHematologia, value: string) => {
    onChange({ ...data, [key]: value });
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <InputNumber label="Leucocitos (mm³)" value={data.leucocitos} onChange={v => handleChange('leucocitos', v)} placeholder="7000" />
        <InputNumber label="Hematíes (mm³)" value={data.hematies} onChange={v => handleChange('hematies', v)} placeholder="4500000" />
        <InputNumber label="Hemoglobina (grs%)" value={data.hemoglobina} onChange={v => handleChange('hemoglobina', v)} placeholder="14.5" />
        <InputNumber label="Hematocrito (%)" value={data.hematocrito} onChange={v => handleChange('hematocrito', v)} placeholder="42.0" />
      </div>

      <hr className="border-gray-200" />

      <div>
        <h3 className="text-sm font-semibold text-gray-900 mb-3">Fórmula Leucocitaria (%)</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <InputNumber label="Segmentados (%)" value={data.segmentados} onChange={v => handleChange('segmentados', v)} placeholder="60" />
          <InputNumber label="Linfocitos (%)" value={data.linfocitos} onChange={v => handleChange('linfocitos', v)} placeholder="30" />
          <InputNumber label="Eosinófilos (%)" value={data.eosinofilos} onChange={v => handleChange('eosinofilos', v)} placeholder="3" />
          <InputNumber label="Otros (%)" value={data.otros} onChange={v => handleChange('otros', v)} placeholder="7" />
        </div>
      </div>

      <hr className="border-gray-200" />

      <div>
        <h3 className="text-sm font-semibold text-gray-900 mb-3">Sedimentación</h3>
        <div className="grid grid-cols-2 md:grid-cols-2 gap-4">
          <InputNumber label="1 hora (mm)" value={data.sedimentacion_1h} onChange={v => handleChange('sedimentacion_1h', v)} placeholder="10" />
          <InputNumber label="2 horas (mm)" value={data.sedimentacion_2h} onChange={v => handleChange('sedimentacion_2h', v)} placeholder="20" />
        </div>
      </div>

      <hr className="border-gray-200" />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <InputNumber label="Plaquetas (mm³)" value={data.plaquetas} onChange={v => handleChange('plaquetas', v)} placeholder="250000" />
      </div>

      <hr className="border-gray-200" />

      <div>
        <h3 className="text-sm font-semibold text-gray-900 mb-3">Coagulación</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <InputNumber label="T. Protrombina (seg)" value={data.t_protrombina} onChange={v => handleChange('t_protrombina', v)} placeholder="12" />
          <InputNumber label="Control T. Protrombina (seg)" value={data.t_protrombina_control} onChange={v => handleChange('t_protrombina_control', v)} placeholder="12" />
          <InputNumber label="INR" value={data.inr} onChange={v => handleChange('inr', v)} placeholder="1.0" />
          <InputNumber label="Razón P/C" value={data.razon_pc} onChange={v => handleChange('razon_pc', v)} placeholder="1.0" />
          <InputNumber label="PTT (seg)" value={data.ptt} onChange={v => handleChange('ptt', v)} placeholder="30" />
          <InputNumber label="Control PTT (seg)" value={data.ptt_control} onChange={v => handleChange('ptt_control', v)} placeholder="30" />
          <InputNumber label="Tiempo de Sangría (min)" value={data.t_sangria} onChange={v => handleChange('t_sangria', v)} placeholder="5" />
          <InputNumber label="Tiempo de Coagulación (min)" value={data.t_coagulacion} onChange={v => handleChange('t_coagulacion', v)} placeholder="8" />
        </div>
      </div>

      <hr className="border-gray-200" />

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

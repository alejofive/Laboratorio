'use client';

import { useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { ResultadosHeces } from '@/types';

interface FormHecesProps {
  resultados?: ResultadosHeces;
  onChange: (resultados: ResultadosHeces) => void;
  onValidChange?: (isValid: boolean) => void;
}

type FormHecesValues = ResultadosHeces;

const COLOR_OPTIONS = [
  'Amarilla',
  'Amarilla palido',
  'Amarilla verde',
  'Beige',
  'Blanco',
  'Gris',
  'Marron claro',
  'Marron rojizo',
  'Marron',
  'Naranja verde',
  'Negro',
  'Rojo',
  'Verde negruso',
  'Verdoso',
] as const;

const MICROS_OPTIONS = ['Escasas', 'Moderadas', 'Abundantes'] as const;

const parasiteKeys: Array<keyof FormHecesValues> = [
  'huevosAscarisLumbricoides',
  'huevosTricocefalos',
  'larvasAncylostomideos',
  'prequisteAmebaSp',
  'quistesAmebaColi',
  'quistesBlastocystisHominis',
  'quistesEndolimaxNana',
  'quistesEntamoebaHistolytica',
  'quistesGiardicaLamblia',
  'quistesIodamoebaBusthlli',
  'trofositosChilomastixMessmilli',
];

const defaultValues: FormHecesValues = {
  aspecto: '',
  sangre: '',
  consistencia: '',
  reaccion: '',
  color: '',
  moco: '',
  microscopicoLeucocitos: '',
  microscopicoEritrocitos: '',
  microscopicoConidias: '',
  microscopicoOtro: '',
  noElementosParasitarios: false,
  huevosAscarisLumbricoides: false,
  huevosTricocefalos: false,
  larvasAncylostomideos: false,
  prequisteAmebaSp: false,
  quistesAmebaColi: false,
  quistesBlastocystisHominis: false,
  quistesEndolimaxNana: false,
  quistesEntamoebaHistolytica: false,
  quistesGiardicaLamblia: false,
  quistesIodamoebaBusthlli: false,
  trofositosChilomastixMessmilli: false,
  complementarioSangreOculta: '',
  complementarioSangreOculta2: '',
  complementarioAzucaresReductores: '',
  complementarioOtro: '',
  observaciones: '',
};

function normalizeResultados(resultados?: ResultadosHeces): FormHecesValues {
  if (!resultados) return defaultValues;

  return {
    ...defaultValues,
    ...resultados,
    reaccion: resultados.reaccion || resultados.ph || '',
    moco: resultados.moco || resultados.mucus || '',
    microscopicoLeucocitos: resultados.microscopicoLeucocitos || resultados.leucocitos || '',
    noElementosParasitarios:
      typeof resultados.noElementosParasitarios === 'boolean'
        ? resultados.noElementosParasitarios
        : (resultados.parasitos || '').toLowerCase().includes('no'),
  };
}

function RadioGroup({
  label,
  name,
  options,
  register,
  value,
  error,
  disabled = false,
}: {
  label: string;
  name: keyof FormHecesValues;
  options: readonly string[];
  register: ReturnType<typeof useForm<FormHecesValues>>['register'];
  value?: string;
  error?: string;
  disabled?: boolean;
}) {
  return (
    <div className="space-y-2">
      <p className="text-sm font-medium text-gray-800">{label}</p>
      <div className="flex flex-wrap gap-3">
        {options.map(option => (
          <label
            key={option}
            className={`inline-flex items-center gap-2 text-sm text-gray-700 ${value === option ? 'font-semibold text-cyan-700' : ''}`}
          >
            <input
              type="radio"
              value={option}
              disabled={disabled}
              {...register(name, { required: 'Este campo es obligatorio' })}
              className="h-4 w-4 border-gray-300 text-cyan-600 focus:ring-cyan-500"
            />
            {option}
          </label>
        ))}
      </div>
      {error && <p className="text-xs text-red-600">{error}</p>}
    </div>
  );
}

export default function FormHeces({ resultados, onChange, onValidChange }: FormHecesProps) {
  const initialValues = useMemo(() => normalizeResultados(resultados), [resultados]);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors, isValid, isSubmitted },
  } = useForm<FormHecesValues>({
    mode: 'onChange',
    defaultValues: initialValues,
  });

  const noElementosParasitarios = watch('noElementosParasitarios');

  const selectedParasites = watch(parasiteKeys);
  const hasParasiteSelected = selectedParasites.some(Boolean);
  const isParasitologicoValid = noElementosParasitarios || hasParasiteSelected;
  const formValid = isValid && isParasitologicoValid;

  useEffect(() => {
    reset(initialValues);
  }, [initialValues, reset]);

  useEffect(() => {
    if (!noElementosParasitarios) return;

    parasiteKeys.forEach(key => {
      setValue(key, false, { shouldValidate: true, shouldDirty: true });
    });
  }, [noElementosParasitarios, setValue]);

  useEffect(() => {
    onValidChange?.(formValid);
  }, [formValid, onValidChange]);

  useEffect(() => {
    const subscription = watch(values => {
      onChange(values as ResultadosHeces);
    });

    return () => subscription.unsubscribe();
  }, [watch, onChange]);

  const onSubmit = (values: FormHecesValues) => {
    onChange(values);
  };

  const handleCancel = () => {
    reset(initialValues);
    onChange(initialValues);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <section className="rounded-lg border border-gray-200 bg-white p-4 md:p-5">
        <h3 className="mb-4 text-base font-semibold text-gray-900">Campos principales</h3>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <RadioGroup label="Aspecto" name="aspecto" options={['Homogeneo', 'Heterogeneo']} register={register} value={watch('aspecto')} error={errors.aspecto?.message} />
          <RadioGroup label="Sangre" name="sangre" options={['Ausente', 'Presente']} register={register} value={watch('sangre')} error={errors.sangre?.message} />
          <RadioGroup
            label="Consistencia"
            name="consistencia"
            options={['Blanda', 'Diarreica', 'Dura', 'Liquida', 'Mucosa', 'Pastosa']}
            register={register}
            value={watch('consistencia')}
            error={errors.consistencia?.message}
          />
          <RadioGroup label="Reaccion" name="reaccion" options={['Acida', 'Alcalina']} register={register} value={watch('reaccion')} error={errors.reaccion?.message} />

          <div className="space-y-2">
            <label htmlFor="color" className="text-sm font-medium text-gray-800">Color</label>
            <select
              id="color"
              {...register('color', { required: 'Este campo es obligatorio' })}
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-cyan-500 focus:outline-none"
            >
              <option value="">Seleccionar color...</option>
              {COLOR_OPTIONS.map(option => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
            {errors.color?.message && <p className="text-xs text-red-600">{errors.color.message}</p>}
          </div>

          <RadioGroup label="Moco" name="moco" options={['Ausente', 'Presente']} register={register} value={watch('moco')} error={errors.moco?.message} />
        </div>
      </section>

      <section className="rounded-lg border border-gray-200 bg-white p-4 md:p-5">
        <h3 className="mb-4 text-base font-semibold text-gray-900">Examen microscopico (40x10)</h3>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <RadioGroup
            label="Leucocitos"
            name="microscopicoLeucocitos"
            options={MICROS_OPTIONS}
            register={register}
            value={watch('microscopicoLeucocitos')}
            error={errors.microscopicoLeucocitos?.message}
          />
          <RadioGroup
            label="Eritrocitos"
            name="microscopicoEritrocitos"
            options={MICROS_OPTIONS}
            register={register}
            value={watch('microscopicoEritrocitos')}
            error={errors.microscopicoEritrocitos?.message}
          />
          <RadioGroup
            label="Conidias"
            name="microscopicoConidias"
            options={MICROS_OPTIONS}
            register={register}
            value={watch('microscopicoConidias')}
            error={errors.microscopicoConidias?.message}
          />
          <RadioGroup
            label="Otro hallazgo"
            name="microscopicoOtro"
            options={MICROS_OPTIONS}
            register={register}
            value={watch('microscopicoOtro')}
            error={errors.microscopicoOtro?.message}
          />
        </div>
      </section>

      <section className="rounded-lg border border-gray-200 bg-white p-4 md:p-5">
        <h3 className="mb-4 text-base font-semibold text-gray-900">Examen parasitologico</h3>
        <label className="mb-4 inline-flex items-center gap-2 text-sm font-medium text-gray-800">
          <input
            type="checkbox"
            {...register('noElementosParasitarios')}
            className="h-4 w-4 rounded border-gray-300 text-cyan-600 focus:ring-cyan-500"
          />
          No se observaron elementos parasitarios
        </label>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          <label className={`inline-flex items-center gap-2 text-sm ${noElementosParasitarios ? 'text-gray-400' : 'text-gray-700'}`}>
            <input type="checkbox" disabled={noElementosParasitarios} {...register('huevosAscarisLumbricoides')} className="h-4 w-4 rounded border-gray-300 text-cyan-600" />
            Huevos de Ascaris lumbricoides
          </label>
          <label className={`inline-flex items-center gap-2 text-sm ${noElementosParasitarios ? 'text-gray-400' : 'text-gray-700'}`}>
            <input type="checkbox" disabled={noElementosParasitarios} {...register('huevosTricocefalos')} className="h-4 w-4 rounded border-gray-300 text-cyan-600" />
            Huevos de Tricocefalos
          </label>
          <label className={`inline-flex items-center gap-2 text-sm ${noElementosParasitarios ? 'text-gray-400' : 'text-gray-700'}`}>
            <input type="checkbox" disabled={noElementosParasitarios} {...register('larvasAncylostomideos')} className="h-4 w-4 rounded border-gray-300 text-cyan-600" />
            Larvas de Ancylostomideos
          </label>
          <label className={`inline-flex items-center gap-2 text-sm ${noElementosParasitarios ? 'text-gray-400' : 'text-gray-700'}`}>
            <input type="checkbox" disabled={noElementosParasitarios} {...register('prequisteAmebaSp')} className="h-4 w-4 rounded border-gray-300 text-cyan-600" />
            Prequiste de Ameba sp
          </label>
          <label className={`inline-flex items-center gap-2 text-sm ${noElementosParasitarios ? 'text-gray-400' : 'text-gray-700'}`}>
            <input type="checkbox" disabled={noElementosParasitarios} {...register('quistesAmebaColi')} className="h-4 w-4 rounded border-gray-300 text-cyan-600" />
            Quistes de Ameba coli
          </label>
          <label className={`inline-flex items-center gap-2 text-sm ${noElementosParasitarios ? 'text-gray-400' : 'text-gray-700'}`}>
            <input type="checkbox" disabled={noElementosParasitarios} {...register('quistesBlastocystisHominis')} className="h-4 w-4 rounded border-gray-300 text-cyan-600" />
            Quistes de Blastocystis hominis
          </label>
          <label className={`inline-flex items-center gap-2 text-sm ${noElementosParasitarios ? 'text-gray-400' : 'text-gray-700'}`}>
            <input type="checkbox" disabled={noElementosParasitarios} {...register('quistesEndolimaxNana')} className="h-4 w-4 rounded border-gray-300 text-cyan-600" />
            Quistes de Endolimax nana
          </label>
          <label className={`inline-flex items-center gap-2 text-sm ${noElementosParasitarios ? 'text-gray-400' : 'text-gray-700'}`}>
            <input type="checkbox" disabled={noElementosParasitarios} {...register('quistesEntamoebaHistolytica')} className="h-4 w-4 rounded border-gray-300 text-cyan-600" />
            Quistes de Entamoeba histolytica
          </label>
          <label className={`inline-flex items-center gap-2 text-sm ${noElementosParasitarios ? 'text-gray-400' : 'text-gray-700'}`}>
            <input type="checkbox" disabled={noElementosParasitarios} {...register('quistesGiardicaLamblia')} className="h-4 w-4 rounded border-gray-300 text-cyan-600" />
            Quistes de Giardica lamblica
          </label>
          <label className={`inline-flex items-center gap-2 text-sm ${noElementosParasitarios ? 'text-gray-400' : 'text-gray-700'}`}>
            <input type="checkbox" disabled={noElementosParasitarios} {...register('quistesIodamoebaBusthlli')} className="h-4 w-4 rounded border-gray-300 text-cyan-600" />
            Quistes de Iodamoeba busthlli
          </label>
          <label className={`inline-flex items-center gap-2 text-sm ${noElementosParasitarios ? 'text-gray-400' : 'text-gray-700'}`}>
            <input type="checkbox" disabled={noElementosParasitarios} {...register('trofositosChilomastixMessmilli')} className="h-4 w-4 rounded border-gray-300 text-cyan-600" />
            Trofositos Chilomastix messmilli
          </label>
        </div>

        {!isParasitologicoValid && (isSubmitted || hasParasiteSelected || !noElementosParasitarios) && (
          <p className="mt-3 text-xs text-red-600">Selecciona "No se observaron elementos parasitarios" o al menos un parasito.</p>
        )}
      </section>

      <section className="rounded-lg border border-gray-200 bg-white p-4 md:p-5">
        <h3 className="mb-4 text-base font-semibold text-gray-900">Examen complementario</h3>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <RadioGroup
            label="Sangre oculta en heces"
            name="complementarioSangreOculta"
            options={['Ausente', 'Presente']}
            register={register}
            value={watch('complementarioSangreOculta')}
            error={errors.complementarioSangreOculta?.message}
          />
          <RadioGroup
            label="Segundo campo de sangre oculta"
            name="complementarioSangreOculta2"
            options={['Negativo', 'Positivo']}
            register={register}
            value={watch('complementarioSangreOculta2')}
            error={errors.complementarioSangreOculta2?.message}
          />
          <RadioGroup
            label="Azucares reductores"
            name="complementarioAzucaresReductores"
            options={['Negativo', 'Positivo (+)', 'Positivo (+2)', 'Positivo (+3)']}
            register={register}
            value={watch('complementarioAzucaresReductores')}
            error={errors.complementarioAzucaresReductores?.message}
          />
          <RadioGroup
            label="Complementario adicional"
            name="complementarioOtro"
            options={['Negativo', 'Positivo']}
            register={register}
            value={watch('complementarioOtro')}
            error={errors.complementarioOtro?.message}
          />
        </div>
      </section>

      <section className="rounded-lg border border-gray-200 bg-white p-4 md:p-5">
        <label htmlFor="observaciones" className="mb-2 block text-sm font-medium text-gray-800">Observaciones</label>
        <textarea
          id="observaciones"
          rows={4}
          {...register('observaciones')}
          placeholder="Observaciones adicionales..."
          className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-cyan-500 focus:outline-none"
        />
      </section>

    </form>
  );
}

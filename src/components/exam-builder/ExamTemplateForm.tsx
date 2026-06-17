'use client';

import { Eye, Pencil, Plus, Save, Trash2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { FormEvent, useState } from 'react';
import { cleanExamTemplatePayload, ExamTemplatePayload, FIELD_TYPES, generateKeyFromLabel, initialExamTemplate, validateExamTemplate } from '@/lib/examTemplateBuilder';
import { ExamTemplate, ExamTemplateField, ExamTemplateFieldType } from '@/types/exam-template';
import { ExamPreview } from './ExamPreview';

interface ExamTemplateFormProps {
  initialValue?: ExamTemplate;
  mode: 'create' | 'edit';
  onSave: (template: ExamTemplatePayload) => Promise<void>;
  isSaving?: boolean;
}

const inputClass = 'w-full rounded-xl border border-border-input bg-surface px-3 py-2 text-sm text-primary outline-none transition focus:border-brand-soft focus:ring-2 focus:ring-brand-soft/30';
const labelClass = 'mb-1 block text-sm font-semibold text-tertiary';

function createEmptyField(): ExamTemplateField {
  return {
    key: '',
    label: '',
    type: 'text',
    options: [],
    unit: '',
    reference_value: '',
    required: false,
  };
}

export function ExamTemplateForm({ initialValue, mode, onSave, isSaving = false }: ExamTemplateFormProps) {
  const router = useRouter();
  const [template, setTemplate] = useState<ExamTemplate>(() => initialValue ?? initialExamTemplate);
  const [errors, setErrors] = useState<string[]>([]);
  const [viewMode, setViewMode] = useState<'edit' | 'preview'>('edit');

  const updateTemplate = (data: Partial<ExamTemplate>) => {
    setTemplate((prev) => ({ ...prev, ...data }));
  };

  const updateSectionTitle = (sectionIndex: number, title: string) => {
    setTemplate((prev) => ({
      ...prev,
      sections: prev.sections.map((section, index) => (index === sectionIndex ? { ...section, title } : section)),
    }));
  };

  const addSection = () => {
    setTemplate((prev) => ({
      ...prev,
      sections: [...prev.sections, { title: '', fields: [] }],
    }));
  };

  const removeSection = (sectionIndex: number) => {
    setTemplate((prev) => ({
      ...prev,
      sections: prev.sections.filter((_section, index) => index !== sectionIndex),
    }));
  };

  const addField = (sectionIndex: number) => {
    setTemplate((prev) => ({
      ...prev,
      sections: prev.sections.map((section, index) => (
        index === sectionIndex ? { ...section, fields: [...section.fields, createEmptyField()] } : section
      )),
    }));
  };

  const removeField = (sectionIndex: number, fieldIndex: number) => {
    setTemplate((prev) => ({
      ...prev,
      sections: prev.sections.map((section, index) => (
        index === sectionIndex
          ? { ...section, fields: section.fields.filter((_field, currentFieldIndex) => currentFieldIndex !== fieldIndex) }
          : section
      )),
    }));
  };

  const updateField = (sectionIndex: number, fieldIndex: number, data: Partial<ExamTemplateField>) => {
    setTemplate((prev) => ({
      ...prev,
      sections: prev.sections.map((section, currentSectionIndex) => {
        if (currentSectionIndex !== sectionIndex) return section;

        return {
          ...section,
          fields: section.fields.map((field, currentFieldIndex) => {
            if (currentFieldIndex !== fieldIndex) return field;

            const nextField = { ...field, ...data };

            if (data.label !== undefined) {
              nextField.key = generateKeyFromLabel(data.label);
            }

            if (data.type && data.type !== 'select' && data.type !== 'radio') {
              nextField.options = [];
            }

            return nextField;
          }),
        };
      }),
    }));
  };

  const updateOption = (sectionIndex: number, fieldIndex: number, optionIndex: number, value: string) => {
    const field = template.sections[sectionIndex].fields[fieldIndex];
    const options = [...(field.options ?? [])];
    options[optionIndex] = value;
    updateField(sectionIndex, fieldIndex, { options });
  };

  const addOption = (sectionIndex: number, fieldIndex: number) => {
    const field = template.sections[sectionIndex].fields[fieldIndex];
    updateField(sectionIndex, fieldIndex, { options: [...(field.options ?? []), ''] });
  };

  const removeOption = (sectionIndex: number, fieldIndex: number, optionIndex: number) => {
    const field = template.sections[sectionIndex].fields[fieldIndex];
    updateField(sectionIndex, fieldIndex, {
      options: (field.options ?? []).filter((_option, index) => index !== optionIndex),
    });
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const validation = validateExamTemplate(template);
    setErrors(validation.errors);

    if (!validation.isValid) return;

    await onSave(cleanExamTemplatePayload(template));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="flex flex-col gap-3 rounded-3xl border border-border-default bg-surface p-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-brand-primary">Modo de trabajo</p>
          <p className="mt-1 text-sm text-secondary">
            {viewMode === 'edit' ? 'Edita la plantilla y sus campos.' : 'Revisa como se vera al cargar resultados.'}
          </p>
        </div>
        <div className="grid grid-cols-2 rounded-2xl bg-surface-muted p-1">
          <button
            type="button"
            onClick={() => setViewMode('edit')}
            className={`inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2 text-sm font-bold transition ${viewMode === 'edit' ? 'bg-surface text-primary shadow-sm' : 'text-secondary hover:text-primary'}`}
          >
            <Pencil size={16} />
            Edicion
          </button>
          <button
            type="button"
            onClick={() => setViewMode('preview')}
            className={`inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2 text-sm font-bold transition ${viewMode === 'preview' ? 'bg-surface text-primary shadow-sm' : 'text-secondary hover:text-primary'}`}
          >
            <Eye size={16} />
            Vista previa
          </button>
        </div>
      </div>

      {viewMode === 'edit' ? (
      <div className="space-y-6">
        <section className="rounded-3xl border border-border-default bg-surface p-6">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-brand-primary">Plantilla clinica</p>
              <h1 className="mt-2 text-3xl font-bold text-primary">{mode === 'create' ? 'Crear examen' : 'Editar examen'}</h1>
              <p className="mt-1 text-sm text-secondary">Define la estructura que luego se usara para cargar resultados reales.</p>
            </div>
            <label className="flex items-center gap-2 rounded-full bg-brand-active px-4 py-2 text-sm font-semibold text-brand-primary">
              <input
                type="checkbox"
                checked={template.is_active}
                onChange={(event) => updateTemplate({ is_active: event.target.checked })}
              />
              Activo
            </label>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <div>
              <label className={labelClass}>Nombre del examen</label>
              <input value={template.name} onChange={(event) => updateTemplate({ name: event.target.value })} className={inputClass} placeholder="Hematologia" />
            </div>
            <div>
              <label className={labelClass}>Categoria</label>
              <input value={template.category ?? ''} onChange={(event) => updateTemplate({ category: event.target.value })} className={inputClass} placeholder="hematology" />
            </div>
            <div>
              <label className={labelClass}>Precio</label>
              <input type="number" min="0" value={template.price ?? 0} onChange={(event) => updateTemplate({ price: Number(event.target.value) })} className={inputClass} />
            </div>
            <div className="md:col-span-2">
              <label className={labelClass}>Descripcion</label>
              <textarea value={template.description ?? ''} onChange={(event) => updateTemplate({ description: event.target.value })} rows={3} className={inputClass} placeholder="Panel hematologico completo" />
            </div>
          </div>
        </section>

        {errors.length > 0 ? (
          <div className="rounded-3xl border border-red-200 bg-red-50 p-5 text-sm text-red-700">
            <p className="font-bold">Corrige estos puntos antes de guardar:</p>
            <ul className="mt-2 list-disc space-y-1 pl-5">
              {errors.map((error) => <li key={error}>{error}</li>)}
            </ul>
          </div>
        ) : null}

        <section className="space-y-4">
          {template.sections.map((section, sectionIndex) => (
            <div key={`${section.title}-${sectionIndex}`} className="rounded-3xl border border-border-default bg-surface p-5">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex-1">
                  <label className={labelClass}>Seccion {sectionIndex + 1}</label>
                  <input value={section.title} onChange={(event) => updateSectionTitle(sectionIndex, event.target.value)} className={inputClass} placeholder="Resultados" />
                </div>
                <button type="button" onClick={() => removeSection(sectionIndex)} className="inline-flex items-center justify-center gap-2 rounded-xl border border-border-default px-3 py-2 text-sm font-semibold text-secondary hover:bg-surface-muted">
                  <Trash2 size={16} />
                  Eliminar seccion
                </button>
              </div>

              <div className="mt-5 space-y-4">
                {section.fields.map((field, fieldIndex) => (
                  <div key={`${field.key}-${fieldIndex}`} className="rounded-2xl border border-border-default bg-canvas/60 p-4">
                    <div className="grid gap-4 lg:grid-cols-4">
                      <div>
                        <label className={labelClass}>Nombre visible</label>
                        <input value={field.label} onChange={(event) => updateField(sectionIndex, fieldIndex, { label: event.target.value })} className={inputClass} placeholder="Leucocitos" />
                      </div>
                      <div>
                        <label className={labelClass}>Tipo</label>
                        <select value={field.type} onChange={(event) => updateField(sectionIndex, fieldIndex, { type: event.target.value as ExamTemplateFieldType })} className={inputClass}>
                          {FIELD_TYPES.map((type) => <option key={type.value} value={type.value}>{type.label}</option>)}
                        </select>
                      </div>
                      <div>
                        <label className={labelClass}>Unidad</label>
                        <input value={field.unit ?? ''} onChange={(event) => updateField(sectionIndex, fieldIndex, { unit: event.target.value })} className={inputClass} placeholder="mm3" />
                      </div>
                      <div>
                        <label className={labelClass}>Valores de referencia</label>
                        <input value={field.reference_value ?? ''} onChange={(event) => updateField(sectionIndex, fieldIndex, { reference_value: event.target.value })} className={inputClass} placeholder="4.000 - 10.000" />
                      </div>
                    </div>

                    <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                      <label className="flex items-center gap-2 text-sm font-semibold text-tertiary">
                        <input type="checkbox" checked={field.required} onChange={(event) => updateField(sectionIndex, fieldIndex, { required: event.target.checked })} />
                        Obligatorio
                      </label>
                      <button type="button" onClick={() => removeField(sectionIndex, fieldIndex)} className="inline-flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold text-red-600 hover:bg-red-50">
                        <Trash2 size={16} />
                        Eliminar campo
                      </button>
                    </div>

                    {field.type === 'select' || field.type === 'radio' ? (
                      <div className="mt-4 rounded-2xl border border-dashed border-border-input p-4">
                        <div className="flex items-center justify-between gap-3">
                          <p className="text-sm font-bold text-tertiary">Opciones</p>
                          <button type="button" onClick={() => addOption(sectionIndex, fieldIndex)} className="text-sm font-bold text-brand-primary hover:underline">+ Agregar opcion</button>
                        </div>
                        <div className="mt-3 space-y-2">
                          {(field.options ?? []).map((option, optionIndex) => (
                            <div key={optionIndex} className="flex gap-2">
                              <input value={option} onChange={(event) => updateOption(sectionIndex, fieldIndex, optionIndex, event.target.value)} className={inputClass} placeholder="A+" />
                              <button type="button" onClick={() => removeOption(sectionIndex, fieldIndex, optionIndex)} className="rounded-xl border border-border-default px-3 text-secondary hover:bg-surface-muted">Quitar</button>
                            </div>
                          ))}
                        </div>
                      </div>
                    ) : null}
                  </div>
                ))}
              </div>

              <button type="button" onClick={() => addField(sectionIndex)} className="mt-4 inline-flex items-center gap-2 rounded-xl bg-brand-active px-4 py-2 text-sm font-bold text-brand-primary hover:bg-brand-soft/20">
                <Plus size={16} />
                Agregar campo
              </button>
            </div>
          ))}

          <button type="button" onClick={addSection} className="inline-flex items-center gap-2 rounded-2xl border border-border-default bg-surface px-4 py-3 text-sm font-bold text-brand-primary hover:bg-brand-active">
            <Plus size={18} />
            Agregar seccion
          </button>
        </section>

      </div>
      ) : (
        <ExamPreview template={template} />
      )}

      <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
        <button type="button" onClick={() => router.push('/dashboard/exam-templates')} className="rounded-2xl border border-border-default px-5 py-3 text-sm font-bold text-secondary hover:bg-surface-muted">Cancelar</button>
        <button type="submit" disabled={isSaving} className="inline-flex items-center justify-center gap-2 rounded-2xl bg-brand-primary px-5 py-3 text-sm font-bold text-white hover:bg-primary disabled:opacity-60">
          <Save size={18} />
          {isSaving ? 'Guardando...' : 'Guardar examen'}
        </button>
      </div>
    </form>
  );
}

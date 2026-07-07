'use client';

import { cleanExamTemplatePayload, ExamTemplatePayload, FIELD_TYPES, generateKeyFromLabel, initialExamTemplate, validateExamTemplate } from '@/lib/examTemplateBuilder';
import { ExamTemplate, ExamTemplateField, ExamTemplateFieldType } from '@/types/exam-template';
import { Eye, Pencil, Plus, Save, Trash2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { FormEvent, useState } from 'react';
import { Button } from '@/components/ui/Button';
import { FieldLabel, SelectInput, TextInput } from '@/components/ui/FormField';
import { ExamPreview } from './ExamPreview';

interface ExamTemplateFormProps {
  initialValue?: ExamTemplate;
  mode: 'create' | 'edit';
  onSave: (template: ExamTemplatePayload) => Promise<void>;
  isSaving?: boolean;
}

function createEmptyField(): ExamTemplateField {
  return {
    key: '',
    label: '',
    type: 'text',
    options: [],
    unit: '',
    reference_value: '',
  };
}

function normalizeTemplateForEditor(template: ExamTemplate): ExamTemplate {
  return {
    ...template,
    description: '',
    price: 0,
  };
}

export function ExamTemplateForm({ initialValue, mode, onSave, isSaving = false }: ExamTemplateFormProps) {
  const router = useRouter();
  const [template, setTemplate] = useState<ExamTemplate>(() => normalizeTemplateForEditor(initialValue ?? initialExamTemplate));
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
            className={`inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2 text-sm font-bold transition ${viewMode === 'edit' ? 'bg-surface text-primary' : 'text-secondary hover:text-primary'}`}
          >
            <Pencil size={16} />
            Edicion
          </button>
          <button
            type="button"
            onClick={() => setViewMode('preview')}
            className={`inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2 text-sm font-bold transition ${viewMode === 'preview' ? 'bg-surface text-primary' : 'text-secondary hover:text-primary'}`}
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
              <FieldLabel>Nombre del examen</FieldLabel>
              <TextInput value={template.name} onChange={(event) => updateTemplate({ name: event.target.value })} placeholder="Hematologia" />
            </div>
            <div>
              <FieldLabel>Categoria</FieldLabel>
              <TextInput value={template.category ?? ''} onChange={(event) => updateTemplate({ category: event.target.value })} placeholder="hematology" />
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
            <div key={section._id ?? sectionIndex} className="rounded-3xl border border-border-default bg-surface p-5">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                <div className="flex-1">
                  <FieldLabel className="text-lg text-primary">Seccion {sectionIndex + 1}</FieldLabel>
                  <TextInput value={section.title} onChange={(event) => updateSectionTitle(sectionIndex, event.target.value)} placeholder="Resultados" />
                </div>
                <Button type="button" onClick={() => removeSection(sectionIndex)} variant="outline" size="sm">
                  <Trash2 size={16} />
                  Eliminar seccion
                </Button>
              </div>

              <div className="mt-5 space-y-4">
                {section.fields.map((field, fieldIndex) => (
                  <div key={field._id ?? fieldIndex} className="rounded-2xl border border-border-default bg-canvas/60 p-4">
                    <div className="grid gap-4 lg:grid-cols-4">
                      <div>
                        <FieldLabel>Nombre</FieldLabel>
                        <TextInput value={field.label} onChange={(event) => updateField(sectionIndex, fieldIndex, { label: event.target.value })} placeholder="Leucocitos" />
                      </div>
                      <div>
                        <FieldLabel>Tipo</FieldLabel>
                        <SelectInput value={field.type} onChange={(event) => updateField(sectionIndex, fieldIndex, { type: event.target.value as ExamTemplateFieldType })}>
                          {FIELD_TYPES.map((type) => <option key={type.value} value={type.value}>{type.label}</option>)}
                        </SelectInput>
                      </div>
                      <div>
                        <FieldLabel>Unidad</FieldLabel>
                        <TextInput value={field.unit ?? ''} onChange={(event) => updateField(sectionIndex, fieldIndex, { unit: event.target.value })} placeholder="mm3" />
                      </div>
                      <div>
                        <FieldLabel>Valores de referencia</FieldLabel>
                        <TextInput value={field.reference_value ?? ''} onChange={(event) => updateField(sectionIndex, fieldIndex, { reference_value: event.target.value })} placeholder="4.000 - 10.000" />
                      </div>
                    </div>

                    <div className="mt-4 flex flex-wrap items-center justify-end gap-3">
                      <Button type="button" onClick={() => removeField(sectionIndex, fieldIndex)} variant="link" size="sm" className="text-red-600 hover:text-red-700">
                        <Trash2 size={16} />
                        Eliminar campo
                      </Button>
                    </div>

                    {field.type === 'select' || field.type === 'radio' ? (
                      <div className="mt-4 rounded-2xl border border-dashed border-border-input p-4">
                        <div className="flex items-center justify-between gap-3">
                          <p className="text-sm font-bold text-tertiary">Opciones</p>
                          <Button type="button" onClick={() => addOption(sectionIndex, fieldIndex)} variant="link" size="sm">+ Agregar opcion</Button>
                        </div>
                        <div className="mt-3 space-y-2">
                          {(field.options ?? []).map((option, optionIndex) => (
                            <div key={optionIndex} className="flex gap-2">
                              <TextInput value={option} onChange={(event) => updateOption(sectionIndex, fieldIndex, optionIndex, event.target.value)} placeholder="A+" />
                              <Button type="button" onClick={() => removeOption(sectionIndex, fieldIndex, optionIndex)} variant="outline" size="sm">Quitar</Button>
                            </div>
                          ))}
                        </div>
                      </div>
                    ) : null}
                  </div>
                ))}
              </div>

              <Button type="button" onClick={() => addField(sectionIndex)} variant="outline" size="sm" className="mt-4">
                <Plus size={16} />
                Agregar campo
              </Button>
            </div>
          ))}

          <Button type="button" onClick={addSection} variant="outline">
            <Plus size={18} />
            Agregar seccion
          </Button>
        </section>

      </div>
      ) : (
        <ExamPreview template={template} />
      )}

      <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
        <Button type="button" onClick={() => router.push('/dashboard/exam-templates')} variant="outline">Cancelar</Button>
        <Button type="submit" disabled={isSaving}>
          <Save size={18} />
          {isSaving ? 'Guardando...' : 'Guardar examen'}
        </Button>
      </div>
    </form>
  );
}

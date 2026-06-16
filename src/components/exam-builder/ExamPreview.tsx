'use client';

import { ExamTemplate, ExamTemplateField } from '@/types/exam-template';

function PreviewControl({ field }: { field: ExamTemplateField }) {
  const baseClass = 'w-full rounded-xl border border-border-input bg-surface-muted px-3 py-2 text-sm text-secondary';

  if (field.type === 'textarea') {
    return <textarea rows={3} disabled placeholder={field.label || 'Texto largo'} className={baseClass} />;
  }

  if (field.type === 'select') {
    return (
      <select disabled className={baseClass} defaultValue="">
        <option value="">Seleccionar</option>
        {(field.options ?? []).map((option) => (
          <option key={option} value={option}>{option}</option>
        ))}
      </select>
    );
  }

  if (field.type === 'radio') {
    return (
      <div className="flex flex-wrap gap-3 rounded-xl border border-border-input bg-surface-muted px-3 py-2 text-sm text-secondary">
        {field.options.length === 0 ? <span>Opciones</span> : null}
        {field.options.map((option) => (
          <label key={option} className="flex items-center gap-2">
            <input type="radio" disabled />
            {option}
          </label>
        ))}
      </div>
    );
  }

  if (field.type === 'checkbox') {
    return (
      <label className="flex items-center gap-2 rounded-xl border border-border-input bg-surface-muted px-3 py-2 text-sm text-secondary">
        <input type="checkbox" disabled />
        Marcar
      </label>
    );
  }

  return <input type={field.type === 'date' ? 'date' : field.type} disabled placeholder={field.label || 'Valor'} className={baseClass} />;
}

export function ExamPreview({ template }: { template: ExamTemplate }) {
  return (
    <section className="space-y-5 rounded-3xl border border-border-default bg-surface p-6">
      <div>
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-brand-primary">Vista previa</p>
        <h2 className="mt-2 text-2xl font-bold text-primary">{template.name || 'Nuevo examen'}</h2>
        {template.description ? <p className="mt-1 text-sm text-secondary">{template.description}</p> : null}
      </div>

      <div className="space-y-5">
        {template.sections.map((section, sectionIndex) => (
          <section key={`${section.title}-${sectionIndex}`} className="rounded-2xl border border-border-default bg-canvas/50 p-4">
            <h3 className="text-base font-bold text-primary">{section.title || `Seccion ${sectionIndex + 1}`}</h3>
            <div className="mt-4 space-y-3">
              {section.fields.length === 0 ? (
                <p className="rounded-xl border border-dashed border-border-input px-3 py-4 text-sm text-secondary">
                  Agrega campos para ver como se cargaran los resultados.
                </p>
              ) : null}

              {section.fields.map((field, fieldIndex) => (
                <div key={`${field.key}-${fieldIndex}`} className="space-y-1.5">
                  <label className="flex items-center gap-1 text-sm font-semibold text-tertiary">
                    {field.label || `Campo ${fieldIndex + 1}`}
                    {field.required ? <span className="text-brand-logo">*</span> : null}
                    {field.unit ? <span className="font-normal text-secondary">({field.unit})</span> : null}
                  </label>
                  <PreviewControl field={field} />
                </div>
              ))}
            </div>
          </section>
        ))}
      </div>
    </section>
  );
}

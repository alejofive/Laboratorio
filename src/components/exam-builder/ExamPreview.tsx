'use client';

import { ExamTemplate, ExamTemplateField } from '@/types/exam-template';

function PreviewControl({ field, label }: { field: ExamTemplateField; label: string }) {
  const baseClass = 'w-full px-3 py-2 border border-gray-300 rounded-md focus:border-transparent bg-white disabled:bg-white disabled:text-secondary';

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
      <div className="flex flex-wrap gap-4 text-sm text-tertiary">
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
      <label className="flex items-center gap-2 text-sm text-tertiary">
        <input type="checkbox" disabled />
        {label}
        {field.required ? <span className="text-brand-logo">*</span> : null}
      </label>
    );
  }

  return <input type={field.type === 'date' ? 'date' : field.type} disabled placeholder={field.label || 'Valor'} className={baseClass} />;
}

export function ExamPreview({ template }: { template: ExamTemplate }) {
  return (
    <section className="space-y-6 rounded-3xl border border-border-default bg-surface p-6">
      <div>
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-brand-primary">Vista previa</p>
        <h2 className="mt-2 text-2xl font-bold text-primary">{template.name || 'Nuevo examen'}</h2>
        {template.description ? <p className="mt-1 text-sm text-secondary">{template.description}</p> : null}
      </div>

      <div className="space-y-6">
        {template.sections.map((section, sectionIndex) => (
          <section key={section._id ?? sectionIndex} className="border border-surface-muted rounded-3xl">
            <h3 className="text-base font-bold text-primary bg-surface-muted py-2 px-5 rounded-t-3xl">
              {section.title || `Seccion ${sectionIndex + 1}`}
            </h3>
            <div className="grid grid-cols-6 gap-4 p-6">
              {section.fields.length === 0 ? (
                <p className="col-span-6 rounded-xl border border-dashed border-border-input px-3 py-4 text-sm text-secondary">
                  Agrega campos para ver como se cargaran los resultados.
                </p>
              ) : null}

              {section.fields.map((field, fieldIndex) => {
                const label = `${field.label || `Campo ${fieldIndex + 1}`}${field.unit ? ` (${field.unit})` : ''}`;
                const className = field.type === 'textarea' ? 'col-span-6' : 'col-span-2';

                return (
                <div key={field._id ?? fieldIndex} className={className}>
                  {field.type !== 'checkbox' ? (
                    <label className="block text-sm font-medium text-tertiary mb-1">
                      {label}
                      {field.required ? <span className="text-brand-logo"> *</span> : null}
                    </label>
                  ) : null}
                  <PreviewControl field={field} label={label} />
                </div>
                );
              })}
            </div>
          </section>
        ))}
      </div>
    </section>
  );
}

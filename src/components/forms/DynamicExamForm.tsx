'use client';

import { useEffect } from 'react';
import { InputNumber } from '@/components/ui/InputNumber';
import { ExamTemplateSection } from '@/types/exam-template';
import { TemplateFormValues, validateTemplateValues } from '@/lib/examTemplate';

interface DynamicExamFormProps {
  sections: ExamTemplateSection[];
  values: TemplateFormValues;
  onChange: (values: TemplateFormValues) => void;
  onValidChange?: (isValid: boolean) => void;
  readOnly?: boolean;
}

export default function DynamicExamForm({
  sections,
  values,
  onChange,
  onValidChange,
  readOnly = false,
}: DynamicExamFormProps) {
  useEffect(() => {
    onValidChange?.(validateTemplateValues(sections, values));
  }, [sections, values, onValidChange]);

  const updateValue = (key: string, value: string | boolean) => {
    onChange({
      ...values,
      [key]: value,
    });
  };

  const renderReadOnlyValue = (key: string, label: string, value: string | boolean | undefined, className = 'col-span-2') => (
    <div key={key} className={className}>
      <label className="block text-sm font-medium text-tertiary mb-1">{label}</label>
      <p className="w-full py-2 text-lg text-primary break-words">{String(value ?? '').trim() || '-'}</p>
    </div>
  );

  return (
    <div className="space-y-6">
      {sections.map((section, idx) => (
        <div key={section._id ?? `${section.title}-${idx}`} className="border border-surface-muted rounded-3xl">
          <h3 className="text-base font-bold text-primary bg-surface-muted py-2 px-5 rounded-t-3xl">{section.title}</h3>
          <div className="grid grid-cols-6 gap-4 p-6">
            {section.fields.map((field) => {
              const label = field.unit ? `${field.label} (${field.unit})` : field.label;
              const value = values[field.key];

              if (field.type === 'textarea') {
                if (readOnly) {
                  return renderReadOnlyValue(field._id ?? field.key, label, value, 'col-span-6');
                }

                return (
                  <div key={field._id ?? field.key} className="col-span-6">
                    <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
                    <textarea
                      value={String(value ?? '')}
                      onChange={(event) => updateValue(field.key, event.target.value)}
                      readOnly={readOnly}
                      rows={3}
                      placeholder={field.label}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:border-transparent"
                    />
                  </div>
                );
              }

              if (field.type === 'select') {
                if (readOnly) {
                  return renderReadOnlyValue(field._id ?? field.key, label, value);
                }

                return (
                  <div key={field._id ?? field.key} className="col-span-2">
                    <label className="block text-sm font-medium text-tertiary mb-1">{label}</label>
                    <select
                      value={String(value ?? '')}
                      onChange={(event) => updateValue(field.key, event.target.value)}
                      disabled={readOnly}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:border-transparent bg-white"
                    >
                      <option value="">Seleccionar</option>
                      {field.options.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                  </div>
                );
              }

              if (field.type === 'checkbox') {
                if (readOnly) {
                  return (
                    <div key={field._id ?? field.key} className="col-span-2">
                      <label className="block text-sm font-medium text-tertiary mb-1">{label}</label>
                      <p className="w-full py-2 text-lg text-primary break-words">{value ? 'Si' : 'No'}</p>
                    </div>
                  );
                }

                return (
                  <label key={field._id ?? field.key} className="flex items-center gap-2 text-sm text-tertiary">
                    <input
                      type="checkbox"
                      checked={Boolean(value)}
                      onChange={(event) => updateValue(field.key, event.target.checked)}
                      disabled={readOnly}
                    />
                    {label}
                  </label>
                );
              }

              if (field.type === 'radio') {
                if (readOnly) {
                  return renderReadOnlyValue(field._id ?? field.key, label, value);
                }

                return (
                  <div key={field._id ?? field.key} className="col-span-2">
                    <label className="block text-sm font-medium text-tertiary mb-2 col-span-2">{label}</label>
                    <div className="flex flex-wrap gap-4">
                      {field.options.map((option) => (
                        <label key={option} className="flex items-center gap-2 text-sm text-tertiary">
                          <input
                            type="radio"
                            name={field.key}
                            value={option}
                            checked={String(value ?? '') === option}
                            onChange={(event) => updateValue(field.key, event.target.value)}
                            disabled={readOnly}
                          />
                          {option}
                        </label>
                      ))}
                    </div>
                  </div>
                );
              }

              if (field.type === 'number') {
                if (readOnly) {
                  return renderReadOnlyValue(field._id ?? field.key, label, value);
                }

                return (
                  <div key={field._id ?? field.key} className='col-span-2'>
                    <InputNumber
                      key={field._id ?? field.key}
                      label={label}
                      value={String(value ?? '')}
                      onChange={(nextValue) => updateValue(field.key, nextValue)}
                      placeholder={field.label}
                      readOnly={readOnly}
                    />
                  </div>
                );
              }

              if (readOnly) {
                return renderReadOnlyValue(field._id ?? field.key, label, value);
              }

              return (
                <div key={field._id ?? field.key} className='col-span-2'>
                  <label className="block text-sm font-medium text-tertiary mb-1 col-span-2">{label}</label>
                  <input
                    type="text"
                    value={String(value ?? '')}
                    onChange={(event) => updateValue(field.key, event.target.value)}
                    readOnly={readOnly}
                    placeholder={field.label}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:border-transparent"
                  />
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}

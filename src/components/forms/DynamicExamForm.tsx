'use client'

import { InputNumber } from '@/components/ui/InputNumber'
import { TemplateFormValues, validateTemplateValues } from '@/lib/examTemplate'
import { ExamTemplateSection } from '@/types/exam-template'
import { useEffect } from 'react'

interface DynamicExamFormProps {
  sections: ExamTemplateSection[]
  values: TemplateFormValues
  onChange: (values: TemplateFormValues) => void
  onValidChange?: (isValid: boolean) => void
  readOnly?: boolean
}

export default function DynamicExamForm({
  sections,
  values,
  onChange,
  onValidChange,
  readOnly = false,
}: DynamicExamFormProps) {
  useEffect(() => {
    onValidChange?.(validateTemplateValues(sections, values))
  }, [sections, values, onValidChange])

  const updateValue = (key: string, value: string | boolean) => {
    onChange({
      ...values,
      [key]: value,
    })
  }

  const renderReference = (referenceValue?: string) =>
    referenceValue ? <p className='mt-1 ml-4 text-xs text-secondary'>{referenceValue}</p> : null

  const renderReadOnlyValue = (
    key: string,
    label: string,
    value: string | boolean | undefined,
    referenceValue?: string,
    className = '',
  ) => (
    <div key={key} className={className}>
      <label className='mb-1 block text-sm font-medium text-tertiary'>{label}</label>
      <p className='flex min-h-12 w-full items-center rounded-xl border border-border-input bg-white px-4 text-base text-primary wrap-break-word'>
        {String(value ?? '').trim() || '-'}
      </p>
      {renderReference(referenceValue)}
    </div>
  )

  return (
    <div className='space-y-6'>
      {sections.map((section, idx) => (
        <section
          key={section._id ?? `${section.title}-${idx}`}
          className='rounded-2xl border border-border-default bg-white px-4 py-4 md:px-5'
        >
          <h3 className='mb-4 text-base font-bold uppercase text-primary'>{section.title}</h3>
          <div className='grid grid-cols-1 gap-x-6 gap-y-4 md:grid-cols-2 lg:grid-cols-4'>
            {section.fields.map(field => {
              const labelBase = field.unit ? `${field.label} (${field.unit})` : field.label
              const value = values[field.key]

              if (field.type === 'textarea') {
                if (readOnly) {
                  return renderReadOnlyValue(
                    field._id ?? field.key,
                    labelBase,
                    value,
                    field.reference_value,
                    'md:col-span-2 lg:col-span-4',
                  )
                }

                return (
                  <div key={field._id ?? field.key} className='md:col-span-2 lg:col-span-4'>
                    <label className='mb-1 block text-sm font-medium text-tertiary'>
                      {labelBase}
                    </label>
                    <textarea
                      value={String(value ?? '')}
                      onChange={event => updateValue(field.key, event.target.value)}
                      readOnly={readOnly}
                      rows={3}
                      placeholder={field.label}
                      className='min-h-35 w-full rounded-xl border border-border-input bg-white px-4 py-3 text-base text-primary placeholder:text-sm placeholder:text-secondary/70 focus:border-brand-primary focus:outline-none'
                    />
                    {renderReference(field.reference_value)}
                  </div>
                )
              }

              if (field.type === 'select') {
                if (readOnly) {
                  return renderReadOnlyValue(
                    field._id ?? field.key,
                    labelBase,
                    value,
                    field.reference_value,
                  )
                }

                return (
                  <div key={field._id ?? field.key}>
                    <label className='mb-1 block text-sm font-medium text-tertiary'>
                      {labelBase}
                    </label>
                    <select
                      value={String(value ?? '')}
                      onChange={event => updateValue(field.key, event.target.value)}
                      disabled={readOnly}
                      className='h-12 w-full rounded-xl border border-border-input bg-white px-4 text-base text-primary focus:border-brand-primary focus:outline-none'
                    >
                      <option value=''>Seleccionar</option>
                      {field.options.map(option => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                    {renderReference(field.reference_value)}
                  </div>
                )
              }

              if (field.type === 'checkbox') {
                if (readOnly) {
                  return (
                    <div key={field._id ?? field.key} className='col-span-2'>
                      <label className='mb-1 block text-sm font-medium text-tertiary'>
                        {labelBase}
                      </label>
                      <p className='flex min-h-12 w-full items-center rounded-xl border border-border-input bg-white px-4 text-base text-primary break-words'>
                        {value ? 'Si' : 'No'}
                      </p>
                      {renderReference(field.reference_value)}
                    </div>
                  )
                }

                return (
                  <label
                    key={field._id ?? field.key}
                    className='flex items-center gap-2 text-sm text-tertiary'
                  >
                    <input
                      type='checkbox'
                      checked={Boolean(value)}
                      onChange={event => updateValue(field.key, event.target.checked)}
                      disabled={readOnly}
                    />
                    {labelBase}
                    {renderReference(field.reference_value)}
                  </label>
                )
              }

              if (field.type === 'radio') {
                if (readOnly) {
                  return renderReadOnlyValue(
                    field._id ?? field.key,
                    labelBase,
                    value,
                    field.reference_value,
                  )
                }

                return (
                  <div key={field._id ?? field.key}>
                    <label className='mb-2 block text-sm font-medium text-tertiary'>
                      {labelBase}
                    </label>
                    <div className='flex flex-wrap gap-4'>
                      {field.options.map(option => (
                        <label
                          key={option}
                          className='flex items-center gap-2 text-sm text-tertiary'
                        >
                          <input
                            type='radio'
                            name={field.key}
                            value={option}
                            checked={String(value ?? '') === option}
                            onChange={event => updateValue(field.key, event.target.value)}
                            disabled={readOnly}
                          />
                          {option}
                        </label>
                      ))}
                    </div>
                    {renderReference(field.reference_value)}
                  </div>
                )
              }

              if (field.type === 'number') {
                if (readOnly) {
                  return renderReadOnlyValue(
                    field._id ?? field.key,
                    labelBase,
                    value,
                    field.reference_value,
                  )
                }

                return (
                  <div key={field._id ?? field.key}>
                    <InputNumber
                      key={field._id ?? field.key}
                      label={labelBase}
                      value={String(value ?? '')}
                      onChange={nextValue => updateValue(field.key, nextValue)}
                      placeholder={field.label}
                      readOnly={readOnly}
                    />
                    {renderReference(field.reference_value)}
                  </div>
                )
              }

              if (readOnly) {
                return renderReadOnlyValue(
                  field._id ?? field.key,
                  labelBase,
                  value,
                  field.reference_value,
                )
              }

              return (
                <div key={field._id ?? field.key}>
                  <label className='mb-1 block text-sm font-medium text-tertiary'>
                    {labelBase}
                  </label>
                  <input
                    type='text'
                    value={String(value ?? '')}
                    onChange={event => updateValue(field.key, event.target.value)}
                    readOnly={readOnly}
                    placeholder={field.label}
                    className='h-12 w-full rounded-xl border border-border-input bg-white px-4 text-base text-primary placeholder:text-sm placeholder:text-secondary/70 focus:border-brand-primary focus:outline-none'
                  />
                  {renderReference(field.reference_value)}
                </div>
              )
            })}
          </div>
        </section>
      ))}
    </div>
  )
}

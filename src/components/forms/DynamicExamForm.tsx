'use client'

import {
  CheckboxInput,
  FieldLabel,
  RadioInput,
  SelectInput,
  TextareaInput,
  TextInput,
} from '@/components/ui/FormField'
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

  const updateNumericValue = (key: string, value: string) => {
    if (!/^\d*([.,]\d*)?$/.test(value)) return
    updateValue(key, value)
  }

  const renderReference = (referenceValue?: string) => {
    if (!referenceValue) return null

    const referenceLabel = /^ref\b/i.test(referenceValue)
      ? referenceValue
      : `Ref: ${referenceValue}`
    return <p className='mt-1 text-xs text-secondary'>{referenceLabel}</p>
  }

  const renderReadOnlyValue = (
    key: string,
    label: string,
    value: string | boolean | undefined,
    referenceValue?: string,
    className = '',
  ) => (
    <div key={key} className={className}>
      <FieldLabel className='font-medium'>{label}</FieldLabel>
      <p className='flex w-full items-center text-primary wrap-break-word font-semibold'>
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
          <div className='grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4'>
            {section.fields.map(field => {
              const labelBase = field.unit ? `${field.label} (${field.unit})` : field.label
              const value = values[field.key]

              if (readOnly) {
                return renderReadOnlyValue(
                  field._id ?? field.key,
                  labelBase,
                  value,
                  field.reference_value,
                )
              }

              if (field.type === 'textarea') {
                return (
                  <div key={field._id ?? field.key} className='md:col-span-2 lg:col-span-4'>
                    <FieldLabel className='font-medium'>{labelBase}</FieldLabel>
                    <TextareaInput
                      value={String(value ?? '')}
                      onChange={event => updateValue(field.key, event.target.value)}
                      rows={3}
                    />
                    {renderReference(field.reference_value)}
                  </div>
                )
              }

              if (field.type === 'select') {
                return (
                  <div key={field._id ?? field.key}>
                    <FieldLabel className='font-medium'>{labelBase}</FieldLabel>
                    <SelectInput
                      value={String(value ?? '')}
                      onChange={event => updateValue(field.key, event.target.value)}
                    >
                      <option value=''>Seleccionar</option>
                      {field.options.map(option => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </SelectInput>
                    {renderReference(field.reference_value)}
                  </div>
                )
              }

              if (field.type === 'checkbox') {
                return (
                  <div key={field._id ?? field.key}>
                    <FieldLabel className='font-medium'>{labelBase}</FieldLabel>
                    <CheckboxInput
                      checked={Boolean(value)}
                      onChange={event => updateValue(field.key, event.target.checked)}
                      label='Si'
                      className='min-h-12'
                    />
                    {renderReference(field.reference_value)}
                  </div>
                )
              }

              if (field.type === 'radio') {
                return (
                  <div key={field._id ?? field.key}>
                    <FieldLabel className='font-medium'>{labelBase}</FieldLabel>
                    <div className='flex min-h-12 flex-wrap items-center gap-4'>
                      {field.options.map(option => (
                        <RadioInput
                          key={option}
                          name={field.key}
                          value={option}
                          checked={String(value ?? '') === option}
                          onChange={event => updateValue(field.key, event.target.value)}
                          label={option}
                        />
                      ))}
                    </div>
                    {renderReference(field.reference_value)}
                  </div>
                )
              }

              return (
                <div key={field._id ?? field.key}>
                  <FieldLabel className='font-medium'>{labelBase}</FieldLabel>
                  <TextInput
                    type={field.type === 'date' ? 'date' : 'text'}
                    inputMode={field.type === 'number' ? 'decimal' : undefined}
                    value={String(value ?? '')}
                    onChange={event => {
                      if (field.type === 'number') {
                        updateNumericValue(field.key, event.target.value)
                        return
                      }

                      updateValue(field.key, event.target.value)
                    }}
                    readOnly={readOnly}
                    className='h-12'
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

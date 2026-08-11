'use client'

import {
  CheckboxInput,
  FieldLabel,
  RadioInput,
  SelectInput,
  TextareaInput,
  TextInput,
} from '@/components/ui/FormField'
import {
  buildFlexibleSelectValue,
  formatTemplateInputValue,
  formatTemplateValue,
  MultiSelectEntry,
  sortMultiSelectEntries,
  TemplateFormValue,
  TemplateFormValues,
  toMultiSelectEntries,
  validateTemplateValues,
} from '@/lib/examTemplate'
import { ExamTemplateSection } from '@/types/exam-template'
import { ChevronDown, Plus, X } from 'lucide-react'
import { useEffect, useState } from 'react'

interface EditableSelectInputProps {
  id: string
  value: string
  options: string[]
  onChange: (value: string) => void
}

function EditableSelectInput({ id, value, options, onChange }: EditableSelectInputProps) {
  const [isOpen, setIsOpen] = useState(false)
  const listId = `${id}-options`

  return (
    <div
      className='relative'
      onBlur={event => {
        if (!event.currentTarget.contains(event.relatedTarget)) setIsOpen(false)
      }}
    >
      <TextInput
        id={id}
        role='combobox'
        aria-autocomplete='list'
        aria-controls={listId}
        aria-expanded={isOpen}
        value={value}
        onChange={event => onChange(event.target.value)}
        onKeyDown={event => {
          if (event.key === 'Escape') setIsOpen(false)
        }}
        placeholder='Selecciona o ingresa un valor'
        className='h-12 pr-11'
      />
      <button
        type='button'
        aria-label={isOpen ? 'Cerrar opciones' : 'Mostrar opciones'}
        onClick={() => setIsOpen(open => !open)}
        className='absolute right-0 top-0 flex h-12 w-11 items-center justify-center text-secondary transition-colors hover:text-brand-primary focus:outline-none'
      >
        <ChevronDown className={`size-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      {isOpen ? (
        <div
          id={listId}
          role='listbox'
          className='absolute z-30 mt-1 max-h-60 w-full overflow-y-auto rounded-xl border border-border-default bg-white p-1 shadow-lg'
        >
          {options.map(option => (
            <button
              key={option}
              type='button'
              role='option'
              aria-selected={value === option}
              onMouseDown={event => event.preventDefault()}
              onClick={() => {
                onChange(option)
                setIsOpen(false)
              }}
              className={`block w-full rounded-lg px-3 py-2 text-left text-sm transition-colors hover:bg-brand-active hover:text-brand-primary ${
                value === option ? 'bg-brand-active text-brand-primary' : 'text-primary'
              }`}
            >
              {option}
            </button>
          ))}
        </div>
      ) : null}
    </div>
  )
}

interface MultiSelectTextInputsProps {
  id: string
  options: string[]
  entries: MultiSelectEntry[]
  onChange: (entries: MultiSelectEntry[]) => void
  /**
   * When the owning field declares `value_options`, each entry also gets a
   * constrained secondary "quantity" select next to its name, and the row
   * label switches to the `Cristales: <nombre>` style used by the fixed
   * crystal `select` fields instead of the numbered "Reporte N:" style.
   */
  valueOptions?: string[]
}

/**
 * Multi-selection where every checked option turns into its own text input,
 * pre-filled with the option name and freely editable so the technician can
 * annotate it (`Quistes de Endolimax nana` -> `Quistes de Endolimax nana: escasos`).
 */
function MultiSelectTextInputs({ id, options, entries, onChange, valueOptions }: MultiSelectTextInputsProps) {
  const [isOpen, setIsOpen] = useState(false)
  const listId = `${id}-options`
  const selectedOptions = new Set(entries.map(entry => entry.option).filter(Boolean))

  const areAllSelected = options.length > 0 && options.every(option => selectedOptions.has(option))

  const toggleOption = (option: string) => {
    const next = selectedOptions.has(option)
      ? entries.filter(entry => entry.option !== option)
      : [...entries, { option, text: option }]

    onChange(sortMultiSelectEntries(next, options))
  }

  /** Clearing keeps hand-typed entries: they are not part of the catalog being toggled. */
  const toggleAllOptions = () => {
    if (areAllSelected) {
      onChange(entries.filter(entry => !entry.option))
      return
    }

    const missingEntries = options
      .filter(option => !selectedOptions.has(option))
      .map(option => ({ option, text: option }))

    onChange(sortMultiSelectEntries([...entries, ...missingEntries], options))
  }

  const updateEntryText = (index: number, text: string) => {
    onChange(entries.map((entry, entryIndex) => (entryIndex === index ? { ...entry, text } : entry)))
  }

  /** Mirrors the plain `select` field's flexible-value logic: an exact catalog
   * match is stored as `option`, anything else is a hand-typed `text`. */
  const updateEntryName = (index: number, inputValue: string) => {
    const matchedOption = options.includes(inputValue) ? inputValue : ''
    onChange(
      entries.map((entry, entryIndex) =>
        entryIndex === index ? { ...entry, option: matchedOption, text: inputValue } : entry,
      ),
    )
  }

  const updateEntryValue = (index: number, value: string) => {
    onChange(entries.map((entry, entryIndex) => (entryIndex === index ? { ...entry, value } : entry)))
  }

  const removeEntry = (index: number) => {
    onChange(entries.filter((_, entryIndex) => entryIndex !== index))
  }

  if (valueOptions?.length) {
    return (
      <div className='space-y-3'>
        {entries.map((entry, index) => (
          <div
            key={`entry-${index}`}
            className='grid grid-cols-[auto_1fr] items-center gap-2 sm:grid-cols-[auto_1fr_10rem_auto]'
          >
            <span className='shrink-0 text-sm font-medium text-secondary/70'>Cristales:</span>
            <EditableSelectInput
              id={`${id}-entry-${index}`}
              value={entry.option || entry.text}
              options={options}
              onChange={inputValue => updateEntryName(index, inputValue)}
            />
            <SelectInput
              aria-label={`Cantidad de ${entry.option || entry.text || 'cristal'}`}
              value={entry.value ?? ''}
              onChange={event => updateEntryValue(index, event.target.value)}
              className='col-start-2 h-12 sm:col-start-3'
            >
              <option value=''>Selecciona</option>
              {valueOptions.map(option => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </SelectInput>
            <button
              type='button'
              aria-label='Quitar cristal'
              onClick={() => removeEntry(index)}
              className='col-start-2 flex size-9 shrink-0 items-center justify-self-end rounded-lg text-secondary transition-colors hover:bg-brand-active hover:text-brand-primary sm:col-start-4 sm:justify-self-auto'
            >
              <X className='size-4' />
            </button>
          </div>
        ))}

        <button
          type='button'
          onClick={() => onChange([...entries, { option: '', text: '', value: '' }])}
          className='flex items-center gap-1 text-sm font-medium text-brand-primary transition-opacity hover:opacity-80'
        >
          <Plus className='size-4' />
          Agregar otro
        </button>
      </div>
    )
  }

  return (
    <div className='space-y-3'>
      <div
        className='relative'
        onBlur={event => {
          if (!event.currentTarget.contains(event.relatedTarget)) setIsOpen(false)
        }}
      >
        <button
          type='button'
          id={id}
          aria-haspopup='listbox'
          aria-controls={listId}
          aria-expanded={isOpen}
          onClick={() => setIsOpen(open => !open)}
          className='flex h-12 w-full items-center justify-between rounded-xl border border-border-input px-3 text-left text-sm text-primary transition-colors hover:border-brand-primary focus:outline-none'
        >
          <span className={selectedOptions.size === 0 ? 'text-secondary' : undefined}>
            {selectedOptions.size === 0
              ? 'Selecciona los hallazgos'
              : `${selectedOptions.size} seleccionado${selectedOptions.size === 1 ? '' : 's'}`}
          </span>
          <ChevronDown className={`size-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        </button>
        {isOpen ? (
          <div
            id={listId}
            role='listbox'
            aria-multiselectable
            className='absolute z-30 mt-1 max-h-60 w-full overflow-y-auto rounded-xl border border-border-default bg-white p-1 shadow-lg'
          >
            <button
              type='button'
              onMouseDown={event => event.preventDefault()}
              onClick={toggleAllOptions}
              className='mb-1 flex w-full items-center gap-2 border-b border-border-default px-3 py-2 text-left text-sm font-medium text-brand-primary transition-colors hover:bg-brand-active'
            >
              <span
                aria-hidden
                className={`flex size-4 shrink-0 items-center justify-center rounded border ${
                  areAllSelected
                    ? 'border-brand-primary bg-brand-primary text-white'
                    : 'border-border-input'
                }`}
              >
                {areAllSelected ? '✓' : null}
              </span>
              {areAllSelected ? 'Quitar todos' : 'Seleccionar todos'}
            </button>
            {options.map(option => (
              <button
                key={option}
                type='button'
                role='option'
                aria-selected={selectedOptions.has(option)}
                onMouseDown={event => event.preventDefault()}
                onClick={() => toggleOption(option)}
                className={`flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm transition-colors hover:bg-brand-active hover:text-brand-primary ${
                  selectedOptions.has(option) ? 'bg-brand-active text-brand-primary' : 'text-primary'
                }`}
              >
                <span
                  aria-hidden
                  className={`flex size-4 shrink-0 items-center justify-center rounded border ${
                    selectedOptions.has(option)
                      ? 'border-brand-primary bg-brand-primary text-white'
                      : 'border-border-input'
                  }`}
                >
                  {selectedOptions.has(option) ? '✓' : null}
                </span>
                {option}
              </button>
            ))}
          </div>
        ) : null}
      </div>

      {entries.map((entry, index) => (
        <div key={entry.option || `custom-${index}`} className='flex items-center gap-2'>
          {/* Same tone as the field placeholders (`placeholder:text-secondary/70`). */}
          <span className='shrink-0 text-sm font-medium text-secondary/70'>
            {`Reporte ${index + 1}:`}
          </span>
          {entry.option ? (
            <p className='w-full wrap-break-word text-primary'>{entry.option}</p>
          ) : (
            // Hand-typed findings still need an input: they have no catalog option to show.
            <TextInput
              value={entry.text}
              onChange={event => updateEntryText(index, event.target.value)}
              placeholder='Describe el hallazgo'
              className='h-10'
            />
          )}
          <button
            type='button'
            aria-label={`Quitar reporte ${index + 1}`}
            onClick={() => removeEntry(index)}
            className='flex size-9 shrink-0 items-center justify-center rounded-lg text-secondary transition-colors hover:bg-brand-active hover:text-brand-primary'
          >
            <X className='size-4' />
          </button>
        </div>
      ))}

      <button
        type='button'
        onClick={() => onChange([...entries, { option: '', text: '', value: '' }])}
        className='flex items-center gap-1 text-sm font-medium text-brand-primary transition-opacity hover:opacity-80'
      >
        <Plus className='size-4' />
        Agregar otro
      </button>
    </div>
  )
}

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

  const updateValue = (key: string, value: TemplateFormValue) => {
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
    value: TemplateFormValue | undefined,
    referenceValue?: string,
    className = '',
    valueOptions?: string[],
  ) => (
    <div key={key} className={className}>
      <FieldLabel className='font-medium'>{label}</FieldLabel>
      <p className='flex w-full items-center text-primary wrap-break-word font-semibold'>
        {formatTemplateValue(value, valueOptions) || '-'}
      </p>
      {renderReference(referenceValue)}
    </div>
  )

  const renderReadOnlyMultiSelectValue = (
    key: string,
    label: string,
    value: TemplateFormValue | undefined,
    referenceValue?: string,
    valueOptions?: string[],
  ) => {
    const entries = toMultiSelectEntries(value)
      .map(entry => ({ name: (entry.option || entry.text).trim(), value: entry.value?.trim() }))
      .filter(entry => entry.name)

    if (!valueOptions?.length) {
      return renderReadOnlyValue(key, label, value, referenceValue)
    }

    return (
      <div key={key} className='grid grid-cols-1 gap-6 md:col-span-2 md:grid-cols-2 lg:col-span-4 lg:grid-cols-4'>
        {entries.length > 0 ? (
          entries.map((entry, index) => (
            <div key={`${entry.name}-${index}`}>
              <FieldLabel className='font-medium'>Cristales: {entry.name}</FieldLabel>
              <p className='flex w-full items-center text-primary wrap-break-word font-semibold'>
                {entry.value || '-'}
              </p>
            </div>
          ))
        ) : (
          <div>
            <FieldLabel className='font-medium'>{label}</FieldLabel>
            <p className='flex w-full items-center text-primary wrap-break-word font-semibold'>-</p>
          </div>
        )}
        {referenceValue ? (
          <div className='md:col-span-2 lg:col-span-4'>{renderReference(referenceValue)}</div>
        ) : null}
      </div>
    )
  }

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
                if (field.type === 'multiselect') {
                  return renderReadOnlyMultiSelectValue(
                    field._id ?? field.key,
                    labelBase,
                    value,
                    field.reference_value,
                    field.value_options,
                  )
                }

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
                    <FieldLabel htmlFor={field.key} className='font-medium'>
                      {labelBase}
                    </FieldLabel>
                    <EditableSelectInput
                      id={field.key}
                      value={formatTemplateInputValue(value)}
                      options={field.options}
                      onChange={inputValue => {
                        const selectedOption = field.options.includes(inputValue) ? inputValue : ''
                        updateValue(
                          field.key,
                          buildFlexibleSelectValue(selectedOption, selectedOption ? '' : inputValue),
                        )
                      }}
                    />
                    {renderReference(field.reference_value)}
                  </div>
                )
              }

              if (field.type === 'multiselect') {
                return (
                  <div key={field._id ?? field.key} className='md:col-span-2 lg:col-span-4'>
                    <FieldLabel htmlFor={field.key} className='font-medium'>
                      {labelBase}
                    </FieldLabel>
                    <MultiSelectTextInputs
                      id={field.key}
                      options={field.options}
                      entries={toMultiSelectEntries(value)}
                      onChange={entries => updateValue(field.key, entries)}
                      valueOptions={field.value_options}
                    />
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

'use client'

import {
  CheckboxInput,
  FieldLabel,
  RadioInput,
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
import { Check, ChevronDown, Pencil, Plus, X } from 'lucide-react'
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
function MultiSelectTextInputs({
  id,
  options,
  entries,
  onChange,
  valueOptions,
}: MultiSelectTextInputsProps) {
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
    onChange(
      entries.map((entry, entryIndex) => (entryIndex === index ? { ...entry, text } : entry)),
    )
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
    onChange(
      entries.map((entry, entryIndex) => (entryIndex === index ? { ...entry, value } : entry)),
    )
  }

  const removeEntry = (index: number) => {
    onChange(entries.filter((_, entryIndex) => entryIndex !== index))
  }

  if (valueOptions?.length) {
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
                ? 'Selecciona los cristales'
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
                    selectedOptions.has(option)
                      ? 'bg-brand-active text-brand-primary'
                      : 'text-primary'
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
          <div
            key={`entry-${index}`}
            className='grid grid-cols-[auto_1fr] items-center gap-2 sm:grid-cols-[auto_3fr_2fr_auto]'
          >
            <span className='shrink-0 text-sm font-medium text-secondary/70'>Cristales:</span>
            <TextInput
              id={`${id}-entry-${index}`}
              value={entry.option || entry.text}
              onChange={event => updateEntryName(index, event.target.value)}
              placeholder='Nombre del cristal'
              className='h-12'
            />
            <div className='col-start-2 sm:col-start-3'>
              <EditableSelectInput
                id={`${id}-entry-${index}-value`}
                value={entry.value ?? ''}
                options={valueOptions}
                onChange={inputValue => updateEntryValue(index, inputValue)}
              />
            </div>
            <button
              type='button'
              aria-label='Quitar cristal'
              onClick={() => removeEntry(index)}
              className='col-start-2 flex size-9 shrink-0 cursor-pointer items-center justify-center justify-self-end rounded-lg text-secondary transition-colors hover:bg-brand-active hover:text-brand-primary sm:col-start-4 sm:justify-self-auto'
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
                  selectedOptions.has(option)
                    ? 'bg-brand-active text-brand-primary'
                    : 'text-primary'
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
  onSectionsChange: (sections: ExamTemplateSection[]) => void
  onValidChange?: (isValid: boolean) => void
  readOnly?: boolean
}

export default function DynamicExamForm({
  sections,
  values,
  onChange,
  onSectionsChange,
  onValidChange,
  readOnly = false,
}: DynamicExamFormProps) {
  const [editingCustomFieldKey, setEditingCustomFieldKey] = useState<string | null>(null)

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

  const addCustomField = (sectionIndex: number) => {
    const key = `custom_${crypto.randomUUID().replaceAll('-', '')}`
    onSectionsChange(
      sections.map((section, index) =>
        index === sectionIndex
          ? {
              ...section,
              fields: [
                ...section.fields,
                { key, label: '', type: 'text', options: [], is_custom: true },
              ],
            }
          : section,
      ),
    )
    updateValue(key, '')
    setEditingCustomFieldKey(key)
  }

  const updateCustomField = (
    sectionIndex: number,
    key: string,
    changes: { label?: string; unit?: string; reference_value?: string },
  ) => {
    onSectionsChange(
      sections.map((section, index) =>
        index === sectionIndex
          ? {
              ...section,
              fields: section.fields.map(field =>
                field.key === key ? { ...field, ...changes } : field,
              ),
            }
          : section,
      ),
    )
  }

  const removeCustomField = (sectionIndex: number, key: string) => {
    onSectionsChange(
      sections.map((section, index) =>
        index === sectionIndex
          ? { ...section, fields: section.fields.filter(field => field.key !== key) }
          : section,
      ),
    )
    const nextValues = { ...values }
    delete nextValues[key]
    onChange(nextValues)
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
    hideLabel = false,
    className = '',
    valueOptions?: string[],
  ) => (
    <div key={key} className={className}>
      {!hideLabel ? <FieldLabel className='font-medium'>{label}</FieldLabel> : null}
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

    return (
      <div
        key={key}
        className='grid grid-cols-1 gap-6 md:col-span-2 md:grid-cols-2 lg:col-span-4 lg:grid-cols-4'
      >
        {entries.length > 0 ? (
          entries.map((entry, index) => (
            <div key={`${entry.name}-${index}`}>
              <FieldLabel className='font-medium'>
                {valueOptions?.length ? `Cristales: ${entry.name}` : `Reporte ${index + 1}`}
              </FieldLabel>
              <p className='flex w-full items-center text-primary wrap-break-word font-semibold'>
                {valueOptions?.length ? entry.value || '-' : entry.name}
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
              const hidesRepeatedObservationLabel =
                section.title.trim().toLocaleLowerCase('es') === 'observaciones' &&
                field.label.trim().toLocaleLowerCase('es') === 'observación'

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
                  hidesRepeatedObservationLabel,
                )
              }

              if (field.is_custom) {
                return (
                  <div key={field.key}>
                    {editingCustomFieldKey === field.key ? (
                      <div className='mb-1 grid grid-cols-[minmax(0,13fr)_minmax(0,7fr)_auto_auto] items-center gap-1'>
                        <TextInput
                          id={`${field.key}-label`}
                          type='text'
                          aria-label='Título del campo adicional'
                          value={field.label}
                          onChange={event =>
                            updateCustomField(idx, field.key, { label: event.target.value })
                          }
                          placeholder='Título'
                          className='h-6 min-h-0! rounded-md px-2 py-0 text-xs font-medium'
                        />
                        <TextInput
                          id={`${field.key}-unit`}
                          type='text'
                          aria-label='Unidad del campo adicional'
                          value={field.unit ?? ''}
                          onChange={event =>
                            updateCustomField(idx, field.key, { unit: event.target.value })
                          }
                          placeholder='Unidad'
                          className='h-6 min-h-0! rounded-md px-2 py-0 text-xs'
                        />
                        <button
                          type='button'
                          aria-label='Terminar edición'
                          onClick={() => setEditingCustomFieldKey(null)}
                          className='flex size-5 items-center justify-center text-green-600 transition-colors hover:text-green-700'
                        >
                          <Check className='size-3.5' />
                        </button>
                        <button
                          type='button'
                          aria-label='Eliminar campo adicional'
                          onClick={() => {
                            removeCustomField(idx, field.key)
                            setEditingCustomFieldKey(null)
                          }}
                          className='flex size-5 items-center justify-center text-secondary transition-colors hover:text-red-600'
                        >
                          <X className='size-3.5' />
                        </button>
                      </div>
                    ) : (
                      <div className='group mb-1 flex items-center gap-1'>
                        <FieldLabel className='mb-0 font-medium'>
                          {labelBase || 'Nuevo campo'}
                        </FieldLabel>
                        <button
                          type='button'
                          aria-label='Editar título, unidad y referencia'
                          onClick={() => setEditingCustomFieldKey(field.key)}
                          className='flex size-4 cursor-pointer items-center justify-center text-secondary opacity-0 transition-opacity group-hover:opacity-100 focus:opacity-100'
                        >
                          <Pencil className='size-3' />
                        </button>
                        <button
                          type='button'
                          aria-label='Eliminar campo adicional'
                          onClick={() => removeCustomField(idx, field.key)}
                          className='flex size-4 cursor-pointer items-center justify-center text-secondary opacity-0 transition-all group-hover:opacity-100 hover:text-red-600 focus:opacity-100'
                        >
                          <X className='size-3.5' />
                        </button>
                      </div>
                    )}
                    <TextInput
                      id={field.key}
                      type='text'
                      aria-label='Valor del campo adicional'
                      value={String(value ?? '')}
                      onChange={event => updateValue(field.key, event.target.value)}
                      placeholder='Valor'
                      className='h-12'
                    />
                    {editingCustomFieldKey === field.key ? (
                      <div className='relative mt-1'>
                        <span className='pointer-events-none absolute left-2 top-1/2 z-10 -translate-y-1/2 text-xs text-secondary'>
                          Ref:
                        </span>
                        <TextInput
                          id={`${field.key}-reference`}
                          type='text'
                          aria-label='Referencia del campo adicional'
                          value={field.reference_value ?? ''}
                          onChange={event =>
                            updateCustomField(idx, field.key, {
                              reference_value: event.target.value,
                            })
                          }
                          placeholder='-'
                          className='h-6 min-h-0! rounded-md py-0 pr-2 pl-8 text-xs text-secondary'
                        />
                      </div>
                    ) : (
                      <p className='mt-1 text-xs text-secondary'>
                        Ref: {field.reference_value || '-'}
                      </p>
                    )}
                  </div>
                )
              }

              if (field.type === 'textarea') {
                return (
                  <div key={field._id ?? field.key} className='md:col-span-2 lg:col-span-4'>
                    {!hidesRepeatedObservationLabel ? (
                      <FieldLabel className='font-medium'>{labelBase}</FieldLabel>
                    ) : null}
                    <TextareaInput
                      aria-label={labelBase}
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
                          buildFlexibleSelectValue(
                            selectedOption,
                            selectedOption ? '' : inputValue,
                          ),
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
          {!readOnly ? (
            <button
              type='button'
              onClick={() => addCustomField(idx)}
              className='mt-4 flex items-center gap-2 text-sm font-semibold text-brand-primary transition-opacity hover:opacity-80'
            >
              <Plus className='size-4' />
              Añadir otro campo
            </button>
          ) : null}
        </section>
      ))}
    </div>
  )
}

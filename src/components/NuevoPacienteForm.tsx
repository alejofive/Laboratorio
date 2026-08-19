'use client'

import {
  useCreateOrder,
  useCreatePatient,
  useExams,
  useOrders,
  usePatientById,
  usePatients,
} from '@/data/createPatients'
import { newPatientRequestSchema, NewPatientRequestValues } from '@/lib/validations/patient'
import { zodResolver } from '@hookform/resolvers/zod'
import { useQueryClient } from '@tanstack/react-query'
import { useEffect, useMemo, useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'react-hot-toast'
import DetallePaciente from './DetallePaciente'
import { PillFilter } from './PillFilter'
import TopResumen from './TopResumen'
import { Button } from './ui/Button'
import { FieldLabel, getFieldButtonClass, SelectInput, TextInput } from './ui/FormField'
import SvgIcon from './ui/SvgIcon'

type GrupoExamen = 'hematologia' | 'quimica' | 'serologia' | 'orina_heces' | 'paneles' | 'perfiles'
type FiltroExamen = 'todos' | GrupoExamen

type ExamItem = {
  templateId: string
  label: string
  group: GrupoExamen
}

const normalizeText = (value: string) =>
  value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()

const categoryToGroup: Record<string, GrupoExamen> = {
  hematologia: 'hematologia',
  'quimica sanguinea': 'quimica',
  'inmunologia y serologia': 'serologia',
  'coprologia y uroanalisis': 'orina_heces',
  'perfiles combinados': 'paneles',
}

const toApiDate = (date: Date) => {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

const formatDisplayDate = (value: string) => {
  if (!value) return ''

  const [year, month, day] = value.split('-')
  if (!year || !month || !day) return value

  return `${day}/${month}/${year}`
}

const parseApiDate = (value: string) => {
  if (!value) return undefined

  const [year, month, day] = value.split('-').map(Number)
  if (!year || !month || !day) return undefined

  return new Date(year, month - 1, day)
}

const birthMonths = [
  'Enero',
  'Febrero',
  'Marzo',
  'Abril',
  'Mayo',
  'Junio',
  'Julio',
  'Agosto',
  'Septiembre',
  'Octubre',
  'Noviembre',
  'Diciembre',
]

const getDaysInMonth = (year: number, month: number) => new Date(year, month, 0).getDate()

export default function NuevoPacienteForm() {
  const queryClient = useQueryClient()
  const {
    register,
    handleSubmit,
    getValues,
    reset,
    setValue,
    watch,
    formState: { errors, isValid },
  } = useForm<NewPatientRequestValues>({
    resolver: zodResolver(newPatientRequestSchema),
    mode: 'onChange',
    defaultValues: {
      nombre: '',
      fechaNacimiento: '',
      sexo: '',
      telefono: '',
      cedula: '',
      direccion: '',
      correo: '',
      apellido: '',
      observaciones: '',
      examenes: [],
    },
  })

  const examenesSeleccionados = watch('examenes')
  const [searchTerm, setSearchTerm] = useState('')
  const [searchExam, setSearchExam] = useState('')
  const [activeCategory, setActiveCategory] = useState<FiltroExamen>('todos')
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [selectedPatientId, setSelectedPatientId] = useState<string | null>(null)
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('')
  const [showBirthDatePicker, setShowBirthDatePicker] = useState(false)
  const [birthDateDraft, setBirthDateDraft] = useState({ day: '', month: '', year: '' })
  const [ageDraft, setAgeDraft] = useState('')
  const [birthInputMode, setBirthInputMode] = useState<'age' | 'date'>('age')
  const birthDatePickerRef = useRef<HTMLDivElement>(null)
  const cedulaValue = watch('cedula')
  const birthDateValue = watch('fechaNacimiento')

  const { data: examsData } = useExams()
  const todayApiDate = useMemo(() => {
    const today = new Date()
    const year = today.getFullYear()
    const month = String(today.getMonth() + 1).padStart(2, '0')
    const day = String(today.getDate()).padStart(2, '0')
    return `${year}-${month}-${day}`
  }, [])

  const { data: ordersToday = [] } = useOrders({
    page: 1,
    limit: 100,
    start_date: todayApiDate,
    end_date: todayApiDate,
  })

  const resumenHoy = useMemo(() => {
    const totalParaImprimir = ordersToday.filter(
      order => order.status === 'completed' || order.status === 'sent',
    ).length
    const totalSolicitudes = ordersToday.length - totalParaImprimir

    return {
      totalSolicitudes,
      totalParaImprimir,
    }
  }, [ordersToday])

  const shouldShowResults = debouncedSearchTerm.trim().length >= 2
  const isSearching = searchTerm.trim().length > 0
  const { data: patientsData, isLoading: isLoadingPatients } = usePatients({
    page: 1,
    limit: 10,
    search: shouldShowResults ? debouncedSearchTerm : '',
  })
  const { data: selectedPatientDetail, isLoading: isLoadingPatientDetail } =
    usePatientById(selectedPatientId)

  const createPatientMutation = useCreatePatient()
  const createOrderMutation = useCreateOrder()

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      setDebouncedSearchTerm(searchTerm.trim())
    }, 350)

    return () => window.clearTimeout(timeoutId)
  }, [searchTerm])

  const results = patientsData?.data ?? []

  const selectedPatient = useMemo(
    () => results.find(patient => patient._id === selectedPatientId) ?? null,
    [results, selectedPatientId],
  )

  useEffect(() => {
    if (!selectedPatientDetail) return

    setValue('cedula', selectedPatientDetail.document_number ?? '', { shouldValidate: true })
    setValue('nombre', selectedPatientDetail.first_name ?? '')
    setValue('apellido', selectedPatientDetail.last_name ?? '')
    setValue('telefono', selectedPatientDetail.phone ?? '')
    setValue('direccion', selectedPatientDetail.address ?? '')
    setValue('correo', selectedPatientDetail.email ?? '')

    if (selectedPatientDetail.birth_date) {
      setValue('fechaNacimiento', selectedPatientDetail.birth_date.split('T')[0])
    }
  }, [selectedPatientDetail, setValue])

  const selectedPatientCard = selectedPatientDetail ?? selectedPatient

  const EXAM_CATEGORIES: { key: FiltroExamen; label: string; iconSrc?: string }[] = [
    { key: 'todos', label: 'Todos' },
    { key: 'hematologia', label: 'Hematología', iconSrc: '/svg/examenes/hematologia.svg' },
    { key: 'quimica', label: 'Química', iconSrc: '/svg/examenes/quimica.svg' },
    { key: 'serologia', label: 'Serología e Infecciosos', iconSrc: '/svg/examenes/serologia.svg' },
    { key: 'orina_heces', label: 'Orina y heces', iconSrc: '/svg/examenes/Muestras.svg' },
    { key: 'paneles', label: 'Paneles Combinados ', iconSrc: '/svg/examenes/Combinados.svg' },
    { key: 'perfiles', label: 'Perfiles Completos', iconSrc: '/svg/examenes/perfil-completo.svg' },
  ]

  const allExams = useMemo<ExamItem[]>(() => {
    if (!examsData?.categories) return []

    return examsData.categories.flatMap(category => {
      const normalizedCategoryName = normalizeText(category.name)
      const group = categoryToGroup[normalizedCategoryName] ?? 'perfiles'

      return category.exams.map(exam => ({
        templateId: exam.id,
        label: exam.name,
        group,
      }))
    })
  }, [examsData])

  const examCountByCategory: Record<FiltroExamen, number> = {
    todos: allExams.length,
    hematologia: allExams.filter(exam => exam.group === 'hematologia').length,
    quimica: allExams.filter(exam => exam.group === 'quimica').length,
    serologia: allExams.filter(exam => exam.group === 'serologia').length,
    orina_heces: allExams.filter(exam => exam.group === 'orina_heces').length,
    paneles: allExams.filter(exam => exam.group === 'paneles').length,
    perfiles: allExams.filter(exam => exam.group === 'perfiles').length,
  }

  const normalizedSearchExam = normalizeText(searchExam)

  const visibleExams = allExams.filter(exam => {
    const byText = normalizeText(exam.label).includes(normalizedSearchExam)

    if (normalizedSearchExam) {
      return byText
    }

    return activeCategory === 'todos' || exam.group === activeCategory
  })

  const selectedExams = examenesSeleccionados || []
  const selectedBirthDate = useMemo(() => parseApiDate(birthDateValue), [birthDateValue])
  const birthDateLabel = birthDateValue ? formatDisplayDate(birthDateValue) : 'Seleccionar fecha'
  const currentDate = new Date()
  const currentYear = currentDate.getFullYear()
  const currentMonth = currentDate.getMonth() + 1
  const currentDay = currentDate.getDate()
  const birthYearOptions = useMemo(
    () => Array.from({ length: currentYear - 1919 }, (_, index) => currentYear - index),
    [currentYear],
  )
  const birthMonthOptions =
    Number(birthDateDraft.year) === currentYear ? birthMonths.slice(0, currentMonth) : birthMonths
  const birthDraftYear = Number(birthDateDraft.year) || currentYear
  const birthDraftMonth = Number(birthDateDraft.month) || 1
  const birthMaxDay =
    birthDraftYear === currentYear && birthDraftMonth === currentMonth
      ? currentDay
      : getDaysInMonth(birthDraftYear, birthDraftMonth)
  const birthDayOptions = Array.from({ length: birthMaxDay }, (_, index) => index + 1)
  const shouldShowSelected = selectedExams.length > 0
  const canCreateFromSearch = Boolean(selectedPatientId) && selectedExams.length > 0
  const canCreateFromForm = showCreateForm && isValid && selectedExams.length > 0
  const isSubmittingRequest = createPatientMutation.isPending || createOrderMutation.isPending
  const isSubmitDisabled = !(canCreateFromSearch || canCreateFromForm)

  const onSearchTermChange = (value: string) => {
    setSearchTerm(value)
  }

  const onSelectPatient = (patient: (typeof results)[number]) => {
    setValue('cedula', patient.document_number, { shouldValidate: true })
    setValue('nombre', patient.first_name)
    setValue('apellido', patient.last_name)
    setValue('telefono', patient.phone)
    setValue('direccion', '')
    setValue('correo', patient.email ?? '')
    setSelectedPatientId(patient._id)
    setShowCreateForm(false)
    setSearchTerm('')

    toast.success(`Se cargaron los datos de ${patient.first_name} ${patient.last_name}`)
  }

  useEffect(() => {
    if (!showBirthDatePicker) return

    if (selectedBirthDate) {
      setBirthDateDraft({
        day: String(selectedBirthDate.getDate()),
        month: String(selectedBirthDate.getMonth() + 1),
        year: String(selectedBirthDate.getFullYear()),
      })
    }

    const handleClickOutside = (event: MouseEvent) => {
      if (!birthDatePickerRef.current?.contains(event.target as Node)) {
        setShowBirthDatePicker(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [selectedBirthDate, showBirthDatePicker])

  const onCreatePatient = () => {
    reset({
      nombre: '',
      apellido: '',
      fechaNacimiento: '',
      sexo: '',
      telefono: '',
      cedula: '',
      direccion: '',
      correo: '',
      observaciones: '',
      examenes: [],
    })
    setSelectedPatientId(null)
    setShowCreateForm(true)
    setShowBirthDatePicker(false)
    setBirthDateDraft({ day: '', month: '', year: '' })
    setAgeDraft('')
    setBirthInputMode('age')
    setSearchTerm('')
  }

  const onClearPatient = () => {
    setSelectedPatientId(null)
    setShowCreateForm(false)
    setShowBirthDatePicker(false)
    setBirthDateDraft({ day: '', month: '', year: '' })
    setAgeDraft('')
    setBirthInputMode('age')
    setSearchTerm('')
  }

  const onBirthDatePartChange = (part: 'day' | 'month' | 'year', value: string) => {
    setAgeDraft('')

    const nextParts = {
      ...birthDateDraft,
      [part]: value,
    }

    if (!nextParts.day || !nextParts.month || !nextParts.year) {
      setBirthDateDraft(nextParts)
      return
    }

    const year = Number(nextParts.year)
    const month = Math.min(Number(nextParts.month), year === currentYear ? currentMonth : 12)
    const maxDay =
      year === currentYear && month === currentMonth ? currentDay : getDaysInMonth(year, month)
    const day = Math.min(Number(nextParts.day), maxDay)

    setBirthDateDraft({ ...nextParts, day: String(day), month: String(month) })

    setValue('fechaNacimiento', toApiDate(new Date(year, month - 1, day)), {
      shouldDirty: true,
      shouldValidate: true,
    })
  }

  const onBirthDateClear = () => {
    setValue('fechaNacimiento', '', { shouldDirty: true, shouldValidate: true })
    setBirthDateDraft({ day: '', month: '', year: '' })
    setAgeDraft('')
  }

  const onBirthInputModeChange = (mode: 'age' | 'date') => {
    if (mode === birthInputMode) return

    onBirthDateClear()
    setShowBirthDatePicker(false)
    setBirthInputMode(mode)
  }

  const onAgeChange = (value: string) => {
    const age = value.replace(/\D/g, '')
    const maxAge = currentYear - 1920

    if (!age) {
      onBirthDateClear()
      return
    }

    const normalizedAge = String(Math.min(Number(age), maxAge))
    const birthYear = currentYear - Number(normalizedAge)

    setAgeDraft(normalizedAge)
    setBirthDateDraft({ day: '1', month: '1', year: String(birthYear) })
    setValue('fechaNacimiento', `${birthYear}-01-01`, {
      shouldDirty: true,
      shouldValidate: true,
    })
  }

  const toggleExamen = (templateId: string) => {
    const current = examenesSeleccionados || []
    const newExamenes = current.includes(templateId)
      ? current.filter(id => id !== templateId)
      : [...current, templateId]
    setValue('examenes', newExamenes, { shouldValidate: true })
  }

  const onSubmit = async (data: NewPatientRequestValues) => {
    try {
      const selectedTemplates = selectedExams

      if (selectedTemplates.length === 0) {
        toast.error('Debes seleccionar al menos un examen valido')
        return
      }

      let patientId = ''

      if (showCreateForm) {
        const created = await createPatientMutation.mutateAsync({
          first_name: data.nombre.trim(),
          last_name: data.apellido.trim(),
          document_number: `V-${data.cedula.trim()}`,
          birth_date: data.fechaNacimiento,
          sex: data.sexo,
          phone: data.telefono.trim(),
          address: data.direccion.trim(),
          ...(data.correo.trim() ? { email: data.correo.trim() } : {}),
        })

        patientId = created._id
      } else {
        if (!selectedPatientId) {
          toast.error('No se encontro el paciente en API para crear la orden')
          return
        }

        patientId = selectedPatientId
      }

      const observaciones = data.observaciones.trim()
      const orderPayload = {
        patient_id: patientId,
        exam_template_ids: selectedTemplates,
        ...(observaciones ? { notes: observaciones } : {}),
      }

      await createOrderMutation.mutateAsync(orderPayload)

      await queryClient.invalidateQueries({ queryKey: ['orders-api'] })

      onClearPatient()
      reset()
      toast.success('Solicitud creada exitosamente')
    } catch {
      toast.error('No se pudo crear la solicitud')
    }
  }

  const onSubmitExistingPatient = async () => {
    try {
      if (!selectedPatientId) {
        toast.error('No se encontro el paciente en API para crear la orden')
        return
      }

      const selectedTemplates = selectedExams

      if (selectedTemplates.length === 0) {
        toast.error('Debes seleccionar al menos un examen valido')
        return
      }

      const observaciones = getValues('observaciones').trim()
      const orderPayload = {
        patient_id: selectedPatientId,
        exam_template_ids: selectedTemplates,
        ...(observaciones ? { notes: observaciones } : {}),
      }

      await createOrderMutation.mutateAsync(orderPayload)

      await queryClient.invalidateQueries({ queryKey: ['orders-api'] })

      onClearPatient()
      reset()
      toast.success('Solicitud creada exitosamente')
    } catch {
      toast.error('No se pudo crear la solicitud')
    }
  }

  return (
    <div className='w-full'>
      <TopResumen
        totalSolicitudes={resumenHoy.totalSolicitudes}
        totalParaImprimir={resumenHoy.totalParaImprimir}
      />

      <section className='bg-surface border-border-default border rounded-3xl p-4 mt-6 mb-4'>
        {!showCreateForm ? (
          <div className='flex flex-wrap items-center gap-4'>
            {selectedPatientCard || isLoadingPatientDetail ? (
              <div className='w-full'>
                <DetallePaciente
                  paciente={selectedPatientCard ?? undefined}
                  isLoading={isLoadingPatientDetail}
                  onClearPatient={onClearPatient}
                />
              </div>
            ) : (
              <div className='w-full'>
                <h2 className='mb-3 text-xl font-semibold leading-none text-primary'>
                  Buscar un paciente o crear solicitud
                </h2>
                <div className='flex items-center gap-3 justify-between'>
                  <div className='border-border-input relative bg-surface min-w-72 flex-1 rounded-xl border px-5 py-3 leading-none'>
                    <input
                      className='text-secondary w-full bg-transparent pr-8 outline-none'
                      value={searchTerm}
                      onChange={event => onSearchTermChange(event.target.value)}
                      placeholder='Buscar por cédula, nombre o teléfono...'
                    />
                    {searchTerm ? (
                      <button
                        type='button'
                        className='text-secondary absolute right-4 top-2 text-xl'
                        onClick={() => onSearchTermChange('')}
                      >
                        ×
                      </button>
                    ) : null}

                    {shouldShowResults ? (
                      <div className='border-border-default bg-white z-20 mt-2 rounded-3xl border absolute top-10 left-0 right-0'>
                        {results.length > 0 ? (
                          results.map((result, index) => (
                            <button
                              key={result._id}
                              type='button'
                              onClick={() => onSelectPatient(result)}
                              className={`flex w-full items-center hover:bg-gray-200 cursor-pointer z-0 justify-between px-4 py-3 text-left ${index > 0 ? 'border-t border-border-default' : ''}`}
                            >
                              <span className='text-tertiary text-base'>
                                {result.first_name} {result.last_name} · {result.document_number} ·{' '}
                                {result.phone} · {result.age} años
                              </span>
                            </button>
                          ))
                        ) : isLoadingPatients ? (
                          <p className='text-secondary px-4 py-3 text-base'>
                            Buscando pacientes...
                          </p>
                        ) : (
                          <p className='text-secondary px-4 py-3 text-base'>
                            No se encontraron pacientes.
                          </p>
                        )}
                      </div>
                    ) : null}
                  </div>

                  <div
                    className={`origin-right overflow-hidden transition-all duration-300 ease-out ${isSearching ? 'pointer-events-none max-w-0 scale-95 opacity-0' : 'max-w-xs scale-100 opacity-100'}`}
                    aria-hidden={isSearching}
                  >
                    <Button
                      className='cursor-pointer whitespace-nowrap rounded-2xl'
                      onClick={onCreatePatient}
                    >
                      <SvgIcon src='/svg/plus.svg' size={24} /> Crear paciente nuevo
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>
        ) : null}

        {showCreateForm ? (
          <form onSubmit={handleSubmit(onSubmit)} className='space-y-6'>
            <div className=''>
              <button
                type='button'
                className='text-tertiary mb-4 text-base flex items-center gap-2 cursor-pointer'
                onClick={onClearPatient}
              >
                <SvgIcon src='/svg/arrow-back.svg' size={20} />
                <span className='text-secondary text-base'>Volver a buscar</span>
              </button>
              <h2 className='mb-3 text-xl font-semibold leading-none'>Nuevo paciente</h2>

              <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
                <div>
                  <FieldLabel>Cédula</FieldLabel>
                  <TextInput
                    type='text'
                    inputMode='numeric'
                    value={cedulaValue}
                    onChange={e =>
                      setValue('cedula', e.target.value.replace(/\D/g, ''), {
                        shouldValidate: true,
                      })
                    }
                    error={Boolean(errors.cedula)}
                    placeholder='Ingrese cédula'
                  />
                  {errors.cedula && (
                    <p className='text-red-500 text-xs mt-1'>{errors.cedula.message}</p>
                  )}
                </div>

                <div>
                  <FieldLabel>Nombres</FieldLabel>
                  <TextInput
                    type='text'
                    {...register('nombre')}
                    error={Boolean(errors.nombre)}
                    placeholder='Ingrese nombres'
                  />
                  {errors.nombre && (
                    <p className='text-red-500 text-xs mt-1'>{errors.nombre.message}</p>
                  )}
                </div>

                <div>
                  <FieldLabel>Apellidos</FieldLabel>
                  <TextInput
                    type='text'
                    {...register('apellido')}
                    error={Boolean(errors.apellido)}
                    placeholder='Ingrese apellidos'
                  />
                  {errors.apellido && (
                    <p className='text-red-500 text-xs mt-1'>{errors.apellido.message}</p>
                  )}
                </div>

                <div>
                  <input type='hidden' {...register('fechaNacimiento')} />
                  <div>
                    <div
                      className='mb-1 flex min-h-5 items-center gap-4'
                      role='radiogroup'
                      aria-label='Forma de ingresar el nacimiento'
                    >
                      <label className='flex cursor-pointer items-center gap-2 text-sm font-medium text-tertiary'>
                        <input
                          type='radio'
                          name='birthInputMode'
                          value='age'
                          checked={birthInputMode === 'age'}
                          onChange={() => onBirthInputModeChange('age')}
                          className='size-5 cursor-pointer accent-[#0058A8]'
                        />
                        Edad
                      </label>
                      <label className='flex cursor-pointer items-center gap-2 text-sm font-medium text-tertiary'>
                        <input
                          type='radio'
                          name='birthInputMode'
                          value='date'
                          checked={birthInputMode === 'date'}
                          onChange={() => onBirthInputModeChange('date')}
                          className='size-5 cursor-pointer accent-[#0058A8]'
                        />
                        Fecha de nacimiento
                      </label>
                    </div>
                    <div className='min-w-0 flex-1'>
                      {birthInputMode === 'age' ? (
                        <div className='relative'>
                          <TextInput
                            type='text'
                            inputMode='numeric'
                            value={ageDraft}
                            onChange={event => onAgeChange(event.target.value)}
                            placeholder='Ingrese la edad'
                            error={Boolean(errors.fechaNacimiento)}
                            className='pr-16'
                          />
                          <span className='pointer-events-none absolute inset-y-0 right-3 flex items-center text-base text-secondary'>
                            {Number(ageDraft) === 1 ? 'año' : 'años'}
                          </span>
                        </div>
                      ) : (
                        <div ref={birthDatePickerRef} className='relative'>
                          <button
                            type='button'
                            onClick={() => setShowBirthDatePicker(prev => !prev)}
                            className={getFieldButtonClass(Boolean(errors.fechaNacimiento))}
                          >
                            <span className={birthDateValue ? 'text-primary' : 'text-secondary'}>
                              {birthDateLabel}
                            </span>
                            <SvgIcon src='/svg/paciente/calendar.svg' size={20} />
                          </button>

                          {showBirthDatePicker ? (
                            <div className='absolute right-0 z-20 mt-2 w-[360px] max-w-[calc(100vw-2rem)] rounded-xl border border-gray-200 bg-white p-3'>
                              <div className='mb-3'>
                                <p className='text-sm font-bold text-tertiary'>
                                  Selecciona día, mes y año
                                </p>
                                <p className='mt-1 text-xs text-secondary'>
                                  La fecha se guarda al completar los tres campos.
                                </p>
                              </div>
                              <div className='grid grid-cols-3 gap-2'>
                                <div>
                                  <label className='mb-1 block text-xs font-bold text-secondary'>
                                    Día
                                  </label>
                                  <SelectInput
                                    value={birthDateDraft.day}
                                    onChange={event =>
                                      onBirthDatePartChange('day', event.target.value)
                                    }
                                    className='rounded-lg px-2 text-sm text-tertiary'
                                  >
                                    <option value=''>Día</option>
                                    {birthDayOptions.map(day => (
                                      <option key={day} value={day}>
                                        {day}
                                      </option>
                                    ))}
                                  </SelectInput>
                                </div>
                                <div>
                                  <label className='mb-1 block text-xs font-bold text-secondary'>
                                    Mes
                                  </label>
                                  <SelectInput
                                    value={birthDateDraft.month}
                                    onChange={event =>
                                      onBirthDatePartChange('month', event.target.value)
                                    }
                                    className='rounded-lg px-2 text-sm text-tertiary'
                                  >
                                    <option value=''>Mes</option>
                                    {birthMonthOptions.map((month, index) => (
                                      <option key={month} value={index + 1}>
                                        {month}
                                      </option>
                                    ))}
                                  </SelectInput>
                                </div>
                                <div>
                                  <label className='mb-1 block text-xs font-bold text-secondary'>
                                    Año
                                  </label>
                                  <SelectInput
                                    value={birthDateDraft.year}
                                    onChange={event =>
                                      onBirthDatePartChange('year', event.target.value)
                                    }
                                    className='rounded-lg px-2 text-sm text-tertiary'
                                  >
                                    <option value=''>Año</option>
                                    {birthYearOptions.map(year => (
                                      <option key={year} value={year}>
                                        {year}
                                      </option>
                                    ))}
                                  </SelectInput>
                                </div>
                              </div>
                              <div className='mt-2 flex justify-between border-t border-gray-100 pt-2'>
                                <button
                                  type='button'
                                  className='text-sm rounded-md px-2 py-1 font-bold text-secondary transition-colors hover:bg-gray-200 disabled:cursor-not-allowed disabled:opacity-50'
                                  onClick={onBirthDateClear}
                                  disabled={!birthDateValue}
                                >
                                  Limpiar
                                </button>
                                <button
                                  type='button'
                                  className='text-sm rounded-md px-2 py-1 font-bold text-secondary transition-colors hover:bg-gray-200'
                                  onClick={() => setShowBirthDatePicker(false)}
                                >
                                  Cerrar
                                </button>
                              </div>
                            </div>
                          ) : null}
                        </div>
                      )}
                    </div>
                  </div>
                  {errors.fechaNacimiento && (
                    <p className='text-red-500 text-xs mt-1'>{errors.fechaNacimiento.message}</p>
                  )}
                </div>

                <div>
                  <FieldLabel>Sexo</FieldLabel>
                  <SelectInput {...register('sexo')} error={Boolean(errors.sexo)} defaultValue=''>
                    <option value='' disabled>
                      Seleccionar
                    </option>
                    <option value='female'>Femenino</option>
                    <option value='male'>Masculino</option>
                    <option value='other'>Otro</option>
                  </SelectInput>
                  {errors.sexo && (
                    <p className='text-red-500 text-xs mt-1'>{errors.sexo.message}</p>
                  )}
                </div>

                <div>
                  <FieldLabel>Teléfono</FieldLabel>
                  <TextInput
                    type='tel'
                    inputMode='numeric'
                    value={watch('telefono')}
                    onChange={e =>
                      setValue('telefono', e.target.value.replace(/\D/g, ''), {
                        shouldValidate: true,
                      })
                    }
                    error={Boolean(errors.telefono)}
                    placeholder='Ingrese número de teléfono'
                  />
                  {errors.telefono && (
                    <p className='text-red-500 text-xs mt-1'>{errors.telefono.message}</p>
                  )}
                </div>

                <div className='md:col-span-2'>
                  <FieldLabel>Dirección</FieldLabel>
                  <TextInput
                    type='text'
                    {...register('direccion')}
                    error={Boolean(errors.direccion)}
                    placeholder='Av. / Urb / Calle'
                  />
                  {errors.direccion && (
                    <p className='text-red-500 text-xs mt-1'>{errors.direccion.message}</p>
                  )}
                </div>

                <div>
                  <FieldLabel>Correo electrónico</FieldLabel>
                  <TextInput
                    type='email'
                    inputMode='email'
                    autoComplete='email'
                    {...register('correo')}
                    error={Boolean(errors.correo)}
                    placeholder='ejemplo@correo.com'
                  />
                  {errors.correo && (
                    <p className='text-red-500 text-xs mt-1'>{errors.correo.message}</p>
                  )}
                </div>
              </div>
            </div>
          </form>
        ) : null}
      </section>

      <section className='bg-surface border border-border-default rounded-3xl p-4 pb-10'>
        <div className='mb-3 flex flex-col gap-3 md:flex-row md:items-center md:justify-between'>
          <div>
            <h2 className='text-xl font-semibold leading-none text-primary'>Exámenes a realizar</h2>
            <p className='text-secondary text-base mt-2'>
              Selecciona uno o varios exámenes para esta solicitud.
            </p>
          </div>
          <div className='w-full shrink-0 md:w-80 lg:w-96'>
            <TextInput
              className='text-secondary'
              placeholder='Buscar examen'
              value={searchExam}
              onChange={event => setSearchExam(event.target.value)}
            />
          </div>
        </div>
        <div className='mb-4 flex flex-wrap gap-2'>
          {EXAM_CATEGORIES.map(category => (
            <PillFilter
              key={category.key}
              label={`${category.label} (${examCountByCategory[category.key]})`}
              active={activeCategory === category.key}
              onClick={() => setActiveCategory(category.key)}
              iconSrc={category.iconSrc}
              iconAlt={category.key}
            />
          ))}
        </div>
        <input type='hidden' {...register('examenes')} />
        <div className='grid gap-3 md:grid-cols-2 xl:grid-cols-5'>
          {visibleExams.map(exam => {
            const isChecked = selectedExams.includes(exam.templateId)

            return (
              <label
                key={exam.templateId}
                className={`text-tertiary flex min-h-16 text-base cursor-pointer items-center gap-2 rounded-xl border px-3 transition-colors duration-200 ${
                  isChecked ? 'border-[#0058A8] bg-[#E4F4FC]' : 'border-border-input'
                }`}
              >
                <input
                  type='checkbox'
                  className='size-5 shrink-0 cursor-pointer'
                  checked={isChecked}
                  onChange={() => toggleExamen(exam.templateId)}
                />
                <span>{exam.label}</span>
              </label>
            )
          })}
        </div>
        {visibleExams.length === 0 ? (
          <p className='text-secondary mt-3 text-sm'>No hay exámenes para esta búsqueda.</p>
        ) : null}
        {shouldShowSelected ? (
          <div className='mt-6'>
            <h4 className='text-xl font-semibold'>
              Exámenes seleccionados: {selectedExams.length}
            </h4>
            <div className='mt-3 flex flex-wrap gap-3'>
              {selectedExams.map(exam => {
                const examLabel = allExams.find(item => item.templateId === exam)?.label ?? exam
                return (
                  <PillFilter
                    selected
                    key={exam}
                    label={examLabel}
                    onRemove={() => toggleExamen(exam)}
                  />
                )
              })}
            </div>
          </div>
        ) : null}
        {errors.examenes && <p className='text-red-500 text-xs mt-2'>{errors.examenes.message}</p>}

        {/* <div className='mt-6'>
          <FieldLabel>Observaciones</FieldLabel>
          <TextareaInput
            {...register('observaciones')}
            placeholder='Agregar observaciones de la solicitud'
          />
        </div> */}
      </section>

      <div className='flex items-center justify-end gap-4 mt-6'>
        <Button
          type='button'
          onClick={showCreateForm ? handleSubmit(onSubmit) : onSubmitExistingPatient}
          disabled={isSubmitDisabled || isSubmittingRequest}
          className='inline-flex items-center gap-2 disabled:cursor-not-allowed disabled:opacity-60'
        >
          {isSubmittingRequest ? (
            <>
              <span className='size-5 animate-spin rounded-full border-2 border-white/40 border-t-white' />
              Creando solicitud...
            </>
          ) : (
            'Guardar y crear solicitud'
          )}
        </Button>
      </div>
    </div>
  )
}

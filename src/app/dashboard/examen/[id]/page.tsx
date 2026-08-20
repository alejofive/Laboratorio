'use client'

import ExamenTabs from '@/components/ExamenTabs'
import DynamicExamForm from '@/components/forms/DynamicExamForm'
import { Button } from '@/components/ui/Button'
import SvgIcon from '@/components/ui/SvgIcon'
import { createOrderExamResult, useOrderById, usePatientById } from '@/data/createPatients'
import {
  buildInitialValuesFromTemplate,
  extractTemplatePayload,
  getTemplateValidationErrors,
  normalizePayloadAliases,
  normalizeTemplateSections,
  TemplateFormValues,
  validateTemplateValues,
} from '@/lib/examTemplate'
import { buildGmailComposeLink } from '@/lib/gmail'
import { buildWhatsAppLink } from '@/lib/whatsapp'
import {
  EstadoExamen,
  Examen,
  Paciente,
  ResultadosExamen,
  ResultadosHematologia,
  TipoExamen,
} from '@/types'
import { ExamTemplateSection } from '@/types/exam-template'
import { useQueryClient } from '@tanstack/react-query'
import { ArrowLeft, Calendar, Download, IdCard, Mail, MapPin, Pencil, Phone } from 'lucide-react'
import Link from 'next/link'
import { useParams, useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useMemo, useRef, useState } from 'react'
import { toast } from 'react-hot-toast'
import Loading from './loading'

const examLabels: Record<TipoExamen, string> = {
  dengue: 'Dengue',
  frotis_sangre: 'Frotis de sangre periferica',
  glicemia_pre_post: 'Glicemia pre post',
  heces: 'Heces',
  heces_hematologia: 'Heces y Hematologia',
  hematologia: 'Hematologia',
  hematologia_orina: 'Hematologia y Orina',
  helicobacter_pylori: 'Helicobacter Pylori',
  hematologia_quimica: 'Hematologia y Quimica',
  hematologia_serologia: 'Hematologia y Serologia',
  hemoglobina_hematocritos: 'Hemoglobina Hematocritos',
  hemoparasitos: 'Hemoparasitos',
  nuevo_completo: 'Nuevo Completo',
  orina_heces: 'Orina y Heces',
  orina: 'Orina',
  prueba_embarazo: 'Prueba de embarazo',
  quimica_colinesterasa: 'Quimica Colinesterasa',
  quimica_corta: 'Quimica sanguinea mas corta',
  quimica_heces: 'Quimica y Heces',
  quimica_orina: 'Quimica y Orina',
  quimica_serologia: 'Quimica y Serologia',
  quimica: 'Quimica',
  serologia_asto_psa_pylori: 'Serologia ASTO PSA Pylori',
  serologia_heces: 'Serologia y Heces',
  serologia_orina: 'Serologia y Orina',
  serologia: 'Serologia',
  tipo_sangre: 'Tipo de sangre',
  vdrl_hepatitis: 'VDRL Hepatitis y demas',
}

const examTypeAlias: Record<string, TipoExamen> = {
  hematologia: 'hematologia',
  orina: 'orina',
  heces: 'heces',
  dengue: 'dengue',
  quimica: 'quimica',
  serologia: 'serologia',
  heces_y_hematologia: 'heces_hematologia',
  hematologia_y_orina: 'hematologia_orina',
  hematologia_y_quimica: 'hematologia_quimica',
  hematologia_y_serologia: 'hematologia_serologia',
  orina_y_heces: 'orina_heces',
  quimica_y_heces: 'quimica_heces',
  quimica_y_orina: 'quimica_orina',
  quimica_y_serologia: 'quimica_serologia',
  serologia_y_heces: 'serologia_heces',
  serologia_y_orina: 'serologia_orina',
}

const VENEZUELA_UTC_OFFSET_HOURS = 4

function toVenezuelaDateOnly(isoDate: string): string {
  const venezuelaTime = new Date(
    new Date(isoDate).getTime() - VENEZUELA_UTC_OFFSET_HOURS * 60 * 60 * 1000,
  )
  const year = venezuelaTime.getUTCFullYear()
  const month = String(venezuelaTime.getUTCMonth() + 1).padStart(2, '0')
  const day = String(venezuelaTime.getUTCDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

function normalizeExamType(rawName?: string): TipoExamen | null {
  if (!rawName) return null
  const normalized = rawName
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '')
  return examTypeAlias[normalized] ?? null
}

function mapResultStatus(status?: string): EstadoExamen {
  switch (status) {
    case 'completed':
      return 'completo'
    case 'sent':
      return 'enviado'
    case 'in_progress':
      return 'en_proceso'
    default:
      return 'pendiente'
  }
}

function getExamMenuStatus(exam: Examen, examReadOnly: boolean) {
  const isCompleted = exam.estado === 'completo' || exam.estado === 'enviado'

  if (isCompleted && !examReadOnly) {
    return {
      label: 'En edición',
      dotClassName: 'bg-[#f59e0b]',
    }
  }

  if (isCompleted) {
    return {
      label: 'Completado ✓',
      dotClassName: 'bg-[#10b981]',
    }
  }

  if (exam.estado === 'en_proceso') {
    return {
      label: 'En proceso',
      dotClassName: 'bg-[#f59e0b]',
    }
  }

  return {
    label: 'Pendiente',
    dotClassName: 'bg-[#9ca3af]',
  }
}

function mapHematologiaPayload(payload: Record<string, unknown>): ResultadosHematologia {
  const normalizedPayload = normalizePayloadAliases(payload)
  const get = (key: string) => String(normalizedPayload[key] ?? '')
  const sangriaMin = get('t_sangria_min')
  const sangriaSeg = get('t_sangria_seg')
  const coagulacionMin = get('t_coagulacion_min')
  const coagulacionSeg = get('t_coagulacion_seg')

  return {
    leucocitos: get('leucocitos'),
    hematies: get('hematies'),
    hemoglobina: get('hemoglobina'),
    hematocrito: get('hematocrito'),
    segmentados: get('segmentados'),
    linfocitos: get('linfocitos'),
    eosinofilos: get('eosinofilos'),
    otros: get('otros'),
    sedimentacion_1h: get('sedimentacion_1h'),
    sedimentacion_2h: get('sedimentacion_2h'),
    plaquetas: get('plaquetas'),
    t_protrombina: String(normalizedPayload.t_protrombina ?? normalizedPayload.t_protombina ?? ''),
    t_protrombina_control: String(
      normalizedPayload.t_protrombina_control ?? normalizedPayload.t_protombina_control ?? '',
    ),
    inr: get('inr'),
    razon_pc: get('razon_pc'),
    ptt: get('ptt'),
    ptt_control: get('ptt_control'),
    t_sangria: [sangriaMin, sangriaSeg].filter(Boolean).join(':'),
    t_coagulacion: [coagulacionMin, coagulacionSeg].filter(Boolean).join(':'),
    observaciones: String(normalizedPayload.observaciones ?? normalizedPayload.notas ?? ''),
  }
}

function mapExamPayload(
  tipo: TipoExamen,
  payload?: Record<string, unknown>,
): ResultadosExamen | undefined {
  if (!payload) return undefined
  const safePayload = normalizePayloadAliases(payload)
  if (tipo === 'hematologia') {
    return mapHematologiaPayload(safePayload)
  }
  return safePayload as unknown as ResultadosExamen
}

function mapExamToPayload(
  tipo: TipoExamen,
  resultados?: ResultadosExamen,
): Record<string, unknown> {
  if (!resultados) return {}

  if (tipo !== 'hematologia') {
    return resultados as unknown as Record<string, unknown>
  }

  const data = resultados as ResultadosHematologia
  const [tSangriaMin, tSangriaSeg] = (data.t_sangria ?? '').split(':')
  const [tCoagulacionMin, tCoagulacionSeg] = (data.t_coagulacion ?? '').split(':')

  return {
    ...data,
    t_protombina: data.t_protrombina,
    t_protombina_control: data.t_protrombina_control,
    t_sangria_min: tSangriaMin ?? '',
    t_sangria_seg: tSangriaSeg ?? '',
    t_coagulacion_min: tCoagulacionMin ?? '',
    t_coagulacion_seg: tCoagulacionSeg ?? '',
    notas: data.observaciones,
  }
}

function normalizePayloadForApi(
  payload: Record<string, unknown>,
  sections: ExamTemplateSection[],
): Record<string, unknown> {
  const fieldTypes = new Map(
    sections.flatMap(section => section.fields.map(field => [field.key, field.type] as const)),
  )

  return Object.fromEntries(
    Object.entries(payload).map(([key, value]) => {
      if (fieldTypes.get(key) !== 'number' || typeof value !== 'string') {
        return [key, value]
      }

      const numericValue = value.trim()
      if (numericValue === '' || !/^-?\d+([.,]\d+)?$/.test(numericValue)) {
        return [key, value]
      }

      return [key, numericValue]
    }),
  )
}

interface ExamenView extends Examen {
  templateSections: ExamTemplateSection[]
  templateName: string
  useDynamicForm: boolean
}

function getPdfFilename(contentDisposition: string | null): string {
  const fallback = 'resultado.pdf'

  if (!contentDisposition) return fallback

  const encodedMatch = contentDisposition.match(/filename\*=UTF-8''([^;]+)/i)
  if (encodedMatch) {
    try {
      return decodeURIComponent(encodedMatch[1].trim())
    } catch {
      return fallback
    }
  }

  const plainMatch = contentDisposition.match(/filename="?([^";]+)"?/i)
  return plainMatch ? plainMatch[1].trim() : fallback
}

function mapPatient(apiPatient: {
  _id: string
  first_name: string
  last_name: string
  document_number: string
  birth_date?: string
  phone: string
  email?: string
  address?: string
}): Paciente {
  const age = apiPatient.birth_date
    ? Math.max(
        0,
        Math.floor(
          (Date.now() - new Date(apiPatient.birth_date).getTime()) / (365.25 * 24 * 60 * 60 * 1000),
        ),
      )
    : 0

  return {
    id: apiPatient._id,
    nombre: `${apiPatient.first_name} ${apiPatient.last_name}`.trim(),
    edad: age,
    telefono: apiPatient.phone,
    email: apiPatient.email,
    fecha: '',
    examenes: [],
    cedula: apiPatient.document_number,
    direccion: apiPatient.address ?? '-',
  }
}

export default function ExamenPage() {
  const queryClient = useQueryClient()
  const router = useRouter()
  const params = useParams()
  const searchParams = useSearchParams()
  const orderId = (params.id as string) || ''
  const examIdFromQuery = searchParams.get('examId')

  const { data: order, isLoading: isOrderLoading } = useOrderById(orderId || null)
  const { data: patientData } = usePatientById(order?.patient_id ?? null)

  const [isFormValid, setIsFormValid] = useState(false)
  const [readOnlyByExam, setReadOnlyByExam] = useState<Record<string, boolean>>({})
  const [orderReferenceByExam, setOrderReferenceByExam] = useState<Record<string, string>>({})
  const [doctorOrdenanteByExam, setDoctorOrdenanteByExam] = useState<Record<string, string>>({})
  const [examDateByExam, setExamDateByExam] = useState<Record<string, string>>({})
  const [examTimeByExam, setExamTimeByExam] = useState<Record<string, string>>({})
  const [bloodCollectionTimeByExam, setBloodCollectionTimeByExam] = useState<
    Record<string, string>
  >({})
  const [estadoByExam, setEstadoByExam] = useState<Record<string, EstadoExamen>>({})
  const [isSavingResult, setIsSavingResult] = useState(false)
  const [isPreparingEmail, setIsPreparingEmail] = useState(false)
  const [isDownloadingPdf, setIsDownloadingPdf] = useState(false)
  const [draftResultadosByExam, setDraftResultadosByExam] = useState<
    Record<string, ResultadosExamen>
  >({})
  const [draftTemplateValuesByExam, setDraftTemplateValuesByExam] = useState<
    Record<string, TemplateFormValues>
  >({})
  const [draftTemplateSectionsByExam, setDraftTemplateSectionsByExam] = useState<
    Record<string, ExamTemplateSection[]>
  >({})
  const formContainerRef = useRef<HTMLDivElement | null>(null)

  const examenesPaciente = useMemo<ExamenView[]>(() => {
    if (!order?.exams) return []

    const mapped: ExamenView[] = []

    for (const exam of order.exams) {
      const normalizedTipo = normalizeExamType(exam.template_snapshot?.name)
      const tipo: TipoExamen = normalizedTipo ?? 'nuevo_completo'
      const templateSections = normalizeTemplateSections(exam.template_snapshot?.sections)
      const useDynamicForm = tipo !== 'hematologia' || templateSections.length > 0

      mapped.push({
        id: exam._id,
        pacienteId: order.patient_id,
        orderNumber: order.order_number,
        tipo,
        estado: estadoByExam[exam._id] ?? mapResultStatus(exam.result_status),
        resultados: useDynamicForm
          ? (exam.result_payload as ResultadosExamen | undefined)
          : mapExamPayload(tipo, exam.result_payload),
        numeroOrden: orderReferenceByExam[exam._id] ?? exam.order_reference ?? '',
        doctorOrdenante: doctorOrdenanteByExam[exam._id] ?? exam.doctor_name ?? '',
        fechaCreacion: exam.created_at ?? order.created_at,
        fechaActualizacion: exam.updated_at ?? order.updated_at ?? order.created_at,
        fechaExamen:
          examDateByExam[exam._id] ??
          (exam.exam_date
            ? exam.exam_date.slice(0, 10)
            : toVenezuelaDateOnly(exam.created_at ?? order.created_at)),
        horaExamen: examTimeByExam[exam._id] ?? exam.exam_time ?? '',
        horaTomaSangre: bloodCollectionTimeByExam[exam._id] ?? exam.blood_collection_time ?? '',
        templateSections,
        templateName: exam.template_snapshot?.name || 'Examen',
        useDynamicForm,
      })
    }

    return mapped
  }, [
    order,
    orderReferenceByExam,
    doctorOrdenanteByExam,
    examDateByExam,
    examTimeByExam,
    bloodCollectionTimeByExam,
    estadoByExam,
  ])

  const selectedExamId = examIdFromQuery ?? examenesPaciente[0]?.id
  const examenBase = examenesPaciente.find(e => e.id === selectedExamId) ?? null
  const examen = examenBase
    ? {
        ...examenBase,
        resultados: draftResultadosByExam[examenBase.id] ?? examenBase.resultados,
        templateSections: draftTemplateSectionsByExam[examenBase.id] ?? examenBase.templateSections,
      }
    : null

  const paciente = patientData ? mapPatient(patientData) : null

  const initialReadOnly = examen?.estado === 'completo' || examen?.estado === 'enviado'
  const readOnly = examen ? (readOnlyByExam[examen.id] ?? initialReadOnly) : false

  useEffect(() => {
    const container = formContainerRef.current
    if (!container) return

    const resetReadOnlyRender = () => {
      container
        .querySelectorAll<HTMLElement>('[data-readonly-generated="true"]')
        .forEach(node => node.remove())
      container.querySelectorAll<HTMLElement>('[data-readonly-hidden="true"]').forEach(node => {
        node.style.removeProperty('display')
        node.removeAttribute('data-readonly-hidden')
      })
      container
        .querySelectorAll<HTMLElement>('[data-readonly-normal-weight="true"]')
        .forEach(node => {
          node.style.removeProperty('font-weight')
          node.removeAttribute('data-readonly-normal-weight')
        })
    }

    resetReadOnlyRender()
    if (!readOnly) return

    const controls = container.querySelectorAll<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >('input, select, textarea')
    controls.forEach(control => {
      if (control instanceof HTMLInputElement && control.type === 'hidden') return

      if (
        control instanceof HTMLInputElement &&
        (control.type === 'radio' || control.type === 'checkbox')
      ) {
        const label = control.closest('label')
        if (!control.checked) {
          const target = label ?? control
          target.style.display = 'none'
          target.setAttribute('data-readonly-hidden', 'true')
          return
        }
        if (label) {
          label.style.fontWeight = '400'
          label.setAttribute('data-readonly-normal-weight', 'true')
        }
        return
      }

      const value =
        control instanceof HTMLSelectElement
          ? control.selectedOptions[0]?.textContent?.trim() || '-'
          : control.value.trim() || '-'
      const readOnlyNode = document.createElement(
        control instanceof HTMLTextAreaElement ? 'div' : 'span',
      )
      readOnlyNode.textContent = value
      readOnlyNode.className = 'w-full py-2 text-lg text-primary break-words block'
      readOnlyNode.setAttribute('data-readonly-generated', 'true')
      control.insertAdjacentElement('afterend', readOnlyNode)
      control.style.display = 'none'
      control.setAttribute('data-readonly-hidden', 'true')
    })

    return resetReadOnlyRender
  }, [readOnly, examen?.id])

  if (isOrderLoading || !orderId) {
    return <Loading />
  }

  if (!examen || !paciente) {
    return <Loading />
  }

  const doctorOrdenanteHistorico =
    [...examenesPaciente]
      .sort((a, b) => new Date(a.fechaCreacion).getTime() - new Date(b.fechaCreacion).getTime())
      .map(ex => ex.doctorOrdenante?.trim())
      .find(Boolean) || ''
  const doctorExamenActual = examen.doctorOrdenante?.trim() || ''
  const doctorOrdenanteInput =
    doctorOrdenanteByExam[examen.id] ?? (doctorExamenActual || doctorOrdenanteHistorico)
  const numeroOrdenInput = examen.numeroOrden ?? ''
  const examDateInput = examen.fechaExamen ?? ''
  const examTimeInput = examen.horaExamen ?? ''
  const bloodCollectionTimeInput = examen.horaTomaSangre ?? ''
  const estadoLabel =
    examen.estado === 'en_proceso'
      ? 'En Proceso'
      : examen.estado.charAt(0).toUpperCase() + examen.estado.slice(1)

  const handleVolver = () => {
    const cedulaParam = searchParams.get('cedula')
    if (cedulaParam) {
      router.push(`/dashboard/pacientes/${cedulaParam}`)
      return
    }

    router.push('/dashboard/solicitudes')
  }

  const setCurrentReadOnly = (nextValue: boolean) => {
    setReadOnlyByExam(prev => ({
      ...prev,
      [examen.id]: nextValue,
    }))
  }

  const handleResultadosChange = (resultados: ResultadosExamen) => {
    setDraftResultadosByExam(prev => ({
      ...prev,
      [examen.id]: resultados,
    }))
  }

  const handleTemplateValuesChange = (values: TemplateFormValues) => {
    setDraftTemplateValuesByExam(prev => ({
      ...prev,
      [examen.id]: values,
    }))
  }

  const handleTemplateSectionsChange = (sections: ExamTemplateSection[]) => {
    setDraftTemplateSectionsByExam(prev => ({
      ...prev,
      [examen.id]: sections,
    }))
  }

  const handleCompletar = async () => {
    if (isSavingResult) return

    const bioanalystName = doctorOrdenanteInput.trim()
    setIsSavingResult(true)

    try {
      const resultados = draftResultadosByExam[examen.id] ?? examen.resultados
      const templateValues =
        draftTemplateValuesByExam[examen.id] ??
        buildInitialValuesFromTemplate(
          examen.templateSections,
          mapExamToPayload(examen.tipo, resultados),
        )

      const payloadByTemplate = extractTemplatePayload(examen.templateSections, templateValues)
      const fallbackPayload = mapExamToPayload(examen.tipo, resultados)

      const rawPayload = examen.templateSections.length > 0 ? payloadByTemplate : fallbackPayload
      const validationErrors = getTemplateValidationErrors(examen.templateSections, templateValues)

      if (validationErrors.length > 0) {
        toast.error(validationErrors[0])
        return
      }

      const normalizedPayload = normalizePayloadForApi(rawPayload, examen.templateSections)

      await createOrderExamResult(orderId, examen.id, {
        result_payload: normalizedPayload,
        custom_fields: examen.templateSections.flatMap((section, sectionIndex) =>
          section.fields
            .filter(field => field.is_custom)
            .map(field => ({
              section_index: sectionIndex,
              key: field.key,
              label: field.label.trim(),
              ...(field.unit?.trim() ? { unit: field.unit.trim() } : {}),
              ...(field.reference_value?.trim()
                ? { reference_value: field.reference_value.trim() }
                : {}),
            })),
        ),
        order_reference: numeroOrdenInput.trim() || undefined,
        doctor_name: bioanalystName,
        exam_date: examDateInput || undefined,
        exam_time: examTimeInput || undefined,
        blood_collection_time: bloodCollectionTimeInput || undefined,
      })

      if (examen.templateSections.length > 0) {
        setDraftTemplateValuesByExam(prev => ({
          ...prev,
          [examen.id]: buildInitialValuesFromTemplate(examen.templateSections, normalizedPayload),
        }))
      } else {
        setDraftResultadosByExam(prev => ({
          ...prev,
          [examen.id]: normalizedPayload as unknown as ResultadosExamen,
        }))
      }

      setOrderReferenceByExam(prev => ({
        ...prev,
        [examen.id]: numeroOrdenInput.trim(),
      }))
      setDoctorOrdenanteByExam(prev => ({
        ...prev,
        [examen.id]: bioanalystName,
      }))
      setExamDateByExam(prev => ({
        ...prev,
        [examen.id]: examDateInput,
      }))
      setExamTimeByExam(prev => ({
        ...prev,
        [examen.id]: examTimeInput,
      }))
      setBloodCollectionTimeByExam(prev => ({
        ...prev,
        [examen.id]: bloodCollectionTimeInput,
      }))
      setEstadoByExam(prev => ({ ...prev, [examen.id]: 'completo' }))
      setCurrentReadOnly(true)
      await queryClient.invalidateQueries({ queryKey: ['order-by-id', orderId] })
      toast.success('Resultado guardado exitosamente')
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'No se pudo guardar el resultado')
    } finally {
      setIsSavingResult(false)
    }
  }

  const fetchExamPdf = async () => {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/orders/${orderId}/exams/${examen.id}/pdf`,
    )

    if (!response.ok) throw new Error('No se pudo generar el PDF')

    const blob = await response.blob()

    return {
      blobUrl: URL.createObjectURL(blob),
      filename: getPdfFilename(response.headers.get('content-disposition')),
    }
  }

  const triggerBlobDownload = (blobUrl: string, filename: string) => {
    const link = document.createElement('a')
    link.href = blobUrl
    link.download = filename
    document.body.appendChild(link)
    link.click()
    link.remove()
  }

  const handleSendEmail = async () => {
    if (isPreparingEmail) return

    const gmailLink = buildGmailComposeLink({
      to: paciente.email,
      subject: `Resultado de examen de ${examLabels[examen.tipo]} - ${paciente.nombre}`,
      body: [
        `Hola ${paciente.nombre}, te saluda Laboratorio Clínico DOS G.`,
        '',
        `Ya tenemos listo el resultado de tu examen de ${examLabels[examen.tipo]}.`,
        '',
        'Adjuntamos el archivo con tu resultado.',
      ].join('\n'),
    })

    // Gmail se abre de forma sincrona para conservar el gesto del usuario: si se
    // abriera despues del await, el navegador lo bloquearia como popup.
    const gmailWindow = window.open(gmailLink, '_blank')

    if (!gmailWindow) {
      toast.error('El navegador bloqueo la apertura de Gmail')
      return
    }

    gmailWindow.opener = null

    setIsPreparingEmail(true)

    try {
      // El PDF solo se descarga: Gmail no permite adjuntar archivos desde la URL,
      // asi que el usuario adjunta manualmente el archivo recien descargado.
      const { blobUrl, filename } = await fetchExamPdf()
      triggerBlobDownload(blobUrl, filename)
      window.setTimeout(() => URL.revokeObjectURL(blobUrl), 60_000)

      toast.success(`PDF descargado. Adjunta ${filename} en Gmail.`)
    } catch {
      toast.error('No se pudo descargar el PDF del resultado')
    } finally {
      setIsPreparingEmail(false)
    }
  }

  const handleDownloadPdf = async () => {
    if (isDownloadingPdf) return

    setIsDownloadingPdf(true)

    try {
      const { blobUrl, filename } = await fetchExamPdf()
      triggerBlobDownload(blobUrl, filename)

      // Se libera el blob luego de que el navegador alcanza a leerlo.
      window.setTimeout(() => URL.revokeObjectURL(blobUrl), 60_000)
    } catch {
      toast.error('No se pudo descargar el PDF')
    } finally {
      setIsDownloadingPdf(false)
    }
  }

  const handleSendWhatsapp = () => {
    const message = [
      `Hola *${paciente.nombre}*, te saluda *Laboratorio Clínico DOS G.*`,
      '',
      `Ya tenemos listo el resultado de tu examen de *${examLabels[examen.tipo]}*.`,
    ].join('\n')
    const waLink = buildWhatsAppLink(paciente.telefono, message)

    if (!waLink) {
      toast.error('El paciente no tiene un número de teléfono válido')
      return
    }

    window.open(waLink, '_blank')
  }

  const renderForm = () => {
    if (examen.useDynamicForm && examen.templateSections.length > 0) {
      const currentValues =
        draftTemplateValuesByExam[examen.id] ??
        buildInitialValuesFromTemplate(
          examen.templateSections,
          mapExamToPayload(examen.tipo, examen.resultados),
        )

      return (
        <DynamicExamForm
          sections={examen.templateSections}
          values={currentValues}
          onChange={handleTemplateValuesChange}
          onSectionsChange={handleTemplateSectionsChange}
          onValidChange={setIsFormValid}
          readOnly={readOnly}
        />
      )
    }
  }

  const isCurrentTemplateValid =
    examen.useDynamicForm && examen.templateSections.length > 0
      ? validateTemplateValues(
          examen.templateSections,
          draftTemplateValuesByExam[examen.id] ??
            buildInitialValuesFromTemplate(
              examen.templateSections,
              mapExamToPayload(examen.tipo, examen.resultados),
            ),
        )
      : isFormValid

  return (
    <div className='flex min-h-screen flex-col px-4 md:px-8'>
      <div className='mx-auto flex w-full flex-1 flex-col'>
        <div className='shrink-0 pt-8'>
          <header className='mb-6 border-b border-border-default pb-4 no-print'>
            <div className='flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between'>
              <div className='min-w-0'>
                <div className='flex flex-wrap items-center gap-3'>
                  <button
                    type='button'
                    onClick={handleVolver}
                    aria-label='Volver'
                    className='flex h-7 w-7 items-center justify-center rounded-full text-primary transition-colors hover:bg-surface-muted'
                  >
                    <ArrowLeft className='h-5 w-5' />
                  </button>
                  <p className='text-xl font-bold text-primary'>
                    # Solicitud: {examen.orderNumber ?? examen.id}
                  </p>
                  <span className='rounded-full bg-surface-muted px-2 py-1 text-xs font-medium text-secondary'>
                    {estadoLabel}
                  </span>
                </div>

                <div className='mt-3 ml-10 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm font-medium text-secondary'>
                  <span className='text-primary text-xl'>{paciente.nombre}</span>
                  <span className='flex items-center gap-1.5'>
                    <IdCard className='h-4 w-4' /> {paciente.cedula}
                  </span>
                  <span className='flex items-center gap-1.5'>
                    <Phone className='h-4 w-4' /> {paciente.telefono || '-'}
                  </span>
                  <span className='flex items-center gap-1.5'>
                    <Calendar className='h-4 w-4' /> {paciente.edad} años
                  </span>
                  <span className='flex items-center gap-1.5'>
                    <MapPin className='h-4 w-4' /> {paciente.direccion || '-'}
                  </span>
                </div>
              </div>

              <div className='flex flex-wrap gap-3 lg:justify-end'>
                <Button
                  type='button'
                  onClick={() => void handleSendEmail()}
                  disabled={!readOnly || isPreparingEmail}
                  variant='outline'
                  icon={<Mail className='h-5 w-5' />}
                >
                  {isPreparingEmail ? 'Preparando...' : 'Enviar al correo'}
                </Button>
                <Button
                  type='button'
                  onClick={handleSendWhatsapp}
                  disabled={!readOnly}
                  variant='outline'
                  icon={<SvgIcon src='/svg/whatsapp.svg' size={20} />}
                >
                  Enviar a WhatsApp
                </Button>
                <Button
                  type='button'
                  onClick={() => void handleDownloadPdf()}
                  disabled={!readOnly || isDownloadingPdf}
                  icon={<Download className='h-5 w-5' />}
                >
                  {isDownloadingPdf ? 'Descargando...' : 'Descargar'}
                </Button>
              </div>
            </div>
          </header>

          {examenesPaciente.length > 1 && (
            <nav className='mb-6 flex flex-col gap-4 no-print'>
              <span className='text-md text-secondary'>Exámenes ({examenesPaciente.length})</span>
              <div className='flex gap-3 overflow-x-auto pb-1'>
                {examenesPaciente.map(ex => {
                  const isActive = ex.id === examen.id
                  const initialExamReadOnly = ex.estado === 'completo' || ex.estado === 'enviado'
                  const examReadOnly = readOnlyByExam[ex.id] ?? initialExamReadOnly
                  const status = getExamMenuStatus(ex, examReadOnly)

                  return (
                    <Link
                      key={ex.id}
                      href={`/dashboard/examen/${orderId}?examId=${ex.id}`}
                      scroll={false}
                      className={`flex min-w-45 items-center gap-3 rounded-2xl border px-4 py-3 transition-colors ${
                        isActive
                          ? 'border-[#2563eb] bg-[#f1f5fe]'
                          : 'border-border-default bg-white hover:bg-surface-muted'
                      }`}
                    >
                      <span className={`h-2 w-2 shrink-0 rounded-full ${status.dotClassName}`} />
                      <span className='min-w-0'>
                        <span
                          className={`block truncate text-base font-semibold ${
                            isActive ? 'text-[#2563eb]' : 'text-primary'
                          }`}
                        >
                          {ex.templateName || examLabels[ex.tipo]}
                        </span>
                        <span className='block text-sm font-medium text-secondary'>
                          {status.label}
                        </span>
                      </span>
                    </Link>
                  )
                })}
              </div>
            </nav>
          )}
        </div>

        <div className='print-area flex flex-1 flex-col gap-6'>
          <div
            className={`flex flex-col gap-4 md:flex-row md:items-center md:justify-between ${
              readOnly
                ? ''
                : 'sticky top-0 z-20 -mx-4 border-b border-border-default bg-canvas px-4 py-4 md:-mx-8 md:px-8'
            }`}
          >
            <h1 className='text-xl font-semibold uppercase text-primary'>
              {examen.templateName || examLabels[examen.tipo]}
            </h1>
            <Button
              onClick={() => {
                if (readOnly) {
                  setCurrentReadOnly(false)
                  return
                }

                void handleCompletar()
              }}
              disabled={isSavingResult || (!readOnly && !isCurrentTemplateValid)}
              variant={readOnly ? 'outline' : 'primary'}
              size='md'
              icon={readOnly ? <Pencil className='h-4 w-4' /> : undefined}
              className='inline-flex items-center gap-2 disabled:cursor-not-allowed disabled:opacity-60'
            >
              {isSavingResult ? (
                <>
                  <span className='size-5 animate-spin rounded-full border-2 border-white/40 border-t-white' />
                  Guardando resultado...
                </>
              ) : readOnly ? (
                'Editar resultado'
              ) : (
                'Guardar resultado'
              )}
            </Button>
          </div>

          <div className='flex-1 pb-8'>
            <div className='flex flex-col gap-6'>
              <ExamenTabs
                readOnly={readOnly}
                examen={examen}
                examenNombre={examen.templateName || examLabels[examen.tipo]}
                examenes={examenesPaciente.map(e => ({ id: e.id, tipo: e.tipo }))}
                examenActualId={examen.id}
                numeroOrden={numeroOrdenInput}
                onNumeroOrdenChange={value => {
                  setOrderReferenceByExam(prev => ({
                    ...prev,
                    [examen.id]: value,
                  }))
                }}
                doctorOrdenante={doctorOrdenanteInput}
                onDoctorOrdenanteChange={value => {
                  setDoctorOrdenanteByExam(prev => ({
                    ...prev,
                    [examen.id]: value,
                  }))
                }}
                examDate={examDateInput}
                onExamDateChange={value => {
                  setExamDateByExam(prev => ({
                    ...prev,
                    [examen.id]: value,
                  }))
                }}
                examTime={examTimeInput}
                onExamTimeChange={value => {
                  setExamTimeByExam(prev => ({
                    ...prev,
                    [examen.id]: value,
                  }))
                }}
                bloodCollectionTime={bloodCollectionTimeInput}
                onBloodCollectionTimeChange={value => {
                  setBloodCollectionTimeByExam(prev => ({
                    ...prev,
                    [examen.id]: value,
                  }))
                }}
              />

              <div ref={formContainerRef}>
                <fieldset
                  disabled={readOnly}
                  className="[&_input:disabled]:opacity-100 [&_textarea:disabled]:opacity-100 [&_select:disabled]:opacity-100 [&_input:disabled]:bg-white [&_textarea:disabled]:bg-white [&_select:disabled]:bg-white [&_input:disabled]:text-gray-900 [&_textarea:disabled]:text-gray-900 [&_select:disabled]:text-gray-900 [&_input:disabled]:border-gray-300 [&_textarea:disabled]:border-gray-300 [&_select:disabled]:border-gray-300 [&_input[type='radio']:disabled]:opacity-100 [&_input[type='checkbox']:disabled]:opacity-100 [&_input[type='radio']:disabled]:accent-cyan-600 [&_input[type='checkbox']:disabled]:accent-cyan-600"
                >
                  {renderForm()}
                </fieldset>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

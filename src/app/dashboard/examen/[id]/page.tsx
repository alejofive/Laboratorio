'use client';

import AccionesExamen from '@/components/AccionesExamen';
import ExamenTabs from '@/components/ExamenTabs';
import DynamicExamForm from '@/components/forms/DynamicExamForm';
import FormDengue from '@/components/forms/FormDengue';
import FormFrotisSangre from '@/components/forms/FormFrotisSangre';
import FormGlicemia from '@/components/forms/FormGlicemia';
import FormHeces from '@/components/forms/FormHeces';
import FormHelicobacterPylori from '@/components/forms/FormHelicobacterPylori';
import FormHematologia from '@/components/forms/FormHematologia';
import FormHematologiaQuimica from '@/components/forms/FormHematologiaQuimica';
import FormHematologiaSerologia from '@/components/forms/FormHematologiaSerologia';
import FormHemoglobinaHematocritos from '@/components/forms/FormHemoglobinaHematocritos';
import FormHemoparasitos from '@/components/forms/FormHemoparasitos';
import FormNuevoCompleto from '@/components/forms/FormNuevoCompleto';
import FormOrina from '@/components/forms/FormOrina';
import FormOrinaHeces from '@/components/forms/FormOrinaHeces';
import FormPruebaEmbarazo from '@/components/forms/FormPruebaEmbarazo';
import FormQuimica from '@/components/forms/FormQuimica';
import FormQuimicaColinesterasa from '@/components/forms/FormQuimicaColinesterasa';
import FormQuimicaCorta from '@/components/forms/FormQuimicaCorta';
import FormQuimicaHeces from '@/components/forms/FormQuimicaHeces';
import FormQuimicaOrina from '@/components/forms/FormQuimicaOrina';
import FormQuimicaSerologia from '@/components/forms/FormQuimicaSerologia';
import FormSerologia from '@/components/forms/FormSerologia';
import FormSerologiaAstoPsaPylori from '@/components/forms/FormSerologiaAstoPsaPylori';
import FormSerologiaHeces from '@/components/forms/FormSerologiaHeces';
import FormSerologiaOrina from '@/components/forms/FormSerologiaOrina';
import FormTipoSangre from '@/components/forms/FormTipoSangre';
import FormVDRLHepatitis from '@/components/forms/FormVDRLHepatitis';
import { Button } from '@/components/ui/Button';
import { createOrderExamResult, sendOrderExamEmail, useOrderById, usePatientById } from '@/data/createPatients';
import {
  buildInitialValuesFromTemplate,
  extractTemplatePayload,
  normalizePayloadAliases,
  normalizeTemplateSections,
  TemplateFormValues,
  validateTemplateValues,
} from '@/lib/examTemplate';
import {
  EstadoExamen,
  Examen,
  Paciente,
  ResultadosDengue,
  ResultadosExamen,
  ResultadosFrotisSangre,
  ResultadosGlicemia,
  ResultadosHeces,
  ResultadosHelicobacterPylori,
  ResultadosHematologia,
  ResultadosHematologiaQuimica,
  ResultadosHematologiaSerologia,
  ResultadosHemoglobinaHematocritos,
  ResultadosHemoparasitos,
  ResultadosNuevoCompleto,
  ResultadosOrina,
  ResultadosOrinaHeces,
  ResultadosPruebaEmbarazo,
  ResultadosQuimica,
  ResultadosQuimicaColinesterasa,
  ResultadosQuimicaCorta,
  ResultadosQuimicaHeces,
  ResultadosQuimicaOrina,
  ResultadosQuimicaSerologia,
  ResultadosSerologia,
  ResultadosSerologiaAstoPsaPylori,
  ResultadosSerologiaHeces,
  ResultadosSerologiaOrina,
  ResultadosTipoSangre,
  ResultadosVDRLHepatitis,
  TipoExamen,
} from '@/types';
import { ExamTemplateSection } from '@/types/exam-template';
import Link from 'next/link';
import { useParams, useSearchParams } from 'next/navigation';
import { useEffect, useMemo, useRef, useState } from 'react';
import { toast } from 'react-hot-toast';
import Loading from './loading';

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
};

const examTypeAlias: Record<string, TipoExamen> = {
  hematologia: 'hematologia',
  orina: 'orina',
  heces: 'heces',
  dengue: 'dengue',
  quimica: 'quimica',
  serologia: 'serologia',
};

function normalizeExamType(rawName?: string): TipoExamen | null {
  if (!rawName) return null;
  const normalized = rawName
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '');
  return examTypeAlias[normalized] ?? null;
}

function mapResultStatus(status?: string): EstadoExamen {
  switch (status) {
    case 'completed':
      return 'completo';
    case 'sent':
      return 'enviado';
    case 'in_progress':
      return 'en_proceso';
    default:
      return 'pendiente';
  }
}

function mapHematologiaPayload(payload: Record<string, unknown>): ResultadosHematologia {
  const normalizedPayload = normalizePayloadAliases(payload);
  const get = (key: string) => String(normalizedPayload[key] ?? '');
  const sangriaMin = get('t_sangria_min');
  const sangriaSeg = get('t_sangria_seg');
  const coagulacionMin = get('t_coagulacion_min');
  const coagulacionSeg = get('t_coagulacion_seg');

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
    t_protrombina_control: String(normalizedPayload.t_protrombina_control ?? normalizedPayload.t_protombina_control ?? ''),
    inr: get('inr'),
    razon_pc: get('razon_pc'),
    ptt: get('ptt'),
    ptt_control: get('ptt_control'),
    t_sangria: [sangriaMin, sangriaSeg].filter(Boolean).join(':'),
    t_coagulacion: [coagulacionMin, coagulacionSeg].filter(Boolean).join(':'),
    observaciones: String(normalizedPayload.observaciones ?? normalizedPayload.notas ?? ''),
  };
}

function mapExamPayload(tipo: TipoExamen, payload?: Record<string, unknown>): ResultadosExamen | undefined {
  if (!payload) return undefined;
  const safePayload = normalizePayloadAliases(payload);
  if (tipo === 'hematologia') {
    return mapHematologiaPayload(safePayload);
  }
  return safePayload as unknown as ResultadosExamen;
}

function mapExamToPayload(tipo: TipoExamen, resultados?: ResultadosExamen): Record<string, unknown> {
  if (!resultados) return {};

  if (tipo !== 'hematologia') {
    return resultados as unknown as Record<string, unknown>;
  }

  const data = resultados as ResultadosHematologia;
  const [tSangriaMin, tSangriaSeg] = (data.t_sangria ?? '').split(':');
  const [tCoagulacionMin, tCoagulacionSeg] = (data.t_coagulacion ?? '').split(':');

  return {
    ...data,
    t_protombina: data.t_protrombina,
    t_protombina_control: data.t_protrombina_control,
    t_sangria_min: tSangriaMin ?? '',
    t_sangria_seg: tSangriaSeg ?? '',
    t_coagulacion_min: tCoagulacionMin ?? '',
    t_coagulacion_seg: tCoagulacionSeg ?? '',
    notas: data.observaciones,
  };
}

function normalizePayloadForApi(value: unknown): unknown {
  if (Array.isArray(value)) {
    return value.map((item) => normalizePayloadForApi(item));
  }

  if (value && typeof value === 'object') {
    return Object.fromEntries(
      Object.entries(value).map(([key, nestedValue]) => [key, normalizePayloadForApi(nestedValue)])
    );
  }

  if (typeof value === 'string') {
    const trimmed = value.trim();
    if (trimmed === '') return value;

    const normalizedDecimal = trimmed.replace(',', '.');
    if (/^-?\d+(\.\d+)?$/.test(normalizedDecimal)) {
      const parsed = Number(normalizedDecimal);
      if (!Number.isNaN(parsed)) return parsed;
    }
  }

  return value;
}

interface ExamenView extends Examen {
  templateSections: ExamTemplateSection[];
  templateName: string;
  useDynamicForm: boolean;
}

function mapPatient(apiPatient: {
  _id: string;
  first_name: string;
  last_name: string;
  document_number: string;
  birth_date?: string;
  phone: string;
  address?: string;
}): Paciente {
  const age = apiPatient.birth_date
    ? Math.max(0, Math.floor((Date.now() - new Date(apiPatient.birth_date).getTime()) / (365.25 * 24 * 60 * 60 * 1000)))
    : 0;

  return {
    id: apiPatient._id,
    nombre: `${apiPatient.first_name} ${apiPatient.last_name}`.trim(),
    edad: age,
    telefono: apiPatient.phone,
    fecha: '',
    examenes: [],
    cedula: apiPatient.document_number,
    direccion: apiPatient.address ?? '-',
  };
}

export default function ExamenPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const orderId = (params.id as string) || '';
  const examIdFromQuery = searchParams.get('examId');

  const { data: order, isLoading: isOrderLoading } = useOrderById(orderId || null);
  const { data: patientData } = usePatientById(order?.patient_id ?? null);

  const [isFormValid, setIsFormValid] = useState(false);
  const [readOnlyByExam, setReadOnlyByExam] = useState<Record<string, boolean>>({});
  const [doctorOrdenanteByExam, setDoctorOrdenanteByExam] = useState<Record<string, string>>({});
  const [estadoByExam, setEstadoByExam] = useState<Record<string, EstadoExamen>>({});
  const [draftResultadosByExam, setDraftResultadosByExam] = useState<Record<string, ResultadosExamen>>({});
  const [draftTemplateValuesByExam, setDraftTemplateValuesByExam] = useState<Record<string, TemplateFormValues>>({});
  const formContainerRef = useRef<HTMLDivElement | null>(null);

  const examenesPaciente = useMemo<ExamenView[]>(() => {
    if (!order?.exams) return [];

    const mapped: ExamenView[] = [];

    for (const exam of order.exams) {
      const normalizedTipo = normalizeExamType(exam.template_snapshot?.name);
      const tipo: TipoExamen = normalizedTipo ?? 'nuevo_completo';
      const templateSections = normalizeTemplateSections(exam.template_snapshot?.sections);

      mapped.push({
        id: exam._id,
        pacienteId: order.patient_id,
        tipo,
        estado: estadoByExam[exam._id] ?? mapResultStatus(exam.result_status),
        resultados: mapExamPayload(tipo, exam.result_payload),
        doctorOrdenante: doctorOrdenanteByExam[exam._id] ?? exam.doctor_name ?? '',
        fechaCreacion: exam.created_at ?? order.created_at,
        fechaActualizacion: exam.updated_at ?? order.updated_at ?? order.created_at,
        templateSections,
        templateName: exam.template_snapshot?.name || 'Examen',
        useDynamicForm: tipo !== 'hematologia' || templateSections.length > 0,
      });

    }

    return mapped;
  }, [order, doctorOrdenanteByExam, estadoByExam]);

  const selectedExamId = examIdFromQuery ?? examenesPaciente[0]?.id;
  const examenBase = examenesPaciente.find((e) => e.id === selectedExamId) ?? null;
  const examen = examenBase
    ? {
      ...examenBase,
      resultados: draftResultadosByExam[examenBase.id] ?? examenBase.resultados,
    }
    : null;

  const paciente = patientData ? mapPatient(patientData) : null;

  const initialReadOnly = examen?.estado === 'completo' || examen?.estado === 'enviado';
  const readOnly = examen ? (readOnlyByExam[examen.id] ?? initialReadOnly) : false;

  useEffect(() => {
    const container = formContainerRef.current;
    if (!container) return;

    const resetReadOnlyRender = () => {
      container.querySelectorAll<HTMLElement>('[data-readonly-generated="true"]').forEach((node) => node.remove());
      container.querySelectorAll<HTMLElement>('[data-readonly-hidden="true"]').forEach((node) => {
        node.style.removeProperty('display');
        node.removeAttribute('data-readonly-hidden');
      });
      container.querySelectorAll<HTMLElement>('[data-readonly-normal-weight="true"]').forEach((node) => {
        node.style.removeProperty('font-weight');
        node.removeAttribute('data-readonly-normal-weight');
      });
    };

    resetReadOnlyRender();
    if (!readOnly) return;

    const controls = container.querySelectorAll<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>('input, select, textarea');
    controls.forEach((control) => {
      if (control instanceof HTMLInputElement && control.type === 'hidden') return;

      if (control instanceof HTMLInputElement && (control.type === 'radio' || control.type === 'checkbox')) {
        const label = control.closest('label');
        if (!control.checked) {
          const target = label ?? control;
          target.style.display = 'none';
          target.setAttribute('data-readonly-hidden', 'true');
          return;
        }
        if (label) {
          label.style.fontWeight = '400';
          label.setAttribute('data-readonly-normal-weight', 'true');
        }
        return;
      }

      const value = control instanceof HTMLSelectElement
        ? (control.selectedOptions[0]?.textContent?.trim() || '-')
        : (control.value.trim() || '-');
      const readOnlyNode = document.createElement(control instanceof HTMLTextAreaElement ? 'div' : 'span');
      readOnlyNode.textContent = value;
      readOnlyNode.className = 'w-full py-2 text-lg text-primary break-words block';
      readOnlyNode.setAttribute('data-readonly-generated', 'true');
      control.insertAdjacentElement('afterend', readOnlyNode);
      control.style.display = 'none';
      control.setAttribute('data-readonly-hidden', 'true');
    });

    return resetReadOnlyRender;
  }, [readOnly, examen?.id]);

  if (isOrderLoading || !orderId) {
    return <Loading />;
  }

  if (!examen || !paciente) {
    return (
      <Loading />
    );
  }

  const doctorOrdenanteHistorico = [...examenesPaciente]
    .sort((a, b) => new Date(a.fechaCreacion).getTime() - new Date(b.fechaCreacion).getTime())
    .map((ex) => ex.doctorOrdenante?.trim())
    .find(Boolean) || '';
  const doctorExamenActual = examen.doctorOrdenante?.trim() || '';
  const doctorOrdenanteInput = doctorOrdenanteByExam[examen.id] ?? (doctorExamenActual || doctorOrdenanteHistorico);

  const setCurrentReadOnly = (nextValue: boolean) => {
    setReadOnlyByExam((prev) => ({
      ...prev,
      [examen.id]: nextValue,
    }));
  };

  const handleResultadosChange = (resultados: ResultadosExamen) => {
    setDraftResultadosByExam((prev) => ({
      ...prev,
      [examen.id]: resultados,
    }));
  };

  const handleTemplateValuesChange = (values: TemplateFormValues) => {
    setDraftTemplateValuesByExam((prev) => ({
      ...prev,
      [examen.id]: values,
    }));
  };

  const handleCompletar = async () => {
    const bioanalystName = doctorOrdenanteInput.trim();

    try {
      const resultados = draftResultadosByExam[examen.id] ?? examen.resultados;
      const templateValues = draftTemplateValuesByExam[examen.id]
        ?? buildInitialValuesFromTemplate(examen.templateSections, mapExamToPayload(examen.tipo, resultados));

      const payloadByTemplate = extractTemplatePayload(examen.templateSections, templateValues);
      const fallbackPayload = mapExamToPayload(examen.tipo, resultados);

      const rawPayload = examen.templateSections.length > 0 ? payloadByTemplate : fallbackPayload;
      const normalizedPayload = normalizePayloadForApi(rawPayload) as Record<string, unknown>;

      await createOrderExamResult(orderId, examen.id, {
        result_payload: normalizedPayload,
        doctor_name: bioanalystName,
      });

      setDoctorOrdenanteByExam((prev) => ({
        ...prev,
        [examen.id]: bioanalystName,
      }));
      setEstadoByExam((prev) => ({ ...prev, [examen.id]: 'completo' }));
      setCurrentReadOnly(true);
      toast.success('Resultado guardado exitosamente');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'No se pudo guardar el resultado');
    }
  };

  const handleCancelEdit = () => {
    setDoctorOrdenanteByExam((prev) => {
      const next = { ...prev };
      delete next[examen.id];
      return next;
    });
  };

  const handleSendEmail = async () => {
    const defaultEmail = examen.emailEnviado || '';
    const email = window.prompt('Ingresa el correo de destino', defaultEmail);
    if (!email?.trim()) return;

    try {
      await sendOrderExamEmail(orderId, examen.id, email.trim());
      alert('Email enviado');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'No se pudo enviar el email');
    }
  };

  const renderForm = () => {
    if (examen.useDynamicForm && examen.templateSections.length > 0) {
      const currentValues = draftTemplateValuesByExam[examen.id]
        ?? buildInitialValuesFromTemplate(examen.templateSections, mapExamToPayload(examen.tipo, examen.resultados));

      return (
        <DynamicExamForm
          sections={examen.templateSections}
          values={currentValues}
          onChange={handleTemplateValuesChange}
          onValidChange={setIsFormValid}
          readOnly={readOnly}
        />
      );
    }

    switch (examen.tipo) {
      case 'orina':
        return <FormOrina resultados={examen.resultados as ResultadosOrina} onChange={handleResultadosChange} />;
      case 'heces':
        return <FormHeces resultados={examen.resultados as ResultadosHeces} onChange={handleResultadosChange} onValidChange={setIsFormValid} />;
      case 'hematologia':
        return <FormHematologia resultados={examen.resultados as ResultadosHematologia} onChange={handleResultadosChange} onValidChange={setIsFormValid} readOnly={readOnly} />;
      case 'dengue':
        return <FormDengue resultados={examen.resultados as ResultadosDengue} onChange={handleResultadosChange} onValidChange={setIsFormValid} readOnly={readOnly} />;
      case 'quimica':
        return <FormQuimica resultados={examen.resultados as ResultadosQuimica} onChange={handleResultadosChange} />;
      case 'glicemia_pre_post':
        return <FormGlicemia resultados={examen.resultados as ResultadosGlicemia} onChange={handleResultadosChange} />;
      case 'hemoglobina_hematocritos':
        return <FormHemoglobinaHematocritos resultados={examen.resultados as ResultadosHemoglobinaHematocritos} onChange={handleResultadosChange} />;
      case 'hemoparasitos':
        return <FormHemoparasitos resultados={examen.resultados as ResultadosHemoparasitos} onChange={handleResultadosChange} />;
      case 'tipo_sangre':
        return <FormTipoSangre resultados={examen.resultados as ResultadosTipoSangre} onChange={handleResultadosChange} />;
      case 'prueba_embarazo':
        return <FormPruebaEmbarazo resultados={examen.resultados as ResultadosPruebaEmbarazo} onChange={handleResultadosChange} />;
      case 'frotis_sangre':
        return <FormFrotisSangre resultados={examen.resultados as ResultadosFrotisSangre} onChange={handleResultadosChange} />;
      case 'helicobacter_pylori':
        return <FormHelicobacterPylori resultados={examen.resultados as ResultadosHelicobacterPylori} onChange={handleResultadosChange} />;
      case 'serologia':
        return <FormSerologia resultados={examen.resultados as ResultadosSerologia} onChange={handleResultadosChange} />;
      case 'serologia_asto_psa_pylori':
        return <FormSerologiaAstoPsaPylori resultados={examen.resultados as ResultadosSerologiaAstoPsaPylori} onChange={handleResultadosChange} />;
      case 'vdrl_hepatitis':
        return <FormVDRLHepatitis resultados={examen.resultados as ResultadosVDRLHepatitis} onChange={handleResultadosChange} />;
      case 'quimica_colinesterasa':
        return <FormQuimicaColinesterasa resultados={examen.resultados as ResultadosQuimicaColinesterasa} onChange={handleResultadosChange} />;
      case 'quimica_corta':
        return <FormQuimicaCorta resultados={examen.resultados as ResultadosQuimicaCorta} onChange={handleResultadosChange} />;
      case 'quimica_heces':
        return <FormQuimicaHeces resultados={examen.resultados as ResultadosQuimicaHeces} onChange={handleResultadosChange} />;
      case 'quimica_orina':
        return <FormQuimicaOrina resultados={examen.resultados as ResultadosQuimicaOrina} onChange={handleResultadosChange} />;
      case 'quimica_serologia':
        return <FormQuimicaSerologia resultados={examen.resultados as ResultadosQuimicaSerologia} onChange={handleResultadosChange} />;
      case 'serologia_heces':
        return <FormSerologiaHeces resultados={examen.resultados as ResultadosSerologiaHeces} onChange={handleResultadosChange} />;
      case 'serologia_orina':
        return <FormSerologiaOrina resultados={examen.resultados as ResultadosSerologiaOrina} onChange={handleResultadosChange} />;
      case 'orina_heces':
        return <FormOrinaHeces resultados={examen.resultados as ResultadosOrinaHeces} onChange={handleResultadosChange} />;
      case 'hematologia_quimica':
        return <FormHematologiaQuimica resultados={examen.resultados as ResultadosHematologiaQuimica} onChange={handleResultadosChange} />;
      case 'hematologia_serologia':
        return <FormHematologiaSerologia resultados={examen.resultados as ResultadosHematologiaSerologia} onChange={handleResultadosChange} />;
      case 'nuevo_completo':
        return <FormNuevoCompleto resultados={examen.resultados as ResultadosNuevoCompleto} onChange={handleResultadosChange} />;
      default:
        return <p>Tipo de examen no soportado</p>;
    }
  };

  const isCurrentTemplateValid = examen.useDynamicForm && examen.templateSections.length > 0
    ? validateTemplateValues(
      examen.templateSections,
      draftTemplateValuesByExam[examen.id]
      ?? buildInitialValuesFromTemplate(examen.templateSections, mapExamToPayload(examen.tipo, examen.resultados)),
    )
    : isFormValid;

  const examenesCompletadosPaciente = examenesPaciente.filter((ex) => ex.estado === 'completo' || ex.estado === 'enviado').length;

  console.log(examen);

  return (
    <div className="h-full flex p-8 flex-col">
      <div className="no-print ">
        <AccionesExamen
          examen={examen}
          paciente={paciente}
          totalExamenesPaciente={examenesPaciente.length}
          examenesCompletadosPaciente={examenesCompletadosPaciente}
          onEnviarEmail={async (email) => {
            await sendOrderExamEmail(orderId, examen.id, email);
          }}
        />
      </div>

      {examenesPaciente.length > 1 && (
        <nav className="flex flex-col gap-4 mb-5">
          <span className="text-xl text-secondary">Examenes</span>
          <div className="flex gap-4">
            {examenesPaciente.map((ex) => (
              <Link
                key={ex.id}
                href={`/dashboard/examen/${orderId}?examId=${ex.id}`}
                scroll={false}
                className={`py-2 px-2.5 font-medium text-base transition-colors rounded-4xl ${ex.id === examen.id
                  ? 'border-primary text-white bg-primary '
                  : 'bg-primary/10 text-tertiary '
                  }`}
              >
                {ex.templateName || examLabels[ex.tipo]}
              </Link>
            ))}
          </div>
        </nav>
      )}

      <div className="bg-white rounded-3xl border border-border-default shadow-sm print-area ">
        <ExamenTabs
          readOnly={readOnly}
          setCurrentReadOnly={setCurrentReadOnly}
          examen={examen}
          examenes={examenesPaciente.map((e) => ({ id: e.id, tipo: e.tipo }))}
          examenActualId={examen.id}
          onPrint={() => window.print()}
          onSendEmail={handleSendEmail}
          doctorOrdenante={doctorOrdenanteInput}
          onDoctorOrdenanteChange={(value) => {
            setDoctorOrdenanteByExam((prev) => ({
              ...prev,
              [examen.id]: value,
            }));
          }}
          onCancelEdit={handleCancelEdit}
        />

        <div ref={formContainerRef} className="px-6 pb-6">
          <fieldset
            disabled={readOnly}
            className="[&_input:disabled]:opacity-100 [&_textarea:disabled]:opacity-100 [&_select:disabled]:opacity-100 [&_input:disabled]:bg-white [&_textarea:disabled]:bg-white [&_select:disabled]:bg-white [&_input:disabled]:text-gray-900 [&_textarea:disabled]:text-gray-900 [&_select:disabled]:text-gray-900 [&_input:disabled]:border-gray-300 [&_textarea:disabled]:border-gray-300 [&_select:disabled]:border-gray-300 [&_input[type='radio']:disabled]:opacity-100 [&_input[type='checkbox']:disabled]:opacity-100 [&_input[type='radio']:disabled]:accent-cyan-600 [&_input[type='checkbox']:disabled]:accent-cyan-600"
          >
            {renderForm()}
          </fieldset>
        </div>
      </div>

      <div className="mt-6 flex justify-end gap-2">
        <Button
          onClick={handleCompletar}
          disabled={!isCurrentTemplateValid || readOnly}
          variant="primary"
          size="md"
          className="cursor-pointer text-base"
        >
          Guardar resultado
        </Button>
      </div>

      <div className="mt-4 text-center text-xs text-gray-400 print-area">
        <p>Laboratorio Clinico - {new Date().toLocaleDateString('es-MX')}</p>
      </div>
    </div>
  );
}

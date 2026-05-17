'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { useLab } from '@/context/LabContext';
import ExamenTabs from '@/components/ExamenTabs';
import AccionesExamen from '@/components/AccionesExamen';
import FormOrina from '@/components/forms/FormOrina';
import FormHeces from '@/components/forms/FormHeces';
import FormHematologia from '@/components/forms/FormHematologia';
import FormDengue from '@/components/forms/FormDengue';
import FormQuimica from '@/components/forms/FormQuimica';
import FormGlicemia from '@/components/forms/FormGlicemia';
import FormHemoglobinaHematocritos from '@/components/forms/FormHemoglobinaHematocritos';
import FormHemoparasitos from '@/components/forms/FormHemoparasitos';
import FormTipoSangre from '@/components/forms/FormTipoSangre';
import FormPruebaEmbarazo from '@/components/forms/FormPruebaEmbarazo';
import FormFrotisSangre from '@/components/forms/FormFrotisSangre';
import FormHelicobacterPylori from '@/components/forms/FormHelicobacterPylori';
import FormSerologia from '@/components/forms/FormSerologia';
import FormSerologiaAstoPsaPylori from '@/components/forms/FormSerologiaAstoPsaPylori';
import FormVDRLHepatitis from '@/components/forms/FormVDRLHepatitis';
import FormQuimicaColinesterasa from '@/components/forms/FormQuimicaColinesterasa';
import FormQuimicaCorta from '@/components/forms/FormQuimicaCorta';
import FormQuimicaHeces from '@/components/forms/FormQuimicaHeces';
import FormQuimicaOrina from '@/components/forms/FormQuimicaOrina';
import FormQuimicaSerologia from '@/components/forms/FormQuimicaSerologia';
import FormSerologiaHeces from '@/components/forms/FormSerologiaHeces';
import FormSerologiaOrina from '@/components/forms/FormSerologiaOrina';
import FormOrinaHeces from '@/components/forms/FormOrinaHeces';
import FormHematologiaQuimica from '@/components/forms/FormHematologiaQuimica';
import FormHematologiaSerologia from '@/components/forms/FormHematologiaSerologia';
import FormNuevoCompleto from '@/components/forms/FormNuevoCompleto';
import {
  ResultadosOrina,
  ResultadosHeces,
  ResultadosHematologia,
  ResultadosDengue,
  ResultadosQuimica,
  ResultadosGlicemia,
  ResultadosHemoglobinaHematocritos,
  ResultadosHemoparasitos,
  ResultadosTipoSangre,
  ResultadosPruebaEmbarazo,
  ResultadosFrotisSangre,
  ResultadosHelicobacterPylori,
  ResultadosSerologia,
  ResultadosSerologiaAstoPsaPylori,
  ResultadosVDRLHepatitis,
  ResultadosQuimicaColinesterasa,
  ResultadosQuimicaCorta,
  ResultadosQuimicaHeces,
  ResultadosQuimicaOrina,
  ResultadosQuimicaSerologia,
  ResultadosSerologiaHeces,
  ResultadosSerologiaOrina,
  ResultadosOrinaHeces,
  ResultadosHematologiaQuimica,
  ResultadosHematologiaSerologia,
  ResultadosNuevoCompleto,
  ResultadosExamen,
  TipoExamen,
} from '@/types';
import { Save } from 'lucide-react';
import Loading from './loading';
import { Button } from '@/components/ui/Button';



export default function ExamenPage() {
  const params = useParams();
  const { examenes, pacientes, actualizarExamen, cambiarEstado, getExamenesPorPaciente, enviarEmail } = useLab();
  const [isFormValid, setIsFormValid] = useState(false);
  const [readOnlyByExam, setReadOnlyByExam] = useState<Record<string, boolean>>({});
  const [doctorOrdenanteByExam, setDoctorOrdenanteByExam] = useState<Record<string, string>>({});
  const formContainerRef = useRef<HTMLDivElement | null>(null);

  const examen = examenes.find(e => e.id === params.id);
  const initialReadOnly = examen?.estado === 'completo' || examen?.estado === 'enviado';
  const readOnly = examen ? (readOnlyByExam[examen.id] ?? initialReadOnly) : false;

  useEffect(() => {
    const container = formContainerRef.current;

    if (!container) return;

    const resetReadOnlyRender = () => {
      container.querySelectorAll<HTMLElement>('[data-readonly-generated="true"]').forEach(node => {
        node.remove();
      });

      container.querySelectorAll<HTMLElement>('[data-readonly-hidden="true"]').forEach(node => {
        node.style.removeProperty('display');
        node.removeAttribute('data-readonly-hidden');
      });

      container.querySelectorAll<HTMLElement>('[data-readonly-normal-weight="true"]').forEach(node => {
        node.style.removeProperty('font-weight');
        node.removeAttribute('data-readonly-normal-weight');
      });
    };

    resetReadOnlyRender();

    if (!readOnly) return;

    const controls = container.querySelectorAll<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>('input, select, textarea');

    controls.forEach(control => {
      if (control instanceof HTMLInputElement && control.type === 'hidden') {
        return;
      }

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
      readOnlyNode.className = 'w-full py-2 text-lg text-primary  break-words block';
      readOnlyNode.setAttribute('data-readonly-generated', 'true');

      control.insertAdjacentElement('afterend', readOnlyNode);
      control.style.display = 'none';
      control.setAttribute('data-readonly-hidden', 'true');
    });

    return resetReadOnlyRender;
  }, [readOnly, examen?.id]);

  if (!examen) {
    return (
      <div className=''>
        <div className=''>
          <Loading />
        </div>
      </div>
    );
  }

  const paciente = pacientes.find(p => p.id === examen.pacienteId);
  const examenesPaciente = paciente ? getExamenesPorPaciente(paciente.id) : [];
  const doctorOrdenanteHistorico = [...examenesPaciente]
    .sort((a, b) => new Date(a.fechaCreacion).getTime() - new Date(b.fechaCreacion).getTime())
    .map(ex => ex.doctorOrdenante?.trim())
    .find(Boolean) || '';
  const doctorExamenActual = examen.doctorOrdenante?.trim() || '';
  const doctorOrdenanteInput = doctorOrdenanteByExam[examen.id] ?? (doctorExamenActual || doctorOrdenanteHistorico);

  const setCurrentReadOnly = (nextValue: boolean) => {
    setReadOnlyByExam(prev => ({
      ...prev,
      [examen.id]: nextValue,
    }));
  };

  const handleResultadosChange = (resultados: ResultadosExamen) => {
    actualizarExamen(examen.id, resultados);
  };

  const handleCompletar = async () => {
    const doctorOrdenanteNormalizado = doctorOrdenanteInput.trim();
    const doctorOrdenanteFinal = doctorOrdenanteNormalizado || 'Sin orden médica';

    setDoctorOrdenanteByExam(prev => ({
      ...prev,
      [examen.id]: doctorOrdenanteFinal,
    }));

    await cambiarEstado(examen.id, 'completo', doctorOrdenanteFinal);
    setCurrentReadOnly(true);
  };

  const handleCancelEdit = () => {
    setDoctorOrdenanteByExam(prev => {
      const next = { ...prev };
      delete next[examen.id];
      return next;
    });
  };

  const handleValidChange = (isValid: boolean) => {
    setIsFormValid(isValid);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleSendEmail = async () => {
    const defaultEmail = examen.emailEnviado || '';
    const email = window.prompt('Ingresa el correo de destino', defaultEmail);

    if (!email) return;

    const emailNormalizado = email.trim();
    if (!emailNormalizado) return;

    await enviarEmail(examen.id, emailNormalizado);
    alert('Email enviado');
  };

  const examLabels: Record<TipoExamen, string> = {
    dengue: 'Dengue',
    frotis_sangre: 'Frotis de sangre periferica',
    glicemia_pre_post: 'Glicemia pre post',
    heces: 'Heces',
    hematologia: 'Hematología',
    helicobacter_pylori: 'Helicobacter Pylori',
    hematologia_quimica: 'Hematología y Química',
    hematologia_serologia: 'Hematología y Serología',
    hemoglobina_hematocritos: 'Hemoglobina Hematocritos',
    hemoparasitos: 'Hemoparasitos',
    nuevo_completo: 'Nuevo Completo',
    orina_heces: 'Orina y Heces',
    orina: 'Orina',
    prueba_embarazo: 'Prueba de embarazo',
    quimica_colinesterasa: 'Química Colinesterasa',
    quimica_corta: 'Quimica sanguinea mas corta',
    quimica_heces: 'Química y Heces',
    quimica_orina: 'Química y Orina',
    quimica_serologia: 'Química y Serología',
    quimica: 'Química',
    serologia_asto_psa_pylori: 'Serologia ASTO PSA Pylori',
    serologia_heces: 'Serología y Heces',
    serologia_orina: 'Serología y Orina',
    serologia: 'Serología',
    tipo_sangre: 'Tipo de sangre',
    vdrl_hepatitis: 'VDRL Hepatitis y demas',
  };

  const renderForm = () => {
    switch (examen.tipo) {
      case 'orina':
        return <FormOrina resultados={examen.resultados as ResultadosOrina} onChange={handleResultadosChange} />;
      case 'heces':
        return <FormHeces resultados={examen.resultados as ResultadosHeces} onChange={handleResultadosChange} onValidChange={handleValidChange} />;
      case 'hematologia':
        return <FormHematologia resultados={examen.resultados as ResultadosHematologia} onChange={handleResultadosChange} onValidChange={handleValidChange} readOnly={readOnly} />;
      case 'dengue':
        return <FormDengue resultados={examen.resultados as ResultadosDengue} onChange={handleResultadosChange} onValidChange={handleValidChange} readOnly={readOnly} />;
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

  return (
    <div className="h-full flex p-8 flex-col">


      {paciente && (
        <div className="no-print ">
          <AccionesExamen examen={examen} paciente={paciente} />
        </div>
      )}

      {!examen ? (
        <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm  print-area">
          <p>Examen no encontrado</p>
        </div>
      ) : (
        <>
          {examenesPaciente.length > 1 && (
            <nav className="flex flex-col gap-4 mb-5">
              <span className='text-xl text-secondary'>Exámenes</span>
              <div className='flex gap-4'>
                {examenesPaciente.map(ex => (
                  <Link
                    key={ex.id}
                    href={`/dashboard/examen/${ex.id}`}
                    scroll={false}
                    className={`py-2 px-2.5 font-medium text-base transition-colors rounded-4xl ${ex.id === examen.id
                      ? 'border-primary text-white bg-primary '
                      : 'bg-primary/10 text-tertiary '
                      }`}
                  >
                    {examLabels[ex.tipo]}

                  </Link>
                ))}
              </div>
            </nav>
          )}
          <div className="bg-white rounded-3xl  border border-border-default shadow-sm  print-area ">


            <ExamenTabs
              readOnly={readOnly}
              setCurrentReadOnly={setCurrentReadOnly}
              examen={examen}
              examenes={examenesPaciente.map(e => ({ id: e.id, tipo: e.tipo }))}
              examenActualId={examen.id}
              onPrint={handlePrint}
              onSendEmail={handleSendEmail}
              doctorOrdenante={doctorOrdenanteInput}
              onDoctorOrdenanteChange={(value) => {
                setDoctorOrdenanteByExam(prev => ({
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
              disabled={!isFormValid || readOnly}
              variant='primary'
              size='md'
              className='cursor-pointer text-base'
            >
              Guardar resultado
            </Button>
          </div>
        </>
      )}

      <div className="mt-4 text-center text-xs text-gray-400 print-area">
        <p>Laboratorio Clínico - {new Date().toLocaleDateString('es-MX')}</p>
      </div>
    </div>
  );
}

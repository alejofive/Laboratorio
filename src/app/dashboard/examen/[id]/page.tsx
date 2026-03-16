'use client';

import { useParams, useRouter } from 'next/navigation';
import { useState } from 'react';
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
  EstadoExamen,
} from '@/types';
import { Save, Pencil } from 'lucide-react';
import Loading from './loading';



export default function ExamenPage() {
  const params = useParams();
  const router = useRouter();
  const { examenes, pacientes, actualizarExamen, cambiarEstado, getExamenesPorPaciente } = useLab();
  const [isFormValid, setIsFormValid] = useState(false);
  const [readOnly, setReadOnly] = useState(false);

  const examen = examenes.find(e => e.id === params.id);

  if (!examen) {
    return (
      <div className='max-w-4xl mx-auto h-full flex flex-col justify-center gap-6'>
        <div className=''>
          <Loading />
        </div>
      </div>
    );
  }

  const paciente = pacientes.find(p => p.id === examen.pacienteId);
  const examenesPaciente = paciente ? getExamenesPorPaciente(paciente.id) : [];

  const handleResultadosChange = (resultados: any) => {
    actualizarExamen(examen.id, resultados);
  };

  const handleCompletar = () => {
    cambiarEstado(examen.id, 'completo');
    setReadOnly(true);
  };

  const estados: EstadoExamen[] = ['pendiente', 'en_proceso', 'completo', 'enviado'];

  const handleValidChange = (isValid: boolean) => {
    setIsFormValid(isValid);
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
    <div className="max-w-4xl mx-auto h-full flex flex-col justify-center gap-6">


      {paciente && (
        <div className="no-print mt-6">
          <AccionesExamen examen={examen} paciente={paciente} />
        </div>
      )}

      {!examen ? (
        <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm  print-area">
          <p>Examen no encontrado</p>
        </div>
      ) : (
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm  print-area ">

          <div className="flex justify-between p-4 border-b border-gray-200">
            <h1 className="text-2xl font-bold text-gray-900">Examen: {examen.tipo}</h1>
            <button
              onClick={() => setReadOnly(!readOnly)}
              className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors flex gap-2 items-center ${readOnly ? 'bg-amber-100 text-amber-700 hover:bg-amber-200' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
            >
              <Pencil className="w-4 h-4" />
              {readOnly ? 'Editar' : 'Solo lectura'}
            </button>
          </div>
          <ExamenTabs examenes={examenesPaciente.map(e => ({ id: e.id, tipo: e.tipo }))} examenActualId={examen.id} />

          <div className="px-6 pb-6 mt-6">


            {renderForm()}
            <div className="mt-6 flex justify-end gap-2">
              <button
                onClick={handleCompletar}
                disabled={!isFormValid || readOnly}
                className="px-4 py-2 bg-cyan-600 hover:bg-cyan-700 text-white text-sm font-bold rounded-md transition-colors flex gap-2 items-center disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Save /> Guardar
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="mt-4 text-center text-xs text-gray-400 print-area">
        <p>Laboratorio Clínico - {new Date().toLocaleDateString('es-MX')}</p>
      </div>
    </div>
  );
}

'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Examen, EstadoExamen, Paciente } from '@/types';
import { useLab } from '@/context/LabContext';
import EstadoBadge from './EstadoBadge';
import { ArrowLeft, FileText, FlaskConical, Mail } from 'lucide-react';

interface AccionesExamenProps {
  examen: Examen;
  paciente: Paciente;
}

const examLabels: Record<string, string> = {
  dengue: 'Dengue',
  frotis_sangre: 'Frotis de sangre periferica',
  glicemia_pre_post: 'GLICEMIA PRE POST',
  heces: 'Examen de Heces',
  hematologia: 'Hematología',
  helicobacter_pylori: 'Helicobacter Pylori',
  hematologia_quimica: 'Hematología y Química',
  hematologia_serologia: 'Hematología y Serología',
  hemoglobina_hematocritos: 'Hemoglobina Hematocritos',
  hemoparasitos: 'Hemoparasitos',
  nuevo_completo: 'Nuevo Completo',
  orina_heces: 'Orina y Heces',
  orina: 'Análisis de Orina',
  prueba_embarazo: 'PRUEBA DE EMBARAZO',
  quimica_colinesterasa: 'Química Colinesterasa',
  quimica_corta: 'QUIMICA SANGUINEA MAS CORTA',
  quimica_heces: 'Química y Heces',
  quimica_orina: 'Química y Orina',
  quimica_serologia: 'Química y Serología',
  quimica: 'Química Sanguínea',
  serologia_asto_psa_pylori: 'Serologia ASTO PSA Pylori',
  serologia_heces: 'Serología y Heces',
  serologia_orina: 'Serología y Orina',
  serologia: 'Serología',
  tipo_sangre: 'Tipo de sangre',
  vdrl_hepatitis: 'VDRL Hepatitis y demas',
};

export default function AccionesExamen({ examen, paciente }: AccionesExamenProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const cedulaParam = searchParams.get('cedula');
  const { enviarEmail } = useLab();
  const [email, setEmail] = useState('');
  const [showEmailModal, setShowEmailModal] = useState(false);

  const handleVolver = () => {
    if (cedulaParam) {
      router.push(`/dashboard/pacientes/${cedulaParam}`);
    } else {
      router.push('/dashboard/solicitudes');
    }
  };


  const handleImprimir = () => {
    window.print();
  };

  const handleEnviarEmail = () => {
    if (email) {
      enviarEmail(examen.id, email);
      setShowEmailModal(false);
      setEmail('');
      alert('Email enviado (simulado)');
    }
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">

        <div>
          <button
            onClick={handleVolver}
            className="cursor-pointer"
          >
            <ArrowLeft className="text-gray-700" />
          </button>
          <p className="text-2xl text-gray-700 flex gap-2 items-center"><FlaskConical className="text-cyan-600" /><span className="font-bold text-gray-900">{examLabels[examen.tipo]}</span></p>

          {paciente && (
            <div className="mt-2 text-sm text-gray-500 flex gap-4">
              <span>Paciente: <strong className="text-gray-700">{paciente.nombre}</strong></span>
              <span>Edad: <strong className="text-gray-700">{paciente.edad}</strong></span>
              <span>Cedula: <strong className="text-gray-700">{paciente.cedula}</strong></span>
              <span>Dirección: <strong className="text-gray-700">{paciente.direccion}</strong></span>
            </div>
          )}

        </div>
        <EstadoBadge estado={examen.estado} />
      </div>

      <div className="flex flex-wrap justify-end gap-2">

        {(examen.estado === 'completo') && (
          <div className='flex items-center gap-3'>
            <button
              onClick={handleImprimir}
              className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white text-sm font-bold rounded-md transition-colors flex gap-2 items-center"
            >
              <FileText /> Imprimir PDF
            </button>
            <button
              onClick={() => setShowEmailModal(true)}
              className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white text-sm font-bold rounded-md transition-colors flex gap-2 items-center"
            >
              <Mail /> Enviar Email
            </button>
          </div>
        )}
      </div>

      {
        showEmailModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Enviar por Email</h3>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="correo@ejemplo.com"
                className="w-full px-3 py-2 border border-gray-300 rounded-md mb-4 "
              />
              <div className="flex gap-2">
                <button
                  onClick={handleEnviarEmail}
                  className="flex-1 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-md"
                >
                  Enviar
                </button>
                <button
                  onClick={() => setShowEmailModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md"
                >
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        )
      }
    </div >
  );
}

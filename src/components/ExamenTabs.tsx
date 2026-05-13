'use client';

import { useEffect, useRef, useState } from 'react';
import { Examen, TipoExamen } from '@/types';
import { ChevronDown } from 'lucide-react';

interface ExamenTabsProps {
  examenes: { id: string; tipo: TipoExamen }[];
  examenActualId: string;
  examen: Examen;
  readOnly: boolean;
  setCurrentReadOnly: (nextValue: boolean) => void;
  doctorOrdenante: string;
  onDoctorOrdenanteChange: (value: string) => void;
  onPrint: () => void;
  onSendEmail: () => void;
}

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

export default function ExamenTabs({
  examenes,
  examenActualId,
  examen,
  readOnly,
  setCurrentReadOnly,
  doctorOrdenante,
  onDoctorOrdenanteChange,
  onPrint,
  onSendEmail,
}: ExamenTabsProps) {
  const capitalize = (str: string) => str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  const formularioGuardado = examen.estado === 'completo' || examen.estado === 'enviado';
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (!menuRef.current) return;
      if (!menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);


  return (
    <div className="">

      <div className="flex p-6 justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Examen: {capitalize(examen.tipo)}</h1>
        <div className="flex gap-3 items-center">
          <label className="flex text-base gap-2 items-center font-medium text-tertiary">
            Ordenado por:
            <input
              type="text"
              value={doctorOrdenante}
              onChange={(event) => onDoctorOrdenanteChange(event.target.value)}
              readOnly={readOnly}
              className="rounded-xl border border-gray-300 px-4 py-3 text-sm text-gray-900 w-48"
              placeholder="Nombre del doctor"
            />
          </label>
          {formularioGuardado && (
            <div className="relative" ref={menuRef}>
              <button
                onClick={() => setIsMenuOpen(prev => !prev)}
                className="px-3 py-1.5 text-sm font-medium rounded-md transition-colors flex gap-2 items-center h-9 justify-center bg-white shadow-md border border-gray-200"
              >
                <img src="/svg/menu.svg" alt="Menu" className="text-secondary" />
              </button>

              {isMenuOpen && (
                <div className="absolute right-0 mt-2 w-52 rounded-xl border border-gray-200 bg-white shadow-lg z-20 py-1">
                  <button
                    onClick={() => {
                      onPrint();
                      setIsMenuOpen(false);
                    }}
                    className="w-full flex items-center gap-2 text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    <img src="/svg/material2.svg" alt="" /> Imprimir examen
                  </button>
                  <button
                    onClick={() => {
                      onSendEmail();
                      setIsMenuOpen(false);
                    }}
                    className="w-full flex items-center gap-2 text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    <img src="/svg/email.svg" alt="" /> Enviar al correo
                  </button>
                  <button
                    onClick={() => {
                      setCurrentReadOnly(false);
                      setIsMenuOpen(false);
                    }}
                    className="w-full flex items-center gap-2 text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    <img src="/svg/edit.svg" alt="" /> Editar
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

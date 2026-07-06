'use client';

import { Examen, TipoExamen } from '@/types';
import { Calendar } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

interface ExamenTabsProps {
  examenes: { id: string; tipo: TipoExamen }[];
  examenActualId: string;
  examen: Examen;
  examenNombre: string;
  readOnly: boolean;
  setCurrentReadOnly: (nextValue: boolean) => void;
  doctorOrdenante: string;
  onDoctorOrdenanteChange: (value: string) => void;
  onCancelEdit: () => void;
  onPrint: () => void;
  onSendEmail: () => void;
}

export default function ExamenTabs({
  examen,
  readOnly,
  setCurrentReadOnly,
  doctorOrdenante,
  onDoctorOrdenanteChange,
  onCancelEdit,
  onPrint,
  onSendEmail,
}: ExamenTabsProps) {
  const formularioGuardado = examen.estado === 'completo' || examen.estado === 'enviado';
  const doctorOrdenanteMostrado = doctorOrdenante.trim() || 'Sin orden médica';
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);
  const fechaExamen = new Date(examen.fechaCreacion).toLocaleDateString('es-ES');

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
    <div className="rounded-2xl border border-border-default bg-white px-4 py-4 md:px-5">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div className="grid w-full gap-6 md:max-w-[548px] md:grid-cols-2">
          <div>
            <label className="mb-1 block text-sm font-medium text-tertiary">Ordenado por:</label>
            {readOnly ? (
              <span className="flex h-12 items-center rounded-xl border border-border-input px-4 text-base text-primary">
                {doctorOrdenanteMostrado}
              </span>
            ) : (
              <input
                type="text"
                value={doctorOrdenante}
                onChange={(event) => onDoctorOrdenanteChange(event.target.value)}
                readOnly={readOnly}
                className="h-12 w-full rounded-xl border border-border-input px-4 text-base text-primary placeholder:text-sm placeholder:text-secondary/70 focus:border-brand-primary focus:outline-none"
                placeholder="Nombre del doctor"
              />
            )}
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-tertiary">Fecha del examen</label>
            <div className="flex h-12 items-center justify-between rounded-xl border border-border-input px-4 text-base text-primary">
              <span>{fechaExamen}</span>
              <Calendar className="h-4 w-4 text-secondary" />
            </div>
          </div>
        </div>
        {formularioGuardado && (
          <div ref={menuRef} className="relative self-start md:self-center">
            <button
              onClick={() => {
                if (readOnly) {
                  setIsMenuOpen(prev => !prev);
                  return;
                }

                onCancelEdit();
                setCurrentReadOnly(true);
                setIsMenuOpen(false);
              }}
              className="cursor-pointer"
            >
              {readOnly ? (
                <img src="/svg/menu.svg" alt="Menu" className="flex h-9 items-center justify-center rounded-md border border-border-default bg-white px-3 py-1.5 text-sm font-medium text-secondary shadow-sm transition-colors" />
              ) : (
                <img src="/svg/xicon.svg" alt="Cerrar" className="px-3 py-1.5 text-secondary" />
              )}
            </button>

            {readOnly && isMenuOpen && (
              <div className="absolute right-0 z-20 mt-2 w-52 rounded-xl border border-border-default bg-white py-1 shadow-lg">
                <button
                  onClick={() => {
                    onPrint();
                    setIsMenuOpen(false);
                  }}
                  className="flex w-full items-center gap-2 px-4 py-2 text-left text-sm text-tertiary hover:bg-surface-muted"
                >
                  <img src="/svg/material2.svg" alt="" /> Imprimir examen
                </button>
                <button
                  onClick={() => {
                    onSendEmail();
                    setIsMenuOpen(false);
                  }}
                  className="flex w-full items-center gap-2 px-4 py-2 text-left text-sm text-tertiary hover:bg-surface-muted"
                >
                  <img src="/svg/email.svg" alt="" /> Enviar al correo
                </button>
                <button
                  onClick={() => {
                    setCurrentReadOnly(false);
                    setIsMenuOpen(false);
                  }}
                  className="flex w-full items-center gap-2 px-4 py-2 text-left text-sm text-tertiary hover:bg-surface-muted"
                >
                  <img src="/svg/edit.svg" alt="" /> Editar
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

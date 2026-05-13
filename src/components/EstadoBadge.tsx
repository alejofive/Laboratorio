'use client';

import { EstadoExamen } from '@/types';

interface EstadoBadgeProps {
  estado: EstadoExamen;
  className?: string;
}

const estados: Record<EstadoExamen, { label: string; bg: string; text: string }> = {
  pendiente: { label: 'Pendiente', bg: 'bg-surface-muted', text: 'text-secondary' },
  en_proceso: { label: 'En Proceso', bg: 'bg-blue-100', text: 'text-blue-700' },
  completo: { label: 'Completo', bg: 'bg-green-100', text: 'text-green-700' },
  enviado: { label: 'Enviado', bg: 'bg-gray-100', text: 'text-gray-600' },
};

export default function EstadoBadge({ estado, className = '' }: EstadoBadgeProps) {
  const config = estados[estado];

  return (
    <span className={`inline-flex items-center gap-2 px-2.5 py-1 rounded-full text-xs font-medium ${config.bg} ${config.text} ${className}`}>
      {config.label}
      {
        estado === 'completo' && <img src="/svg/check.svg" alt="Check" />
      }
    </span>
  );
}

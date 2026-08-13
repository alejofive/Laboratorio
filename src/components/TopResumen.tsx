'use client'

import { useMemo } from 'react'

interface TopResumenProps {
  solicitudes?: boolean
  filtroEstado?: 'pendiente' | 'completo'
  totalSolicitudes?: number
  totalParaImprimir?: number
}

export default function TopResumen({ solicitudes }: TopResumenProps) {
  const fechaActual = useMemo(() => {
    const formatter = new Intl.DateTimeFormat('es-ES', {
      weekday: 'long',
      day: '2-digit',
      month: 'long',
    })

    const [weekday, rest] = formatter.format(new Date()).split(', ')
    if (!weekday || !rest) return formatter.format(new Date())

    return `${weekday.charAt(0).toUpperCase()}${weekday.slice(1)}, ${rest}`
  }, [])

  return (
    <div className='flex flex-wrap items-start justify-between gap-4'>
      {solicitudes ? (
        <div>
          <h1 className='text-2xl font-bold text-primary'>Solicitudes</h1>
        </div>
      ) : (
        <div>
          <h1 className='text-2xl font-bold text-primary'>Resumen del día</h1>
          <p className='text-secondary text-lg font-normal'>{fechaActual}</p>
        </div>
      )}
    </div>
  )
}

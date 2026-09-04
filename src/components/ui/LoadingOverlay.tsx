'use client'

import { useEffect } from 'react'

type LoadingOverlayProps = {
  isOpen: boolean
  title?: string
  description?: string
}

export default function LoadingOverlay({
  isOpen,
  title = 'Procesando...',
  description = 'Espera mientras completamos la operación.',
}: LoadingOverlayProps) {
  useEffect(() => {
    if (!isOpen) return

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    return () => {
      document.body.style.overflow = previousOverflow
    }
  }, [isOpen])

  if (!isOpen) return null

  return (
    <div
      className='fixed inset-0 z-[100] flex items-center justify-center bg-primary/35 px-4 backdrop-blur-[2px]'
      role='status'
      aria-live='polite'
      aria-atomic='true'
    >
      <div className='flex w-full max-w-sm flex-col items-center rounded-3xl border border-border-default bg-surface p-8 text-center shadow-xl'>
        <span
          className='size-12 animate-spin rounded-full border-4 border-brand-soft/40 border-t-brand-primary'
          aria-hidden='true'
        />
        <p className='mt-5 text-xl font-semibold text-primary'>{title}</p>
        <p className='mt-2 text-sm text-secondary'>{description}</p>
      </div>
    </div>
  )
}

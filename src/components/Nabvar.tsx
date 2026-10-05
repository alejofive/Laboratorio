'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { ClipboardList, Grid2X2, LayoutTemplate, Palette, Plus, Users, X } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'

const mainItems = [
  { label: 'Nueva', desktopLabel: 'Crear solicitud', href: '/dashboard', icon: Plus },
  { label: 'Solicitudes', desktopLabel: 'Solicitudes', href: '/dashboard/solicitudes', icon: ClipboardList },
  { label: 'Pacientes', desktopLabel: 'Pacientes', href: '/dashboard/pacientes', icon: Users },
]

const extraItems = [
  { label: 'Plantillas de exámenes', href: '/dashboard/exam-templates', icon: LayoutTemplate },
  { label: 'UI Kit', href: '/dashboard/ui-kit', icon: Palette },
]

const isCurrent = (pathname: string, href: string) =>
  href === '/dashboard'
    ? pathname === href
    : pathname === href || pathname.startsWith(`${href}/`)

export default function Navbar() {
  const pathname = usePathname()
  const [moreOpen, setMoreOpen] = useState(false)
  const moreButtonRef = useRef<HTMLButtonElement>(null)
  const closeButtonRef = useRef<HTMLButtonElement>(null)
  const morePanelRef = useRef<HTMLElement>(null)
  const moreActive = extraItems.some(item => isCurrent(pathname, item.href))

  useEffect(() => {
    if (!moreOpen) return
    const moreButton = moreButtonRef.current
    closeButtonRef.current?.focus()
    const onEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setMoreOpen(false)
      if (event.key !== 'Tab') return
      const focusable = morePanelRef.current?.querySelectorAll<HTMLElement>('button, a[href]')
      if (!focusable?.length) return
      const first = focusable[0]
      const last = focusable[focusable.length - 1]
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault()
        first.focus()
      }
    }
    document.addEventListener('keydown', onEscape)
    return () => {
      document.removeEventListener('keydown', onEscape)
      moreButton?.focus()
    }
  }, [moreOpen])

  return (
    <>
      <aside className='sticky top-0 hidden h-screen w-[218px] shrink-0 flex-col overflow-y-auto border-r border-border-default bg-surface lg:flex'>
        <div className='mx-5 my-8 flex items-center gap-3'>
          <Image src='/png/logo.png' alt='Laboratorio Clínico DOS G' width={40} height={48} priority />
          <p className='text-base font-bold leading-tight text-brand-logo'>Lab. Clínico<br />DOS G</p>
        </div>
        <nav className='flex flex-col gap-2 px-4' aria-label='Navegación principal'>
          {[...mainItems, ...extraItems].map(item => {
            const active = isCurrent(pathname, item.href) ||
              (item.href === '/dashboard/solicitudes' && pathname.startsWith('/dashboard/examen/'))
            return (
              <Link key={item.href} href={item.href} aria-current={active ? 'page' : undefined}
                className={`flex min-h-12 items-center gap-3 rounded-xl px-3 py-2 text-base transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary ${active ? 'bg-brand-active font-semibold text-brand-primary' : 'text-secondary hover:bg-surface-muted hover:text-primary'}`}>
                <item.icon aria-hidden='true' className='size-5 shrink-0' />
                <span>{'desktopLabel' in item && typeof item.desktopLabel === 'string' ? item.desktopLabel : item.label}</span>
              </Link>
            )
          })}
        </nav>
      </aside>

      {moreOpen && (
        <div className='lg:hidden'>
          <button type='button' className='fixed inset-0 z-40 bg-primary/35'
            aria-label='Cerrar opciones' onClick={() => setMoreOpen(false)} />
          <section ref={morePanelRef} id='mobile-more-options' role='dialog' aria-modal='true' aria-label='Más opciones'
            className='fixed inset-x-0 bottom-[calc(4.5rem+env(safe-area-inset-bottom))] z-50 rounded-t-3xl border border-border-default bg-surface p-4 shadow-lg'>
            <div className='mx-auto max-w-lg'>
              <div className='mb-3 flex items-center justify-between px-2'>
                <h2 className='text-lg font-semibold text-primary'>Más opciones</h2>
                <button ref={closeButtonRef} type='button' aria-label='Cerrar opciones'
                  onClick={() => setMoreOpen(false)}
                  className='flex size-11 items-center justify-center rounded-xl text-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary'>
                  <X aria-hidden='true' className='size-5' />
                </button>
              </div>
              {extraItems.map(item => (
                <Link key={item.href} href={item.href} onClick={() => setMoreOpen(false)}
                  aria-current={isCurrent(pathname, item.href) ? 'page' : undefined}
                  className='flex min-h-14 items-center gap-3 rounded-xl px-3 text-primary hover:bg-surface-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary'>
                  <item.icon aria-hidden='true' className='size-5 text-brand-primary' />
                  {item.label}
                </Link>
              ))}
            </div>
          </section>
        </div>
      )}

      <nav aria-label='Navegación principal móvil'
        className={`fixed inset-x-0 bottom-0 border-t border-border-default bg-surface pb-[env(safe-area-inset-bottom)] lg:hidden ${moreOpen ? 'z-30' : 'z-50'}`}>
        <div className='mx-auto grid h-[4.5rem] max-w-lg grid-cols-4 items-stretch px-2'>
          {mainItems.map(item => {
            const active = isCurrent(pathname, item.href) ||
              (item.href === '/dashboard/solicitudes' && pathname.startsWith('/dashboard/examen/'))
            return (
              <Link key={item.href} href={item.href} aria-current={active ? 'page' : undefined}
                className={`m-1 flex min-w-0 flex-col items-center justify-center gap-1 rounded-xl text-[11px] font-medium leading-tight transition-colors active:bg-brand-active focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary ${active ? 'bg-brand-active text-brand-primary' : 'text-secondary'}`}>
                <item.icon aria-hidden='true' className='size-5 shrink-0' strokeWidth={active ? 2.5 : 2} />
                <span>{item.label}</span>
              </Link>
            )
          })}
          <button ref={moreButtonRef} type='button' onClick={() => setMoreOpen(open => !open)}
            aria-expanded={moreOpen} aria-haspopup='dialog' aria-controls='mobile-more-options'
            className={`m-1 flex min-w-0 flex-col items-center justify-center gap-1 rounded-xl text-[11px] font-medium leading-tight transition-colors active:bg-brand-active focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary ${moreActive || moreOpen ? 'bg-brand-active text-brand-primary' : 'text-secondary'}`}>
            <Grid2X2 aria-hidden='true' className='size-5 shrink-0' strokeWidth={moreActive || moreOpen ? 2.5 : 2} />
            <span>Más</span>
          </button>
        </div>
      </nav>
    </>
  )
}

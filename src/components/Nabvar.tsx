'use client'

import Link from "next/link"
import Image from 'next/image'
import { usePathname } from "next/navigation"
import { Menu, X } from 'lucide-react'
import { useEffect, useRef, useState } from "react"
import SvgIcon from "./ui/SvgIcon"


const menuItems = [
    { label: 'Crear Solicitud', iconSrc: '/svg/plus.svg', href: '/dashboard' },
    { label: 'Solicitudes', iconSrc: '/svg/list.svg', href: '/dashboard/solicitudes' },
    { label: 'Pacientes', iconSrc: '/svg/people.svg', href: '/dashboard/pacientes' },
    { label: 'Plantillas', iconSrc: '/svg/list.svg', href: '/dashboard/exam-templates' },
    { label: 'UI Kit', iconSrc: '/svg/list.svg', href: '/dashboard/ui-kit' }
]

export default function Navbar() {
    const pathname = usePathname()
    const [isOpen, setIsOpen] = useState(false)
    const menuButtonRef = useRef<HTMLButtonElement>(null)
    const closeButtonRef = useRef<HTMLButtonElement>(null)
    const drawerRef = useRef<HTMLElement>(null)
    const activeItem = menuItems.find(item =>
        item.href === '/dashboard'
            ? pathname === item.href
            : pathname === item.href || pathname.startsWith(`${item.href}/`),
    )

    useEffect(() => {
        if (!isOpen) return

        const previousOverflow = document.body.style.overflow
        const menuButton = menuButtonRef.current
        document.body.style.overflow = 'hidden'
        closeButtonRef.current?.focus()

        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                setIsOpen(false)
                return
            }

            if (event.key !== 'Tab') return

            const focusableElements = drawerRef.current?.querySelectorAll<HTMLElement>(
                'a[href], button:not([disabled])',
            )
            if (!focusableElements?.length) return

            const firstElement = focusableElements[0]
            const lastElement = focusableElements[focusableElements.length - 1]

            if (event.shiftKey && document.activeElement === firstElement) {
                event.preventDefault()
                lastElement.focus()
            } else if (!event.shiftKey && document.activeElement === lastElement) {
                event.preventDefault()
                firstElement.focus()
            }
        }

        document.addEventListener('keydown', handleKeyDown)

        return () => {
            document.body.style.overflow = previousOverflow
            document.removeEventListener('keydown', handleKeyDown)
            menuButton?.focus()
        }
    }, [isOpen])

    const renderMenu = (onNavigate?: () => void) => (
        <nav className='flex flex-col gap-2 px-4' aria-label='Navegacion principal'>
            {menuItems.map(item => {
                const isActive = item.href === '/dashboard'
                    ? pathname === item.href
                    : pathname === item.href || pathname.startsWith(`${item.href}/`)

                return (
                    <Link
                        key={item.href}
                        href={item.href}
                        onClick={onNavigate}
                        aria-current={isActive ? 'page' : undefined}
                        className={`flex min-h-12 items-center gap-3 rounded-xl px-3 py-2 text-base transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary/30 ${isActive ? 'bg-brand-active font-bold text-brand-primary' : 'text-secondary hover:bg-surface-muted hover:text-primary'}`}
                    >
                        <SvgIcon src={item.iconSrc} size={24} />
                        <span>{item.label}</span>
                    </Link>
                )
            })}
        </nav>
    )

    return (
        <>
            <header className='fixed inset-x-0 top-0 z-30 flex h-16 items-center justify-between border-b border-border-default bg-surface px-4 lg:hidden'>
                <div className='flex min-w-0 items-center gap-3'>
                    <Image src='/png/logo.png' alt='Laboratorio Clinico DOS G' width={30} height={36} priority />
                    <div className='min-w-0'>
                        <p className='truncate text-xs font-medium text-secondary'>Laboratorio Clinico DOS G</p>
                        <p className='truncate text-sm font-semibold text-primary'>{activeItem?.label ?? 'Dashboard'}</p>
                    </div>
                </div>
                <button
                    ref={menuButtonRef}
                    type='button'
                    onClick={() => setIsOpen(true)}
                    className='flex size-11 items-center justify-center rounded-xl border border-border-default text-primary transition-colors hover:bg-surface-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary/30'
                    aria-label='Abrir menu principal'
                    aria-expanded={isOpen}
                    aria-controls='mobile-navigation'
                >
                    <Menu className='size-6' />
                </button>
            </header>

            {isOpen ? (
                <div className='lg:hidden'>
                    <button
                        type='button'
                        className='fixed inset-0 z-40 cursor-default bg-primary/35'
                        onClick={() => setIsOpen(false)}
                        aria-label='Cerrar menu principal'
                    />
                    <aside
                        ref={drawerRef}
                        id='mobile-navigation'
                        role='dialog'
                        aria-modal='true'
                        aria-label='Menu principal'
                        className='fixed inset-y-0 left-0 z-50 flex w-[min(20rem,calc(100vw-3rem))] flex-col border-r border-border-default bg-surface'
                    >
                        <div className='flex items-center justify-between border-b border-border-default px-5 py-5'>
                            <div className='flex items-center gap-3'>
                                <Image src='/png/logo.png' alt='' width={36} height={43} />
                                <p className='text-base font-bold leading-tight text-brand-logo'>
                                    Lab. Clinico<br />DOS G
                                </p>
                            </div>
                            <button
                                ref={closeButtonRef}
                                type='button'
                                onClick={() => setIsOpen(false)}
                                className='flex size-11 items-center justify-center rounded-xl text-secondary transition-colors hover:bg-surface-muted hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary/30'
                                aria-label='Cerrar menu principal'
                            >
                                <X className='size-6' />
                            </button>
                        </div>
                        <div className='flex-1 overflow-y-auto py-5'>
                            {renderMenu(() => setIsOpen(false))}
                        </div>
                    </aside>
                </div>
            ) : null}

            <aside className='sticky top-0 hidden h-screen w-[218px] shrink-0 flex-col overflow-y-auto border-r border-border-default bg-surface lg:flex'>
                <div className='mx-5 my-8 flex items-center gap-3'>
                    <Image src='/png/logo.png' alt='Laboratorio Clinico DOS G' width={40} height={48} priority />
                    <h1 className='text-base font-bold leading-tight text-brand-logo'>
                        Lab. Clinico<br />DOS G
                    </h1>
                </div>
                {renderMenu()}
            </aside>
        </>
    )
}

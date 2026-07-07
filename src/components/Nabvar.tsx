"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState } from "react"
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
    const [collapsed, setCollapsed] = useState(false)

    return (

        <aside
            className={`min-h-screen bg-white border-r border-slate-200 flex flex-col  min-w-[218px]
      ${collapsed ? 'w-20' : ''}
    `}
        >
            {/* Header */}
            <div className='px-5 my-8 flex items-center justify-between'>
                <div className="flex items-center gap-2.5">
                    <div className={` ${collapsed ? 'w-0 opacity-0' : 'w-10 h-12 opacity-100'}`}>
                        <div className=" mb-8 text-sm font-semibold leading-5 flex items-center gap-2">
                            <img className='w-10 h-12' src="/png/logo.png" alt="Logo" />

                        </div>

                    </div>
                    <h1 className={`text-brand-logo text-base font-bold ${collapsed ? 'w-0 opacity-0' : ' opacity-100'}`}>Lab. Clínico<br /><strong>DOS G</strong></h1>
                </div>


            </div>

            {/* Menu */}
            <nav className='flex flex-col gap-5 px-5'>
                {menuItems.map(item => {
                    const isActive = item.href === '/dashboard'
                        ? pathname === item.href
                        : pathname === item.href || pathname.startsWith(`${item.href}/`)

                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`flex items-center  text-base gap-2 rounded-xl px-3 py-2 ${isActive ? 'bg-brand-active text-brand-primary font-bold' : 'text-secondary hover:bg-gray-100'}`}
                        >
                            {/* Icon */}
                            <SvgIcon src={item.iconSrc} size={24} />

                            {/* Label (se oculta si está colapsado) */}
                            <span className={`whitespace-nowrap transition-all duration-200 ease-in-out ${collapsed ? 'w-0 opacity-0 -translate-x-2' : 'opacity-100 translate-x-0'}`}>
                                {item.label}
                            </span>
                        </Link>
                    )
                })}
            </nav>
        </aside>
    )
}

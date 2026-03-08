"use client"

import { ArrowLeft, ArrowRight, ChevronLeft, ChevronRight, FlaskConical, User2, UserRoundPlus, Users, UserSearch } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState } from "react"


const menuItems = [
    { label: 'Crear', icon: <UserRoundPlus />, href: '/dashboard' },
    { label: 'Solicitudes', icon: <Users />, href: '/dashboard/solicitudes' },
    { label: 'Pacientes', icon: <UserSearch />, href: '/dashboard/pacientes' }
]

export default function Navbar() {

    const pathname = usePathname()
    const [collapsed, setCollapsed] = useState(false)

    return (

        <aside
            className={`min-h-screen bg-white border-r border-slate-200 flex flex-col transition-all duration-200 ease-in-out
      ${collapsed ? 'w-20' : 'w-56'}
    `}
        >
            {/* Header */}
            <div className='p-6 flex items-center justify-between'>
                <div className={`transition-all duration-200 ease-in-out overflow-hidden ${collapsed ? 'w-0 opacity-0' : 'w-9 h-9 opacity-100'}`}>
                    <h1 className='w-9 h-9 bg-cyan-100 flex justify-center items-center rounded-md'><FlaskConical className="text-cyan-900" /></h1>
                </div>

                <button onClick={() => setCollapsed(!collapsed)} className='cursor-pointer p-1 rounded hover:bg-gray-100 transition'>
                    {collapsed ? <><ChevronRight /></> : <><ChevronLeft /> </>}
                </button>
            </div>

            {/* Menu */}
            <nav className='flex flex-col mt-4'>
                {menuItems.map(item => {
                    const isActive = pathname === item.href

                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`flex items-center gap-3 px-6 py-3 text-sm font-semibold transition-all duration-200 ease-in-out
                                ${isActive ? 'bg-cyan-50 text-cyan-600 border-r-4 border-cyan-800' : 'text-slate-500 hover:bg-gray-100'}
                            `}
                        >
                            {/* Icon */}
                            <span className={`transition-all duration-200 ease-in-out ${collapsed ? 'scale-110' : 'scale-100'}`}>
                                {item.icon}
                            </span>

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
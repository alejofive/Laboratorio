'use client'

import { Examen, Paciente } from '@/types'
import { ArrowLeft, FileText, Mail } from 'lucide-react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useState } from 'react'
import EstadoBadge from './EstadoBadge'
import { Button } from './ui/Button'
import { TextInput } from './ui/FormField'

interface AccionesExamenProps {
  examen: Examen
  paciente: Paciente
  mostrarAccionesResultado?: boolean
  totalExamenesPaciente: number
  examenesCompletadosPaciente: number
  onEnviarEmail: (email: string) => Promise<void>
}

export default function AccionesExamen({
  examen,
  paciente,
  mostrarAccionesResultado = true,
  onEnviarEmail,
}: AccionesExamenProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const cedulaParam = searchParams.get('cedula')
  const [email, setEmail] = useState('')
  const [showEmailModal, setShowEmailModal] = useState(false)

  const handleVolver = () => {
    if (cedulaParam) {
      router.push(`/dashboard/pacientes/${cedulaParam}`)
    } else {
      router.push('/dashboard/solicitudes')
    }
  }

  const handleImprimir = () => {
    window.print()
  }

  const handleEnviarEmail = async () => {
    if (email) {
      await onEnviarEmail(email)
      setShowEmailModal(false)
      setEmail('')
      alert('Email enviado')
    }
  }

  return (
    <div className='mb-6'>
      <div className='flex items-center mb-4 gap-4'>
        <button onClick={handleVolver} className='cursor-pointer'>
          <ArrowLeft className='text-gray-700' />
        </button>
        <p className='text-primary text-2xl'>
          <strong># Solicitud: </strong>
          {examen.orderNumber ?? examen.id}
        </p>
        <EstadoBadge estado={examen.estado} />
      </div>

      <div className='bg-white rounded-3xl border border-border-default p-6'>
        <div className=' md:items-center md:justify-between gap-4 '>
          <div className='flex justify-between items-end'>
            <div>
              <div className='flex items-center justify-between'>
                <p className='text-xl font-semibold'>{paciente.nombre}</p>
              </div>
              <p className='text-secondary text-base  flex items-center gap-3 mt-4'>
                <span className='flex items-center gap-2'>
                  <img src='/svg/paciente/cedula.svg' alt='' /> {paciente.cedula}
                </span>
                <span className='flex items-center gap-2'>
                  <img src='/svg/paciente/phone.svg' alt='' /> {paciente.telefono}
                </span>
                <span className='flex items-center gap-2'>
                  <img src='/svg/paciente/calendar.svg' alt='' /> {paciente.edad} años
                </span>
                <span className='flex items-center gap-2'>
                  <img src='/svg/paciente/location.svg' alt='' /> {paciente.direccion}
                </span>
              </p>
            </div>

            {mostrarAccionesResultado && (
              <div className='flex flex-wrap justify-between gap-2'>
                <div className='flex items-center gap-3'>
                  <Button
                    onClick={() => setShowEmailModal(true)}
                    variant='outline'
                    size='md'
                    className='flex gap-2 text-sm items-center cursor-pointer'
                  >
                    <Mail size={24} /> Enviar Email
                  </Button>
                  <Button
                    onClick={handleImprimir}
                    variant='primary'
                    size='md'
                    className='flex gap-2 text-sm items-center cursor-pointer'
                  >
                    <FileText size={24} /> Imprimir todo
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>

        {mostrarAccionesResultado && showEmailModal && (
          <div className='fixed inset-0 bg-black/50 flex items-center justify-center z-50'>
            <div className='bg-white rounded-lg p-6 max-w-md w-full mx-4'>
              <h3 className='text-lg font-medium text-gray-900 mb-4'>Enviar por Email</h3>
              <TextInput
                type='email'
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder='correo@ejemplo.com'
                className='mb-4'
              />
              <div className='flex gap-2'>
                <Button
                  onClick={handleEnviarEmail}
                  className='flex-1'
                >
                  Enviar
                </Button>
                <Button
                  onClick={() => setShowEmailModal(false)}
                  variant='outline'
                >
                  Cancelar
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

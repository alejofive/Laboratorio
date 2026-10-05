'use client'

import { Eye, EyeOff } from 'lucide-react'
import { forwardRef, useState, type InputHTMLAttributes } from 'react'
import { TextInput } from '@/components/ui/FormField'

type PasswordInputProps = InputHTMLAttributes<HTMLInputElement> & {
  error?: string | boolean
  visibilityLabel?: string
}

export const PasswordInput = forwardRef<HTMLInputElement, PasswordInputProps>(
  function PasswordInput(
    { className = '', error, visibilityLabel = 'contrasena', ...props },
    ref,
  ) {
    const [visible, setVisible] = useState(false)

    return (
      <div className="relative">
        <TextInput
          ref={ref}
          type={visible ? 'text' : 'password'}
          error={error}
          className={`pr-11 ${className}`}
          {...props}
        />
        <button
          type="button"
          onClick={() => setVisible(current => !current)}
          className="absolute right-1.5 top-1/2 flex size-9 -translate-y-1/2 cursor-pointer items-center justify-center rounded-lg text-secondary transition-colors hover:bg-surface-muted hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary/30"
          aria-label={`${visible ? 'Ocultar' : 'Mostrar'} ${visibilityLabel}`}
          aria-pressed={visible}
        >
          {visible ? <EyeOff aria-hidden="true" size={18} /> : <Eye aria-hidden="true" size={18} />}
        </button>
      </div>
    )
  },
)

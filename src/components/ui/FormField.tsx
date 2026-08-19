import {
  forwardRef,
  type InputHTMLAttributes,
  type LabelHTMLAttributes,
  type ReactNode,
  type SelectHTMLAttributes,
  type TextareaHTMLAttributes,
} from 'react'

type FieldError = string | boolean | undefined

type FieldLabelProps = {
  children: ReactNode
} & LabelHTMLAttributes<HTMLLabelElement>

type BaseFieldProps = {
  error?: FieldError
}

type CheckboxInputProps = Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> & {
  label?: ReactNode
}

type RadioInputProps = Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> & {
  label?: ReactNode
}

const fieldBaseClass =
  'min-h-[42px] w-full rounded-xl border bg-white px-3 py-2 text-base text-primary outline-none transition-colors placeholder:text-secondary/70 focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/10 disabled:cursor-not-allowed disabled:bg-white disabled:text-primary disabled:opacity-100'

const getBorderClass = (error?: FieldError) => (error ? 'border-red-500' : 'border-gray-300')

const mergeClassName = (...classes: Array<string | undefined | false>) =>
  classes.filter(Boolean).join(' ')

export function FieldLabel({ children, className = '', ...props }: FieldLabelProps) {
  return (
    <label
      className={mergeClassName('mb-1 block text-sm font-medium text-tertiary', className)}
      {...props}
    >
      {children}
    </label>
  )
}

export const TextInput = forwardRef<
  HTMLInputElement,
  InputHTMLAttributes<HTMLInputElement> & BaseFieldProps
>(function TextInput({ className = '', error, ...props }, ref) {
  return (
    <input
      ref={ref}
      className={mergeClassName(fieldBaseClass, getBorderClass(error), className)}
      {...props}
    />
  )
})

export const SelectInput = forwardRef<
  HTMLSelectElement,
  SelectHTMLAttributes<HTMLSelectElement> & BaseFieldProps
>(function SelectInput({ className = '', error, ...props }, ref) {
  return (
    <select
      ref={ref}
      className={mergeClassName(fieldBaseClass, getBorderClass(error), className)}
      {...props}
    />
  )
})

export const TextareaInput = forwardRef<
  HTMLTextAreaElement,
  TextareaHTMLAttributes<HTMLTextAreaElement> & BaseFieldProps
>(function TextareaInput({ className = '', error, ...props }, ref) {
  return (
    <textarea
      ref={ref}
      className={mergeClassName(
        fieldBaseClass,
        'min-h-24 resize-y',
        getBorderClass(error),
        className,
      )}
      {...props}
    />
  )
})

export const CheckboxInput = forwardRef<HTMLInputElement, CheckboxInputProps>(
  function CheckboxInput({ label, className = '', ...props }, ref) {
    return (
      <label
        className={mergeClassName(
          'flex cursor-pointer items-center gap-2 text-sm font-medium text-tertiary',
          className,
        )}
      >
        <input
          ref={ref}
          type='checkbox'
          className='size-5 shrink-0 cursor-pointer rounded border-gray-300 text-brand-primary accent-brand-primary focus:ring-2 focus:ring-brand-primary/20 disabled:cursor-not-allowed disabled:opacity-60'
          {...props}
        />
        {label ? <span>{label}</span> : null}
      </label>
    )
  },
)

export const RadioInput = forwardRef<HTMLInputElement, RadioInputProps>(function RadioInput(
  { label, className = '', ...props },
  ref,
) {
  return (
    <label
      className={mergeClassName(
        'flex cursor-pointer items-center gap-2 text-sm font-medium text-tertiary',
        className,
      )}
    >
      <input
        ref={ref}
        type='radio'
        className='size-4 shrink-0 cursor-pointer border-gray-300 text-brand-primary accent-brand-primary focus:ring-2 focus:ring-brand-primary/20 disabled:cursor-not-allowed disabled:opacity-60'
        {...props}
      />
      {label ? <span>{label}</span> : null}
    </label>
  )
})

export const fieldButtonClass =
  'flex min-h-[42px] w-full items-center justify-between gap-3 rounded-xl border bg-white px-3 py-2 text-left text-base transition-colors hover:bg-gray-50 focus:outline-none focus:border-brand-soft'

export const getFieldButtonClass = (error?: FieldError, className = '') =>
  mergeClassName(fieldButtonClass, getBorderClass(error), className)

export const fieldControlClass = fieldBaseClass

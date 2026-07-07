import type { ButtonProps } from './Button.types'

const baseClassName =
  'inline-flex cursor-pointer items-center justify-center gap-2 whitespace-nowrap rounded-2xl border font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary/30 disabled:cursor-not-allowed disabled:opacity-60'

const variantClassName = {
  primary:
    'border-brand-primary bg-brand-primary text-white hover:bg-brand-primary/90 hover:text-white',
  outline:
    'border-border-default bg-white text-primary hover:border-brand-primary hover:bg-brand-active hover:text-brand-primary',
  link: 'border-transparent bg-transparent p-0 text-brand-primary underline-offset-4 hover:text-brand-primary/80 hover:underline',
}

const sizeClassName = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'min-h-12 px-4 py-2 text-base',
  lg: 'px-5 py-3 text-lg',
}

const mergeClassName = (...classes: Array<string | undefined | false>) => classes.filter(Boolean).join(' ')

export function Button({
  variant = 'primary',
  size = 'md',
  loading = false,
  icon,
  children,
  className = '',
  disabled,
  ...props
}: ButtonProps) {
  return (
    <button
      type="button"
      className={mergeClassName(
        baseClassName,
        variantClassName[variant],
        sizeClassName[size],
        className,
      )}
      disabled={disabled || loading}
      {...props}
    >
      {icon ? <span>{icon}</span> : null}
      {loading ? 'Cargando...' : children}
    </button>
  )
}

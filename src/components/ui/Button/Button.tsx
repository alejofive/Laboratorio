import styles from './Button.module.css'
import type { ButtonProps } from './Button.types'

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
      className={`${styles.button} ${styles[variant]} ${styles[size]} ${className}`}
      disabled={disabled || loading}
      {...props}
    >
      {icon ? <span>{icon}</span> : null}
      {loading ? 'Cargando...' : children}
    </button>
  )
}

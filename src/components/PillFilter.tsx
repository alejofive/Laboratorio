import SvgIcon from "./ui/SvgIcon"
import Image from 'next/image'

type PillFilterProps = {
    label: string
    active?: boolean
    onClick?: () => void
    selected?: boolean
    onRemove?: () => void
    iconSrc?: string
    iconAlt?: string
    disabled?: boolean
}

export function PillFilter({
    label,
    active = false,
    onClick,
    selected = false,
    onRemove,
    iconSrc,
    iconAlt,
    disabled = false,
}: PillFilterProps) {
    if (selected) {
        return (
            <div className="inline-flex min-h-12 max-w-full items-center gap-1 rounded-full border border-border-default py-1 pl-4 pr-1 text-base font-medium text-secondary transition-colors duration-200">
                <span className='min-w-0 truncate'>{label}</span>
                <button type="button" className="flex size-10 shrink-0 cursor-pointer items-center justify-center rounded-full text-sm leading-none text-secondary hover:bg-surface-muted hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary/30" onClick={onRemove} aria-label={`Quitar ${label}`}>
                    <SvgIcon src='/svg/xicon.svg' size={20} />
                </button>
            </div>
        )
    }

    return (
        <button
            className={`flex min-h-10 shrink-0 items-center gap-2 rounded-full px-3 py-2 text-sm font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary/30 ${disabled ? 'cursor-not-allowed bg-surface-muted text-secondary opacity-50' : active ? 'cursor-pointer bg-primary text-white' : 'cursor-pointer bg-surface-muted text-secondary hover:bg-gray-200'}`}
            type="button"
            onClick={onClick}
            disabled={disabled}
        >
            {iconSrc ? (
                <Image
                    src={iconSrc}
                    alt={iconAlt ?? ''}
                    width={16}
                    height={16}
                    className={`h-4 w-4 shrink-0 transition duration-200 ${active && !disabled ? 'brightness-0 invert' : ''}`}
                />
            ) : null}
            <span>{label}</span>
        </button>
    )
}

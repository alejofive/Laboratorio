import SvgIcon from "./ui/SvgIcon"

type PillFilterProps = {
    label: string
    active?: boolean
    onClick?: () => void
    selected?: boolean
    onRemove?: () => void
    iconSrc?: string
    iconAlt?: string
}

export function PillFilter({
    label,
    active = false,
    onClick,
    selected = false,
    onRemove,
    iconSrc,
    iconAlt,
}: PillFilterProps) {
    if (selected) {
        return (
            <div className="border-border-secondary text-secondary inline-flex items-center gap-2 rounded-full border px-4 py-2 text-xs font-medium transition-colors duration-200">
                <span>{label}</span>
                <button type="button" className="cursor-pointer text-secondary w-5 h-5 hover:text-primary text-sm leading-none" onClick={onRemove}>
                    <SvgIcon src='/svg/xicon.svg' size={20} />
                </button>
            </div>
        )
    }

    return (
        <button
            className={`rounded-full px-4 py-2 text-xs font-medium ${active ? 'bg-primary text-white' : 'bg-surface-muted text-secondary'}`}
            type="button"
            onClick={onClick}
        >
            <span className="inline-flex items-center gap-2">
                {iconSrc ? (
                    <img
                        src={iconSrc}
                        alt={iconAlt ?? ''}
                        className={`h-4 w-4 shrink-0 transition duration-200 ${active ? 'brightness-0 invert' : ''}`}
                    />
                ) : null}
                <span>{label}</span>
            </span>
        </button>
    )
}

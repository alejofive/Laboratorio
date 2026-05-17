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
            <div className="border-border-secondary text-secondary inline-flex items-center gap-2  rounded-full border px-4 py-2 text-base font-medium transition-colors duration-200">
                <span>{label}</span>
                <button type="button" className="cursor-pointer text-secondary w-5 h-5 hover:text-primary text-sm leading-none" onClick={onRemove}>
                    <SvgIcon src='/svg/xicon.svg' size={20} />
                </button>
            </div>
        )
    }

    return (
        <button
            className={`rounded-full px-2.5 flex items-center gap-2 py-1.5  cursor-pointer text-sm font-medium ${active ? 'bg-primary text-white' : 'bg-surface-muted text-secondary hover:bg-gray-200'}`}
            type="button"
            onClick={onClick}
        >
            {iconSrc ? (
                <img
                    src={iconSrc}
                    alt={iconAlt ?? ''}
                    className={`h-4 w-4 shrink-0 transition duration-200 ${active ? 'brightness-0 invert' : ''}`}
                />
            ) : null}
            <span>{label}</span>
        </button>
    )
}

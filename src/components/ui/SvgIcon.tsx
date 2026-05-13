import type { CSSProperties } from "react"

type SvgIconProps = {
  src: string
  className?: string
  size?: number
}

export default function SvgIcon({ src, className = "", size = 24 }: SvgIconProps) {
  const style: CSSProperties = {
    width: `${size}px`,
    height: `${size}px`,
    backgroundColor: "currentColor",
    WebkitMask: `url(${src}) center / contain no-repeat`,
    mask: `url(${src}) center / contain no-repeat`,
  }

  return <span aria-hidden="true" className={`inline-block shrink-0 ${className}`} style={style} />
}

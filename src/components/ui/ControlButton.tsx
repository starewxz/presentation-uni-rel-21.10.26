import type { ButtonHTMLAttributes, ReactNode } from 'react'

interface ControlButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  icon: ReactNode
  /** Підпис, видимий на широких екранах. */
  label?: string
  pressed?: boolean
  /** Підказка з гарячою клавішею. */
  hint?: string
}

export default function ControlButton({ icon, label, pressed, hint, className = '', ...rest }: ControlButtonProps) {
  const active = pressed === true
  return (
    <button
      type="button"
      aria-pressed={pressed}
      title={hint ? `${rest['aria-label'] ?? label} (${hint})` : undefined}
      className={`inline-flex h-11 min-w-11 items-center justify-center gap-2 rounded-full border px-3 text-small font-medium transition-all duration-300 disabled:cursor-not-allowed disabled:opacity-30 ${
        active
          ? 'border-gold bg-gold text-midnight'
          : 'border-gold/30 bg-midnight/60 text-ivory hover:border-gold hover:bg-gold/10 hover:text-gold disabled:hover:border-gold/30 disabled:hover:bg-midnight/60 disabled:hover:text-ivory'
      } ${className}`}
      {...rest}
    >
      {icon}
      {label && <span className="hidden roomy:inline">{label}</span>}
    </button>
  )
}

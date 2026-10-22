interface EyebrowProps {
  number: number
  label: string
  className?: string
}

const pad = (n: number) => String(n).padStart(2, '0')

export default function Eyebrow({ number, label, className = '' }: EyebrowProps) {
  return (
    <div className={`flex items-center gap-u2 ${className}`}>
      <span className="font-serif text-h3 font-medium leading-none text-gold">{pad(number)}</span>
      <span aria-hidden="true" className="gold-rule w-u6" />
      <span className="text-label font-medium uppercase text-sand">{label}</span>
    </div>
  )
}

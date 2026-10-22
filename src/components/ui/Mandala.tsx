import { useId } from 'react'

interface MandalaProps {
  className?: string
  /** Кількість пелюстків у внутрішніх колах. */
  petals?: number
  /** Додає тонкі риски по зовнішньому колу. */
  ticks?: boolean
}

const polar = (angle: number, radius: number): [number, number] => {
  const rad = ((angle - 90) * Math.PI) / 180
  return [Number((Math.cos(rad) * radius).toFixed(2)), Number((Math.sin(rad) * radius).toFixed(2))]
}

/** Стримана геометрична мандала: лише тонкі золоті лінії, без заливки. */
export default function Mandala({ className, petals = 16, ticks = true }: MandalaProps) {
  const id = useId()
  const petalPath = 'M0 -64 C 9 -54, 9 -40, 0 -30 C -9 -40, -9 -54, 0 -64 Z'
  const smallPetal = 'M0 -42 C 6 -35, 6 -26, 0 -19 C -6 -26, -6 -35, 0 -42 Z'
  const angles = Array.from({ length: petals }, (_, i) => (360 / petals) * i)
  const tickAngles = Array.from({ length: 96 }, (_, i) => i * 3.75)

  return (
    <svg
      viewBox="-100 -100 200 200"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth={1}
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        <clipPath id={`${id}-clip`}>
          <circle r="99" />
        </clipPath>
      </defs>
      <g vectorEffect="non-scaling-stroke" clipPath={`url(#${id}-clip)`}>
        <circle r="98" vectorEffect="non-scaling-stroke" />
        <circle r="92" vectorEffect="non-scaling-stroke" strokeDasharray="1 3" />
        <circle r="78" vectorEffect="non-scaling-stroke" />
        <circle r="66" vectorEffect="non-scaling-stroke" opacity={0.6} />
        <circle r="30" vectorEffect="non-scaling-stroke" />
        <circle r="17" vectorEffect="non-scaling-stroke" opacity={0.7} />
        <circle r="5" vectorEffect="non-scaling-stroke" />
        {ticks &&
          tickAngles.map((a) => {
            const long = Math.round(a / 3.75) % 4 === 0
            const [x1, y1] = polar(a, 98)
            const [x2, y2] = polar(a, long ? 92 : 95)
            return <line key={a} x1={x1} y1={y1} x2={x2} y2={y2} vectorEffect="non-scaling-stroke" />
          })}
        {angles.map((a) => (
          <g key={`p-${a}`} transform={`rotate(${a})`}>
            <path d={petalPath} vectorEffect="non-scaling-stroke" />
          </g>
        ))}
        {angles.map((a) => (
          <g key={`s-${a}`} transform={`rotate(${a + 180 / petals})`}>
            <path d={smallPetal} vectorEffect="non-scaling-stroke" opacity={0.75} />
          </g>
        ))}
        {angles.map((a) => {
          const [x, y] = polar(a + 180 / petals, 72)
          return <circle key={`d-${a}`} cx={x} cy={y} r="1.3" fill="currentColor" stroke="none" />
        })}
      </g>
    </svg>
  )
}

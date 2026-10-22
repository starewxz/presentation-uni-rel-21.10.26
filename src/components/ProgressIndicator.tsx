import type { SlideData } from '../types/presentation'

interface ProgressIndicatorProps {
  slides: readonly SlideData[]
  index: number
  onSelect: (index: number) => void
}

const pad = (n: number) => String(n).padStart(2, '0')

export default function ProgressIndicator({ slides, index, onSelect }: ProgressIndicatorProps) {
  return (
    <nav aria-label="Прогрес презентації" className="flex items-center gap-u2">
      <p className="whitespace-nowrap font-serif text-[max(15px,calc(var(--u)*22px))] tabular-nums tracking-[0.08em] text-mist" aria-live="polite">
        <span className="font-semibold text-gold">{pad(index + 1)}</span>
        <span aria-hidden="true"> / </span>
        <span className="sr-only"> із </span>
        {pad(slides.length)}
      </p>
      <ol className="flex items-center">
        {slides.map((slide, i) => {
          const current = i === index
          return (
            <li key={slide.id}>
              <button
                type="button"
                onClick={() => onSelect(i)}
                aria-label={`Слайд ${i + 1}: ${slide.title}`}
                aria-current={current ? 'step' : undefined}
                title={`${i + 1}. ${slide.title}`}
                className="group flex h-9 items-center px-[3px]"
              >
                <span
                  className={`block rounded-full transition-all duration-500 ease-cinema ${
                    current
                      ? 'h-[5px] w-7 bg-gold shadow-[0_0_14px_rgba(214,179,106,0.7)] wide:w-[calc(var(--u)*44px)]'
                      : i < index
                        ? 'h-[3px] w-3.5 bg-gold/55 group-hover:bg-gold wide:w-[calc(var(--u)*22px)]'
                        : 'h-[3px] w-3.5 bg-ivory/25 group-hover:bg-ivory/60 wide:w-[calc(var(--u)*22px)]'
                  }`}
                />
              </button>
            </li>
          )
        })}
      </ol>
    </nav>
  )
}

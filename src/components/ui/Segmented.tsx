import { useRef, type KeyboardEvent } from 'react'

export interface SegmentedOption<T extends string> {
  id: T
  label: string
}

interface SegmentedProps<T extends string> {
  label: string
  options: readonly SegmentedOption<T>[]
  value: T
  onChange: (id: T) => void
  /** Префікс для зв’язку вкладок і панелей через aria-controls. */
  idPrefix: string
  className?: string
}

/** Доступний перемикач вкладок: стрілки, Home/End, «рухомий» tabindex. */
export default function Segmented<T extends string>({
  label,
  options,
  value,
  onChange,
  idPrefix,
  className = '',
}: SegmentedProps<T>) {
  const refs = useRef<(HTMLButtonElement | null)[]>([])

  const onKeyDown = (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
    let nextIndex = index
    if (event.key === 'ArrowRight') nextIndex = (index + 1) % options.length
    else if (event.key === 'ArrowLeft') nextIndex = (index - 1 + options.length) % options.length
    else if (event.key === 'Home') nextIndex = 0
    else if (event.key === 'End') nextIndex = options.length - 1
    else return
    event.preventDefault()
    onChange(options[nextIndex].id)
    refs.current[nextIndex]?.focus()
  }

  return (
    <div
      role="tablist"
      aria-label={label}
      data-no-swipe
      className={`flex flex-wrap gap-x-u3 gap-y-1 border-b border-gold/20 ${className}`}
    >
      {options.map((option, index) => {
        const selected = option.id === value
        return (
          <button
            key={option.id}
            ref={(el) => {
              refs.current[index] = el
            }}
            type="button"
            role="tab"
            id={`${idPrefix}-tab-${option.id}`}
            aria-selected={selected}
            aria-controls={`${idPrefix}-panel`}
            tabIndex={selected ? 0 : -1}
            onClick={() => onChange(option.id)}
            onKeyDown={(e) => onKeyDown(e, index)}
            className={`relative -mb-px py-2 text-small font-medium tracking-[0.04em] transition-colors duration-300 ${
              selected ? 'text-gold' : 'text-mist hover:text-ivory'
            }`}
          >
            {option.label}
            <span
              aria-hidden="true"
              className={`absolute inset-x-0 bottom-0 h-[2px] bg-gold transition-transform duration-500 ease-cinema ${
                selected ? 'scale-x-100' : 'scale-x-0'
              }`}
            />
          </button>
        )
      })}
    </div>
  )
}

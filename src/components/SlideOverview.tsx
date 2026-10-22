import { useEffect, useRef, type KeyboardEvent } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { X } from 'lucide-react'
import type { SlideData } from '../types/presentation'
import SmartImage from './ui/SmartImage'

interface SlideOverviewProps {
  open: boolean
  slides: readonly SlideData[]
  currentIndex: number
  onSelect: (index: number) => void
  onClose: () => void
}

const pad = (n: number) => String(n).padStart(2, '0')

export default function SlideOverview({ open, slides, currentIndex, onSelect, onClose }: SlideOverviewProps) {
  const dialogRef = useRef<HTMLDivElement>(null)
  const gridRef = useRef<HTMLUListElement>(null)
  const returnFocus = useRef<Element | null>(null)

  useEffect(() => {
    if (!open) return
    returnFocus.current = document.activeElement
    const timer = window.setTimeout(() => {
      gridRef.current?.querySelector<HTMLElement>('[aria-current="true"]')?.focus()
    }, 60)
    return () => {
      window.clearTimeout(timer)
      if (returnFocus.current instanceof HTMLElement) returnFocus.current.focus()
    }
  }, [open])

  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    const dialog = dialogRef.current
    if (!dialog) return

    if (event.key === 'Tab') {
      const focusable = Array.from(dialog.querySelectorAll<HTMLElement>('button:not([disabled])'))
      if (focusable.length === 0) return
      const first = focusable[0]
      const last = focusable[focusable.length - 1]
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault()
        first.focus()
      }
      return
    }

    const items = Array.from(gridRef.current?.querySelectorAll<HTMLElement>('[data-thumb]') ?? [])
    const at = items.indexOf(document.activeElement as HTMLElement)
    if (at < 0 || !gridRef.current) return
    const columns = getComputedStyle(gridRef.current).gridTemplateColumns.split(' ').length
    const moves: Record<string, number> = {
      ArrowRight: at + 1,
      ArrowLeft: at - 1,
      ArrowDown: at + columns,
      ArrowUp: at - columns,
      Home: 0,
      End: items.length - 1,
    }
    if (event.key in moves) {
      event.preventDefault()
      items[Math.min(Math.max(moves[event.key], 0), items.length - 1)]?.focus()
    }
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          key="overview"
          ref={dialogRef}
          role="dialog"
          aria-modal="true"
          aria-label="Огляд слайдів"
          onKeyDown={onKeyDown}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-50 flex flex-col bg-indigo-deep/95 backdrop-blur-md"
          onClick={(e) => {
            if (e.target === e.currentTarget) onClose()
          }}
        >
          <header className="flex items-center justify-between gap-4 px-5 pb-3 pt-5 sm:px-10">
            <div>
              <p className="text-label font-medium uppercase text-gold">Огляд слайдів</p>
              <h2 className="mt-1 font-serif text-[28px] font-medium leading-tight text-ivory">Оберіть слайд</h2>
            </div>
            <button
              type="button"
              onClick={onClose}
              aria-label="Закрити огляд слайдів"
              title="Закрити (Esc)"
              className="flex h-11 w-11 items-center justify-center rounded-full border border-gold/40 text-ivory transition-colors hover:border-gold hover:text-gold"
            >
              <X className="h-5 w-5" aria-hidden="true" />
            </button>
          </header>

          <div
            className="scroll-thin flex min-h-0 flex-1 overflow-y-auto px-5 pb-8 pt-2 sm:px-10"
            onClick={(e) => {
              if (e.target === e.currentTarget) onClose()
            }}
          >
            <ul
              ref={gridRef}
              className="m-auto grid w-full max-w-[1400px] grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-5 lg:grid-cols-5"
            >
              {slides.map((slide, i) => {
                const current = i === currentIndex
                return (
                  <li key={slide.id}>
                    <button
                      type="button"
                      data-thumb
                      aria-current={current ? 'true' : undefined}
                      aria-label={`Слайд ${i + 1}: ${slide.title}${current ? ' (поточний)' : ''}`}
                      onClick={() => onSelect(i)}
                      className={`group relative block aspect-video w-full overflow-hidden border text-left transition-all duration-300 ${
                        current
                          ? 'border-gold shadow-[0_0_0_2px_rgba(214,179,106,0.45),0_16px_40px_-12px_rgba(214,179,106,0.35)]'
                          : 'border-gold/25 hover:border-gold/80'
                      }`}
                    >
                      <SmartImage
                        image={slide.image}
                        thumb
                        eager={false}
                        className="absolute inset-0 h-full w-full transition-transform duration-700 ease-cinema group-hover:scale-105"
                      />
                      <span className="absolute inset-0 bg-gradient-to-t from-midnight via-midnight/55 to-midnight/20" />
                      <span className="absolute left-2 top-1 font-serif text-[26px] font-semibold leading-none text-gold sm:text-[32px]">
                        {pad(slide.number)}
                      </span>
                      {current && (
                        <span className="absolute right-2 top-2 rounded-full bg-gold px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-midnight">
                          Зараз
                        </span>
                      )}
                      <span className="absolute inset-x-2 bottom-2 font-serif text-[15px] font-semibold leading-tight text-ivory sm:text-[18px]">
                        {slide.layout === 'cover' ? 'Індуїзм: що це?' : slide.title}
                      </span>
                    </button>
                  </li>
                )
              })}
            </ul>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

import { useEffect, useMemo, useRef, useState } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { ArrowRight, Clock, Minus, Pause, Play, Plus, RotateCcw, X } from 'lucide-react'
import type { PanelMode, SlideData } from '../types/presentation'
import { useViewport } from '../hooks/useViewport'
import Rich from './ui/Rich'
import SmartImage from './ui/SmartImage'

interface SpeakerNotesProps {
  slide: SlideData
  nextSlide: SlideData | null
  total: number
  mode: Exclude<PanelMode, 'closed'>
  onClose: () => void
  onNext: () => void
}

const WORDS_PER_MINUTE = 140
const MIN_FONT = 14
const MAX_FONT = 26
const LG = 1024

const pad = (n: number) => String(n).padStart(2, '0')
const clock = (s: number) => `${pad(Math.floor(s / 60))}:${pad(s % 60)}`

function useStopwatch() {
  const [seconds, setSeconds] = useState(0)
  const [running, setRunning] = useState(false)

  useEffect(() => {
    if (!running) return
    const id = window.setInterval(() => setSeconds((s) => s + 1), 1000)
    return () => window.clearInterval(id)
  }, [running])

  return {
    seconds,
    running,
    toggle: () => setRunning((r) => !r),
    reset: () => {
      setRunning(false)
      setSeconds(0)
    },
  }
}

export default function SpeakerNotes({ slide, nextSlide, total, mode, onClose, onNext }: SpeakerNotesProps) {
  const reduce = useReducedMotion()
  const { width, height } = useViewport()
  const [fontSize, setFontSize] = useState(17)
  const scrollRef = useRef<HTMLDivElement>(null)
  const watch = useStopwatch()
  const presenter = mode === 'presenter'

  // Нотатки кожного слайда відкриваються з початку.
  useEffect(() => {
    scrollRef.current?.scrollTo({ top: 0 })
  }, [slide.id])

  const minutes = useMemo(() => {
    const words = slide.notes.reduce((sum, block) => sum + block.text.split(/\s+/).length, 0)
    return Math.max(1, Math.round(words / WORDS_PER_MINUTE))
  }, [slide.notes])

  const vertical = width < LG
  const target = vertical
    ? Math.round(height * (presenter ? 0.55 : 0.46))
    : Math.round(Math.min(Math.max(width * (presenter ? 0.4 : 0.32), presenter ? 440 : 360), presenter ? 680 : 520))

  const credit = `${slide.image.source} · «${slide.image.file}»`

  return (
    <motion.aside
      aria-label={presenter ? 'Режим доповідача' : 'Нотатки доповідача'}
      initial={{ flexBasis: '0px', opacity: 0 }}
      animate={{ flexBasis: `${target}px`, opacity: 1 }}
      exit={{ flexBasis: '0px', opacity: 0 }}
      transition={{ duration: reduce ? 0.01 : 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="relative z-30 flex min-h-0 min-w-0 shrink-0 grow-0 flex-col overflow-hidden border-gold/25 bg-indigo-deep max-lg:border-t lg:border-l"
    >
      <div
        className="flex min-h-0 flex-1 flex-col"
        style={vertical ? { height: target } : { width: target }}
      >
        <header className="flex items-start justify-between gap-3 border-b border-gold/20 px-5 pb-3 pt-4">
          <div className="min-w-0">
            <p className="text-label font-medium uppercase text-gold">
              {presenter ? 'Режим доповідача' : 'Нотатки доповідача'}
            </p>
            <h2 className="mt-1 truncate font-serif text-[22px] font-semibold leading-tight text-ivory">
              {slide.number}. {slide.title}
            </h2>
            <p className="mt-1 flex items-center gap-1.5 text-[13px] text-mist">
              <Clock className="h-3.5 w-3.5" aria-hidden="true" />≈ {minutes} хв мовлення
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Закрити панель нотаток"
            title="Закрити (Esc)"
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-gold/30 text-mist transition-colors hover:border-gold hover:text-gold"
          >
            <X className="h-4 w-4" aria-hidden="true" />
          </button>
        </header>

        <div className="flex items-center justify-between gap-2 border-b border-gold/10 px-5 py-2">
          <div className="flex items-center gap-1" role="group" aria-label="Розмір тексту нотаток">
            <button
              type="button"
              onClick={() => setFontSize((f) => Math.max(MIN_FONT, f - 1))}
              disabled={fontSize <= MIN_FONT}
              aria-label="Зменшити текст"
              className="flex h-8 w-8 items-center justify-center rounded-full border border-gold/30 text-mist hover:border-gold hover:text-gold disabled:opacity-30"
            >
              <Minus className="h-3.5 w-3.5" aria-hidden="true" />
            </button>
            <span className="w-10 text-center text-[13px] tabular-nums text-mist" aria-live="polite">
              {fontSize}px
            </span>
            <button
              type="button"
              onClick={() => setFontSize((f) => Math.min(MAX_FONT, f + 1))}
              disabled={fontSize >= MAX_FONT}
              aria-label="Збільшити текст"
              className="flex h-8 w-8 items-center justify-center rounded-full border border-gold/30 text-mist hover:border-gold hover:text-gold disabled:opacity-30"
            >
              <Plus className="h-3.5 w-3.5" aria-hidden="true" />
            </button>
          </div>

          {presenter && (
            <div className="flex items-center gap-1" role="group" aria-label="Таймер доповіді">
              <span className="mr-1 font-serif text-[20px] tabular-nums text-gold" role="timer">
                {clock(watch.seconds)}
              </span>
              <button
                type="button"
                onClick={watch.toggle}
                aria-label={watch.running ? 'Призупинити таймер' : 'Запустити таймер'}
                className="flex h-8 w-8 items-center justify-center rounded-full border border-gold/30 text-mist hover:border-gold hover:text-gold"
              >
                {watch.running ? (
                  <Pause className="h-3.5 w-3.5" aria-hidden="true" />
                ) : (
                  <Play className="h-3.5 w-3.5" aria-hidden="true" />
                )}
              </button>
              <button
                type="button"
                onClick={watch.reset}
                aria-label="Скинути таймер"
                className="flex h-8 w-8 items-center justify-center rounded-full border border-gold/30 text-mist hover:border-gold hover:text-gold"
              >
                <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
              </button>
            </div>
          )}
        </div>

        <div
          ref={scrollRef}
          data-scroll-region
          data-no-swipe
          tabIndex={0}
          role="region"
          aria-label={`Текст доповіді до слайда ${slide.number}`}
          className="scroll-thin min-h-0 flex-1 overflow-y-auto px-5 py-4"
          style={{ fontSize }}
        >
          <div className="space-y-[1.1em] leading-[1.65] text-ivory/90">
            {slide.notes.map((block, i) => (
              <section key={`${slide.id}-${i}`}>
                {block.heading && (
                  <h3 className="mb-[0.35em] font-serif text-[1.15em] font-semibold leading-snug text-gold">
                    {block.heading}
                  </h3>
                )}
                <p className="text-pretty">
                  <Rich text={block.text} />
                </p>
              </section>
            ))}
            <p className="border-t border-gold/15 pt-3 text-[0.78em] leading-snug text-mist/70">
              Зображення слайда: {credit}
            </p>
          </div>
        </div>

        {presenter && (
          <footer className="border-t border-gold/20 px-5 py-3">
            {nextSlide ? (
              <button
                type="button"
                onClick={onNext}
                className="group flex w-full items-center gap-3 rounded border border-gold/25 bg-midnight/50 p-2 text-left transition-colors hover:border-gold"
              >
                <SmartImage
                  image={nextSlide.image}
                  thumb
                  eager={false}
                  className="h-12 w-20 shrink-0 rounded-sm border border-gold/30"
                />
                <span className="min-w-0 flex-1">
                  <span className="block text-[11px] font-medium uppercase tracking-[0.18em] text-sand">
                    Далі · {nextSlide.number} / {total}
                  </span>
                  <span className="block truncate font-serif text-[17px] font-semibold text-ivory">
                    {nextSlide.title}
                  </span>
                </span>
                <ArrowRight className="h-4 w-4 text-gold transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
              </button>
            ) : (
              <p className="text-center font-serif text-[17px] italic text-gold-soft">Це останній слайд</p>
            )}
          </footer>
        )}
      </div>
    </motion.aside>
  )
}

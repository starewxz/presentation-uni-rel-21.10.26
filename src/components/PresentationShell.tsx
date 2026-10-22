import { useCallback, useEffect, useRef } from 'react'
import { AnimatePresence } from 'framer-motion'
import { BookOpenText, LayoutGrid, Presentation } from 'lucide-react'
import type { SlideData } from '../types/presentation'
import { useFullscreen } from '../hooks/useFullscreen'
import { useIdle } from '../hooks/useIdle'
import { useKeyboardNavigation } from '../hooks/useKeyboardNavigation'
import { usePresentation } from '../hooks/usePresentation'
import { useStageMetrics } from '../hooks/useStageMetrics'
import { useSwipe } from '../hooks/useSwipe'
import FullscreenButton from './FullscreenButton'
import ProgressIndicator from './ProgressIndicator'
import SlideNavigation from './SlideNavigation'
import SlideOverview from './SlideOverview'
import SlideRenderer from './SlideRenderer'
import SpeakerNotes from './SpeakerNotes'
import Mandala from './ui/Mandala'
import ControlButton from './ui/ControlButton'

interface PresentationShellProps {
  slides: readonly SlideData[]
}

export default function PresentationShell({ slides }: PresentationShellProps) {
  const total = slides.length
  const p = usePresentation(total)
  const fullscreen = useFullscreen()
  const stageRef = useRef<HTMLDivElement>(null)
  useStageMetrics(stageRef)

  const slide = slides[p.index]
  const nextSlide = slides[p.index + 1] ?? null

  const idle = useIdle(3500, fullscreen.isFullscreen && !p.overviewOpen)
  const controlsHidden = idle && fullscreen.isFullscreen

  const escape = useCallback(() => {
    if (p.overviewOpen) p.closeOverview()
    else if (p.panel !== 'closed') p.closePanel()
  }, [p])

  useKeyboardNavigation(
    {
      next: p.next,
      prev: p.prev,
      first: p.first,
      last: p.last,
      toggleNotes: p.toggleNotes,
      togglePresenter: p.togglePresenter,
      toggleOverview: p.toggleOverview,
      toggleFullscreen: fullscreen.toggle,
      escape,
    },
    p.overviewOpen,
  )

  useSwipe(stageRef, { onSwipeLeft: p.next, onSwipeRight: p.prev, enabled: !p.overviewOpen })

  // Підвантажуємо фото сусідніх слайдів, щоб перехід не «блимав».
  useEffect(() => {
    ;[slides[p.index + 1], slides[p.index - 1]].forEach((s) => {
      if (s) new Image().src = s.image.src
    })
  }, [p.index, slides])

  useEffect(() => {
    document.title = `${slide.number}/${total} · ${slide.layout === 'cover' ? 'Індуїзм' : slide.title} — Релігієзнавство`
  }, [slide, total])

  const panelOpen = p.panel !== 'closed'

  return (
    <div className={`flex h-dvh w-screen flex-col overflow-hidden bg-midnight text-ivory lg:flex-row ${controlsHidden ? 'cursor-none' : ''}`}>
      <main
        ref={stageRef}
        data-mode="wide"
        aria-label="Презентація"
        className="relative min-h-0 min-w-0 flex-1 overflow-hidden"
      >
        <SlideRenderer slides={slides} index={p.index} direction={p.direction} />

        {/* Верхня смуга: мітка і назва */}
        <div
          className={`pointer-events-none absolute inset-x-0 top-0 z-20 flex items-start justify-between px-5 pt-4 transition-opacity duration-500 wide:px-[calc(var(--u)*40px)] wide:pt-[calc(var(--u)*28px)] ${
            controlsHidden ? 'opacity-0' : 'opacity-100'
          }`}
        >
          <div
            className={`flex items-center gap-2 text-[max(10px,calc(var(--u)*12px))] font-medium uppercase tracking-[0.24em] text-sand transition-opacity duration-500 ${
              p.index === 0 ? 'opacity-0' : 'opacity-100'
            }`}
            aria-hidden={p.index === 0}
          >
            <Mandala className="h-5 w-5 text-gold" ticks={false} petals={8} />
            Індуїзм · Релігієзнавство
          </div>
        </div>

        {/* Нижня панель керування */}
        <div
          className={`absolute inset-x-0 bottom-0 z-20 bg-gradient-to-t from-midnight via-midnight/70 to-transparent px-3 pb-3 pt-10 transition-opacity duration-500 roomy:px-[calc(var(--u)*40px)] ${
            controlsHidden ? 'pointer-events-none opacity-0' : 'opacity-100'
          }`}
        >
          <div className="flex flex-col items-center gap-2 roomy:flex-row roomy:justify-between">
            <div className="order-2 flex w-full items-center justify-between gap-2 roomy:order-none roomy:w-auto">
              <SlideNavigation onPrev={p.prev} onNext={p.next} isFirst={p.isFirst} isLast={p.isLast} />
              <div className="flex items-center gap-2 roomy:hidden">
                <ToolButtons p={p} panelOpen={panelOpen} fullscreen={fullscreen} />
              </div>
            </div>

            <div className="order-1 roomy:order-none">
              <ProgressIndicator slides={slides} index={p.index} onSelect={p.goTo} />
            </div>

            <div className="hidden items-center gap-2 roomy:flex">
              <ToolButtons p={p} panelOpen={panelOpen} fullscreen={fullscreen} />
            </div>
          </div>
        </div>
      </main>

      <AnimatePresence initial={false}>
        {p.panel !== 'closed' && (
          <SpeakerNotes
            key="panel"
            slide={slide}
            nextSlide={nextSlide}
            total={total}
            mode={p.panel}
            onClose={p.closePanel}
            onNext={p.next}
          />
        )}
      </AnimatePresence>

      <SlideOverview
        open={p.overviewOpen}
        slides={slides}
        currentIndex={p.index}
        onClose={p.closeOverview}
        onSelect={(i) => {
          p.goTo(i)
          p.closeOverview()
        }}
      />

      <div className="sr-only" aria-live="polite" role="status">
        Слайд {slide.number} із {total}: {slide.title}
      </div>
    </div>
  )
}

interface ToolButtonsProps {
  p: ReturnType<typeof usePresentation>
  panelOpen: boolean
  fullscreen: ReturnType<typeof useFullscreen>
}

function ToolButtons({ p, fullscreen }: ToolButtonsProps) {
  return (
    <>
      <ControlButton
        icon={<BookOpenText className="h-[18px] w-[18px]" aria-hidden="true" />}
        label="Нотатки"
        aria-label="Нотатки доповідача"
        hint="N"
        pressed={p.panel === 'notes'}
        onClick={p.toggleNotes}
      />
      <ControlButton
        icon={<Presentation className="h-[18px] w-[18px]" aria-hidden="true" />}
        label="Доповідач"
        aria-label="Режим доповідача"
        hint="P"
        pressed={p.panel === 'presenter'}
        onClick={p.togglePresenter}
      />
      <ControlButton
        icon={<LayoutGrid className="h-[18px] w-[18px]" aria-hidden="true" />}
        label="Огляд"
        aria-label="Огляд слайдів"
        hint="O"
        onClick={p.openOverview}
      />
      <FullscreenButton
        isFullscreen={fullscreen.isFullscreen}
        supported={fullscreen.supported}
        onToggle={fullscreen.toggle}
      />
    </>
  )
}

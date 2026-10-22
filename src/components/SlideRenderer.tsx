import { AnimatePresence, motion, useReducedMotion, type Variants } from 'framer-motion'
import type { Direction, SlideData } from '../types/presentation'
import CasteLayout from './layouts/CasteLayout'
import ConclusionLayout from './layouts/ConclusionLayout'
import CoverLayout from './layouts/CoverLayout'
import CowLayout from './layouts/CowLayout'
import KarmaLayout from './layouts/KarmaLayout'
import MokshaLayout from './layouts/MokshaLayout'
import OriginsLayout from './layouts/OriginsLayout'
import PantheonLayout from './layouts/PantheonLayout'
import SamsaraLayout from './layouts/SamsaraLayout'
import YogaLayout from './layouts/YogaLayout'

function SlideBody({ slide }: { slide: SlideData }) {
  switch (slide.layout) {
    case 'cover':
      return <CoverLayout slide={slide} />
    case 'origins':
      return <OriginsLayout slide={slide} />
    case 'pantheon':
      return <PantheonLayout slide={slide} />
    case 'karma':
      return <KarmaLayout slide={slide} />
    case 'samsara':
      return <SamsaraLayout slide={slide} />
    case 'moksha':
      return <MokshaLayout slide={slide} />
    case 'cow':
      return <CowLayout slide={slide} />
    case 'caste':
      return <CasteLayout slide={slide} />
    case 'yoga':
      return <YogaLayout slide={slide} />
    case 'conclusion':
      return <ConclusionLayout slide={slide} />
  }
}

interface SlideRendererProps {
  slides: readonly SlideData[]
  index: number
  direction: Direction
}

const EASE = [0.22, 1, 0.36, 1] as const

export default function SlideRenderer({ slides, index, direction }: SlideRendererProps) {
  const reduce = useReducedMotion()
  const slide = slides[index]

  /* Вхід: м’яке «проявлення» з легким зсувом; вихід лишається видимим, доки нове не накриє його. */
  const variants: Variants = {
    enter: (d: Direction) => ({ opacity: 0, x: reduce ? 0 : d * 56 }),
    center: {
      opacity: 1,
      x: 0,
      transition: { duration: reduce ? 0.2 : 0.85, ease: EASE, delayChildren: reduce ? 0 : 0.25, staggerChildren: 0.09 },
    },
    exit: (d: Direction) => ({
      opacity: 0,
      x: reduce ? 0 : d * -40,
      transition: { duration: 0.35, delay: reduce ? 0 : 0.6 },
    }),
  }

  return (
    <AnimatePresence initial={false} custom={direction}>
      <motion.section
        key={slide.id}
        custom={direction}
        variants={variants}
        initial="enter"
        animate="center"
        exit="exit"
        aria-roledescription="слайд"
        aria-label={`Слайд ${slide.number} із ${slides.length}: ${slide.title}`}
        className="no-scrollbar absolute inset-0 overflow-y-auto overflow-x-hidden bg-midnight"
      >
        <SlideBody slide={slide} />
      </motion.section>
    </AnimatePresence>
  )
}

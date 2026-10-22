import { useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { Check, X } from 'lucide-react'
import type { KarmaSlide } from '../../types/presentation'
import Backdrop from '../ui/Backdrop'
import Eyebrow from '../ui/Eyebrow'
import Rich from '../ui/Rich'
import Rise from '../ui/Rise'
import SlideCanvas from '../ui/SlideCanvas'

/** Координати вузлів у системі 760 × 420 — одночасно для лінії та для кнопок. */
const W = 760
const H = 420
const NODES: [number, number][] = [
  [70, 330],
  [225, 290],
  [395, 225],
  [560, 150],
  [700, 82],
]
const BRANCH: [number, number][] = [
  [225, 290],
  [400, 345],
  [560, 375],
  [700, 380],
]

const smooth = (points: [number, number][]): string =>
  points.reduce((d, [x, y], i) => {
    if (i === 0) return `M${x} ${y}`
    const [px, py] = points[i - 1]
    const dx = (x - px) / 2
    return `${d} C${px + dx} ${py} ${x - dx} ${y} ${x} ${y}`
  }, '')

export default function KarmaLayout({ slide }: { slide: KarmaSlide }) {
  const [activeId, setActiveId] = useState(slide.chain[0].id)
  const reduce = useReducedMotion()
  const active = slide.chain.find((c) => c.id === activeId) ?? slide.chain[0]
  const activeIndex = slide.chain.indexOf(active)

  return (
    <SlideCanvas>
      <Backdrop
        image={slide.image}
        shade="bg-gradient-to-r from-midnight via-midnight/92 to-midnight/80"
      />

      <div className="safe-px safe-pt safe-pb relative z-10 grid flex-1 gap-u5 wide:grid-cols-12 wide:gap-u6">
        <div className="flex flex-col justify-center wide:col-span-5">
          <Rise>
            <Eyebrow number={slide.number} label={slide.eyebrow} />
          </Rise>
          <Rise>
            <h2 className="mt-u2 flex flex-wrap items-baseline gap-x-u3 font-serif text-[max(48px,calc(var(--u)*104px))] font-medium leading-[0.95] text-ivory">
              {slide.title}
              <span lang="sa" className="font-deva text-[max(20px,calc(var(--u)*34px))] font-normal text-gold/90">
                {slide.subtitle}
              </span>
            </h2>
          </Rise>
          <Rise>
            <p className="mt-u3 text-lead text-mist text-pretty">
              <Rich text={slide.lead ?? ''} />
            </p>
          </Rise>
          <Rise>
            <div className="mt-u4 space-y-u2">
              <div className="flex gap-u2">
                <X className="mt-1 h-5 w-5 shrink-0 text-sand/70" aria-label="Не так" />
                <p className="text-small text-sand/90 line-through decoration-sand/40 text-pretty">
                  {slide.misconception.wrong}
                </p>
              </div>
              <div className="flex gap-u2">
                <Check className="mt-1 h-5 w-5 shrink-0 text-gold" aria-label="Так" />
                <p className="text-body text-ivory text-pretty">{slide.misconception.right}</p>
              </div>
            </div>
          </Rise>
        </div>

        <div className="flex flex-col justify-center wide:col-span-7">
          <Rise>
            <div className="relative w-full" style={{ aspectRatio: `${W} / ${H}` }}>
              <svg
                viewBox={`0 0 ${W} ${H}`}
                className="absolute inset-0 h-full w-full overflow-visible"
                fill="none"
                aria-hidden="true"
              >
                <defs>
                  <linearGradient id="karma-line" x1="0" y1="1" x2="1" y2="0">
                    <stop offset="0" stopColor="#B7A58A" />
                    <stop offset="1" stopColor="#E8CF9B" />
                  </linearGradient>
                </defs>
                <motion.path
                  d={smooth(BRANCH)}
                  stroke="#B8BCCD"
                  strokeOpacity="0.7"
                  strokeWidth="2.5"
                  strokeDasharray="3 9"
                  strokeLinecap="round"
                  initial={reduce ? false : { pathLength: 0, opacity: 0 }}
                  animate={{ pathLength: 1, opacity: 1 }}
                  transition={{ duration: 2.2, delay: 1.2, ease: 'easeInOut' }}
                />
                <motion.path
                  d={smooth(NODES)}
                  stroke="url(#karma-line)"
                  strokeWidth="3"
                  strokeLinecap="round"
                  initial={reduce ? false : { pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 2.4, delay: 0.5, ease: 'easeInOut' }}
                  style={{ filter: 'drop-shadow(0 0 8px rgba(214,179,106,0.6))' }}
                />
                <text x="700" y="410" textAnchor="end" fontSize="15" fill="#B8BCCD" fillOpacity="0.8" fontStyle="italic">
                  інший вибір — інший слід
                </text>
              </svg>

              {NODES.map(([x, y], i) => {
                const node = slide.chain[i]
                const isActive = node.id === activeId
                const reached = i <= activeIndex
                return (
                  <button
                    key={node.id}
                    type="button"
                    onClick={() => setActiveId(node.id)}
                    aria-pressed={isActive}
                    aria-label={`${i + 1}. ${node.title}`}
                    className="group absolute -translate-x-1/2 -translate-y-1/2"
                    style={{ left: `${(x / W) * 100}%`, top: `${(y / H) * 100}%` }}
                  >
                    <span
                      className={`flex h-[max(30px,calc(var(--u)*46px))] w-[max(30px,calc(var(--u)*46px))] items-center justify-center rounded-full border bg-midnight font-serif text-h3 leading-none transition-all duration-500 ease-cinema ${
                        isActive
                          ? 'scale-125 border-gold text-gold shadow-[0_0_30px_rgba(214,179,106,0.65)]'
                          : reached
                            ? 'border-gold/80 text-gold-soft'
                            : 'border-sand/50 text-sand group-hover:border-gold'
                      }`}
                    >
                      {i + 1}
                    </span>
                    <span
                      className={`pointer-events-none absolute left-1/2 -translate-x-1/2 whitespace-nowrap font-serif text-[max(14px,calc(var(--u)*22px))] font-semibold transition-colors ${
                        'bottom-full mb-u2'
                      } ${isActive ? 'text-gold' : 'text-ivory/85'}`}
                    >
                      {node.title}
                    </span>
                  </button>
                )
              })}
            </div>
          </Rise>

          <Rise>
            <div
              aria-live="polite"
              className="glass mt-u3 min-h-[calc(var(--u)*128px)] border-l-2 border-gold p-u3"
            >
              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={active.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.3 }}
                >
                  <p className="text-label font-medium uppercase text-gold">
                    Крок {activeIndex + 1} із {slide.chain.length}
                  </p>
                  <p className="mt-1 font-serif text-h3 font-semibold text-ivory">{active.title}</p>
                  <p className="mt-1 text-body text-mist text-pretty">{active.text}</p>
                </motion.div>
              </AnimatePresence>
            </div>
            <p className="mt-u2 font-serif text-quote italic text-gold-soft">{slide.keyIdea}</p>
          </Rise>
        </div>
      </div>
    </SlideCanvas>
  )
}

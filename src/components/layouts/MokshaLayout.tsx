import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import type { LiberationRelation, MokshaSlide } from '../../types/presentation'
import Eyebrow from '../ui/Eyebrow'
import Frame from '../ui/Frame'
import Rich from '../ui/Rich'
import Rise from '../ui/Rise'
import Segmented from '../ui/Segmented'
import SlideCanvas from '../ui/SlideCanvas'

interface Geometry {
  brahman: { cx: number; cy: number; r: number }
  atman: { cx: number; cy: number; r: number }
  labelB: { x: number; y: number }
  labelA: { x: number; y: number }
  showLabels: boolean
}

const GEOMETRY: Record<LiberationRelation, Geometry> = {
  merge: {
    brahman: { cx: 120, cy: 100, r: 78 },
    atman: { cx: 120, cy: 100, r: 78 },
    labelB: { x: 120, y: 96 },
    labelA: { x: 120, y: 114 },
    showLabels: false,
  },
  within: {
    brahman: { cx: 120, cy: 100, r: 78 },
    atman: { cx: 132, cy: 120, r: 26 },
    labelB: { x: 120, y: 56 },
    labelA: { x: 132, y: 124 },
    showLabels: true,
  },
  apart: {
    brahman: { cx: 82, cy: 100, r: 52 },
    atman: { cx: 190, cy: 100, r: 22 },
    labelB: { x: 82, y: 104 },
    labelA: { x: 190, y: 104 },
    showLabels: true,
  },
}

const SPRING = { type: 'spring', stiffness: 90, damping: 18 } as const

function RelationDiagram({ relation }: { relation: LiberationRelation }) {
  const g = GEOMETRY[relation]
  return (
    <svg
      viewBox="0 0 240 200"
      role="img"
      aria-label={
        relation === 'merge'
          ? 'Схема: атман і брахман — одне коло'
          : relation === 'within'
            ? 'Схема: душа всередині Бога, але окрема від Нього'
            : 'Схема: душа й Бог — окремі кола'
      }
      className="h-full w-full"
      fill="none"
    >
      <defs>
        <radialGradient id="glow" cx="50%" cy="50%" r="50%">
          <stop offset="0" stopColor="#D6B36A" stopOpacity="0.35" />
          <stop offset="1" stopColor="#D6B36A" stopOpacity="0" />
        </radialGradient>
      </defs>
      <motion.circle
        fill="url(#glow)"
        animate={{ cx: g.brahman.cx, cy: g.brahman.cy, r: g.brahman.r + 16 }}
        transition={SPRING}
      />
      <motion.circle
        stroke="#D6B36A"
        strokeWidth="1.6"
        strokeDasharray="4 5"
        animate={{ cx: g.brahman.cx, cy: g.brahman.cy, r: g.brahman.r }}
        transition={SPRING}
      />
      <motion.circle
        stroke="#F4EFE5"
        strokeWidth="1.6"
        fill="#D6B36A"
        fillOpacity={relation === 'merge' ? 0.12 : 0.85}
        animate={{ cx: g.atman.cx, cy: g.atman.cy, r: g.atman.r, strokeOpacity: relation === 'merge' ? 0 : 1 }}
        transition={SPRING}
      />
      {relation === 'apart' && (
        <motion.line
          x1="134"
          y1="100"
          x2="168"
          y2="100"
          stroke="#D6B36A"
          strokeDasharray="2 4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        />
      )}
      {relation === 'merge' ? (
        <g textAnchor="middle" fontFamily="'Cormorant Garamond', serif" fill="#F4EFE5">
          <text x="120" y="96" fontSize="15" fontWeight="600">
            АТМАН
          </text>
          <text x="120" y="108" fontSize="9" fill="#D6B36A">
            =
          </text>
          <text x="120" y="124" fontSize="15" fontWeight="600">
            БРАХМАН
          </text>
        </g>
      ) : (
        g.showLabels && (
          <g textAnchor="middle" fontFamily="'Cormorant Garamond', serif" fontWeight="600" fontSize="14">
            <text x={g.labelB.x} y={g.labelB.y} fill="#F4EFE5">
              {relation === 'within' ? 'БРАХМАН / БОГ' : 'БОГ'}
            </text>
            <text x={g.labelA.x} y={g.labelA.y} fill="#10172A" fontSize="11">
              АТМАН
            </text>
          </g>
        )
      )}
    </svg>
  )
}

export default function MokshaLayout({ slide }: { slide: MokshaSlide }) {
  const [viewId, setViewId] = useState(slide.views[0].id)
  const view = slide.views.find((v) => v.id === viewId) ?? slide.views[0]

  return (
    <SlideCanvas className="bg-gradient-to-br from-indigo-deep via-midnight to-indigo">
      <div className="safe-px safe-pt safe-pb relative z-10 grid flex-1 gap-u5 wide:grid-cols-12 wide:gap-u8">
        <Rise className="h-48 min-h-0 wide:col-span-3 wide:h-auto">
          <Frame image={slide.image} arch className="h-full" />
        </Rise>

        <div className="flex flex-col justify-center wide:col-span-9">
          <Rise>
            <Eyebrow number={slide.number} label={slide.eyebrow} />
          </Rise>
          <Rise>
            <h2 className="mt-u2 flex flex-wrap items-baseline gap-x-u3 font-serif text-[max(44px,calc(var(--u)*76px))] font-medium leading-none text-ivory">
              {slide.title}
              <span lang="sa" className="font-deva text-[max(18px,calc(var(--u)*30px))] font-normal text-gold/90">
                {slide.subtitle}
              </span>
            </h2>
          </Rise>
          <Rise>
            <p className="mt-u2 max-w-[44em] text-lead text-mist text-pretty">
              <Rich text={slide.lead ?? ''} />
            </p>
          </Rise>

          <Rise>
            <div className="mt-u3">
              <p className="mb-u1 font-serif text-[max(17px,calc(var(--u)*24px))] italic text-gold-soft text-balance">{slide.keyIdea}</p>
              <Segmented
                label="Філософські школи"
                idPrefix="views"
                options={slide.views.map((v) => ({ id: v.id, label: v.school }))}
                value={viewId}
                onChange={setViewId}
              />
              <div
                role="tabpanel"
                id="views-panel"
                aria-labelledby={`views-tab-${viewId}`}
                aria-live="polite"
                className="grid items-center gap-u3 pt-u2 sm:grid-cols-[calc(var(--u)*220px)_1fr]"
              >
                <div className="mx-auto h-[calc(var(--u)*140px)] min-h-[120px] w-full max-w-[260px]">
                  <RelationDiagram relation={view.relation} />
                </div>
                <div className="min-h-[calc(var(--u)*96px)]">
                  <AnimatePresence mode="wait" initial={false}>
                    <motion.div
                      key={view.id}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -6 }}
                      transition={{ duration: 0.3 }}
                    >
                      <p className="font-serif text-h3 font-semibold text-gold">{view.title}</p>
                      <p className="mt-1 text-body text-ivory/90 text-pretty">
                        <Rich text={view.text} />
                      </p>
                    </motion.div>
                  </AnimatePresence>
                </div>
              </div>
            </div>
          </Rise>

          <Rise>
            <div className="mt-u2 border-t border-gold/25 pt-u2">
              <p className="mb-u1 text-label font-medium uppercase text-sand">Шляхи до звільнення</p>
              <ul className="grid grid-cols-2 gap-u2 wide:grid-cols-4">
                {slide.paths.map((path) => (
                  <li key={path.id}>
                    <p className="flex items-baseline gap-u1">
                      <span lang="sa" className="font-deva text-h3 leading-none text-gold">
                        {path.accent}
                      </span>
                    </p>
                    <p className="mt-1 font-serif text-[max(16px,calc(var(--u)*22px))] font-semibold leading-tight text-ivory">
                      {path.title}
                    </p>
                    <p className="text-[max(11px,calc(var(--u)*14px))] leading-snug text-mist text-pretty">{path.text}</p>
                  </li>
                ))}
              </ul>
            </div>
          </Rise>
        </div>
      </div>
    </SlideCanvas>
  )
}

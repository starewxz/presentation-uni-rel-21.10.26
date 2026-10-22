import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import type { YogaSlide } from '../../types/presentation'
import Eyebrow from '../ui/Eyebrow'
import Frame from '../ui/Frame'
import Rich from '../ui/Rich'
import Rise from '../ui/Rise'
import Segmented from '../ui/Segmented'
import SlideCanvas from '../ui/SlideCanvas'

export default function YogaLayout({ slide }: { slide: YogaSlide }) {
  const [stepId, setStepId] = useState(slide.story[0].id)
  const stepIndex = Math.max(
    0,
    slide.story.findIndex((s) => s.id === stepId),
  )
  const step = slide.story[stepIndex]

  return (
    <SlideCanvas className="bg-gradient-to-br from-indigo-deep via-midnight to-indigo">
      <div className="safe-px safe-pt safe-pb relative z-10 grid flex-1 gap-u5 wide:grid-cols-12 wide:gap-u8">
        <div className="flex flex-col justify-center gap-u3 wide:col-span-5">
          <Rise className="h-[calc(var(--u)*280px)] min-h-[170px]">
            <Frame image={slide.image} className="h-full" />
          </Rise>
          <Rise>
            <p className="mb-u1 text-label font-medium uppercase text-gold">Дилема Арджуни · Бхагавадгіта</p>
            <Segmented
              label="Етапи історії"
              idPrefix="story"
              options={slide.story.map((s, i) => ({ id: s.id, label: `${i + 1}. ${s.title}` }))}
              value={stepId}
              onChange={setStepId}
            />
            <div
              role="tabpanel"
              id="story-panel"
              aria-labelledby={`story-tab-${stepId}`}
              aria-live="polite"
              className="min-h-[calc(var(--u)*96px)] pt-u2"
            >
              <AnimatePresence mode="wait" initial={false}>
                <motion.p
                  key={step.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.3 }}
                  className="text-body text-ivory/90 text-pretty"
                >
                  <Rich text={step.text} />
                </motion.p>
              </AnimatePresence>
            </div>
          </Rise>
        </div>

        <div className="flex flex-col justify-center wide:col-span-7">
          <Rise>
            <Eyebrow number={slide.number} label={slide.eyebrow} />
          </Rise>
          <Rise>
            <h2 className="mt-u2 font-serif text-h2 font-medium text-ivory text-balance">{slide.title}</h2>
          </Rise>
          <Rise>
            <p lang="sa" className="mt-u1 font-deva text-h3 text-gold/90">
              {slide.subtitle}
            </p>
          </Rise>
          <Rise>
            <p className="mt-u2 text-lead text-mist text-pretty">
              <Rich text={slide.lead ?? ''} />
            </p>
          </Rise>

          <Rise>
            <p className="mb-u1 mt-u3 text-label font-medium uppercase text-sand">Три шляхи Бхагавадгіти</p>
            <ul className="grid gap-u2 sm:grid-cols-3">
              {slide.paths.map((path, i) => (
                <li
                  key={path.id}
                  className="relative overflow-hidden border border-gold/40 bg-gradient-to-b from-indigo/80 to-midnight/80 p-u2"
                >
                  <span aria-hidden="true" className="absolute right-2 top-1 font-serif text-[max(30px,calc(var(--u)*58px))] leading-none text-gold/15">
                    {i + 1}
                  </span>
                  <p lang="sa" className="font-deva text-h3 leading-none text-gold">
                    {path.accent}
                  </p>
                  <h3 className="mt-u1 font-serif text-h3 font-semibold text-ivory">{path.title}</h3>
                  <p className="mt-1 text-small text-mist text-pretty">{path.text}</p>
                </li>
              ))}
            </ul>
          </Rise>

          <Rise>
            <p className="mt-u3 flex items-start gap-u2 border-t border-gold/25 pt-u2 text-small text-sand text-pretty">
              <span aria-hidden="true" className="mt-[0.5em] h-1.5 w-1.5 shrink-0 rotate-45 bg-gold" />
              {slide.asanaNote}
            </p>
          </Rise>
        </div>
      </div>
    </SlideCanvas>
  )
}

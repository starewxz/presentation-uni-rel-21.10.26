import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import type { Deity, PantheonSlide } from '../../types/presentation'
import Backdrop from '../ui/Backdrop'
import Eyebrow from '../ui/Eyebrow'
import Rich from '../ui/Rich'
import Rise from '../ui/Rise'
import Segmented from '../ui/Segmented'
import SlideCanvas from '../ui/SlideCanvas'
import SmartImage from '../ui/SmartImage'

function Arch({ deity }: { deity: Deity }) {
  return (
    <article className="flex flex-col items-center rounded-t-[999px] border border-gold/40 bg-gradient-to-b from-indigo/90 to-midnight/90 px-u2 pb-u3 pt-u6 text-center shadow-[0_20px_50px_-24px_rgba(0,0,0,0.8)]">
      <span lang="sa" className="font-deva text-[max(28px,calc(var(--u)*50px))] leading-none text-gold">
        {deity.accent}
      </span>
      <h3 className="mt-u2 font-serif text-[max(24px,calc(var(--u)*38px))] font-semibold leading-none text-ivory">
        {deity.title}
      </h3>
      <p className="mt-u1 text-label font-medium uppercase text-gold-soft">{deity.role}</p>
      <span aria-hidden="true" className="gold-rule my-u2 w-u6 opacity-70" />
      <p className="text-small text-mist text-pretty">{deity.text}</p>
    </article>
  )
}

function Portrait({ deity }: { deity: Deity }) {
  return (
    <article className="flex items-center gap-u2">
      {deity.image && (
        <SmartImage
          image={deity.image}
          className="h-[max(52px,calc(var(--u)*84px))] w-[max(52px,calc(var(--u)*84px))] shrink-0 rounded-full border border-gold/60"
        />
      )}
      <div className="min-w-0">
        <h3 className="flex items-baseline gap-u1 font-serif text-h3 font-semibold leading-none text-ivory">
          {deity.title}
          <span lang="sa" className="font-deva text-small font-normal text-gold/80">
            {deity.accent}
          </span>
        </h3>
        <p className="mt-1 text-small text-mist">{deity.text}</p>
      </div>
    </article>
  )
}

export default function PantheonLayout({ slide }: { slide: PantheonSlide }) {
  const [readingId, setReadingId] = useState(slide.readings[0].id)
  const reading = slide.readings.find((r) => r.id === readingId) ?? slide.readings[0]

  return (
    <SlideCanvas>
      <Backdrop image={slide.image} shade="bg-midnight/80" />

      <div className="safe-px safe-pt safe-pb relative z-10 grid flex-1 gap-u5 wide:grid-cols-12 wide:gap-u6">
        <div className="flex flex-col justify-center wide:col-span-5">
          <Rise>
            <Eyebrow number={slide.number} label={slide.eyebrow} />
          </Rise>
          <Rise>
            <h2 className="mt-u2 font-serif text-h2 font-medium text-ivory">{slide.title}</h2>
          </Rise>
          <Rise>
            <p className="mt-u2 text-lead text-mist text-pretty">
              <Rich text={slide.lead ?? ''} />
            </p>
          </Rise>

          <Rise>
            <div className="mt-u3">
              <Segmented
                label="Способи розуміти божественне"
                idPrefix="readings"
                options={slide.readings.map((r) => ({ id: r.id, label: r.title }))}
                value={readingId}
                onChange={setReadingId}
              />
              <div
                role="tabpanel"
                id="readings-panel"
                aria-labelledby={`readings-tab-${readingId}`}
                aria-live="polite"
                className="min-h-[calc(var(--u)*118px)] pt-u2"
              >
                <AnimatePresence mode="wait" initial={false}>
                  <motion.p
                    key={reading.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    transition={{ duration: 0.3 }}
                    className="text-body text-ivory/90 text-pretty"
                  >
                    <Rich text={reading.text} />
                  </motion.p>
                </AnimatePresence>
              </div>
            </div>
          </Rise>

          <Rise>
            <aside className="mt-u1 border border-gold/50 bg-gold/[0.07] p-u2">
              <p className="font-serif text-h3 font-semibold italic text-gold">{slide.brahmanNote.title}</p>
              <p className="mt-1 text-small text-ivory/90 text-pretty">
                <Rich text={slide.brahmanNote.text} />
              </p>
            </aside>
          </Rise>
        </div>

        <div className="flex flex-col justify-center gap-u4 wide:col-span-7">
          <Rise>
            <p className="mb-u2 flex items-center gap-u2 text-label font-medium uppercase text-sand">
              <span aria-hidden="true" className="gold-rule w-u6" />
              Тримурті · три образи космічного циклу
            </p>
            <div className="grid grid-cols-1 gap-u2 sm:grid-cols-3">
              {slide.trimurti.map((deity) => (
                <Arch key={deity.id} deity={deity} />
              ))}
            </div>
          </Rise>
          <Rise>
            <p className="mb-u2 flex items-center gap-u2 text-label font-medium uppercase text-sand">
              <span aria-hidden="true" className="gold-rule w-u6" />
              Інші улюблені образи
            </p>
            <div className="grid gap-u2 border-t border-gold/20 pt-u2 sm:grid-cols-3">
              {slide.others.map((deity) => (
                <Portrait key={deity.id} deity={deity} />
              ))}
            </div>
          </Rise>
        </div>
      </div>
    </SlideCanvas>
  )
}

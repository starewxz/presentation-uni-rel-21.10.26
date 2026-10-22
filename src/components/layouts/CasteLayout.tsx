import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import type { CasteSlide } from '../../types/presentation'
import Eyebrow from '../ui/Eyebrow'
import Frame from '../ui/Frame'
import Rich from '../ui/Rich'
import Rise from '../ui/Rise'
import Segmented from '../ui/Segmented'
import SlideCanvas from '../ui/SlideCanvas'

type TabId = 'model' | 'inequality' | 'reform'

const TABS = [
  { id: 'model', label: 'Варна й джаті' },
  { id: 'inequality', label: 'Нерівність' },
  { id: 'reform', label: 'Реформи й закон' },
] as const satisfies readonly { id: TabId; label: string }[]

function Panel({ slide, tab }: { slide: CasteSlide; tab: TabId }) {
  if (tab === 'model') {
    return (
      <div className="grid gap-u4 sm:grid-cols-[1fr_1.3fr]">
        <div>
          <p className="mb-u1 text-label font-medium uppercase text-sand">Чотири варни — схема</p>
          <ol className="space-y-1.5">
            {slide.varnas.map((varna, i) => (
              <li
                key={varna.id}
                className="flex items-baseline justify-between gap-u2 border border-gold/30 bg-midnight/40 px-u2 py-1.5"
                style={{ marginLeft: `${i * 4}%` }}
              >
                <span className="font-serif text-h3 font-semibold leading-none text-ivory">{varna.title}</span>
                <span className="text-small text-mist">{varna.role}</span>
              </li>
            ))}
          </ol>
        </div>
        <ul className="space-y-u2">
          {slide.jati.map((point) => (
            <li key={point.id} className="border-l-2 border-gold/60 pl-u2">
              <p className="font-serif text-h3 font-semibold leading-tight text-gold-soft">{point.title}</p>
              <p className="text-small text-mist text-pretty">{point.text}</p>
            </li>
          ))}
        </ul>
      </div>
    )
  }

  if (tab === 'inequality') {
    return (
      <ul className="grid gap-u3 sm:grid-cols-3">
        {slide.inequality.map((point) => (
          <li key={point.id} className="border-t border-gold/50 pt-u2">
            <p className="font-serif text-h3 font-semibold leading-tight text-ivory">{point.title}</p>
            <p className="mt-1 text-small text-mist text-pretty">
              <Rich text={point.text} />
            </p>
          </li>
        ))}
      </ul>
    )
  }

  return (
    <ol className="relative grid gap-u3 sm:grid-cols-4">
      {slide.reform.map((step) => (
        <li key={step.id} className="relative border-t border-gold/50 pt-u2">
          <span aria-hidden="true" className="absolute -top-[5px] left-0 h-2.5 w-2.5 rotate-45 bg-gold" />
          <p className="text-label font-medium uppercase text-gold">{step.period}</p>
          <p className="mt-1 font-serif text-h3 font-semibold leading-tight text-ivory">{step.title}</p>
          <p className="mt-1 text-small text-mist text-pretty">{step.text}</p>
        </li>
      ))}
    </ol>
  )
}

export default function CasteLayout({ slide }: { slide: CasteSlide }) {
  const [tab, setTab] = useState<TabId>('model')

  return (
    <SlideCanvas className="bg-gradient-to-bl from-indigo via-midnight to-indigo-deep">
      <div className="safe-px safe-pt safe-pb relative z-10 grid flex-1 gap-u5 wide:grid-cols-12 wide:gap-u8">
        <Rise className="flex min-h-0 flex-col wide:col-span-3">
          <div className="mx-auto h-64 w-52 wide:h-full wide:max-h-[calc(var(--u)*440px)] wide:w-full wide:self-center">
            <Frame image={slide.image} className="h-full" />
          </div>
        </Rise>

        <div className="flex flex-col justify-center wide:col-span-9">
          <Rise>
            <Eyebrow number={slide.number} label={slide.eyebrow} />
          </Rise>
          <Rise>
            <h2 className="mt-u2 font-serif text-h2 font-medium text-ivory text-balance">{slide.title}</h2>
          </Rise>
          <Rise>
            <p className="mt-u2 max-w-[46em] text-lead text-mist text-pretty">{slide.lead}</p>
          </Rise>

          <Rise>
            <div className="mt-u3">
              <Segmented
                label="Розділи про касти"
                idPrefix="caste"
                options={TABS}
                value={tab}
                onChange={setTab}
              />
              <div
                role="tabpanel"
                id="caste-panel"
                aria-labelledby={`caste-tab-${tab}`}
                className="min-h-[calc(var(--u)*214px)] pt-u3"
              >
                <AnimatePresence mode="wait" initial={false}>
                  <motion.div
                    key={tab}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Panel slide={slide} tab={tab} />
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>
          </Rise>

          <Rise>
            <p className="mt-u2 border-t border-gold/25 pt-u2 font-serif text-quote italic text-gold-soft">{slide.caveat}</p>
          </Rise>
        </div>
      </div>
    </SlideCanvas>
  )
}

import { ArrowRight } from 'lucide-react'
import type { OriginsSlide } from '../../types/presentation'
import Eyebrow from '../ui/Eyebrow'
import Frame from '../ui/Frame'
import Mandala from '../ui/Mandala'
import Rich from '../ui/Rich'
import Rise from '../ui/Rise'
import SlideCanvas from '../ui/SlideCanvas'

export default function OriginsLayout({ slide }: { slide: OriginsSlide }) {
  return (
    <SlideCanvas className="bg-gradient-to-br from-indigo via-midnight to-indigo-deep">
      <Mandala className="spin-slow-reverse pointer-events-none absolute -bottom-[30%] -left-[12%] h-[110%] text-gold/[0.12]" />

      <div className="safe-px safe-pt safe-pb relative z-10 flex flex-1 flex-col gap-u4">
        <div className="grid flex-1 gap-u5 wide:grid-cols-12 wide:gap-u8">
          <div className="flex flex-col justify-center wide:col-span-5">
            <Rise>
              <Eyebrow number={slide.number} label={slide.eyebrow} />
            </Rise>
            <Rise>
              <h2 className="mt-u3 font-serif text-h2 font-medium text-ivory">{slide.title}</h2>
            </Rise>
            <Rise>
              <p className="mt-u2 text-lead text-mist text-pretty">
                <Rich text={slide.lead ?? ''} />
              </p>
            </Rise>
            <Rise>
              <blockquote className="mt-u3 border-l-2 border-gold pl-u2 font-serif text-quote italic text-ivory text-balance">
                {slide.keyIdea}
              </blockquote>
            </Rise>
          </div>

          <div className="flex flex-col gap-u3 wide:col-span-7">
            <Rise className="h-[calc(var(--u)*230px)] min-h-[150px] wide:flex-none">
              <Frame image={slide.image} className="h-full" />
            </Rise>
            <Rise>
              <div className="grid items-stretch gap-u2 wide:grid-cols-[1fr_auto_1fr]">
                <div className="border border-sand/30 bg-midnight/50 p-u2">
                  <p className="text-label font-medium uppercase text-sand">{slide.shift.from.title}</p>
                  <p className="mt-1 text-small text-mist text-pretty">
                    <Rich text={slide.shift.from.text} />
                  </p>
                </div>
                <div className="flex items-center justify-center text-gold" aria-hidden="true">
                  <ArrowRight className="h-6 w-6 rotate-90 wide:rotate-0" />
                </div>
                <div className="border border-gold/50 bg-gold/[0.06] p-u2">
                  <p className="text-label font-medium uppercase text-gold">{slide.shift.to.title}</p>
                  <p className="mt-1 text-small text-ivory/90 text-pretty">
                    <Rich text={slide.shift.to.text} />
                  </p>
                </div>
              </div>
            </Rise>
          </div>
        </div>

        <Rise>
          <ol className="relative grid gap-u3 border-t border-gold/25 pt-u3 sm:grid-cols-2 wide:grid-cols-4">
            {slide.stages.map((stage, i) => (
              <li key={stage.id} className="relative">
                <div className="flex items-center gap-2">
                  <span
                    aria-hidden="true"
                    className="flex h-5 w-5 items-center justify-center rounded-full border border-gold bg-midnight font-serif text-[10px] leading-none text-gold"
                  >
                    {i + 1}
                  </span>
                  <span className="text-[max(10px,calc(var(--u)*12px))] uppercase tracking-[0.12em] text-sand">
                    {stage.period}
                  </span>
                </div>
                <div className="mt-1 flex items-baseline gap-u1">
                  <h3 className="font-serif text-h3 font-semibold text-ivory">{stage.title}</h3>
                  <span lang="sa" className="font-deva text-small text-gold/80">
                    {stage.accent}
                  </span>
                </div>
                <p className="mt-1 text-small text-mist text-pretty">{stage.text}</p>
              </li>
            ))}
          </ol>
        </Rise>
      </div>
    </SlideCanvas>
  )
}

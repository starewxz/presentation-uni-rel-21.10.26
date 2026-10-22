import type { CoverSlide } from '../../types/presentation'
import Backdrop from '../ui/Backdrop'
import Mandala from '../ui/Mandala'
import Rich from '../ui/Rich'
import Rise from '../ui/Rise'
import SlideCanvas from '../ui/SlideCanvas'

export default function CoverLayout({ slide }: { slide: CoverSlide }) {
  return (
    <SlideCanvas>
      <Backdrop
        image={slide.image}
        drift
        shade="bg-midnight/55 wide:bg-transparent wide:bg-gradient-to-r wide:from-midnight/90 wide:via-midnight/30 wide:to-transparent"
        vignette="bg-gradient-to-t from-midnight via-midnight/20 to-midnight/35"
      />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-[18%] top-1/2 aspect-square w-[min(120%,calc(var(--u)*820px))] -translate-y-1/2 wide:-right-[12%]"
      >
        <Mandala className="spin-slow h-full w-full text-gold/30" />
      </div>

      <div className="safe-px safe-pt safe-pb relative z-10 flex flex-1 flex-col justify-between gap-u4">
        <Rise>
          <p className="flex items-center gap-u2 text-label font-medium uppercase text-gold">
            <span aria-hidden="true" className="gold-rule w-u8" />
            {slide.label}
          </p>
        </Rise>

        <div className="max-w-[calc(var(--u)*1000px)]">
          <Rise y={36}>
            <h1 className="font-serif text-display font-medium tracking-[0.1em] text-ivory [text-shadow:0_6px_40px_rgba(0,0,0,0.5)]">
              {slide.title}
            </h1>
          </Rise>
          <Rise delay={0.1}>
            <p className="mt-u3 font-serif text-subtitle font-medium italic text-gold-soft text-balance">
              {slide.subtitle}
            </p>
          </Rise>
          <Rise delay={0.2}>
            <p className="mt-u2 max-w-[34em] text-lead text-ivory/85 text-pretty">{slide.supporting}</p>
          </Rise>
        </div>

        <Rise delay={0.15}>
          <div className="grid gap-u3 border-t border-gold/30 pt-u3 wide:grid-cols-[1.15fr_1fr] wide:gap-u8">
            <div>
              <p className="mb-u1 text-label font-medium uppercase text-sand">{slide.definitionHeading}</p>
              <p className="max-w-[36em] text-body text-mist text-pretty">
                <Rich text={slide.lead ?? ''} />
              </p>
            </div>
            <div>
              <blockquote className="border-l-2 border-gold pl-u2 font-serif text-quote italic text-ivory text-balance">
                {slide.keyIdea}
              </blockquote>
              <ul className="mt-u2 flex flex-wrap gap-x-u3 gap-y-1">
                {slide.facts.map((fact) => (
                  <li key={fact} className="flex items-center gap-2 text-small text-mist">
                    <span aria-hidden="true" className="h-1.5 w-1.5 rotate-45 bg-gold" />
                    {fact}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Rise>
      </div>
    </SlideCanvas>
  )
}

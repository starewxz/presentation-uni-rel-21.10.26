import type { ConclusionSlide } from '../../types/presentation'
import Backdrop from '../ui/Backdrop'
import Eyebrow from '../ui/Eyebrow'
import Mandala from '../ui/Mandala'
import Rise from '../ui/Rise'
import SlideCanvas from '../ui/SlideCanvas'

const EMPHASIS = 'ким є насправді'

function Question({ text }: { text: string }) {
  const at = text.indexOf(EMPHASIS)
  if (at < 0) return <>{text}</>
  return (
    <>
      {text.slice(0, at)}
      <em className="not-italic text-gold [text-shadow:0_0_40px_rgba(214,179,106,0.45)]">{EMPHASIS}</em>
      {text.slice(at + EMPHASIS.length)}
    </>
  )
}

export default function ConclusionLayout({ slide }: { slide: ConclusionSlide }) {
  return (
    <SlideCanvas>
      <Backdrop
        image={slide.image}
        drift
        shade="bg-gradient-to-t from-midnight via-midnight/60 to-transparent"
        vignette="bg-gradient-to-b from-midnight/35 via-transparent to-transparent"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-[57%] top-[37%] aspect-square w-[min(130%,calc(var(--u)*600px))] -translate-x-1/2 -translate-y-1/2"
      >
        <Mandala className="spin-slow h-full w-full text-gold/45" />
      </div>

      <div className="safe-px safe-pt safe-pb relative z-10 flex flex-1 flex-col items-center justify-end gap-u3 text-center">
        <Rise>
          <Eyebrow number={slide.number} label={slide.eyebrow} className="justify-center" />
        </Rise>

        <Rise>
          <ul className="flex flex-wrap items-start justify-center gap-x-u6 gap-y-u2">
            {slide.recap.map((item) => (
              <li key={item.id} className="max-w-[calc(var(--u)*230px)] min-w-[130px]">
                <p className="font-serif text-[max(16px,calc(var(--u)*26px))] font-semibold tracking-[0.22em] text-gold">
                  {item.title}
                </p>
                <p className="mt-1 text-small text-mist text-balance">{item.text}</p>
              </li>
            ))}
          </ul>
        </Rise>

        <Rise>
          <span aria-hidden="true" className="gold-rule mx-auto block w-u12 opacity-80" />
        </Rise>

        <Rise delay={0.2} y={30}>
          <h2 className="max-w-[24em] font-serif text-question font-medium italic text-ivory text-balance [text-shadow:0_4px_40px_rgba(0,0,0,0.6)]">
            <Question text={slide.question} />
          </h2>
        </Rise>
      </div>
    </SlideCanvas>
  )
}

import type { SamsaraSlide } from '../../types/presentation'
import Backdrop from '../ui/Backdrop'
import Eyebrow from '../ui/Eyebrow'
import Rich from '../ui/Rich'
import Rise from '../ui/Rise'
import SlideCanvas from '../ui/SlideCanvas'

/** Позиції чотирьох станцій кола (у відсотках від полотна колеса). */
const STATIONS = [
  { pos: 'left-1/2 top-[2%] -translate-x-1/2 -translate-y-1/2', align: 'items-center text-center', shift: 'bottom-full mb-2' },
  { pos: 'left-[98%] top-1/2 -translate-x-1/2 -translate-y-1/2', align: 'items-start text-left', shift: 'left-full ml-3 top-1/2 -translate-y-1/2' },
  { pos: 'left-1/2 top-[98%] -translate-x-1/2 -translate-y-1/2', align: 'items-center text-center', shift: 'top-full mt-2' },
  { pos: 'left-[2%] top-1/2 -translate-x-1/2 -translate-y-1/2', align: 'items-end text-right', shift: 'right-full mr-3 top-1/2 -translate-y-1/2' },
] as const

function Wheel({ slide }: { slide: SamsaraSlide }) {
  return (
    <div className="relative mx-auto aspect-square w-[min(62%,calc(var(--u)*300px))] wide:w-[calc(var(--u)*300px)]">
      <svg viewBox="-100 -100 200 200" className="absolute inset-0 h-full w-full" fill="none" aria-hidden="true">
        <defs>
          <marker id="arr" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse">
            <path d="M0 0 L10 5 L0 10 z" fill="#D6B36A" />
          </marker>
        </defs>
        <circle r="92" stroke="#D6B36A" strokeOpacity="0.5" vectorEffect="non-scaling-stroke" />
        <circle r="62" stroke="#D6B36A" strokeOpacity="0.25" strokeDasharray="1 5" vectorEffect="non-scaling-stroke" />
        {/* стрілки за годинниковою між станціями */}
        {[0, 90, 180, 270].map((a) => (
          <path
            key={a}
            transform={`rotate(${a})`}
            d="M 14 -86 A 87 87 0 0 1 80 -34"
            stroke="#D6B36A"
            strokeWidth="1.4"
            markerEnd="url(#arr)"
            vectorEffect="non-scaling-stroke"
          />
        ))}
        <g className="spin-slow" style={{ transformOrigin: 'center', animationDuration: '90s' }}>
          {Array.from({ length: 8 }, (_, i) => (
            <g key={i} transform={`rotate(${i * 45})`}>
              <line x1="0" y1="-60" x2="0" y2="-34" stroke="#D6B36A" strokeOpacity="0.5" strokeWidth="1" vectorEffect="non-scaling-stroke" />
              <circle cy="-60" r="2.2" fill="#D6B36A" />
            </g>
          ))}
          <circle r="34" stroke="#D6B36A" strokeOpacity="0.7" vectorEffect="non-scaling-stroke" />
        </g>
      </svg>

      <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
        <span lang="sa" className="font-deva text-[max(18px,calc(var(--u)*30px))] leading-none text-gold">
          संसार
        </span>
        <span className="mt-1 font-serif text-[max(13px,calc(var(--u)*20px))] font-semibold tracking-[0.2em] text-ivory">
          САНСАРА
        </span>
      </div>

      <ol className="contents">
        {slide.cycle.map((step, i) => {
          const st = STATIONS[i]
          return (
            <li key={step.id} className={`absolute ${st.pos}`}>
              <span className="flex h-[max(26px,calc(var(--u)*36px))] w-[max(26px,calc(var(--u)*36px))] items-center justify-center rounded-full border border-gold bg-midnight font-serif text-h3 leading-none text-gold shadow-[0_0_26px_rgba(214,179,106,0.35)]">
                {i + 1}
              </span>
              <span className={`absolute hidden w-[calc(var(--u)*132px)] flex-col wide:flex ${st.align} ${st.shift} ${i % 2 === 0 ? 'left-1/2 -translate-x-1/2' : ''}`}>
                <span className="font-serif text-[max(14px,calc(var(--u)*22px))] font-semibold leading-tight text-ivory">
                  {step.title}
                </span>
                <span className="text-[max(11px,calc(var(--u)*14px))] leading-snug text-mist">
                  <Rich text={step.text} />
                </span>
              </span>
            </li>
          )
        })}
      </ol>
    </div>
  )
}

function CycleList({ slide }: { slide: SamsaraSlide }) {
  return (
    <ol className="mt-u3 grid grid-cols-2 gap-u2 wide:hidden">
      {slide.cycle.map((step, i) => (
        <li key={step.id} className="border-t border-gold/40 pt-u1">
          <span className="font-serif text-h3 text-gold">{i + 1}. </span>
          <span className="font-serif text-h3 font-semibold text-ivory">{step.title}</span>
          <p className="text-small text-mist">
            <Rich text={step.text} />
          </p>
        </li>
      ))}
    </ol>
  )
}

export default function SamsaraLayout({ slide }: { slide: SamsaraSlide }) {
  const { comparison } = slide
  return (
    <SlideCanvas>
      <Backdrop
        image={slide.image}
        shade="bg-gradient-to-r from-midnight/80 via-midnight/90 to-midnight/95"
        imgClassName="saturate-[0.8]"
      />

      <div className="safe-px safe-pt safe-pb relative z-10 flex flex-1 flex-col gap-u3">
        <div className="grid flex-1 items-center gap-u5 wide:grid-cols-[minmax(0,6fr)_minmax(0,6fr)] wide:gap-u4">
          <Rise className="wide:px-[calc(var(--u)*140px)] wide:py-[calc(var(--u)*60px)]">
            <Wheel slide={slide} />
            <CycleList slide={slide} />
          </Rise>

          <div>
            <Rise>
              <Eyebrow number={slide.number} label={slide.eyebrow} />
            </Rise>
            <Rise>
              <h2 className="mt-u2 font-serif text-h2 font-medium text-ivory text-balance">{slide.title}</h2>
            </Rise>
            <Rise>
              <p className="mt-u2 text-lead text-mist text-pretty">
                <Rich text={slide.lead ?? ''} />
              </p>
            </Rise>
            <Rise>
              <div className="mt-u3 grid gap-u3 sm:grid-cols-2">
                <section aria-labelledby="trad" className="border-t border-gold/60 pt-u2">
                  <h3 id="trad" className="text-label font-medium uppercase text-gold">
                    {comparison.traditionalTitle}
                  </h3>
                  <ul className="mt-u1 space-y-1.5">
                    {comparison.traditional.map((line) => (
                      <li key={line} className="flex gap-2 text-small text-ivory/90 text-pretty">
                        <span aria-hidden="true" className="mt-[0.6em] h-1 w-1 shrink-0 rotate-45 bg-gold" />
                        {line}
                      </li>
                    ))}
                  </ul>
                </section>
                <section aria-labelledby="simple" className="border-t border-sand/40 pt-u2">
                  <h3 id="simple" className="text-label font-medium uppercase text-sand">
                    {comparison.simplifiedTitle}
                  </h3>
                  <ul className="mt-u1 space-y-1.5">
                    {comparison.simplified.map((line) => (
                      <li key={line} className="flex gap-2 text-small text-mist/90 text-pretty">
                        <span aria-hidden="true" className="mt-[0.6em] h-1 w-1 shrink-0 rotate-45 bg-sand/70" />
                        {line}
                      </li>
                    ))}
                  </ul>
                </section>
              </div>
            </Rise>
          </div>
        </div>

        <Rise>
          <p className="border-t border-gold/30 pt-u3 text-center font-serif text-question font-medium italic text-gold-soft text-balance">
            {slide.question}
          </p>
        </Rise>
      </div>
    </SlideCanvas>
  )
}

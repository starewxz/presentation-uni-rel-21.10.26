import { HeartHandshake, Leaf, Milk, Wheat, type LucideIcon } from 'lucide-react'
import type { CowSlide } from '../../types/presentation'
import Eyebrow from '../ui/Eyebrow'
import Frame from '../ui/Frame'
import Rich from '../ui/Rich'
import Rise from '../ui/Rise'
import SlideCanvas from '../ui/SlideCanvas'
import SmartImage from '../ui/SmartImage'

const ICONS: Record<CowSlide['symbols'][number]['icon'], LucideIcon> = {
  nourishment: Milk,
  motherhood: HeartHandshake,
  ahimsa: Leaf,
  farm: Wheat,
}

export default function CowLayout({ slide }: { slide: CowSlide }) {
  return (
    <SlideCanvas className="bg-gradient-to-br from-indigo via-midnight to-indigo-deep">
      <div className="relative z-10 grid flex-1 wide:grid-cols-12">
        <div className="relative min-h-[300px] wide:col-span-6">
          <SmartImage image={slide.image} className="absolute inset-0 h-full w-full" />
          <div className="absolute inset-0 bg-gradient-to-r from-midnight/10 via-midnight/20 to-midnight" />
          <div className="absolute inset-0 bg-gradient-to-t from-midnight/95 via-midnight/30 to-midnight/40" />

          <div className="safe-pt safe-pb relative flex h-full flex-col justify-end gap-u3 px-u4 wide:pl-u10 wide:pr-u8">
            <Rise>
              <blockquote className="max-w-[18em] border-l-2 border-gold pl-u2 font-serif text-[max(20px,calc(var(--u)*34px))] italic leading-[1.2] text-ivory text-balance [text-shadow:0_2px_20px_rgba(0,0,0,0.8)]">
                {slide.keyIdea}
              </blockquote>
            </Rise>
            <Rise className="hidden wide:block">
              <p className="text-[max(10px,calc(var(--u)*12px))] text-mist/70">
                {slide.image.caption} · {slide.image.source}
              </p>
            </Rise>
          </div>

          <Rise className="absolute right-u3 top-[22%] hidden w-[calc(var(--u)*190px)] wide:block">
            <Frame image={slide.gallery} className="aspect-[4/5]" />
          </Rise>
        </div>

        <div className="safe-px safe-pt safe-pb flex flex-col justify-center wide:col-span-6 wide:!pl-u6">
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
            <ul className="mt-u3 grid gap-x-u4 gap-y-u3 sm:grid-cols-2">
              {slide.symbols.map((symbol) => {
                const Icon = ICONS[symbol.icon]
                return (
                  <li key={symbol.id} className="flex gap-u2">
                    <span className="flex h-[max(34px,calc(var(--u)*46px))] w-[max(34px,calc(var(--u)*46px))] shrink-0 items-center justify-center rounded-full border border-gold/60 text-gold">
                      <Icon className="h-[55%] w-[55%]" strokeWidth={1.4} aria-hidden="true" />
                    </span>
                    <div>
                      <h3 className="font-serif text-h3 font-semibold leading-none text-ivory">{symbol.title}</h3>
                      <p className="mt-1 text-small text-mist text-pretty">{symbol.text}</p>
                    </div>
                  </li>
                )
              })}
            </ul>
          </Rise>

          <Rise>
            <aside className="mt-u4 border border-gold/40 bg-gold/[0.06] p-u2">
              <p className="text-label font-medium uppercase text-gold">{slide.note.title}</p>
              <p className="mt-1 text-small text-ivory/90 text-pretty">{slide.note.text}</p>
            </aside>
          </Rise>
        </div>
      </div>
    </SlideCanvas>
  )
}

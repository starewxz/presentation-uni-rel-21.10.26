import type { ReactNode } from 'react'
import type { ImageConfig } from '../../types/presentation'
import SmartImage from './SmartImage'

interface FrameProps {
  image: ImageConfig
  className?: string
  /** Форма: прямокутник чи арка храмової ніші. */
  arch?: boolean
  showCaption?: boolean
  children?: ReactNode
}

/**
 * Фото у золотій рамці зі зсунутою тонкою обвідкою — як експонат у музеї.
 * Підпис містить походження файлу.
 */
export default function Frame({ image, className = '', arch = false, showCaption = true, children }: FrameProps) {
  return (
    <figure className={`relative flex flex-col ${className}`}>
      <div className="relative min-h-0 flex-1">
        <div
          aria-hidden="true"
          className={`absolute -bottom-2 -right-2 left-2 top-2 border border-gold/35 ${arch ? 'rounded-t-[999px]' : ''}`}
        />
        <div
          className={`relative h-full w-full overflow-hidden border border-gold/60 bg-indigo shadow-[0_24px_60px_-20px_rgba(0,0,0,0.7)] ${
            arch ? 'rounded-t-[999px]' : ''
          }`}
        >
          <SmartImage image={image} className="h-full w-full" />
          {children}
        </div>
      </div>
      {showCaption && (
        <figcaption className="mt-u2 text-[max(10px,calc(var(--u)*12px))] leading-snug text-mist/80">
          <span className="text-sand">{image.caption ?? image.alt}</span>
          <span className="block text-mist/50">{image.source}</span>
        </figcaption>
      )}
    </figure>
  )
}

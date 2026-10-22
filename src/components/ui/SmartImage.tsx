import { useEffect, useRef, useState } from 'react'
import { ImageOff } from 'lucide-react'
import type { ImageConfig } from '../../types/presentation'
import Mandala from './Mandala'

interface SmartImageProps {
  image: ImageConfig
  className?: string
  imgClassName?: string
  /** false — відкладене завантаження (для мініатюр). */
  eager?: boolean
  /** Використати полегшену версію файлу. */
  thumb?: boolean
}

/**
 * Зображення з плавною появою та охайним запасним варіантом:
 * якщо файл не завантажився, показується градієнт із мандалою, а не «розбитий» значок.
 */
export default function SmartImage({ image, className = '', imgClassName = '', eager = true, thumb = false }: SmartImageProps) {
  const src = thumb ? image.thumb : image.src
  const [status, setStatus] = useState<'loading' | 'loaded' | 'error'>('loading')
  const ref = useRef<HTMLImageElement>(null)

  useEffect(() => {
    setStatus('loading')
    const el = ref.current
    if (el?.complete) setStatus(el.naturalWidth > 0 ? 'loaded' : 'error')
  }, [src])

  return (
    <div className={`${/\babsolute\b/.test(className) ? '' : 'relative '}overflow-hidden bg-indigo ${className}`}>
      <div
        className="absolute inset-0 bg-[radial-gradient(ellipse_at_30%_20%,#2a3358_0%,#171e36_45%,#0c1122_100%)]"
        aria-hidden="true"
      />
      {status !== 'loaded' && (
        <Mandala
          className={`absolute left-1/2 top-1/2 h-[80%] max-h-[520px] -translate-x-1/2 -translate-y-1/2 text-gold/25 ${
            status === 'loading' ? 'pulse-ring' : ''
          }`}
        />
      )}
      {status === 'error' ? (
        <div role="img" aria-label={image.alt} className="absolute inset-0 flex items-end p-3">
          <span className="inline-flex items-center gap-1.5 rounded bg-midnight/70 px-2 py-1 text-small text-mist">
            <ImageOff className="h-3.5 w-3.5" aria-hidden="true" />
            Зображення тимчасово недоступне
          </span>
        </div>
      ) : (
        <img
          ref={ref}
          src={src}
          alt={image.alt}
          loading={eager ? 'eager' : 'lazy'}
          decoding="async"
          referrerPolicy="no-referrer"
          draggable={false}
          onLoad={() => setStatus('loaded')}
          onError={() => setStatus('error')}
          style={{ objectPosition: image.position ?? '50% 50%' }}
          className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-1000 ease-cinema ${
            status === 'loaded' ? 'opacity-100' : 'opacity-0'
          } ${imgClassName}`}
        />
      )}
    </div>
  )
}

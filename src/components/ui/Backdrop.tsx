import { motion, useReducedMotion } from 'framer-motion'
import type { ImageConfig } from '../../types/presentation'
import SmartImage from './SmartImage'

interface BackdropProps {
  image: ImageConfig
  /** Градієнт-затемнення поверх фото. */
  shade?: string
  /** Вертикальне затемнення (зверху й знизу). */
  vignette?: string
  /** Повільний «наїзд» камери. */
  drift?: boolean
  className?: string
  imgClassName?: string
}

/** Повноекранний фон-фотографія з наїздом і затемненням для читабельності тексту. */
export default function Backdrop({
  image,
  shade = 'bg-gradient-to-r from-midnight via-midnight/85 to-midnight/35',
  vignette = 'bg-gradient-to-t from-midnight/80 via-transparent to-midnight/50',
  drift = false,
  className = '',
  imgClassName = '',
}: BackdropProps) {
  const reduce = useReducedMotion()
  return (
    <div className={`absolute inset-0 overflow-hidden ${className}`} aria-hidden="false">
      <motion.div
        className="absolute inset-0"
        initial={{ scale: 1 }}
        animate={drift && !reduce ? { scale: 1.08 } : { scale: 1 }}
        transition={{ duration: 28, ease: 'linear' }}
      >
        <SmartImage image={image} className="h-full w-full" imgClassName={imgClassName} />
      </motion.div>
      <div className={`absolute inset-0 ${shade}`} />
      <div className={`absolute inset-0 ${vignette}`} />
    </div>
  )
}

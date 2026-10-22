import { motion, useReducedMotion } from 'framer-motion'
import type { ReactNode } from 'react'

interface RiseProps {
  children: ReactNode
  className?: string
  y?: number
  /** Додаткова затримка появи, с. */
  delay?: number
}

const EASE = [0.22, 1, 0.36, 1] as const

/**
 * Дочірній елемент слайда: з’являється за мітками батьківського слайда
 * (enter → center), тож затримки каскаду задає SlideRenderer.
 */
export default function Rise({ children, className, y = 24, delay = 0 }: RiseProps) {
  const reduce = useReducedMotion()
  return (
    <motion.div
      className={className}
      variants={{
        enter: { opacity: 0, y: reduce ? 0 : y },
        center: { opacity: 1, y: 0, transition: { duration: 0.9, ease: EASE, delay } },
      }}
    >
      {children}
    </motion.div>
  )
}

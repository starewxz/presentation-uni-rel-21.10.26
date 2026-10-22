import { useEffect, type RefObject } from 'react'

interface SwipeOptions {
  onSwipeLeft: () => void
  onSwipeRight: () => void
  enabled: boolean
}

const MIN_DISTANCE = 56
const DOMINANCE = 1.4

/** Горизонтальний свайп; вертикальне прокручування всередині слайда не чіпає. */
export function useSwipe(ref: RefObject<HTMLElement>, { onSwipeLeft, onSwipeRight, enabled }: SwipeOptions): void {
  useEffect(() => {
    const el = ref.current
    if (!el || !enabled) return

    let startX = 0
    let startY = 0
    let tracking = false

    const onStart = (e: TouchEvent) => {
      const target = e.target instanceof Element ? e.target : null
      if (e.touches.length !== 1 || target?.closest('[data-no-swipe]')) {
        tracking = false
        return
      }
      startX = e.touches[0].clientX
      startY = e.touches[0].clientY
      tracking = true
    }

    const onEnd = (e: TouchEvent) => {
      if (!tracking) return
      tracking = false
      const touch = e.changedTouches[0]
      const dx = touch.clientX - startX
      const dy = touch.clientY - startY
      if (Math.abs(dx) < MIN_DISTANCE || Math.abs(dx) < Math.abs(dy) * DOMINANCE) return
      if (dx < 0) onSwipeLeft()
      else onSwipeRight()
    }

    el.addEventListener('touchstart', onStart, { passive: true })
    el.addEventListener('touchend', onEnd, { passive: true })
    return () => {
      el.removeEventListener('touchstart', onStart)
      el.removeEventListener('touchend', onEnd)
    }
  }, [ref, enabled, onSwipeLeft, onSwipeRight])
}

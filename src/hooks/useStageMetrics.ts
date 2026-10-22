import { useLayoutEffect, useState, type RefObject } from 'react'

export type StageMode = 'wide' | 'compact'

export interface StageMetrics {
  mode: StageMode
  width: number
  height: number
}

/** Базове полотно розкладки: 1440 × 810 (16:9). Усі розміри множаться на --u. */
const DESIGN_W = 1440
const DESIGN_H = 810

/**
 * Вимірює область слайда й виставляє CSS-змінні:
 *  --u  — масштаб (1 = 1440×810);  --sw — ширина області в px.
 * «wide» — альбомна розкладка проєктора/ноутбука, «compact» — планшет/телефон у портреті.
 */
export function useStageMetrics(ref: RefObject<HTMLElement>): StageMetrics {
  const [metrics, setMetrics] = useState<StageMetrics>({ mode: 'wide', width: DESIGN_W, height: DESIGN_H })

  useLayoutEffect(() => {
    const el = ref.current
    if (!el) return

    const apply = () => {
      const { width, height } = el.getBoundingClientRect()
      if (width === 0 || height === 0) return
      const mode: StageMode = width >= 640 && width / height >= 1 ? 'wide' : 'compact'
      const u =
        mode === 'wide'
          ? Math.min(width / DESIGN_W, height / DESIGN_H)
          : Math.min(Math.max(width / 480, 0.7), 1.15)
      el.style.setProperty('--u', u.toFixed(4))
      el.style.setProperty('--sw', `${width.toFixed(0)}px`)
      el.dataset.mode = mode
      el.dataset.size = width >= 1100 ? 'roomy' : 'snug'
      setMetrics((prev) =>
        prev.mode === mode && prev.width === Math.round(width) && prev.height === Math.round(height)
          ? prev
          : { mode, width: Math.round(width), height: Math.round(height) },
      )
    }

    apply()
    const observer = new ResizeObserver(apply)
    observer.observe(el)
    return () => observer.disconnect()
  }, [ref])

  return metrics
}

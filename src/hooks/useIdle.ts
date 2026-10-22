import { useEffect, useState } from 'react'

/** true, якщо протягом `delay` мс не було руху вказівника, дотику чи клавіш. */
export function useIdle(delay: number, enabled: boolean): boolean {
  const [idle, setIdle] = useState(false)

  useEffect(() => {
    if (!enabled) {
      setIdle(false)
      return
    }
    let timer = window.setTimeout(() => setIdle(true), delay)
    const wake = () => {
      setIdle(false)
      window.clearTimeout(timer)
      timer = window.setTimeout(() => setIdle(true), delay)
    }
    const events: (keyof WindowEventMap)[] = ['pointermove', 'pointerdown', 'keydown', 'touchstart']
    events.forEach((name) => window.addEventListener(name, wake, { passive: true }))
    return () => {
      window.clearTimeout(timer)
      events.forEach((name) => window.removeEventListener(name, wake))
    }
  }, [delay, enabled])

  return idle
}

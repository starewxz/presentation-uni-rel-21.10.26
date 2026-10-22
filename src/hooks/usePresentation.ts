import { useCallback, useEffect, useState } from 'react'
import type { Direction, PanelMode } from '../types/presentation'

const readHash = (total: number): number => {
  const match = window.location.hash.match(/^#(\d+)$/)
  if (!match) return 0
  const n = Number(match[1]) - 1
  return Number.isFinite(n) ? Math.min(Math.max(n, 0), total - 1) : 0
}

export interface PresentationState {
  index: number
  direction: Direction
  panel: PanelMode
  overviewOpen: boolean
  isFirst: boolean
  isLast: boolean
  next: () => void
  prev: () => void
  first: () => void
  last: () => void
  goTo: (target: number) => void
  toggleNotes: () => void
  togglePresenter: () => void
  closePanel: () => void
  openOverview: () => void
  closeOverview: () => void
  toggleOverview: () => void
}

/** Єдине джерело правди про стан презентації: слайд, панель нотаток, огляд. */
export function usePresentation(total: number): PresentationState {
  const [view, setView] = useState<{ index: number; direction: Direction }>(() => ({
    index: readHash(total),
    direction: 1,
  }))
  const { index, direction } = view
  const [panel, setPanel] = useState<PanelMode>('closed')
  const [overviewOpen, setOverviewOpen] = useState(false)

  const move = useCallback(
    (resolve: (current: number) => number) => {
      setView((v) => {
        const clamped = Math.min(Math.max(resolve(v.index), 0), total - 1)
        return clamped === v.index ? v : { index: clamped, direction: clamped > v.index ? 1 : -1 }
      })
    },
    [total],
  )

  const goTo = useCallback((target: number) => move(() => target), [move])
  const next = useCallback(() => move((i) => i + 1), [move])
  const prev = useCallback(() => move((i) => i - 1), [move])
  const first = useCallback(() => goTo(0), [goTo])
  const last = useCallback(() => goTo(total - 1), [goTo, total])

  const toggleNotes = useCallback(() => setPanel((p) => (p === 'notes' ? 'closed' : 'notes')), [])
  const togglePresenter = useCallback(
    () => setPanel((p) => (p === 'presenter' ? 'closed' : 'presenter')),
    [],
  )
  const closePanel = useCallback(() => setPanel('closed'), [])
  const openOverview = useCallback(() => setOverviewOpen(true), [])
  const closeOverview = useCallback(() => setOverviewOpen(false), [])
  const toggleOverview = useCallback(() => setOverviewOpen((v) => !v), [])

  // Зберігаємо позицію в адресі (#3), щоб перезавантаження не скидало слайд.
  useEffect(() => {
    const hash = `#${index + 1}`
    if (window.location.hash !== hash) window.history.replaceState(null, '', hash)
  }, [index])

  useEffect(() => {
    const onHashChange = () => goTo(readHash(total))
    window.addEventListener('hashchange', onHashChange)
    return () => window.removeEventListener('hashchange', onHashChange)
  }, [goTo, total])

  return {
    index,
    direction,
    panel,
    overviewOpen,
    isFirst: index === 0,
    isLast: index === total - 1,
    next,
    prev,
    first,
    last,
    goTo,
    toggleNotes,
    togglePresenter,
    closePanel,
    openOverview,
    closeOverview,
    toggleOverview,
  }
}

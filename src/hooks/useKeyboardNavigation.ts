import { useEffect, useRef } from 'react'

export interface KeyboardHandlers {
  next: () => void
  prev: () => void
  first: () => void
  last: () => void
  toggleNotes: () => void
  togglePresenter: () => void
  toggleOverview: () => void
  toggleFullscreen: () => void
  escape: () => void
}

const TEXT_ENTRY = 'input, textarea, select, [contenteditable="true"]'
const ARROW_OWNERS = '[role="tab"], [role="slider"], [role="radio"], [role="menuitem"], [role="option"]'
const ACTIVATABLE = 'button, a[href], summary, [role="button"], [role="tab"]'

/**
 * Глобальні гарячі клавіші. Не перехоплює клавіші, коли фокус на елементі,
 * якому ці клавіші потрібні для власної роботи (поле вводу, вкладка, кнопка для Space).
 */
export function useKeyboardNavigation(handlers: KeyboardHandlers, overlayOpen: boolean): void {
  const ref = useRef(handlers)
  ref.current = handlers

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.defaultPrevented) return
      if (event.metaKey || event.ctrlKey || event.altKey) return

      const target = event.target instanceof Element ? event.target : null
      const h = ref.current

      if (event.key === 'Escape') {
        h.escape()
        return
      }
      if (overlayOpen) return
      if (target?.closest(TEXT_ENTRY)) return

      const ownsArrows = Boolean(target?.closest(ARROW_OWNERS))
      const isActivatable = Boolean(target?.closest(ACTIVATABLE))
      const inScrollRegion = Boolean(target?.closest('[data-scroll-region]'))

      switch (event.key) {
        case 'ArrowRight':
        case 'PageDown':
          if (ownsArrows && event.key === 'ArrowRight') return
          event.preventDefault()
          h.next()
          return
        case 'ArrowLeft':
        case 'PageUp':
          if (ownsArrows && event.key === 'ArrowLeft') return
          event.preventDefault()
          h.prev()
          return
        case ' ':
        case 'Spacebar':
          if (isActivatable || inScrollRegion) return
          event.preventDefault()
          if (event.shiftKey) h.prev()
          else h.next()
          return
        case 'Home':
          if (ownsArrows || inScrollRegion) return
          event.preventDefault()
          h.first()
          return
        case 'End':
          if (ownsArrows || inScrollRegion) return
          event.preventDefault()
          h.last()
          return
        case 'n':
        case 'N':
        case 'т':
        case 'Т':
          h.toggleNotes()
          return
        case 'p':
        case 'P':
        case 'з':
        case 'З':
          h.togglePresenter()
          return
        case 'o':
        case 'O':
        case 'щ':
        case 'Щ':
          h.toggleOverview()
          return
        case 'f':
        case 'F':
        case 'а':
        case 'А':
          h.toggleFullscreen()
          return
        default:
          return
      }
    }

    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [overlayOpen])
}

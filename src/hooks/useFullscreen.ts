import { useCallback, useEffect, useState } from 'react'

type FsDocument = Document & {
  webkitFullscreenElement?: Element | null
  webkitExitFullscreen?: () => Promise<void>
}
type FsElement = HTMLElement & { webkitRequestFullscreen?: () => Promise<void> }

const currentElement = (): Element | null => {
  const doc = document as FsDocument
  return doc.fullscreenElement ?? doc.webkitFullscreenElement ?? null
}

export function useFullscreen() {
  const [isFullscreen, setIsFullscreen] = useState(() => currentElement() !== null)
  const root = document.documentElement as FsElement
  const supported = Boolean(root.requestFullscreen ?? root.webkitRequestFullscreen)

  useEffect(() => {
    const sync = () => setIsFullscreen(currentElement() !== null)
    document.addEventListener('fullscreenchange', sync)
    document.addEventListener('webkitfullscreenchange', sync)
    return () => {
      document.removeEventListener('fullscreenchange', sync)
      document.removeEventListener('webkitfullscreenchange', sync)
    }
  }, [])

  const toggle = useCallback(async () => {
    const doc = document as FsDocument
    try {
      if (currentElement()) {
        await (doc.exitFullscreen?.() ?? doc.webkitExitFullscreen?.())
      } else {
        await (root.requestFullscreen?.() ?? root.webkitRequestFullscreen?.())
      }
    } catch {
      // Браузер може відхилити запит (наприклад, у вбудованому перегляді) — стан лишається без змін.
    }
  }, [root])

  return { isFullscreen, supported, toggle }
}

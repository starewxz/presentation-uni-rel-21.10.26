import { Maximize, Minimize } from 'lucide-react'
import ControlButton from './ui/ControlButton'

interface FullscreenButtonProps {
  isFullscreen: boolean
  supported: boolean
  onToggle: () => void
}

export default function FullscreenButton({ isFullscreen, supported, onToggle }: FullscreenButtonProps) {
  if (!supported) return null
  return (
    <ControlButton
      icon={
        isFullscreen ? (
          <Minimize className="h-[18px] w-[18px]" aria-hidden="true" />
        ) : (
          <Maximize className="h-[18px] w-[18px]" aria-hidden="true" />
        )
      }
      label={isFullscreen ? 'Вийти' : 'Повний екран'}
      aria-label={isFullscreen ? 'Вийти з повноекранного режиму' : 'Повноекранний режим'}
      hint="F"
      pressed={isFullscreen}
      onClick={onToggle}
    />
  )
}

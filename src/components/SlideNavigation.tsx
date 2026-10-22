import { ChevronLeft, ChevronRight } from 'lucide-react'
import ControlButton from './ui/ControlButton'

interface SlideNavigationProps {
  onPrev: () => void
  onNext: () => void
  isFirst: boolean
  isLast: boolean
}

export default function SlideNavigation({ onPrev, onNext, isFirst, isLast }: SlideNavigationProps) {
  return (
    <div className="flex items-center gap-2" role="group" aria-label="Перемикання слайдів">
      <ControlButton
        icon={<ChevronLeft className="h-5 w-5" aria-hidden="true" />}
        aria-label="Попередній слайд"
        hint="←"
        onClick={onPrev}
        disabled={isFirst}
      />
      <ControlButton
        icon={<ChevronRight className="h-5 w-5" aria-hidden="true" />}
        aria-label="Наступний слайд"
        hint="→ або Пробіл"
        onClick={onNext}
        disabled={isLast}
      />
    </div>
  )
}

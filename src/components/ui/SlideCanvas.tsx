import type { ReactNode } from 'react'

interface SlideCanvasProps {
  children: ReactNode
  className?: string
}

/** Базове полотно слайда: на проєкторі заповнює висоту, на телефоні росте за вмістом. */
export default function SlideCanvas({ children, className = '' }: SlideCanvasProps) {
  return (
    <div className={`grain relative isolate flex min-h-full flex-col overflow-hidden bg-midnight wide:h-full ${className}`}>
      {children}
    </div>
  )
}

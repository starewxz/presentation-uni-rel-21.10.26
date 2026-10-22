export type SlideLayout =
  | 'cover'
  | 'origins'
  | 'pantheon'
  | 'karma'
  | 'samsara'
  | 'moksha'
  | 'cow'
  | 'caste'
  | 'yoga'
  | 'conclusion'

export interface ImageConfig {
  /** Повний URL зображення (Wikimedia Commons). */
  src: string
  /** Полегшена версія для мініатюр огляду слайдів. */
  thumb: string
  alt: string
  /** Короткий підпис під фото. */
  caption?: string
  /** Назва файлу на Wikimedia Commons — виводиться в нотатках як джерело. */
  file: string
  /** Джерело, що показується під фото. */
  source: string
  /** CSS object-position, напр. "50% 30%". */
  position?: string
}

/**
 * Невеликий смисловий блок. Рядки підтримують розмітку **виділення**,
 * яку компонент Rich перетворює на золотий акцент.
 */
export interface KeyPoint {
  id: string
  title: string
  text: string
  /** Санскритський / деванагарі акцент або короткий маркер. */
  accent?: string
}

export interface NoteBlock {
  heading?: string
  text: string
}

interface SlideBase {
  id: string
  /** Порядковий номер 1…10. */
  number: number
  layout: SlideLayout
  /** Рубрика над заголовком. */
  eyebrow: string
  title: string
  subtitle?: string
  lead?: string
  keyIdea?: string
  image: ImageConfig
  /** Повний текст доповіді. */
  notes: NoteBlock[]
}

export interface CoverSlide extends SlideBase {
  layout: 'cover'
  label: string
  supporting: string
  definitionHeading: string
  facts: string[]
}

export interface OriginsSlide extends SlideBase {
  layout: 'origins'
  stages: (KeyPoint & { period: string })[]
  shift: {
    from: KeyPoint
    to: KeyPoint
  }
}

export interface Deity extends KeyPoint {
  role: string
  image?: ImageConfig
}

export interface PantheonSlide extends SlideBase {
  layout: 'pantheon'
  trimurti: Deity[]
  others: Deity[]
  brahmanNote: { title: string; text: string }
  readings: KeyPoint[]
}

export interface KarmaSlide extends SlideBase {
  layout: 'karma'
  chain: KeyPoint[]
  misconception: { wrong: string; right: string }
}

export interface SamsaraSlide extends SlideBase {
  layout: 'samsara'
  cycle: KeyPoint[]
  comparison: {
    traditionalTitle: string
    traditional: string[]
    simplifiedTitle: string
    simplified: string[]
  }
  question: string
}

/** Як у школі співвідносяться душа й Абсолют: тотожні, в Абсолюті чи окремі. */
export type LiberationRelation = 'merge' | 'within' | 'apart'

export interface MokshaView extends KeyPoint {
  relation: LiberationRelation
  school: string
}

export interface MokshaSlide extends SlideBase {
  layout: 'moksha'
  views: MokshaView[]
  paths: KeyPoint[]
}

export interface CowSlide extends SlideBase {
  layout: 'cow'
  symbols: (KeyPoint & { icon: 'nourishment' | 'motherhood' | 'ahimsa' | 'farm' })[]
  note: { title: string; text: string }
  gallery: ImageConfig
}

export interface CasteSlide extends SlideBase {
  layout: 'caste'
  varnas: (KeyPoint & { role: string })[]
  jati: KeyPoint[]
  inequality: KeyPoint[]
  reform: (KeyPoint & { period: string })[]
  caveat: string
}

export interface YogaSlide extends SlideBase {
  layout: 'yoga'
  paths: KeyPoint[]
  story: KeyPoint[]
  asanaNote: string
}

export interface ConclusionSlide extends SlideBase {
  layout: 'conclusion'
  recap: KeyPoint[]
  question: string
}

export type SlideData =
  | CoverSlide
  | OriginsSlide
  | PantheonSlide
  | KarmaSlide
  | SamsaraSlide
  | MokshaSlide
  | CowSlide
  | CasteSlide
  | YogaSlide
  | ConclusionSlide

/** Стан бічної панелі доповідача. */
export type PanelMode = 'closed' | 'notes' | 'presenter'

/** Напрямок переходу між слайдами: 1 — вперед, -1 — назад. */
export type Direction = 1 | -1

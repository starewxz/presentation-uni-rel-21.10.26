import type { SlideData } from '../types/presentation'
import { slide01 } from './content/s01-what-is'
import { slide02 } from './content/s02-origins'
import { slide03 } from './content/s03-gods'
import { slide04 } from './content/s04-karma'
import { slide05 } from './content/s05-samsara'
import { slide06 } from './content/s06-moksha'
import { slide07 } from './content/s07-cow'
import { slide08 } from './content/s08-caste'
import { slide09 } from './content/s09-yoga'
import { slide10 } from './content/s10-conclusion'

export const slides: readonly SlideData[] = [
  slide01,
  slide02,
  slide03,
  slide04,
  slide05,
  slide06,
  slide07,
  slide08,
  slide09,
  slide10,
]

export const TOTAL_SLIDES = slides.length

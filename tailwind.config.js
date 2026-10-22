import plugin from 'tailwindcss/plugin'

const u = (px) => `calc(var(--u) * ${px}px)`
const fs = (floor, px) => `max(${floor}px, ${u(px)})`
/** Те саме, але з обмеженням від ширини області — щоб заголовки не «ламались» на телефоні */
const fsw = (floor, px, k) => `max(${floor}px, min(${u(px)}, calc(var(--sw) * ${k})))`

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        midnight: '#10172A',
        indigo: { DEFAULT: '#171E36', deep: '#0C1122' },
        gold: { DEFAULT: '#D6B36A', soft: '#E8CF9B' },
        ivory: '#F4EFE5',
        sand: '#B7A58A',
        mist: '#B8BCCD',
      },
      fontFamily: {
        serif: ['"Cormorant Garamond"', '"Playfair Display"', 'Georgia', 'serif'],
        sans: ['Inter', 'system-ui', '-apple-system', '"Segoe UI"', 'sans-serif'],
        deva: ['"Noto Serif Devanagari"', '"Cormorant Garamond"', 'serif'],
      },
      /* Усі розміри масштабуються змінною --u (її виставляє useStageMetrics) */
      fontSize: {
        label: [fs(11, 12.5), { lineHeight: '1.3', letterSpacing: '0.22em' }],
        small: [fs(13, 15), { lineHeight: '1.5' }],
        body: [fs(15, 19), { lineHeight: '1.55' }],
        lead: [fs(17, 22), { lineHeight: '1.45' }],
        subtitle: [fsw(20, 46, 0.065), { lineHeight: '1.12' }],
        h3: [fsw(17, 28, 0.05), { lineHeight: '1.15' }],
        h2: [fsw(26, 56, 0.085), { lineHeight: '1.04' }],
        quote: [fsw(17, 30, 0.05), { lineHeight: '1.28' }],
        question: [fsw(20, 44, 0.07), { lineHeight: '1.18' }],
        display: [`min(${u(124)}, calc(var(--sw) * 0.155))`, { lineHeight: '0.95' }],
      },
      spacing: {
        u1: u(8),
        u2: u(16),
        u3: u(24),
        u4: u(32),
        u5: u(40),
        u6: u(48),
        u8: u(64),
        u10: u(80),
        u12: u(96),
        u16: u(128),
      },
      transitionTimingFunction: {
        cinema: 'cubic-bezier(0.22, 1, 0.36, 1)',
      },
    },
  },
  plugins: [
    plugin(({ addVariant }) => {
      addVariant('wide', '[data-mode="wide"] &')
      addVariant('roomy', '[data-size="roomy"] &')
    }),
  ],
}

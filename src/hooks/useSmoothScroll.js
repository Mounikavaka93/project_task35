import { useEffect } from 'react'
import Lenis from 'lenis'

export default function useSmoothScroll(enabled = true) {
  useEffect(() => {
    if (!enabled) return undefined

    const lenis = new Lenis({
      duration: 1.15,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      wheelMultiplier: 0.9,
      touchMultiplier: 1.1,
      autoRaf: true,
    })

    window.lenis = lenis

    return () => {
      lenis.destroy()
      if (window.lenis === lenis) window.lenis = null
    }
  }, [enabled])
}

export function headerOffset() {
  const raw = getComputedStyle(document.documentElement).getPropertyValue('--header-h')
  const height = parseFloat(raw) || 110
  return -(height + 12)
}

export function smoothScrollTo(target) {
  const el = typeof target === 'string' ? document.getElementById(target) : target
  if (!el) return
  const offset = headerOffset()
  if (window.lenis) {
    window.lenis.scrollTo(el, { offset, duration: 1.2 })
    return
  }
  const top = el.getBoundingClientRect().top + window.scrollY + offset
  window.scrollTo({ top, behavior: 'smooth' })
}

import { useEffect, useRef, useState } from 'react'
import { clamp } from '../lib/math'

/**
 * Tracks the progress of a pinned section (0 → 1) without re-rendering on every
 * scroll event. A quantised value is exposed for text/HUD updates.
 */
export function useScrollProgress<T extends HTMLElement>() {
  const ref = useRef<T>(null)
  const progressRef = useRef(0)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    let raf = 0
    const read = () => {
      raf = 0
      const rect = el.getBoundingClientRect()
      const travel = el.offsetHeight - window.innerHeight
      const p = travel > 0 ? clamp(-rect.top / travel) : 0
      progressRef.current = p
      setProgress((prev) => (Math.abs(prev - p) > 0.008 ? p : prev))
    }
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(read)
    }
    read()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      if (raf) cancelAnimationFrame(raf)
    }
  }, [])

  return { ref, progress, progressRef }
}

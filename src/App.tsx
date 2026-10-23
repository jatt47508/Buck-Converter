import { useEffect, useState } from 'react'
import { Hero } from './components/Hero'
import { Marquee } from './components/Marquee'
import { Nav } from './components/Nav'
import { Circuit } from './sections/Circuit'
import { Downloads } from './sections/Downloads'
import { Footer } from './sections/Footer'
import { Introduction } from './sections/Introduction'
import { Lab } from './sections/Lab'
import { Pcb } from './sections/Pcb'
import { Principle } from './sections/Principle'
import { Simulation } from './sections/Simulation'
import { useScrollbar } from './hooks/useInView'
import { useReducedMotion } from './hooks/useMedia'

const TICKER = [
  '12 V input',
  '5 V class output',
  '100 kHz switching',
  '47 µH inductor',
  '220 µF output',
  '2.5 Ω test load',
  'LTspice transient',
  'KiCad PCB',
]

export default function App() {
  return (
    <>
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <div className="frame" aria-hidden="true" />
      <ScrollProgress />
      <Nav />
      <main id="main">
        <Hero />
        <Marquee items={TICKER} />
        <Introduction />
        <Principle />
        <Marquee items={['Design', 'Simulate', 'Inspect', 'Question the result', 'KiCad → LTspice']} />
        <Circuit />
        <Simulation />
        <Pcb />
        <Downloads />
        <Lab />
      </main>
      <Footer />
      <BackToTop />
    </>
  )
}

function ScrollProgress() {
  const pct = useScrollbar()
  return (
    <div className="progress" aria-hidden="true">
      <i style={{ width: `${pct}%` }} />
    </div>
  )
}

function BackToTop() {
  const pct = useScrollbar()
  const reduced = useReducedMotion()
  const [pastHero, setPastHero] = useState(false)

  useEffect(() => {
    const read = () => {
      const hero = document.querySelector<HTMLElement>('.hero')
      const end = (hero?.offsetHeight ?? window.innerHeight * 2) - window.innerHeight
      setPastHero(window.scrollY > end + 24)
    }
    read()
    window.addEventListener('scroll', read, { passive: true })
    window.addEventListener('resize', read)
    return () => {
      window.removeEventListener('scroll', read)
      window.removeEventListener('resize', read)
    }
  }, [])

  return (
    <button
      type="button"
      className={`to-top ${pastHero && pct > 6 ? 'show' : ''}`}
      aria-label="Back to top"
      onClick={() => window.scrollTo({ top: 0, behavior: reduced ? 'auto' : 'smooth' })}
    >
      <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true">
        <path d="M9 15V3M9 3L3.5 8.5M9 3l5.5 5.5" fill="none" stroke="currentColor" strokeWidth="1.6" />
      </svg>
    </button>
  )
}

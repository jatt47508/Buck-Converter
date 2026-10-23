import { Suspense, lazy, useCallback, useState } from 'react'
import { ErrorBoundary } from './ErrorBoundary'
import { PART_ORDER, PART_BY_REF } from '../data/components'
import { SITE, asset } from '../data/site'
import { useReducedMotion, useWebGL } from '../hooks/useMedia'
import { useInView } from '../hooks/useInView'
import { useScrollProgress } from '../hooks/useScrollProgress'
import { range, smoothstep } from '../lib/math'

const HeroScene = lazy(() =>
  import('../three/HeroScene').then((m) => ({ default: m.HeroScene })),
)

const PHASES = ['Reveal', 'Explode', 'Assemble', 'Inspect'] as const

export function Hero() {
  const { ref, progress, progressRef } = useScrollProgress<HTMLElement>()
  const { ref: viewRef, inView } = useInView<HTMLDivElement>('0px')
  const reduced = useReducedMotion()
  const webgl = useWebGL()
  const [ready, setReady] = useState(false)
  const [failed, setFailed] = useState(false)
  const staticMode = reduced || !webgl || failed

  const onReady = useCallback(() => setReady(true), [])

  if (staticMode) return <StaticHero />

  const titleFade = smoothstep(range(progress, 0.12, 0.24))
  const phase = progress < 0.18 ? 0 : progress < 0.38 ? 1 : progress < 0.8 ? 2 : 3

  return (
    <section id="top" className="hero" ref={ref}>
      <div className="hero__sticky" ref={viewRef}>
        <div className="hero__canvas" aria-hidden="true">
          <ErrorBoundary
            fallback={null}
            onError={() => {
              setFailed(true)
            }}
          >
            <Suspense fallback={null}>
              <HeroScene progressRef={progressRef} onReady={onReady} active={inView} />
            </Suspense>
          </ErrorBoundary>
        </div>
        <div className="hero__veil" aria-hidden="true" />
        <div className="hero__grain" aria-hidden="true" />

        <div className={ready ? 'hero__loading is-done' : 'hero__loading'} aria-hidden="true">
          <div className="hero__loading-inner">
            <span>Loading 3D assembly</span>
            <div className="hero__loading-bar">
              <i />
            </div>
          </div>
        </div>

        <div className="hero__top">
          <span>
            Power electronics <b>· project 04</b>
          </span>
          <span>12 V → 5 V · 100 kHz · KiCad + LTspice</span>
        </div>

        <div
          className="hero__title"
          style={{ opacity: 1 - titleFade, translate: `0 ${-26 * titleFade}px` }}
        >
          <p className="hero__eyebrow">A non-isolated step-down converter</p>
          <h1>
            <span className="line">12V → 5V</span>
            <span className="outline">Buck Converter</span>
          </h1>
          <p className="hero__sub">{SITE.subtitle}</p>
          <div className="hero__meta">
            <span>KiCad 10 · 2-layer PCB</span>
            <span>LTspice transient · 10 ms</span>
            <span>47 µH · 220 µF · 2.5 Ω</span>
          </div>
        </div>

        <div
          className="hero__stage-caption"
          style={{
            opacity:
              smoothstep(range(progress, 0.24, 0.3)) *
              (1 - smoothstep(range(progress, 0.66, 0.74))),
          }}
        >
          <span className="mono">{phase === 1 ? '02 / Exploded view' : '03 / Assembly'}</span>
          <p className="display">
            {phase === 1 ? (
              <>
                Five parts.
                <br />
                One board.
              </>
            ) : (
              <>
                Back to
                <br />
                the board.
              </>
            )}
          </p>
        </div>

        <div className="hero__hud">
          <div className="hero__counter">
            {String(Math.round(progress * 100)).padStart(2, '0')}
            <small>/ 100</small>
          </div>
          <div className="hero__phasebar" aria-hidden="true">
            {PHASES.map((p, i) => (
              <i key={p} className={i <= phase ? 'on' : ''} />
            ))}
          </div>
          <span className="mono" style={{ color: 'var(--orange-soft)' }}>
            {PHASES[phase]}
          </span>
        </div>

        <div className="hero__rail" aria-hidden="true">
          {PHASES.map((p, i) => (
            <span key={p} className={i === phase ? 'active' : ''}>
              {p}
            </span>
          ))}
        </div>

        <div
          className="hero__scroll"
          aria-hidden="true"
          style={{ opacity: 1 - smoothstep(range(progress, 0.01, 0.05)) }}
        >
          <i />
          Scroll to assemble
        </div>

        <p className="sr-only">
          Interactive 3D model of the buck converter. As you scroll, the {PART_ORDER.length}{' '}
          components — {PART_ORDER.map((r) => `${r} ${PART_BY_REF[r]?.value ?? ''}`).join(', ')} —
          move from an exploded view into their positions on the PCB. The same models are
          available in the interactive laboratory at the end of the page.
        </p>
      </div>
    </section>
  )
}

function StaticHero() {
  return (
    <section id="top" className="hero hero--static">
      <div className="hero__sticky">
        <div className="hero__poster" aria-hidden="true">
          <img src={asset('img/board-iso.png')} alt="" />
        </div>
        <div className="hero__veil" aria-hidden="true" />
        <div className="hero__top">
          <span>
            Power electronics <b>· project 04</b>
          </span>
          <span>12 V → 5 V · 100 kHz</span>
        </div>
        <div className="hero__title">
          <p className="hero__eyebrow">A non-isolated step-down converter</p>
          <h1>
            <span className="line">12V → 5V</span>
            <span className="outline">Buck Converter</span>
          </h1>
          <p className="hero__sub">{SITE.subtitle}</p>
          <div className="hero__meta">
            <span>KiCad 10 · 2-layer PCB</span>
            <span>LTspice transient · 10 ms</span>
          </div>
          <p className="hero__static-note">
            Static render · the animated 3D assembly is disabled by your motion or WebGL settings.
          </p>
        </div>
      </div>
    </section>
  )
}

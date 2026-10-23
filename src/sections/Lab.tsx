import { Suspense, lazy, useCallback, useEffect, useState } from 'react'
import { ErrorBoundary } from '../components/ErrorBoundary'
import { Reveal } from '../components/Reveal'
import { SectionHead } from '../components/SectionHead'
import { PART_BY_REF, PART_INFO, PART_ORDER } from '../data/components'
import { useInView } from '../hooks/useInView'
import { useCoarsePointer } from '../hooks/useMedia'
import { asset } from '../data/site'
import type { PresetKey } from '../three/LabScene'

const LabScene = lazy(() =>
  import('../three/LabScene').then((m) => ({ default: m.LabScene })),
)

const PRESETS: { key: PresetKey; label: string }[] = [
  { key: 'iso', label: 'Iso' },
  { key: 'top', label: 'Top' },
  { key: 'side', label: 'Side' },
  { key: 'bottom', label: 'Bottom' },
]

export function Lab() {
  const { ref: stageRef, inView } = useInView<HTMLDivElement>('300px 0px')
  const coarse = useCoarsePointer()
  const [mounted, setMounted] = useState(false)
  const [ready, setReady] = useState(false)
  const [failed, setFailed] = useState(false)
  const [preset, setPreset] = useState<PresetKey>('iso')
  const [viewTick, setViewTick] = useState(0)
  const [explode, setExplode] = useState(0)
  const [labels, setLabels] = useState(!coarse)
  const [selected, setSelected] = useState<string | null>(null)
  const [hovered, setHovered] = useState<string | null>(null)

  useEffect(() => {
    if (inView) setMounted(true)
  }, [inView])

  const onReady = useCallback(() => setReady(true), [])
  const onSelect = useCallback((ref: string | null) => setSelected(ref), [])
  const onHover = useCallback((ref: string | null) => setHovered(ref), [])

  const choosePreset = (key: PresetKey) => {
    setPreset(key)
    setViewTick((v) => v + 1)
  }

  const selectedPart = selected ? PART_BY_REF[selected] : null
  const selectedInfo = selected ? PART_INFO[selected] : null

  return (
    <section id="lab" className="lab">
      <div className="wrap">
        <SectionHead
          no="07"
          kicker="3D laboratory"
          dark
          title={
            <>
              Inspect it
              <br />
              from every side.
            </>
          }
          lede="This is the same geometry exported from the KiCad board — six components and the PCB substrate. Orbit the model, pull the parts apart, and select a component to read its connections."
          aside={
            <div className="lab__aside">
              <span className="mono">Real STEP geometry</span>
              <span className="mono">5 component models + board</span>
            </div>
          }
        />
      </div>

      <Reveal>
        <div className="lab__stage" ref={stageRef}>
          <div className="lab__bg" aria-hidden="true" />

          {mounted && !failed && (
            <div className="lab__canvas">
              <ErrorBoundary fallback={null} onError={() => setFailed(true)}>
                <Suspense fallback={null}>
                  <LabScene
                    preset={preset}
                    viewTick={viewTick}
                    explode={explode / 100}
                    selected={selected}
                    hovered={hovered}
                    labels={labels}
                    active={inView}
                    onHover={onHover}
                    onSelect={onSelect}
                    onReady={onReady}
                  />
                </Suspense>
              </ErrorBoundary>
            </div>
          )}

          {(failed || !mounted) && (
            <div className="lab__fallback">
              <img src={asset('img/board-iso.png')} alt="" />
              {failed && (
                <p>
                  The 3D laboratory could not start on this device. The board render above comes
                  from the same PCB file.
                </p>
              )}
            </div>
          )}

          <div className="lab__toolbar">
            <div className="seg seg--dark" role="group" aria-label="Camera view">
              {PRESETS.map((p) => (
                <button
                  key={p.key}
                  type="button"
                  className={preset === p.key ? 'is-active' : ''}
                  aria-pressed={preset === p.key}
                  onClick={() => choosePreset(p.key)}
                >
                  {p.label}
                </button>
              ))}
            </div>
            <button
              type="button"
              className="lab__reset"
              onClick={() => {
                choosePreset('iso')
                setExplode(0)
                setSelected(null)
              }}
            >
              Reset
            </button>
            <span className="lab__hover mono" aria-hidden="true">
              {hovered ?? '—'}
            </span>
          </div>

          <aside
            className={`lab__panel ${selected ? 'is-open' : 'is-empty'}`}
            aria-live="polite"
          >
            {selectedPart && selectedInfo ? (
              <>
                <div className="lab__panel-head">
                  <span className="mono">
                    {selectedInfo.kind} · {selectedPart.ref}
                  </span>
                  <button type="button" onClick={() => setSelected(null)} aria-label="Clear selection">
                    ×
                  </button>
                </div>
                <h3>{selectedInfo.name}</h3>
                <p className="lab__panel-value">{selectedPart.value}</p>
                <dl>
                  <div>
                    <dt>Footprint</dt>
                    <dd>{selectedInfo.footprint}</dd>
                  </div>
                  <div>
                    <dt>Nets</dt>
                    <dd>{selectedInfo.nets}</dd>
                  </div>
                </dl>
                <p className="lab__panel-detail">{selectedInfo.detail}</p>
              </>
            ) : (
              <>
                <span className="mono">Interactive model</span>
                <h3>Pick a component</h3>
                <p>
                  Drag to orbit, scroll or pinch to zoom, and click any part for its footprint and
                  nets.
                </p>
                <ul className="lab__legend">
                  {PART_ORDER.map((ref) => (
                    <li key={ref}>
                      <button type="button" onClick={() => setSelected(ref)}>
                        <b>{ref}</b>
                        <span>{PART_BY_REF[ref]?.value}</span>
                      </button>
                    </li>
                  ))}
                </ul>
                <p className="lab__panel-note">
                  BT1 has no 3D model in the STEP export; its two plated holes are visible on the
                  board.
                </p>
              </>
            )}
          </aside>

          <div className="lab__controls">
            <label className="lab__slider">
              <span className="mono">
                Explode <b>{explode}%</b>
              </span>
              <input
                type="range"
                min={0}
                max={100}
                step={1}
                value={explode}
                onChange={(e) => setExplode(Number(e.target.value))}
                aria-label="Explode the assembly"
              />
            </label>
            <button
              type="button"
              className={`lab__toggle ${labels ? 'is-on' : ''}`}
              aria-pressed={labels}
              onClick={() => setLabels((v) => !v)}
            >
              <i aria-hidden="true" />
              Labels
            </button>
          </div>

          <p className="lab__hint">
            Drag to orbit · Scroll / pinch to zoom · Click a component
          </p>

          <div className={ready || failed ? 'lab__loading is-done' : 'lab__loading'} aria-hidden="true">
            <span className="mono">Loading interactive model…</span>
          </div>
        </div>
      </Reveal>
    </section>
  )
}

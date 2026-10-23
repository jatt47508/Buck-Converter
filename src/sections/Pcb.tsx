import { useState } from 'react'
import { Reveal } from '../components/Reveal'
import { SectionHead } from '../components/SectionHead'
import { Zoomable } from '../components/Zoomable'
import { BOARD_SPECS, DRC_FINDINGS, PCB } from '../data/pcb'
import { asset } from '../data/site'

const VIEWS = [
  { key: 'top', label: 'Top', src: 'img/board-top.png', alt: 'Top view of the buck converter PCB render' },
  {
    key: 'bottom',
    label: 'Bottom',
    src: 'img/board-bottom.png',
    alt: 'Bottom view of the buck converter PCB render',
  },
  {
    key: 'iso',
    label: 'Isometric',
    src: 'img/board-iso.png',
    alt: 'Isometric render of the assembled buck converter board',
  },
  {
    key: 'detail',
    label: 'Detail',
    src: 'img/board-detail.png',
    alt: 'Close detail render of the PCB components and copper',
  },
] as const

export function Pcb() {
  const [view, setView] = useState<(typeof VIEWS)[number]['key']>('iso')
  const current = VIEWS.find((v) => v.key === view) ?? VIEWS[2]

  return (
    <section id="pcb" className="section section--pcb">
      <div className="wrap">
        <SectionHead
          no="05"
          kicker="PCB design"
          title={
            <>
              A two-layer draft,
              <br />
              drawn at 1:1.
            </>
          }
          lede="The board measures 55.5 × 44 mm on 1.6 mm FR-4. All 21 track segments are on the front copper; the back copper is a single Earth zone. There are no vias and no ground plane on the component side."
          aside={
            <div className="revision-badge">
              <span className="mono">Revision status</span>
              <b>Draft · not fabricated</b>
              <span>{PCB.stats.tracks} track segments · {PCB.stats.pads} pads</span>
            </div>
          }
        />

        <div className="pcb-grid">
          <Reveal className="pcb-viewer">
            <div className="pcb-viewer__head">
              <div className="seg" role="tablist" aria-label="PCB view">
                {VIEWS.map((v) => (
                  <button
                    key={v.key}
                    type="button"
                    role="tab"
                    aria-selected={view === v.key}
                    className={view === v.key ? 'is-active' : ''}
                    onClick={() => setView(v.key)}
                  >
                    {v.label}
                  </button>
                ))}
              </div>
              <span className="mono">KiCad raytrace · actual layout</span>
            </div>
            <div className="pcb-stage">
              <Zoomable
                key={current.key}
                src={asset(current.src)}
                alt={current.alt}
                caption="Click to enlarge · rendered from the committed PCB file"
              />
            </div>
          </Reveal>

          <div className="pcb-side">
            <Reveal delay={60} className="spec-card">
              <span className="kicker">Board facts</span>
              <dl className="spec-list">
                {BOARD_SPECS.map(([k, v]) => (
                  <div key={k}>
                    <dt>{k}</dt>
                    <dd>{v}</dd>
                  </div>
                ))}
              </dl>
            </Reveal>

            <Reveal delay={110} className="stack-card">
              <span className="kicker">Layer stack</span>
              <div className="stack">
                <div className="stack__layer stack__layer--cu">
                  <span>F.Cu</span>
                  <small>tracks + pads · 35 µm nominal</small>
                </div>
                <div className="stack__layer stack__layer--fr4">
                  <span>FR-4</span>
                  <small>1.6 mm substrate</small>
                </div>
                <div className="stack__layer stack__layer--cu">
                  <span>B.Cu</span>
                  <small>Earth zone</small>
                </div>
              </div>
              <p>
                Every routed segment sits on the top layer. The bottom zone provides the return
                path; through-hole pads connect the two sides.
              </p>
            </Reveal>
          </div>
        </div>

        <Reveal delay={80} className="pcb-findings">
          <div className="pcb-findings__head">
            <span className="kicker">Open findings</span>
            <span className="mono">Observed in the KiCad files</span>
          </div>
          <ul>
            {DRC_FINDINGS.map((f) => (
              <li key={f.tag}>
                <span>{f.tag}</span>
                <b>{f.title}</b>
              </li>
            ))}
          </ul>
          <p>
            The board is shown as a design study. It has not been sent for fabrication, assembled
            or measured, and the project contains no DRC report. The detailed findings are in{' '}
            <a href="#circuit">section 03</a>.
          </p>
        </Reveal>
      </div>
    </section>
  )
}

import { useEffect, useState } from 'react'
import { Reveal } from '../components/Reveal'
import { SectionHead } from '../components/SectionHead'
import { M } from '../data/sim'
import { useReducedMotion } from '../hooks/useMedia'

type State = 'on' | 'off'

export function Principle() {
  const reduced = useReducedMotion()
  const [state, setState] = useState<State>('on')
  const [auto, setAuto] = useState(true)

  useEffect(() => {
    if (!auto || reduced) return
    const id = window.setInterval(() => {
      setState((s) => (s === 'on' ? 'off' : 'on'))
    }, 2600)
    return () => window.clearInterval(id)
  }, [auto, reduced])

  const pick = (s: State) => {
    setAuto(false)
    setState(s)
  }

  return (
    <section id="principle" className="section section--principle">
      <div className="wrap">
        <SectionHead
          no="02"
          kicker="Working principle"
          title={
            <>
              Two states,
              <br />
              one output.
            </>
          }
          lede="A buck converter repeatedly connects an inductor to the input, then disconnects it and lets the current freewheel. The fraction of each cycle spent connected — the duty cycle — sets the output voltage."
        />

        <div className="principle-grid">
          <Reveal className="diagram-card">
            <div className="diagram-card__top">
              <span className="mono">
                Current path <b className={`is-${state}`}>{state === 'on' ? 'Q1 on' : 'Q1 off'}</b>
              </span>
              <div className="seg" role="group" aria-label="Switch state">
                <button
                  type="button"
                  className={state === 'on' ? 'is-active' : ''}
                  onClick={() => pick('on')}
                  aria-pressed={state === 'on'}
                >
                  On
                </button>
                <button
                  type="button"
                  className={state === 'off' ? 'is-active' : ''}
                  onClick={() => pick('off')}
                  aria-pressed={state === 'off'}
                >
                  Off
                </button>
                {!reduced && (
                  <button
                    type="button"
                    className={auto ? 'is-active' : ''}
                    onClick={() => setAuto((v) => !v)}
                    aria-pressed={auto}
                  >
                    Auto
                  </button>
                )}
              </div>
            </div>

            <svg
              className="diagram-svg"
              viewBox="0 0 720 400"
              role="img"
              aria-label={`Buck converter power stage. Switch is ${state === 'on' ? 'on: current flows from the 12 V source through Q1 and the inductor to the load' : 'off: the inductor current freewheels through diode D1'}.`}
            >
              <g className="d-wire">
                <path d="M90 120 H250" />
                <path d="M300 152 V200" />
                <path d="M300 200 H390" />
                <path d="M470 200 H630" />
                <path d="M300 200 V256" />
                <path d="M300 286 V350" />
                <path d="M540 282 V350" />
                <path d="M630 320 V350" />
                <path d="M90 350 H630" />
                <path d="M90 248 V350" />
              </g>

              <circle className="d-source" cx="90" cy="210" r="34" />
              <path className="d-wire" d="M90 176 V120" />
              <path className="d-wire" d="M90 244 V350" />
              <text className="d-text d-text--mid" x="90" y="206" textAnchor="middle">
                +
              </text>
              <text className="d-text d-text--mid" x="90" y="230" textAnchor="middle">
                −
              </text>
              <text className="d-label" x="34" y="214">
                12 V
              </text>

              <g className="d-part">
                <rect x="250" y="88" width="100" height="64" />
                <path d="M300 96 V112" />
                <path d="M300 112 L326 134" />
                <path d="M300 138 V152" />
                <circle cx="300" cy="140" r="2.6" />
              </g>
              <text className="d-label" x="250" y="78">
                Q1 · switch
              </text>

              <g className="d-part">
                <path d="M286 286 H314 L300 258 Z" />
                <path d="M286 254 H314" />
              </g>
              <text className="d-label" x="324" y="276">
                D1 · freewheel
              </text>

              <path
                className="d-part d-coil"
                d="M390 200 q10 -17 20 0 q10 -17 20 0 q10 -17 20 0 q10 -17 20 0"
              />
              <text className="d-label" x="390" y="176">
                L1 · 47 µH
              </text>

              <g className="d-part">
                <path d="M522 266 H558" />
                <path d="M522 284 H558" />
              </g>
              <text className="d-label" x="568" y="270">
                C1 · 220 µF
              </text>

              <path className="d-part d-res" d="M630 228 l0 12 l10 6 l-20 12 l20 12 l-20 12 l20 12 l-10 6 v10" />
              <text className="d-label" x="646" y="284">
                R1 · 2.5 Ω
              </text>

              <path className="d-wire" d="M540 200 V266" />
              <text className="d-label d-label--small" x="524" y="196">
                VOUT
              </text>
              <text className="d-label d-label--small" x="306" y="196">
                SW
              </text>

              <g className="d-node">
                <circle cx="90" cy="120" r="3.4" />
                <circle cx="300" cy="200" r="3.4" />
                <circle cx="540" cy="200" r="3.4" />
                <circle cx="630" cy="200" r="3.4" />
              </g>

              <path
                className={`d-flow d-flow--on ${state === 'on' ? 'is-live' : ''}`}
                d="M90 120 H300 V200 H630 V350 H90 V120"
              />
              <path
                className={`d-flow d-flow--off ${state === 'off' ? 'is-live' : ''}`}
                d="M300 350 V200 H630 V350 H300"
              />

              <text className="d-caption" x="34" y="378">
                {state === 'on'
                  ? 'Q1 closed · inductor current rises · D1 blocks'
                  : 'Q1 open · inductor current falls · D1 conducts'}
              </text>
            </svg>

            <p className="diagram-card__foot">
              Illustrative schematic of the power stage, drawn for this page. Component values
              match the KiCad project; the actual KiCad schematic is shown in section 03.
            </p>
          </Reveal>

          <div className="principle-side">
            <Reveal delay={60} className="formula-card">
              <span className="kicker">Ideal conversion ratio</span>
              <div className="formula">
                V<sub>out</sub> = D · V<sub>in</sub>
              </div>
              <p>
                With a 44.6 % duty cycle, the ideal output would be{' '}
                <b>{M.voutIdealAtSimDuty.toFixed(2)} V</b>. LTspice settles at{' '}
                <b>{M.voutAvg.toFixed(3)} V</b> because the diode and conduction losses are
                included.
              </p>
              <dl className="mini-dl">
                <div>
                  <dt>Duty cycle</dt>
                  <dd>{M.dutySim.toFixed(1)} %</dd>
                </div>
                <div>
                  <dt>Ideal duty for 5 V</dt>
                  <dd>{M.dutyIdeal.toFixed(1)} %</dd>
                </div>
                <div>
                  <dt>Switching frequency</dt>
                  <dd>100 kHz</dd>
                </div>
              </dl>
              <p className="formula-card__note">Ideal estimate — not a hardware measurement.</p>
            </Reveal>

            <Reveal delay={120}>
              <ol className="step-list">
                <li>
                  <span>01</span>
                  <div>
                    <b>Switch on</b>
                    <p>
                      Q1 connects the 12 V input to the inductor. Current ramps up and energy is
                      stored in L1; the diode is reverse-biased.
                    </p>
                  </div>
                </li>
                <li>
                  <span>02</span>
                  <div>
                    <b>Switch off</b>
                    <p>
                      The inductor keeps its current flowing. D1 turns on and provides the
                      freewheeling path while the energy in L1 is delivered to the load.
                    </p>
                  </div>
                </li>
                <li>
                  <span>03</span>
                  <div>
                    <b>Smooth the result</b>
                    <p>
                      C1 supplies the load between switching events; the average inductor current
                      equals the load current.
                    </p>
                  </div>
                </li>
              </ol>
            </Reveal>
          </div>
        </div>

        <Reveal delay={80} className="timing-card">
          <div className="timing-card__head">
            <span className="mono">Gate drive and switch node · one cycle</span>
            <span className="mono">T = 10 µs · f = 100 kHz</span>
          </div>
          <TimingDiagram />
          <p className="timing-card__foot">
            Gate pulse from the simulation deck: 10 V amplitude, 4.45 µs on-time, 10 µs period.
            The switch node alternates between roughly 12 V and a small negative excursion as D1
            conducts.
          </p>
        </Reveal>
      </div>
    </section>
  )
}

function TimingDiagram() {
  const x0 = 96
  const x1 = 700
  const onX = x0 + ((x1 - x0) * 4.45) / 10
  const yGateLow = 76
  const yGateHigh = 44
  const ySwLow = 158
  const ySwHigh = 122
  const yIlMid = 238
  const ilAmp = 20

  return (
    <svg className="timing-svg" viewBox="0 0 740 290" role="img" aria-label="Timing diagram: a 10 volt gate pulse with 44.6 percent duty over a 10 microsecond period; the switch node rises to 12 volts during the on time; the inductor current ramps up and down.">
      <g className="t-grid">
        <path d={`M${x0} 30 V262`} />
        <path d={`M${onX} 30 V262`} />
        <path d={`M${x1} 30 V262`} />
        <path d={`M${x0} 76 H${x1}`} strokeDasharray="2 4" />
        <path d={`M${x0} 158 H${x1}`} strokeDasharray="2 4" />
        <path d={`M${x0} ${yIlMid} H${x1}`} strokeDasharray="2 4" />
      </g>

      <text className="t-label" x="20" y={yGateLow + 4}>
        Vgs
      </text>
      <text className="t-label" x="20" y={ySwLow + 4}>
        Vsw
      </text>
      <text className="t-label" x="20" y={yIlMid + 4}>
        IL
      </text>

      <path
        className="t-trace"
        d={`M${x0} ${yGateLow} H${onX} V${yGateHigh} H${onX + 4} V${yGateLow} H${x1}`}
      />
      <text className="t-note" x={x0 + 8} y={yGateHigh - 6}>
        10 V
      </text>

      <path className="t-trace t-trace--sw" d={`M${x0} ${ySwHigh} H${onX} V${ySwLow} H${x1}`} />
      <text className="t-note" x={x0 + 8} y={ySwHigh - 6}>
        ≈ 12 V
      </text>
      <text className="t-note" x={onX + 10} y={ySwLow - 6}>
        ≈ 0 V
      </text>

      <path
        className="t-trace t-trace--il"
        d={`M${x0} ${yIlMid + ilAmp * 0.4} L${onX} ${yIlMid - ilAmp} L${x1} ${yIlMid + ilAmp * 0.4}`}
      />
      <text className="t-note" x={x0 + 8} y={yIlMid - ilAmp - 8}>
        {M.ilAvg.toFixed(2)} A avg
      </text>

      <g className="t-bracket">
        <path d={`M${x0} 24 H${onX}`} />
        <path d={`M${x0} 19 V29`} />
        <path d={`M${onX} 19 V29`} />
      </g>
      <text className="t-bracket-label" x={(x0 + onX) / 2} y="16" textAnchor="middle">
        Ton = 4.45 µs
      </text>
      <text className="t-bracket-label" x={(onX + x1) / 2} y="16" textAnchor="middle">
        Toff = 5.55 µs
      </text>
    </svg>
  )
}

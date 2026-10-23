import { Reveal } from '../components/Reveal'
import { SectionHead } from '../components/SectionHead'
import { M } from '../data/sim'

const ROLES = [
  ['Q1', 'Switch', 'Chops the 12 V input at 100 kHz.'],
  ['D1', 'Freewheel', 'Carries inductor current while Q1 is off.'],
  ['L1', 'Store', '47 µH inductor moves energy to the load.'],
  ['C1', 'Filter', '220 µF capacitor smooths the 5 V rail.'],
  ['R1', 'Load', '2.5 Ω test load, about 2 A at 5 V.'],
] as const

export function Introduction() {
  return (
    <section id="introduction" className="section section--intro">
      <div className="wrap">
        <SectionHead
          no="01"
          kicker="Introduction"
          title={
            <>
              A power stage,
              <br />
              documented end to end.
            </>
          }
          lede="This is a non-isolated buck converter that steps a 12 V rail down to a 5 V class output. The schematic, a two-layer PCB, the STEP export and the LTspice transient all come from the same project — the numbers on this page are read from those files, not invented."
          aside={
            <div className="status-card">
              <p className="mono status-card__title">Project status</p>
              <ul className="status-list">
                <li>
                  <span className="status-dot status-dot--ok" aria-hidden="true" />
                  <b>Simulation</b>
                  <span>10 ms transient · complete</span>
                </li>
                <li>
                  <span className="status-dot status-dot--warn" aria-hidden="true" />
                  <b>PCB layout</b>
                  <span>Draft revision · 3 findings</span>
                </li>
                <li>
                  <span className="status-dot status-dot--off" aria-hidden="true" />
                  <b>Hardware</b>
                  <span>Not fabricated or measured</span>
                </li>
              </ul>
            </div>
          }
        />

        <div className="intro-grid">
          <Reveal className="intro-copy">
            <p className="intro-lead">
              The converter is specified for <b>12 V in</b>, a <b>5 V output</b> and roughly{' '}
              <b>2 A</b> into a 2.5 Ω test load. A single N-channel MOSFET switches at 100 kHz;
              a diode, a 47 µH inductor and a 220 µF capacitor form the power stage.
            </p>
            <p>
              In LTspice the output settles at {M.voutAvg.toFixed(3)} V with{' '}
              {M.voutRipplePct.toFixed(2)} % ripple and {M.efficiency.toFixed(1)} % efficiency
              at the simulated operating point. Those are simulation results, not bench
              measurements.
            </p>
            <p>
              The PCB is presented as a draft. Three review findings are documented in the
              circuit and PCB sections: the input net stops at the connector, the MOSFET gate
              is marked no-connect, and no design-rule-check report exists in the project.
            </p>
          </Reveal>

          <Reveal delay={100} className="target-card">
            <div className="target-card__row">
              <span className="mono">Design intent</span>
              <strong>5.0 V · 2 A</strong>
              <small>Ideal target at the stated load</small>
            </div>
            <div className="target-card__arrow" aria-hidden="true">
              ↓ simulated
            </div>
            <div className="target-card__row target-card__row--big">
              <span className="mono">LTspice result</span>
              <strong>{M.voutAvg.toFixed(3)} V</strong>
              <small>
                {M.ilAvg.toFixed(2)} A average inductor current ·{' '}
                {M.efficiency.toFixed(1)} % efficiency
              </small>
            </div>
            <p className="target-card__note">
              Difference from the ideal 5.0 V comes from conduction and switching losses, not
              from a feedback loop — the simulation has no controller.
            </p>
          </Reveal>
        </div>

        <Reveal delay={80}>
          <ul className="role-grid">
            {ROLES.map(([ref, role, text], i) => (
              <li key={ref}>
                <span className="role-grid__no">{String(i + 1).padStart(2, '0')}</span>
                <b>{role}</b>
                <span className="role-grid__ref">{ref}</span>
                <p>{text}</p>
              </li>
            ))}
          </ul>
        </Reveal>

        <Reveal delay={120}>
          <div className="fact-strip">
            <div>
              <span className="mono">Input</span>
              <b>12 V</b>
            </div>
            <div>
              <span className="mono">Output</span>
              <b>5 V class</b>
            </div>
            <div>
              <span className="mono">Switching</span>
              <b>100 kHz</b>
            </div>
            <div>
              <span className="mono">Board</span>
              <b>55.5 × 44 mm</b>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}

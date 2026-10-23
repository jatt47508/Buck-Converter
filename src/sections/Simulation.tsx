import { useState } from 'react'
import { Reveal } from '../components/Reveal'
import { SectionHead } from '../components/SectionHead'
import { WaveformChart } from '../components/WaveformChart'
import { M, SIM_SETUP } from '../data/sim'

export function Simulation() {
  return (
    <section id="simulation" className="section section--dark section--simulation">
      <div className="wrap">
        <SectionHead
          no="04"
          kicker="Simulation"
          dark
          title={
            <>
              The waveform
              <br />
              is the evidence.
            </>
          }
          lede="A 10 ms transient analysis with a 44.6 % gate pulse. The output settles near 5 V, the inductor current ramps between about 1.56 A and 2.35 A, and the converter delivers roughly 2 A to the test load."
          aside={
            <div className="sim-source">
              <span className="mono">Source</span>
              <b>LTspice 26.1.1</b>
              <span className="mono">tran 0 10 ms · 64,055 points</span>
            </div>
          }
        />

        <div className="metric-grid">
          <Reveal className="metric">
            <span className="mono">Average output</span>
            <b>
              {M.voutAvg.toFixed(3)}
              <small>V</small>
            </b>
            <span>Time-weighted mean, 8–10 ms</span>
          </Reveal>
          <Reveal delay={60} className="metric">
            <span className="mono">Output ripple</span>
            <b>
              {M.voutRipple.toFixed(1)}
              <small>mV</small>
            </b>
            <span>{M.voutRipplePct.toFixed(2)} % peak-to-peak</span>
          </Reveal>
          <Reveal delay={120} className="metric">
            <span className="mono">Efficiency</span>
            <b>
              {M.efficiency.toFixed(1)}
              <small>%</small>
            </b>
            <span>
              {M.pout.toFixed(2)} W out / {M.pin.toFixed(2)} W in
            </span>
          </Reveal>
          <Reveal delay={180} className="metric">
            <span className="mono">Duty cycle</span>
            <b>
              {M.dutySim.toFixed(1)}
              <small>%</small>
            </b>
            <span>4.45 µs on per 10 µs period</span>
          </Reveal>
        </div>

        <div className="sim-grid">
          <Reveal className="chart-panel">
            <WaveformChart />
          </Reveal>

          <div className="sim-side">
            <Reveal delay={60} className="setup-card">
              <div className="setup-card__head">
                <span className="kicker">Simulation setup</span>
                <span className="mono">Exactly as run</span>
              </div>
              <dl className="setup-list">
                {SIM_SETUP.map(([k, v]) => (
                  <div key={k}>
                    <dt>{k}</dt>
                    <dd>{v}</dd>
                  </div>
                ))}
              </dl>
              <p className="setup-card__note">
                The gate pulse is an ideal voltage source referenced to the switch node. Gate-drive
                and controller losses are therefore outside the efficiency figure.
              </p>
            </Reveal>

            <Reveal delay={110}>
              <IdealCalculator />
            </Reveal>
          </div>
        </div>

        <Reveal delay={80}>
          <div className="sim-strip">
            <div>
              <span className="mono">Inductor current</span>
              <b>{M.ilAvg.toFixed(2)} A avg</b>
              <span>{M.ilRipple.toFixed(2)} A ripple</span>
            </div>
            <div>
              <span className="mono">Input current</span>
              <b>{M.iinAvg.toFixed(2)} A avg</b>
              <span>pulsed, not smooth DC</span>
            </div>
            <div>
              <span className="mono">Switch node</span>
              <b>
                {M.vswMin.toFixed(2)} … {M.vswMax.toFixed(2)} V
              </b>
              <span>below ground during freewheeling</span>
            </div>
            <div>
              <span className="mono">Ideal output at 44.6 %</span>
              <b>{M.voutIdealAtSimDuty.toFixed(2)} V</b>
              <span>lossless estimate</span>
            </div>
          </div>
        </Reveal>

        <p className="sim-disclaimer">
          All values on this page are simulation outputs from the committed LTspice deck. No bench
          measurement exists for this converter, and the PCB was not fabricated.
        </p>
      </div>
    </section>
  )
}

function IdealCalculator() {
  const [duty, setDuty] = useState(44.6)
  const [load, setLoad] = useState(2.5)
  const vin = 12
  const vout = (vin * duty) / 100
  const iout = vout / load
  const pout = vout * iout
  const delta = vout - M.voutAvg

  return (
    <div className="calc-card">
      <div className="calc-card__head">
        <span className="kicker">Ideal calculator</span>
        <span className="mono">Lossless</span>
      </div>
      <p className="calc-card__eq">
        V<sub>out</sub> = D · V<sub>in</sub>
      </p>

      <label className="calc-row">
        <span>
          Duty cycle <b>{duty.toFixed(1)} %</b>
        </span>
        <input
          type="range"
          min={5}
          max={95}
          step={0.1}
          value={duty}
          onChange={(e) => setDuty(Number(e.target.value))}
          aria-label="Duty cycle in percent"
        />
      </label>
      <label className="calc-row">
        <span>
          Load <b>{load.toFixed(1)} Ω</b>
        </span>
        <input
          type="range"
          min={1}
          max={20}
          step={0.1}
          value={load}
          onChange={(e) => setLoad(Number(e.target.value))}
          aria-label="Load resistance in ohms"
        />
      </label>

      <div className="calc-out">
        <div>
          <span className="mono">Vout</span>
          <b>{vout.toFixed(2)} V</b>
        </div>
        <div>
          <span className="mono">Iout</span>
          <b>{iout.toFixed(2)} A</b>
        </div>
        <div>
          <span className="mono">Pout</span>
          <b>{pout.toFixed(1)} W</b>
        </div>
      </div>

      <p className="calc-card__note">
        Ideal, lossless estimate — not a hardware prediction. At 44.6 % the ideal result is{' '}
        {M.voutIdealAtSimDuty.toFixed(2)} V; LTspice gives {M.voutAvg.toFixed(3)} V,{' '}
        {delta > 0 ? `${delta.toFixed(2)} V lower` : `${Math.abs(delta).toFixed(2)} V higher`}{' '}
        because the diode and conduction losses are modelled. The deck has no feedback loop.
      </p>
    </div>
  )
}

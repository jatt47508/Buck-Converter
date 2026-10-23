import { Reveal } from '../components/Reveal'
import { SectionHead } from '../components/SectionHead'
import { Zoomable } from '../components/Zoomable'
import { DRC_FINDINGS } from '../data/pcb'
import { asset } from '../data/site'

const VALUES = [
  ['BT1', 'Input terminals', '12 V banana jack'],
  ['Q1', 'N-MOSFET', 'Q_NMOS_GDS symbol'],
  ['D1', 'Schottky diode', 'D_Schottky symbol'],
  ['L1', 'Inductor', '47 µH'],
  ['C1', 'Output capacitor', '220 µF · polarised'],
  ['R1', 'Load resistor', '2.5 Ω'],
] as const

const NETS = [
  { name: '/Vin', note: 'BT1 pad 1 only', tone: 'warn' },
  { name: '/Vout', note: 'L1, C1, R1', tone: 'ok' },
  { name: 'Earth', note: 'BT1, D1, C1, R1', tone: 'ok' },
  { name: 'SW', note: 'D1 cathode ↔ L1', tone: 'ok' },
  { name: 'Q1 gate', note: 'no-connect', tone: 'bad' },
] as const

export function Circuit() {
  return (
    <section id="circuit" className="section section--circuit">
      <div className="wrap">
        <SectionHead
          no="03"
          kicker="Circuit & design"
          title={
            <>
              A small schematic,
              <br />
              read closely.
            </>
          }
          lede="Six symbols make up the design: input terminals, a switching MOSFET, a freewheeling diode, an inductor, an output capacitor and a test load. The schematic is deliberately minimal — there is no controller, gate driver or feedback divider."
          aside={
            <div className="circuit-tags">
              <span>KiCad 10</span>
              <span>2 copper layers</span>
              <span>6 footprints</span>
            </div>
          }
        />

        <div className="circuit-grid">
          <Reveal className="schematic-card">
            <Zoomable
              src={asset('img/schematic.svg')}
              alt="KiCad schematic of the 12 V to 5 V buck converter"
              caption="KiCad schematic, cropped to the circuit · click to enlarge"
            />
            <div className="schematic-card__foot">
              <span className="mono">12V_to_5V_Buck.kicad_sch</span>
              <span className="mono">Exported from the project file</span>
            </div>
          </Reveal>

          <div className="circuit-side">
            <Reveal delay={60} className="param-card">
              <div className="param-card__head">
                <span className="kicker">Design parameters</span>
                <span className="mono">Symbols only</span>
              </div>
              <dl className="param-list">
                {VALUES.map(([ref, what, value]) => (
                  <div key={ref}>
                    <dt>{ref}</dt>
                    <dd>
                      <b>{value}</b>
                      <span>{what}</span>
                    </dd>
                  </div>
                ))}
              </dl>
              <p className="param-card__note">
                No manufacturer part numbers are assigned in the schematic, except the AP9465GEM
                model used inside LTspice.
              </p>
            </Reveal>

            <Reveal delay={110} className="net-card">
              <span className="kicker">Nets in the layout</span>
              <ul className="net-list">
                {NETS.map((n) => (
                  <li key={n.name} data-tone={n.tone}>
                    <b>{n.name}</b>
                    <span>{n.note}</span>
                  </li>
                ))}
              </ul>
            </Reveal>
          </div>
        </div>

        <div className="review-block">
          <Reveal className="review-head">
            <div>
              <span className="kicker">Design review</span>
              <h3 className="display">What the files actually show</h3>
            </div>
            <p>
              These are direct observations from the KiCad files. They are not a formal DRC
              result — the project contains no DRC report.
            </p>
          </Reveal>
          <div className="review-grid">
            {DRC_FINDINGS.map((f, i) => (
              <Reveal key={f.tag} delay={i * 80} className="review-card">
                <span className="review-card__tag">{f.tag}</span>
                <span className="review-card__no">{String(i + 1).padStart(2, '0')}</span>
                <h4>{f.title}</h4>
                <p>{f.body}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

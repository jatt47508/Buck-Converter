import raw from './parts.json'
import { asset } from './site'

export type Vec3 = [number, number, number]

export interface PartMeta {
  ref: string
  value: string
  role: string
  color: string
  file: string
  pos: Vec3
  size: Vec3
  top: number
  explode: Vec3
  meshes: number
}

export interface PartInfo {
  name: string
  kind: 'Semiconductor' | 'Magnetic' | 'Passive' | 'Connector'
  footprint: string
  nets: string
  blurb: string
  detail: string
}

export const BOARD = raw.board as { file: string; size: Vec3; thickness: number }
export const PARTS = raw.parts as PartMeta[]

export const PART_BY_REF = Object.fromEntries(PARTS.map((p) => [p.ref, p])) as Record<
  string,
  PartMeta
>

export const PART_INFO: Record<string, PartInfo> = {
  Q1: {
    name: 'Switching MOSFET',
    kind: 'Semiconductor',
    footprint: 'Toshiba SOIC-4-6 · 4.4 × 3.6 mm · P1.27',
    nets: 'G — no-connect · S — SW · D pads 4/6 — no net',
    blurb: 'Chops the 12 V input at 100 kHz. Duty cycle sets the output voltage.',
    detail:
      'Schematic symbol Q_NMOS_GDS. The LTspice study uses an AP9465GEM model; no physical part number is assigned in the design. On this PCB revision the gate is marked no-connect and the drain pads carry no net.',
  },
  D1: {
    name: 'Freewheeling diode',
    kind: 'Semiconductor',
    footprint: 'DO-41 / SOD81 · P10.16 mm',
    nets: 'K — SW · A — Earth',
    blurb: 'Carries the inductor current while the MOSFET is off.',
    detail:
      'Symbol D_Schottky, no part number assigned. The LTspice deck uses the default diode model, so the simulated forward drop is generic rather than a specific Schottky datasheet value.',
  },
  L1: {
    name: 'Energy-storage inductor',
    kind: 'Magnetic',
    footprint: 'Radial D8.7 mm · P5.00 · Fastron 07HCP',
    nets: '1 — SW · 2 — /Vout',
    blurb: 'Stores energy while the switch is on and releases it to the load.',
    detail:
      '47 µH, the central magnetic element of the power stage. The simulation adds a 1 mΩ series resistance to the ideal inductance.',
  },
  C1: {
    name: 'Output capacitor',
    kind: 'Passive',
    footprint: 'CP radial D8.0 mm · P3.50 mm',
    nets: '+ — /Vout · − — Earth',
    blurb: 'Holds the output steady between switching cycles.',
    detail:
      '220 µF polarised electrolytic. In simulation it supplies the load ripple current, limiting output ripple to about 59 mV.',
  },
  R1: {
    name: 'Load resistor',
    kind: 'Passive',
    footprint: 'Axial DIN0207 · L6.3 · P10.16 mm',
    nets: '1 — /Vout · 2 — Earth',
    blurb: 'Represents a 2 A load at 5 V — the operating point used in simulation.',
    detail:
      '2.5 Ω, sized for 2 A at a 5 V output. It is a test load, not part of the converter itself.',
  },
  BT1: {
    name: '12 V input terminals',
    kind: 'Connector',
    footprint: '2-pin banana jack · 10.16 mm pads · 6.1 mm drill',
    nets: '+ — /Vin · − — Earth',
    blurb: 'The only input connection on the board. Interesting finding: /Vin is not routed onward.',
    detail:
      'The STEP export contains no 3D model for this connector, so the showcase shows its two large plated holes only. The PCB layout places BT1 on the left edge.',
  },
}

export const PART_ORDER = ['Q1', 'D1', 'L1', 'C1', 'R1'] as const

export const partUrl = (p: PartMeta) => asset(`models/${p.file}`)
export const boardUrl = asset(`models/${BOARD.file}`)

export const PART_ANNOTATIONS: Record<
  string,
  { title: string; sub: string; side: 1 | -1 }
> = {
  Q1: { title: 'MOSFET', sub: 'switching element', side: -1 },
  D1: { title: 'SCHOTTKY', sub: 'freewheeling path', side: -1 },
  L1: { title: '47 µH', sub: 'energy storage', side: 1 },
  C1: { title: '220 µF', sub: 'output filter', side: 1 },
  R1: { title: '2.5 Ω', sub: 'simulated load', side: 1 },
}

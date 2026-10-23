import sim from './sim.json'

export interface Metrics {
  vin: number
  voutTarget: number
  fsw: number
  voutAvg: number
  voutRipple: number
  voutRipplePct: number
  dutySim: number
  dutyIdeal: number
  voutIdealAtSimDuty: number
  ilAvg: number
  ilRipple: number
  iinAvg: number
  pout: number
  pin: number
  efficiency: number
  vswMin: number
  vswMax: number
  points: number
  tEndMs: number
}

export type SeriesKey = 'vout' | 'il' | 'iin' | 'vgs' | 'vsw'
export type WindowKey = 'overview' | 'steady' | 'switching'

export interface WindowData {
  t: number[]
  vout?: number[]
  il?: number[]
  iin?: number[]
  vgs?: number[]
  vsw?: number[]
}

export const SIM = sim as {
  source: string
  command: string
  circuit: string
  note: string
  metrics: Metrics
  windows: Record<WindowKey, WindowData>
}

export const M = SIM.metrics

export const SERIES_META: Record<
  SeriesKey,
  { label: string; unit: string; color: string; decimals: number; fastOnly?: boolean }
> = {
  vout: { label: 'Output voltage', unit: 'V', color: '#c2410c', decimals: 3 },
  il: { label: 'Inductor current', unit: 'A', color: '#0f766e', decimals: 2 },
  iin: { label: 'Input current', unit: 'A', color: '#7c3aed', decimals: 2 },
  vgs: { label: 'Gate–source voltage', unit: 'V', color: '#1d4ed8', decimals: 1, fastOnly: true },
  vsw: { label: 'Switch-node voltage', unit: 'V', color: '#a16207', decimals: 2, fastOnly: true },
}

export const WINDOWS: Record<WindowKey, { label: string; caption: string }> = {
  overview: { label: 'Startup', caption: '0 – 10 ms · output settles from 0 V' },
  steady: { label: 'Steady state', caption: '8 – 10 ms · ripple and conduction' },
  switching: { label: 'Switching detail', caption: '9.49 – 9.53 ms · four 100 kHz cycles' },
}

export const SIM_SETUP = [
  ['Engine', 'LTspice 26.1.1 · tran 0 10 ms'],
  ['Input source', 'V1 = 12 V DC'],
  ['Gate drive', 'V2 = PULSE(0 10 0 10n 10n 4.45u 10u)'],
  ['MOSFET model', 'AP9465GEM'],
  ['Diode', 'LTspice default diode (D1 symbol is D_Schottky)'],
  ['Inductor', '47 µH + 1 mΩ series resistance'],
  ['Capacitor', '220 µF'],
  ['Load', '2.5 Ω (≈ 2 A at 5 V)'],
  ['Data', '64,055 adaptive time points'],
] as const

import pcb from './pcb.json'

export interface Track {
  a: [number, number]
  b: [number, number]
  w: number
  layer: string
  net: string | null
}

export interface Pad {
  ref: string
  name: string
  at: [number, number]
  size: [number, number]
  shape: string
  type: string
  layers: string[]
  net: string | null
  drill: number
  rot: number
}

export const PCB = pcb as unknown as {
  tracks: Track[]
  pads: Pad[]
  trackLength: Record<string, number>
  stats: { tracks: number; pads: number; trackLength: Record<string, number> }
}

export const BOARD_SPECS = [
  ['Board size', '55.5 × 44.0 mm'],
  ['Thickness', '1.6 mm'],
  ['Layers', '2 (F.Cu / B.Cu)'],
  ['Track segments', '21 · 122.8 mm total on F.Cu'],
  ['Copper zone', '1 · B.Cu · Earth'],
  ['Vias', '0'],
  ['Footprints', '6'],
  ['Plated pads', '14'],
] as const

export const DRC_FINDINGS = [
  {
    tag: 'Unrouted',
    title: '/Vin never reaches the switch',
    body:
      'BT1 pad 1 is the only pad on /Vin. The MOSFET drain pads (4 and 6) have no net, so the 12 V input is not connected to Q1 in the layout.',
  },
  {
    tag: 'No-connect',
    title: 'Gate drive is absent',
    body:
      'Q1 pad 1 (gate) is marked no-connect in the schematic and carries an unconnected net on the PCB. The board cannot switch without an external gate driver.',
  },
  {
    tag: 'Unexported',
    title: 'No DRC report in the project',
    body:
      'The repository has no design-rule-check report, so the layout is not claimed as DRC-clean. The board has not been fabricated or measured.',
  },
] as const

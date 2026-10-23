import pcbSch from '../../12V_to_5V_Buck/12V_to_5V_Buck.kicad_sch?url'
import pcbPcb from '../../12V_to_5V_Buck/12V_to_5V_Buck.kicad_pcb?url'
import pcbPro from '../../12V_to_5V_Buck/12V_to_5V_Buck.kicad_pro?url'
import step from '../../12V_to_5V_Buck/buck_converter.step?url'
import asc from '../../LTspice/BuckMod.asc?url'
import plt from '../../LTspice/BuckMod.plt?url'
import { asset } from './site'

export interface DownloadFile {
  name: string
  href: string
  type: string
  bytes: number
  description: string
  group: 'Design' | 'Simulation' | 'Visuals'
}

export const DOWNLOADS: DownloadFile[] = [
  {
    name: '12V_to_5V_Buck.kicad_sch',
    href: pcbSch,
    type: 'KiCad schematic',
    bytes: 41571,
    description: 'The complete schematic: input, power stage and test load.',
    group: 'Design',
  },
  {
    name: '12V_to_5V_Buck.kicad_pcb',
    href: pcbPcb,
    type: 'KiCad PCB',
    bytes: 87792,
    description: 'Two-layer board layout, 55.5 × 44 mm, including the Earth zone.',
    group: 'Design',
  },
  {
    name: '12V_to_5V_Buck.kicad_pro',
    href: pcbPro,
    type: 'KiCad project',
    bytes: 16746,
    description: 'Project settings and design rules used while editing the board.',
    group: 'Design',
  },
  {
    name: 'buck_converter.step',
    href: step,
    type: 'STEP 3D model',
    bytes: 449780,
    description: 'Board substrate and the 3D component models exported by KiCad.',
    group: 'Design',
  },
  {
    name: 'buck-simulation.csv',
    href: asset('files/buck-simulation.csv'),
    type: 'CSV · LTspice export',
    bytes: 942252,
    description:
      'Transient data decimated to every 4th sample: time, Vout, Vsw, Vgate, IL and input current.',
    group: 'Simulation',
  },
  {
    name: 'BuckMod.asc',
    href: asc,
    type: 'LTspice schematic',
    bytes: 3606,
    description: 'The exact simulation deck: 12 V source, gate pulse, MOSFET, diode, L, C and load.',
    group: 'Simulation',
  },
  {
    name: 'BuckMod.plt',
    href: plt,
    type: 'LTspice plot settings',
    bytes: 275,
    description: 'Saved waveform-pane configuration for the transient analysis.',
    group: 'Simulation',
  },
  {
    name: 'schematic.svg',
    href: asset('img/schematic.svg'),
    type: 'SVG · schematic',
    bytes: 0,
    description: 'Vector export of the schematic, cropped to the circuit.',
    group: 'Visuals',
  },
  {
    name: 'board-iso.png',
    href: asset('img/board-iso.png'),
    type: 'PNG · 3D render',
    bytes: 0,
    description: 'Ray-traced isometric render of the assembled board from KiCad.',
    group: 'Visuals',
  },
]

export const formatBytes = (bytes: number) => {
  if (!bytes) return 'vector'
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / 1024 / 1024).toFixed(2)} MB`
}

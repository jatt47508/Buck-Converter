export const SITE = {
  title: '12V → 5V Buck Converter',
  subtitle: 'Design. Simulation. Implementation.',
  author: 'Jatin Kumar Mallick',
  repo: 'https://github.com/jatt47508/Buck-Converter',
  live: 'https://jatt47508.github.io/Buck-Converter/',
  course: 'Power Electronics',
  year: '2026',
}

export const asset = (path: string) =>
  `${import.meta.env.BASE_URL}${path.replace(/^\/+/, '')}`

export const SECTIONS = [
  { id: 'top', label: 'Top', short: '00' },
  { id: 'introduction', label: 'Introduction', short: '01' },
  { id: 'principle', label: 'Working principle', short: '02' },
  { id: 'circuit', label: 'Circuit & design', short: '03' },
  { id: 'simulation', label: 'Simulation', short: '04' },
  { id: 'pcb', label: 'PCB design', short: '05' },
  { id: 'downloads', label: 'Downloads', short: '06' },
  { id: 'lab', label: '3D laboratory', short: '07' },
] as const

export type SectionId = (typeof SECTIONS)[number]['id']

import { Reveal } from '../components/Reveal'
import { SectionHead } from '../components/SectionHead'
import { DOWNLOADS, formatBytes, type DownloadFile } from '../data/files'
import { SITE } from '../data/site'

const GROUPS: DownloadFile['group'][] = ['Design', 'Simulation', 'Visuals']

const EXT_LABEL: Record<string, string> = {
  kicad_sch: 'SCH',
  kicad_pcb: 'PCB',
  kicad_pro: 'PRO',
  step: 'STEP',
  asc: 'ASC',
  plt: 'PLT',
  csv: 'CSV',
  svg: 'SVG',
  png: 'PNG',
}

const GROUP_TEXT: Record<DownloadFile['group'], string> = {
  Design: 'Editable KiCad and STEP sources',
  Simulation: 'The deck, its plot settings and the exported data',
  Visuals: 'Vector schematic and raytraced board renders',
}

export function Downloads() {
  return (
    <section id="downloads" className="section section--downloads">
      <div className="wrap">
        <SectionHead
          no="06"
          kicker="Downloads"
          title={
            <>
              Take the files,
              <br />
              check the work.
            </>
          }
          lede="These are the actual project files. Download the KiCad sources, open the LTspice deck, or take the decimated waveform CSV. Nothing on this page links to a file that does not exist in the repository."
          aside={
            <a className="btn btn--ghost" href={SITE.repo} target="_blank" rel="noreferrer">
              Browse repository ↗
            </a>
          }
        />

        <div className="download-groups">
          {GROUPS.map((group, gi) => (
            <Reveal key={group} delay={gi * 80} className="download-group">
              <div className="download-group__head">
                <h3>{group}</h3>
                <span className="mono">{DOWNLOADS.filter((f) => f.group === group).length} files</span>
              </div>
              <p className="download-group__text">{GROUP_TEXT[group]}</p>
              <ul>
                {DOWNLOADS.filter((f) => f.group === group).map((file) => (
                  <li key={file.name}>
                    <a href={file.href} download={file.name}>
                      <span className="file-ext">
                        {EXT_LABEL[file.name.split('.').pop()?.toLowerCase() ?? ''] ??
                          file.name.split('.').pop()?.toUpperCase()}
                      </span>
                      <span className="file-main">
                        <b>{file.name}</b>
                        <span>{file.description}</span>
                      </span>
                      <span className="file-meta">
                        {formatBytes(file.bytes)}
                        <i aria-hidden="true">↓</i>
                      </span>
                    </a>
                  </li>
                ))}
              </ul>
            </Reveal>
          ))}
        </div>

        <Reveal delay={80}>
          <div className="download-note">
            <span className="mono">Integrity note</span>
            <p>
              The LTspice <code>.raw</code> file is generated at runtime and is not committed; the
              simulation section reads a derived JSON summary of that run, and the CSV is included
              for inspection in other tools. Rendered images come from the committed PCB and
              schematic files.
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  )
}

import { SITE } from '../data/site'

export function Footer() {
  return (
    <footer className="footer">
      <div className="wrap">
        <div className="footer__top">
          <div>
            <span className="mono footer__kicker">Power electronics · {SITE.year}</span>
            <h2 className="display footer__title">
              12V → 5V
              <br />
              Buck converter
            </h2>
          </div>
          <div className="footer__links">
            <div>
              <span className="mono">Project</span>
              <a href="#introduction">Introduction</a>
              <a href="#principle">Working principle</a>
              <a href="#simulation">Simulation</a>
              <a href="#lab">3D laboratory</a>
            </div>
            <div>
              <span className="mono">Files</span>
              <a href="#downloads">Downloads</a>
              <a href={SITE.repo} target="_blank" rel="noreferrer">
                Repository ↗
              </a>
              <a href={SITE.live} target="_blank" rel="noreferrer">
                Live page ↗
              </a>
            </div>
          </div>
        </div>

        <div className="footer__notice">
          <span className="mono">Disclaimer · educational project</span>
          <p>
            This buck converter is a personal passion project built to learn and demonstrate
            power-electronics design. It is not a commercial product and should not be trusted for
            industry-grade, production, or safety-critical use. The board has not been fabricated or
            measured, and every electrical result on this site comes from simulation.
          </p>
        </div>

        <div className="footer__bottom">
          <span>
            © {SITE.year} {SITE.author} · Educational use only
          </span>
          <span>Built from the KiCad and LTspice project files</span>
          <span>Simulated results · hardware not built</span>
        </div>
      </div>
    </footer>
  )
}

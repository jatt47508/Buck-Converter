import { useEffect, useRef, useState } from 'react'
import { SECTIONS, SITE } from '../data/site'
import { useScrollSpy } from '../hooks/useInView'

const SECTION_IDS = SECTIONS.map((s) => s.id)

export function Nav() {
  const [open, setOpen] = useState(false)
  const burgerRef = useRef<HTMLButtonElement>(null)
  const firstLinkRef = useRef<HTMLAnchorElement>(null)
  const active = useScrollSpy(SECTION_IDS)
  const activeSection = SECTIONS.find((s) => s.id === active) ?? SECTIONS[0]

  useEffect(() => {
    document.body.classList.toggle('menu-open', open)
    if (open) {
      const t = window.setTimeout(() => firstLinkRef.current?.focus(), 60)
      return () => window.clearTimeout(t)
    }
  }, [open])

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpen(false)
        burgerRef.current?.focus()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  const close = () => setOpen(false)

  return (
    <>
      <header className="nav">
        <button
          ref={burgerRef}
          type="button"
          className="nav__burger"
          aria-expanded={open}
          aria-controls="site-menu"
          aria-label={open ? 'Close navigation' : 'Open navigation'}
          onClick={() => setOpen((v) => !v)}
        >
          <span className="nav__burger-lines" aria-hidden="true">
            <i />
            <i />
            <i />
          </span>
          <span>{open ? 'Close' : 'Menu'}</span>
        </button>

        <div className="nav__right">
          <span className="nav__chip nav__status">
            <i className="nav__dot" aria-hidden="true" />
            Simulated data
          </span>
          <a
            className="nav__chip"
            href={SITE.repo}
            target="_blank"
            rel="noreferrer"
            aria-label="Open the project repository on GitHub"
          >
            GitHub ↗
          </a>
          <span className="nav__chip nav__section" aria-live="polite">
            <b>{activeSection.short}</b>
            <span>/{String(SECTIONS.length - 1).padStart(2, '0')}</span>
            <span>{activeSection.label}</span>
          </span>
        </div>
      </header>

      <div
        id="site-menu"
        className={`menu ${open ? 'open' : ''}`}
        aria-hidden={!open}
        onPointerDown={(e) => {
          if (e.target === e.currentTarget) close()
        }}
      >
        <div className="menu__frame" aria-hidden="true" />
        <nav aria-label="Sections">
          <ul className="menu__list">
            {SECTIONS.map((s, i) => (
              <li key={s.id}>
                <a
                  ref={i === 0 ? firstLinkRef : undefined}
                  className="menu__link"
                  href={`#${s.id}`}
                  aria-current={active === s.id ? 'true' : undefined}
                  onClick={close}
                  tabIndex={open ? 0 : -1}
                >
                  <span className="menu__no">{s.short}</span>
                  <span className="menu__label">{s.label}</span>
                  <span className="menu__hint">Go to section ↗</span>
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <div className="menu__bottom">
          <span>12 V → 5 V · Buck converter · {SITE.year}</span>
          <a href={SITE.repo} target="_blank" rel="noreferrer">
            github.com/jatt47508/Buck-Converter ↗
          </a>
        </div>
      </div>
    </>
  )
}

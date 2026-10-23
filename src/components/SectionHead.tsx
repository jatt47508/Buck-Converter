import type { ReactNode } from 'react'

export function SectionHead({
  no,
  kicker,
  title,
  lede,
  aside,
  dark = false,
}: {
  no: string
  kicker: string
  title: ReactNode
  lede?: ReactNode
  aside?: ReactNode
  dark?: boolean
}) {
  return (
    <header className="section-head">
      <div className="section-head__meta">
        <span className="kicker">{kicker}</span>
        <span className="section-head__no" aria-hidden="true">
          {no}
        </span>
      </div>
      <div className="section-head__main">
        <h2 className={`display section-title ${dark ? 'is-light' : ''}`}>{title}</h2>
        {lede && <p className="lede section-head__lede">{lede}</p>}
      </div>
      {aside && <div className="section-head__aside">{aside}</div>}
    </header>
  )
}

import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'

export function Zoomable({
  src,
  alt,
  caption,
  tone = 'cream',
}: {
  src: string
  alt: string
  caption?: string
  tone?: 'cream' | 'dark'
}) {
  const [open, setOpen] = useState(false)
  return (
    <>
      <button
        type="button"
        className={`zoomable zoomable--${tone}`}
        onClick={() => setOpen(true)}
        aria-label={`Open ${alt} at full size`}
      >
        <img src={src} alt={alt} loading="lazy" />
        <span className="zoomable__badge" aria-hidden="true">
          Zoom +
        </span>
        {caption && <span className="zoomable__caption">{caption}</span>}
      </button>
      {open && <Lightbox src={src} alt={alt} onClose={() => setOpen(false)} />}
    </>
  )
}

function Lightbox({
  src,
  alt,
  onClose,
}: {
  src: string
  alt: string
  onClose: () => void
}) {
  const [scale, setScale] = useState(1)
  const [offset, setOffset] = useState({ x: 0, y: 0 })
  const dragging = useRef<{ x: number; y: number; ox: number; oy: number } | null>(null)
  const closeRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    closeRef.current?.focus()
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = prev
      window.removeEventListener('keydown', onKey)
    }
  }, [onClose])

  const clampScale = (v: number) => Math.min(6, Math.max(0.8, v))
  const zoom = (factor: number) => setScale((s) => clampScale(s * factor))
  const reset = () => {
    setScale(1)
    setOffset({ x: 0, y: 0 })
  }

  return createPortal(
    <div
      className="lightbox"
      role="dialog"
      aria-modal="true"
      aria-label={`${alt} — enlarged view`}
      onPointerDown={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
    >
      <div className="lightbox__bar">
        <span className="lightbox__title">{alt}</span>
        <div className="lightbox__tools">
          <button type="button" onClick={() => zoom(1.35)} aria-label="Zoom in">
            +
          </button>
          <button type="button" onClick={() => zoom(1 / 1.35)} aria-label="Zoom out">
            −
          </button>
          <button type="button" onClick={reset} aria-label="Reset zoom">
            1:1
          </button>
          <button
            type="button"
            className="lightbox__close"
            onClick={onClose}
            ref={closeRef}
            aria-label="Close enlarged view"
          >
            Close ×
          </button>
        </div>
      </div>
      <div
        className="lightbox__stage"
        onWheel={(e) => {
          e.preventDefault()
          zoom(e.deltaY < 0 ? 1.12 : 1 / 1.12)
        }}
        onPointerDown={(e) => {
          if (e.target !== e.currentTarget) return
          dragging.current = { x: e.clientX, y: e.clientY, ox: offset.x, oy: offset.y }
          e.currentTarget.setPointerCapture(e.pointerId)
        }}
        onPointerMove={(e) => {
          const d = dragging.current
          if (!d) return
          setOffset({ x: d.ox + (e.clientX - d.x), y: d.oy + (e.clientY - d.y) })
        }}
        onPointerUp={() => {
          dragging.current = null
        }}
        onDoubleClick={reset}
      >
        <img
          src={src}
          alt={alt}
          style={{
            transform: `translate(${offset.x}px, ${offset.y}px) scale(${scale})`,
          }}
          draggable={false}
        />
      </div>
      <p className="lightbox__hint">Scroll to zoom · drag to pan · Esc to close</p>
    </div>,
    document.body,
  )
}

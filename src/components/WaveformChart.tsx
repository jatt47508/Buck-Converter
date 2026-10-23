import { useId, useMemo, useState } from 'react'
import { SERIES_META, SIM, WINDOWS, type SeriesKey, type WindowKey } from '../data/sim'

const W = 860
const H = 360
const PAD = { t: 26, r: 18, b: 40, l: 62 }

const formatTime = (t: number) => `${t.toFixed(2)} ms`

export function WaveformChart() {
  const [windowKey, setWindowKey] = useState<WindowKey>('steady')
  const [series, setSeries] = useState<SeriesKey>('vout')
  const [hover, setHover] = useState<number | null>(null)
  const gid = useId().replace(/:/g, '')

  const data = SIM.windows[windowKey]
  const meta = SERIES_META[series]
  const values = data[series]

  const selectSeries = (key: SeriesKey) => {
    setSeries(key)
    if (SERIES_META[key].fastOnly && windowKey !== 'switching') {
      setWindowKey('switching')
    }
  }

  const selectWindow = (key: WindowKey) => {
    setWindowKey(key)
    if (SERIES_META[series].fastOnly && key !== 'switching') {
      setSeries('vout')
    }
  }

  const chart = useMemo(() => {
    if (!values || values.length === 0) return null
    const t0 = data.t[0]
    const t1 = data.t[data.t.length - 1]
    let min = Math.min(...values)
    let max = Math.max(...values)
    if (meta.unit === 'V' && series === 'vsw') {
      min = Math.min(0, min)
      max = Math.max(12, max)
    }
    const span = max - min || 1
    min -= span * 0.1
    max += span * 0.1
    const x = (t: number) => PAD.l + ((t - t0) / (t1 - t0 || 1)) * (W - PAD.l - PAD.r)
    const y = (v: number) => PAD.t + (1 - (v - min) / (max - min)) * (H - PAD.t - PAD.b)

    let d = ''
    for (let i = 0; i < values.length; i += 1) {
      d += `${i === 0 ? 'M' : 'L'}${x(data.t[i]).toFixed(2)} ${y(values[i]).toFixed(2)}`
    }
    const area = `${d}L${x(t1).toFixed(2)} ${H - PAD.b}L${x(t0).toFixed(2)} ${H - PAD.b}Z`

    const yTicks = Array.from({ length: 5 }, (_, i) => {
      const v = min + ((max - min) * i) / 4
      return { v, y: y(v) }
    })
    const xTicks = Array.from({ length: 5 }, (_, i) => {
      const t = t0 + ((t1 - t0) * i) / 4
      return { t, x: x(t) }
    })

    return { t0, t1, min, max, x, y, d, area, yTicks, xTicks }
  }, [data.t, values, meta.unit, series])

  const hoverPoint =
    chart && hover !== null && values
      ? { t: data.t[hover], v: values[hover], x: chart.x(data.t[hover]), y: chart.y(values[hover]) }
      : null

  const decimals = meta.decimals
  const lastValue = values?.[values.length - 1]

  return (
    <div className="chart">
      <div className="chart__tabs">
        <div className="chart__tabgroup" role="tablist" aria-label="Time window">
          {(Object.keys(WINDOWS) as WindowKey[]).map((k) => (
            <button
              key={k}
              type="button"
              role="tab"
              aria-selected={windowKey === k}
              className={windowKey === k ? 'is-active' : ''}
              onClick={() => selectWindow(k)}
            >
              {WINDOWS[k].label}
            </button>
          ))}
        </div>
      </div>

      <div className="chart__series" role="group" aria-label="Signal">
        {(Object.keys(SERIES_META) as SeriesKey[]).map((k) => (
          <button
            key={k}
            type="button"
            className={series === k ? 'is-active' : ''}
            onClick={() => selectSeries(k)}
            aria-pressed={series === k}
          >
            <i style={{ background: SERIES_META[k].color }} aria-hidden="true" />
            {SERIES_META[k].label}
          </button>
        ))}
      </div>

      <div className="chart__head">
        <div>
          <span className="mono">{WINDOWS[windowKey].caption}</span>
          <h4>
            {meta.label} <span>/ {meta.unit}</span>
          </h4>
        </div>
        <div className="chart__readout" aria-live="polite">
          {hoverPoint ? (
            <>
              <b>{hoverPoint.v.toFixed(decimals)} {meta.unit}</b>
              <span>at {formatTime(hoverPoint.t)}</span>
            </>
          ) : (
            <>
              <b>
                {lastValue !== undefined ? lastValue.toFixed(decimals) : '—'} {meta.unit}
              </b>
              <span>end of window · hover to inspect</span>
            </>
          )}
        </div>
      </div>

      <svg
        className="chart__svg"
        viewBox={`0 0 ${W} ${H}`}
        role="img"
        aria-label={`${meta.label} over ${WINDOWS[windowKey].caption.toLowerCase()}. Hover the chart to inspect values.`}
        onPointerLeave={() => setHover(null)}
        onPointerMove={(e) => {
          if (!chart || !values) return
          const rect = e.currentTarget.getBoundingClientRect()
          const px = ((e.clientX - rect.left) / rect.width) * W
          const frac = (px - PAD.l) / (W - PAD.l - PAD.r)
          const idx = Math.round(frac * (values.length - 1))
          setHover(Math.max(0, Math.min(values.length - 1, idx)))
        }}
      >
        <defs>
          <linearGradient id={`grad-${gid}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={meta.color} stopOpacity="0.28" />
            <stop offset="100%" stopColor={meta.color} stopOpacity="0" />
          </linearGradient>
        </defs>

        {chart?.yTicks.map((tick) => (
          <g key={`y-${tick.v}`}>
            <line
              x1={PAD.l}
              x2={W - PAD.r}
              y1={tick.y}
              y2={tick.y}
              stroke="rgba(255,251,228,0.12)"
              strokeDasharray="2 5"
            />
            <text x={PAD.l - 10} y={tick.y + 4} textAnchor="end" className="chart__tick">
              {tick.v.toFixed(meta.unit === 'V' ? 1 : 2)}
            </text>
          </g>
        ))}
        {chart?.xTicks.map((tick) => (
          <g key={`x-${tick.t}`}>
            <line
              x1={tick.x}
              x2={tick.x}
              y1={PAD.t}
              y2={H - PAD.b}
              stroke="rgba(255,251,228,0.08)"
            />
            <text x={tick.x} y={H - PAD.b + 18} textAnchor="middle" className="chart__tick">
              {tick.t.toFixed(2)}
            </text>
          </g>
        ))}
        <text x={W - PAD.r} y={H - 8} textAnchor="end" className="chart__axis">
          time / ms
        </text>
        <text x={PAD.l} y={PAD.t - 8} className="chart__axis">
          {meta.unit}
        </text>

        {chart && (
          <>
            <path d={chart.area} fill={`url(#grad-${gid})`} />
            <path d={chart.d} fill="none" stroke={meta.color} strokeWidth="2" strokeLinejoin="round" />
          </>
        )}

        {hoverPoint && (
          <g pointerEvents="none">
            <line
              x1={hoverPoint.x}
              x2={hoverPoint.x}
              y1={PAD.t}
              y2={H - PAD.b}
              stroke={meta.color}
              strokeOpacity="0.55"
              strokeDasharray="3 4"
            />
            <circle cx={hoverPoint.x} cy={hoverPoint.y} r="4.5" fill={meta.color} />
            <circle cx={hoverPoint.x} cy={hoverPoint.y} r="8" fill={meta.color} opacity="0.18" />
          </g>
        )}
      </svg>

      <p className="chart__note">
        {windowKey === 'overview'
          ? 'Full transient including startup. The output reaches its steady value in about 4 ms.'
          : windowKey === 'steady'
            ? 'Two milliseconds of settled operation. Ripple is measured peak-to-peak in this window.'
            : 'Four switching cycles around 9.5 ms. Gate and switch-node traces are only available in this window.'}{' '}
        Traces are decimated from 64,055 adaptive-step samples; averages on this page are
        time-weighted, not sample-weighted.
      </p>
    </div>
  )
}

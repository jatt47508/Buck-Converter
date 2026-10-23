export const clamp = (v: number, min = 0, max = 1) => Math.min(max, Math.max(min, v))

export const lerp = (a: number, b: number, t: number) => a + (b - a) * t

export const smoothstep = (t: number) => {
  const x = clamp(t)
  return x * x * (3 - 2 * x)
}

export const range = (v: number, a: number, b: number) => clamp((v - a) / (b - a))

export const round = (v: number, d = 2) => {
  const f = 10 ** d
  return Math.round(v * f) / f
}

export const fmt = (v: number, d = 2) => v.toFixed(d)

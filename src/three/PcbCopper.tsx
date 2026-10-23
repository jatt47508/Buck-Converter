import { useMemo } from 'react'
import { PCB } from '../data/pcb'

const COPPER = '#9a5a1a'

export function PcbCopper({ y = 0.776 }: { y?: number }) {
  const pads = useMemo(
    () =>
      PCB.pads.map((pad, i) => {
        const [x, z] = pad.at
        const w = pad.size[0]
        const h = pad.size[1]
        const round = pad.shape === 'circle' || pad.shape === 'roundrect'
        if (round) {
          const outer = Math.max(w, h) / 2
          const inner = Math.max(0.18, pad.drill / 2)
          return (
            <mesh key={`pad-${i}`} position={[x, y + 0.008, z]} rotation={[-Math.PI / 2, 0, 0]}>
              <ringGeometry args={[inner, outer, 28]} />
              <meshStandardMaterial
                color={COPPER}
                metalness={0.45}
                roughness={0.55}
                envMapIntensity={0.3}
              />
            </mesh>
          )
        }
        return (
          <mesh key={`pad-${i}`} position={[x, y + 0.008, z]}>
            <boxGeometry args={[w, 0.02, h]} />
            <meshStandardMaterial color={COPPER} metalness={0.45} roughness={0.55} />
          </mesh>
        )
      }),
    [y],
  )

  const tracks = useMemo(
    () =>
      PCB.tracks.map((t, i) => {
        const [x1, z1] = t.a
        const [x2, z2] = t.b
        const dx = x2 - x1
        const dz = z2 - z1
        const len = Math.hypot(dx, dz)
        return (
          <mesh
            key={`track-${i}`}
            position={[(x1 + x2) / 2, y, (z1 + z2) / 2]}
            rotation={[0, -Math.atan2(dz, dx), 0]}
          >
            <boxGeometry args={[len + 0.02, 0.018, t.w]} />
            <meshStandardMaterial
              color="#8d5518"
              metalness={0.4}
              roughness={0.55}
              envMapIntensity={0.3}
            />
          </mesh>
        )
      }),
    [y],
  )

  return (
    <group>
      {tracks}
      {pads}
    </group>
  )
}



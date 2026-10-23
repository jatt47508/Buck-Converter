import { Suspense, useEffect, useMemo, useRef } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Environment, Html, Lightformer, Line, useGLTF } from '@react-three/drei'
import * as THREE from 'three'
import type { MutableRefObject } from 'react'
import { PART_ANNOTATIONS, PART_ORDER, PARTS, boardUrl, partUrl } from '../data/components'
import type { PartMeta } from '../data/components'
import { clamp, lerp, range, smoothstep } from '../lib/math'
import { useMediaQuery } from '../hooks/useMedia'
import { prepareModel } from './model'
import { PcbCopper } from './PcbCopper'

useGLTF.preload(boardUrl)
PARTS.forEach((p) => useGLTF.preload(partUrl(p)))

const EXPLODE = 0.52

const TIMING: Record<string, { start: number; dur: number }> = {
  Q1: { start: 0.3, dur: 0.28 },
  D1: { start: 0.35, dur: 0.28 },
  L1: { start: 0.4, dur: 0.28 },
  C1: { start: 0.45, dur: 0.28 },
  R1: { start: 0.5, dur: 0.28 },
}

const LABEL_SHIFT: Record<string, [number, number, number]> = {
  Q1: [-9, 2, 0],
  D1: [-2, 3, 2],
  L1: [3, 4, 0],
  C1: [8, 5, -4],
  R1: [8, 1, 4],
}

function Board() {
  const { scene } = useGLTF(boardUrl)
  const model = useMemo(() => {
    const baked = prepareModel(scene)
    baked.traverse((o) => {
      const mesh = o as THREE.Mesh
      if (!mesh.isMesh) return
      mesh.material = new THREE.MeshLambertMaterial({
        color: new THREE.Color('#1c5c41'),
      })
    })
    return baked
  }, [scene])
  return <primitive object={model} />
}

function Part({
  part,
  progressRef,
}: {
  part: PartMeta
  progressRef: MutableRefObject<number>
}) {
  const { scene } = useGLTF(partUrl(part))
  const group = useRef<THREE.Group>(null)
  const model = useMemo(() => prepareModel(scene), [scene])
  const materials = useMemo(() => {
    const list: THREE.MeshStandardMaterial[] = []
    model.traverse((o) => {
      const mesh = o as THREE.Mesh
      if (!mesh.isMesh) return
      const mats = Array.isArray(mesh.material) ? mesh.material : [mesh.material]
      mats.forEach((m) => list.push(m as THREE.MeshStandardMaterial))
    })
    return list
  }, [model])
  const timing = TIMING[part.ref] ?? { start: 0.4, dur: 0.28 }

  useFrame(() => {
    const g = group.current
    if (!g) return
    const p = progressRef.current
    const appear = smoothstep(range(p, 0.1, 0.21))
    const explode = 1 - smoothstep(range(p, timing.start, timing.start + timing.dur))
    g.visible = appear > 0.004
    g.position.set(
      part.pos[0] + part.explode[0] * explode * EXPLODE,
      part.pos[1] + part.explode[1] * explode * EXPLODE,
      part.pos[2] + part.explode[2] * explode * EXPLODE,
    )
    const transparent = appear < 0.995
    for (const m of materials) {
      if (m.transparent !== transparent) {
        m.transparent = transparent
        m.depthWrite = !transparent
        m.needsUpdate = true
      }
      m.opacity = appear
    }
  })

  return (
    <group ref={group}>
      <primitive object={model} />
    </group>
  )
}

function Annotations({ progressRef }: { progressRef: MutableRefObject<number> }) {
  const wide = useMediaQuery('(min-width: 900px)')
  const refs = useRef<Array<HTMLDivElement | null>>([])
  const lineRefs = useRef<Array<any>>([])

  useFrame(() => {
    const p = progressRef.current
    const t = smoothstep(range(p, 0.78, 0.84)) * (1 - smoothstep(range(p, 0.95, 1)))
    refs.current.forEach((el) => {
      if (!el) return
      el.style.opacity = String(t)
      el.style.translate = `0 ${(1 - t) * 6}px`
    })
    lineRefs.current.forEach((line) => {
      if (line?.material) {
        line.material.opacity = t * 0.8
        line.material.transparent = true
      }
    })
  })

  if (!wide) return null

  return (
    <group>
      {PART_ORDER.map((ref, index) => {
        const part = PARTS.find((p) => p.ref === ref)
        if (!part) return null
        const info = PART_ANNOTATIONS[ref]
        const shift = LABEL_SHIFT[ref] ?? [0, 0, 0]
        const baseY = part.pos[1] + part.top
        const anchor: [number, number, number] = [
          part.pos[0] + shift[0],
          baseY + 7 + shift[1],
          part.pos[2] + shift[2],
        ]
        return (
          <group key={ref}>
            <Line
              ref={(el: any) => {
                lineRefs.current[index] = el
              }}
              points={[
                [part.pos[0], baseY + 0.6, part.pos[2]],
                [anchor[0], anchor[1] - 2.4, anchor[2]],
              ]}
              color="#ff5c16"
              lineWidth={1}
              transparent
              opacity={0}
            />
            <Html position={anchor} center zIndexRange={[40, 0]} wrapperClass="anno-wrap">
              <div
                className="anno"
                ref={(el) => {
                  refs.current[index] = el
                }}
              >
                <b>
                  {ref} · {info.title}
                </b>
                <span>{info.sub}</span>
              </div>
            </Html>
          </group>
        )
      })}
    </group>
  )
}

const PATH = [
  { p: 0, c: [44, 36, 62], t: [2, 2.5, -2] },
  { p: 0.18, c: [66, 57, 100], t: [0, 3, 0] },
  { p: 0.38, c: [70, 59, 103], t: [0, 2, 0] },
  { p: 0.62, c: [61, 51, 91], t: [0, 1.5, -1] },
  { p: 0.82, c: [65, 55, 79], t: [0, 2, -1] },
  { p: 1, c: [49, 47, 94], t: [0, 3, 0] },
]

function CameraRig({ progressRef }: { progressRef: MutableRefObject<number> }) {
  const { camera, size, pointer } = useThree()

  useEffect(() => {
    camera.lookAt(0, 2, 0)
  }, [camera])

  useFrame(() => {
    const p = clamp(progressRef.current)
    let i = 0
    while (i < PATH.length - 2 && p > PATH[i + 1].p) i += 1
    const a = PATH[i]
    const b = PATH[i + 1]
    const k = smoothstep(range(p, a.p, b.p))
    const fit = size.width < 760 ? 2.02 : size.width / size.height < 1.15 ? 1.18 : 1
    const px = lerp(a.c[0], b.c[0], k) * fit
    const py = lerp(a.c[1], b.c[1], k) * fit
    const pz = lerp(a.c[2], b.c[2], k) * fit
    const tx = lerp(a.t[0], b.t[0], k)
    const ty = lerp(a.t[1], b.t[1], k)
    const tz = lerp(a.t[2], b.t[2], k)

    const parallax = 1 - smoothstep(range(p, 0.55, 0.9))
    camera.position.set(
      px + pointer.x * 2.4 * parallax,
      py + pointer.y * 1.6 * parallax,
      pz,
    )
    camera.lookAt(tx, ty, tz)

    const wantFov = size.width < 760 ? 42 : 34
    const cam = camera as THREE.PerspectiveCamera
    if (Math.abs(cam.fov - wantFov) > 0.01) {
      cam.fov = wantFov
      cam.updateProjectionMatrix()
    }
  })

  return null
}

function Assembly({
  progressRef,
  children,
}: {
  progressRef: MutableRefObject<number>
  children: React.ReactNode
}) {
  const group = useRef<THREE.Group>(null)
  const { size } = useThree()

  useFrame(() => {
    const g = group.current
    if (!g) return
    const p = progressRef.current
    const mobile = size.width < 760
    const spread = 1 - smoothstep(range(p, 0.22, 0.5))
    g.position.x = mobile ? -2.6 * spread : 2.2
    g.position.y = mobile ? 2.1 : 0.4
    g.rotation.y =
      lerp(-0.3, 0, smoothstep(range(p, 0, 0.3))) +
      smoothstep(range(p, 0.8, 1)) * 0.6
  })

  return <group ref={group}>{children}</group>
}

function Ready({ onReady }: { onReady: () => void }) {
  useEffect(() => {
    const t = window.setTimeout(onReady, 120)
    return () => window.clearTimeout(t)
  }, [onReady])
  return null
}

export function HeroScene({
  progressRef,
  onReady,
  active,
}: {
  progressRef: MutableRefObject<number>
  onReady: () => void
  active: boolean
}) {
  return (
    <Canvas
      frameloop={active ? 'always' : 'never'}
      dpr={[1, 1.75]}
      gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
      camera={{ fov: 34, near: 0.1, far: 600, position: [27, 21, 38] }}
      onCreated={({ gl }) => {
        gl.toneMapping = THREE.ACESFilmicToneMapping
        gl.toneMappingExposure = 1.0
      }}
    >
      <ambientLight intensity={0.24} />
      <directionalLight
        castShadow
        position={[45, 62, 30]}
        intensity={1.45}
        color="#eef4ff"
        shadow-mapSize={[1024, 1024]}
        shadow-camera-left={-40}
        shadow-camera-right={40}
        shadow-camera-top={40}
        shadow-camera-bottom={-40}
        shadow-bias={-0.0004}
      />
      <directionalLight position={[-38, 26, -24]} intensity={0.22} color="#a9c4ff" />
      <pointLight position={[0, 28, -4]} intensity={10} distance={110} color="#ffeccb" />

      <Environment resolution={128} frames={1}>
        <Lightformer
          form="rect"
          intensity={2.8}
          position={[0, 12, -14]}
          scale={[30, 18, 1]}
          color="#fff6d8"
        />
        <Lightformer
          form="rect"
          intensity={1.6}
          position={[-14, 6, 8]}
          scale={[12, 20, 1]}
          color="#ffc79a"
        />
        <Lightformer
          form="rect"
          intensity={1.2}
          position={[14, 4, 6]}
          scale={[10, 14, 1]}
          color="#9fc2ff"
        />
      </Environment>

      <Suspense fallback={null}>
        <Assembly progressRef={progressRef}>
          <Board />
          <PcbCopper />
          {PARTS.map((part) => (
            <Part key={part.ref} part={part} progressRef={progressRef} />
          ))}
          <Annotations progressRef={progressRef} />
        </Assembly>
        <Ready onReady={onReady} />
      </Suspense>
      <CameraRig progressRef={progressRef} />
    </Canvas>
  )
}




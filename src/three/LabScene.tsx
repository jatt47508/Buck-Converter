import { Suspense, useEffect, useMemo, useRef } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Environment, Grid, Html, Lightformer, OrbitControls, useGLTF } from '@react-three/drei'
import * as THREE from 'three'
import { PART_BY_REF, PART_ORDER, PARTS, boardUrl, partUrl } from '../data/components'
import type { PartMeta } from '../data/components'
import { prepareModel } from './model'
import { PcbCopper } from './PcbCopper'

useGLTF.preload(boardUrl)
PARTS.forEach((p) => useGLTF.preload(partUrl(p)))

export type PresetKey = 'iso' | 'top' | 'side' | 'bottom'

const PRESETS: Record<PresetKey, { pos: [number, number, number]; target: [number, number, number] }> =
  {
    iso: { pos: [58, 48, 72], target: [0, 2, 0] },
    top: { pos: [0.01, 120, 0.01], target: [0, 0, 0] },
    side: { pos: [0, 14, 102], target: [0, 2, 0] },
    bottom: { pos: [0.01, -114, 0.01], target: [0, 0, 0] },
  }

function BoardClickCatcher({ onClear }: { onClear: () => void }) {
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
  return (
    <group onClick={(e) => {
      e.stopPropagation()
      onClear()
    }}>
      <primitive object={model} />
    </group>
  )
}

function Part({
  part,
  explode,
  selected,
  hovered,
  onHover,
  onSelect,
  labels,
}: {
  part: PartMeta
  explode: number
  selected: string | null
  hovered: string | null
  onHover: (ref: string | null) => void
  onSelect: (ref: string) => void
  labels: boolean
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

  const isSelected = selected === part.ref
  const isHovered = hovered === part.ref

  useEffect(() => {
    for (const m of materials) {
      if (!m.emissive) continue
      m.emissive.set(isSelected ? '#ff5c16' : isHovered ? '#8a3c10' : '#000000')
      m.emissiveIntensity = isSelected ? 0.5 : isHovered ? 0.28 : 0
    }
  }, [materials, isSelected, isHovered])

  useFrame(() => {
    const g = group.current
    if (!g) return
    const e = explode * 0.8
    g.position.set(
      part.pos[0] + part.explode[0] * e,
      part.pos[1] + part.explode[1] * e,
      part.pos[2] + part.explode[2] * e,
    )
  })

  return (
    <group
      ref={group}
      onPointerOver={(e) => {
        e.stopPropagation()
        onHover(part.ref)
        document.body.style.cursor = 'pointer'
      }}
      onPointerOut={() => {
        onHover(null)
        document.body.style.cursor = ''
      }}
      onClick={(e) => {
        e.stopPropagation()
        onSelect(part.ref)
      }}
    >
      <primitive object={model} />
      {labels && (
        <Html
          position={[0, part.top + 5, 0]}
          center
          zIndexRange={[30, 0]}
          style={{ pointerEvents: 'none' }}
        >
          <span className={`lab-label ${isSelected ? 'is-selected' : ''}`}>{part.ref}</span>
        </Html>
      )}
    </group>
  )
}

function ViewRig({ preset, viewTick }: { preset: PresetKey; viewTick: number }) {
  const controls = useRef<any>(null)
  const { camera, size } = useThree()

  useEffect(() => {
    const c = controls.current
    if (!c) return
    const next = PRESETS[preset]
    const fit = size.width < 760 ? 1.9 : size.width / size.height < 1.1 ? 1.3 : 1
    camera.position.set(next.pos[0] * fit, next.pos[1] * fit, next.pos[2] * fit)
    c.target.set(...next.target)
    c.update()
  }, [preset, viewTick, camera, size.width, size.height])

  return (
    <OrbitControls
      ref={controls}
      makeDefault
      enablePan={false}
      enableDamping
      dampingFactor={0.08}
      rotateSpeed={0.65}
      zoomSpeed={0.85}
      minDistance={34}
      maxDistance={240}
      maxPolarAngle={Math.PI * 0.98}
      target={[0, 2, 0]}
    />
  )
}

function Ready({ onReady }: { onReady: () => void }) {
  useEffect(() => {
    const t = window.setTimeout(onReady, 150)
    return () => window.clearTimeout(t)
  }, [onReady])
  return null
}

export function LabScene({
  preset,
  viewTick,
  explode,
  selected,
  hovered,
  labels,
  active,
  onHover,
  onSelect,
  onReady,
}: {
  preset: PresetKey
  viewTick: number
  explode: number
  selected: string | null
  hovered: string | null
  labels: boolean
  active: boolean
  onHover: (ref: string | null) => void
  onSelect: (ref: string | null) => void
  onReady: () => void
}) {
  return (
    <Canvas
      frameloop={active ? 'always' : 'never'}
      shadows
      dpr={[1, 1.8]}
      gl={{ antialias: true, alpha: true }}
      camera={{ fov: 32, near: 0.5, far: 800, position: [58, 48, 72] }}
      onPointerMissed={() => onSelect(null)}
      onCreated={({ gl }) => {
        gl.toneMapping = THREE.ACESFilmicToneMapping
        gl.toneMappingExposure = 0.94
      }}
    >
      <ambientLight intensity={0.32} />
      <directionalLight
        castShadow
        position={[55, 80, 40]}
        intensity={2.2}
        color="#fff4d8"
        shadow-mapSize={[1024, 1024]}
        shadow-camera-left={-50}
        shadow-camera-right={50}
        shadow-camera-top={50}
        shadow-camera-bottom={-50}
        shadow-bias={-0.0004}
      />
      <directionalLight position={[-45, 30, -30]} intensity={0.65} color="#ffb27a" />
      <pointLight position={[0, 30, 0]} intensity={26} distance={120} color="#ffe9a8" />

      <Environment resolution={128} frames={1}>
        <Lightformer
          form="rect"
          intensity={2.6}
          position={[0, 14, -16]}
          scale={[36, 22, 1]}
          color="#fff6d8"
        />
        <Lightformer
          form="rect"
          intensity={1.4}
          position={[-16, 8, 10]}
          scale={[14, 22, 1]}
          color="#ffc79a"
        />
        <Lightformer
          form="rect"
          intensity={1.1}
          position={[16, 5, 8]}
          scale={[12, 16, 1]}
          color="#9fc2ff"
        />
      </Environment>

      {preset !== 'bottom' && (
        <Grid
          position={[0, -10, 0]}
          args={[260, 260]}
          cellSize={4}
          cellThickness={0.5}
          cellColor="#302d25"
          sectionSize={20}
          sectionThickness={1}
          sectionColor="#4a4636"
          fadeDistance={250}
          fadeStrength={2}
          infiniteGrid
        />
      )}

      <Suspense fallback={null}>
        <BoardClickCatcher onClear={() => onSelect(null)} />
        <PcbCopper />
        {PART_ORDER.map((ref) => {
          const part = PART_BY_REF[ref]
          if (!part) return null
          return (
            <Part
              key={ref}
              part={part}
              explode={explode}
              selected={selected}
              hovered={hovered}
              labels={labels}
              onHover={onHover}
              onSelect={onSelect}
            />
          )
        })}
        <Ready onReady={onReady} />
      </Suspense>

      <ViewRig preset={preset} viewTick={viewTick} />
    </Canvas>
  )
}



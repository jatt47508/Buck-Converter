import * as THREE from 'three'

export function prepareModel(root: THREE.Object3D) {
  const clone = root.clone(true)
  clone.traverse((o) => {
    const mesh = o as THREE.Mesh
    if (!mesh.isMesh) return
    const cloneMat = (m: THREE.Material) => {
      const c = m.clone() as THREE.MeshStandardMaterial
      if ('envMapIntensity' in c) c.envMapIntensity = 0.55
      return c
    }
    mesh.material = Array.isArray(mesh.material)
      ? mesh.material.map(cloneMat)
      : cloneMat(mesh.material)
    mesh.castShadow = true
    mesh.receiveShadow = true
  })
  return clone
}

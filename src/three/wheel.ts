import * as THREE from 'three'
import {
  WHEEL_CENTER_Y,
  WHEEL_RIM_RADIUS,
  WHEEL_SCALE,
  WHEEL_TILT,
  WHEEL_Z,
} from './constants'
import type { Pocket } from '../types'
import { themeValue } from '../const/classes'
import { drawWheel } from './wheel-texture'

export const createWheel = (initialPockets: Pocket[]) => {
  let pockets = initialPockets
  const brass = themeValue('--color-brass')

  const canvas = document.createElement('canvas')
  drawWheel(canvas, pockets)

  const texture = new THREE.CanvasTexture(canvas)
  texture.colorSpace = THREE.SRGBColorSpace

  const group = new THREE.Group()

  // main wheel disk with the generated texture
  const disk = new THREE.Mesh(
    new THREE.CircleGeometry(8, 128),
    new THREE.MeshStandardMaterial({
      map: texture,
      roughness: 0.5,
      metalness: 0.2,
    }),
  )
  group.add(disk)

  // chrome rim
  const rim = new THREE.Mesh(
    new THREE.TorusGeometry(WHEEL_RIM_RADIUS, 0.35, 16, 128),
    new THREE.MeshStandardMaterial({
      color: themeValue('--color-rim'),
      metalness: 0.9,
      roughness: 0.3,
    }),
  )
  group.add(rim)

  // center boss
  const bossUnder = new THREE.Mesh(
    new THREE.CylinderGeometry(0.7, 0.5, 0.8, 128),
    new THREE.MeshStandardMaterial({
      color: brass,
      metalness: 0.9,
      roughness: 0.4,
    }),
  )
  bossUnder.rotation.x = Math.PI / 2
  bossUnder.position.set(0, 0, 0.15)
  group.add(bossUnder)

  const boss = new THREE.Mesh(
    new THREE.CylinderGeometry(0.35, 0.5, 4.2, 64),
    new THREE.MeshStandardMaterial({
      color: brass,
      metalness: 0.9,
      roughness: 0.5,
    }),
  )
  boss.rotation.x = Math.PI / 2
  boss.position.set(0, 0, 0.3)
  group.add(boss)

  const bossGlobe = new THREE.Mesh(
    new THREE.SphereGeometry(0.65, 64, 64),
    new THREE.MeshStandardMaterial({
      color: brass,
      roughness: 0.7,
      metalness: 0.5,
      emissive: brass,
      emissiveIntensity: 0.12,
    }),
  )
  bossGlobe.position.set(0, 0, 3)
  group.add(bossGlobe)

  // four arms with a ball, in a group that can turn on its own
  const arms = new THREE.Group()
  group.add(arms)

  const ARM_LENGTH = 2.3
  const arm = new THREE.CylinderGeometry(0.12, 0.12, ARM_LENGTH, 16)
  const tip = new THREE.SphereGeometry(0.27, 24, 16)

  for (let i = 0; i < 4; i++) {
    const angle = (i * Math.PI) / 2
    const [dx, dy] = [-Math.sin(angle), Math.cos(angle)]

    const mesh = new THREE.Mesh(arm, bossGlobe.material)
    mesh.position.set((dx * ARM_LENGTH) / 2, (dy * ARM_LENGTH) / 2, 3)
    mesh.rotation.z = angle
    arms.add(mesh)

    const end = new THREE.Mesh(tip, bossGlobe.material)
    end.position.set(dx * ARM_LENGTH, dy * ARM_LENGTH, 3)
    arms.add(end)
  }

  // wheel pose in the scene
  group.rotation.x = -WHEEL_TILT
  group.position.set(0, WHEEL_CENTER_Y, WHEEL_Z)
  group.scale.setScalar(WHEEL_SCALE)

  const redraw = (highlightIndex = -1) => {
    drawWheel(canvas, pockets, highlightIndex)
    texture.needsUpdate = true
  }

  const setPockets = (nextPockets: Pocket[]) => {
    pockets = nextPockets
    redraw()
  }

  const dispose = () => {
    group.traverse((object) => {
      if (!(object instanceof THREE.Mesh)) return
      object.geometry.dispose()
      object.material.dispose()
    })
    texture.dispose()
  }

  return { group, arms, redraw, setPockets, dispose }
}

import { themeValue } from '../utils/theme'
import gsap from 'gsap'
import * as THREE from 'three'
import {
  WHEEL_CENTER_Y,
  WHEEL_RIM_RADIUS,
  WHEEL_SCALE,
  WHEEL_TILT,
  WHEEL_Z,
} from './constants'
import type { Game } from '../types'
import { isReducedMotion, seconds } from '../animations/motion'
import { createStage } from './stage'
import { createWheel } from './wheel'

const TWO_PI = Math.PI * 2
const IDLE_SPEED = 0.06
const FULL_SPINS = 5

const POINTER_TOP_Y =
  WHEEL_CENTER_Y + WHEEL_RIM_RADIUS * WHEEL_SCALE * Math.cos(WHEEL_TILT)

const SPIN_DURATION = 9
const HIGHLIGHT_BEFORE_STOP = 2

type RouletteOptions = {
  onTick?: () => void
}

export const createRoulette = (
  container: HTMLElement,
  game: Game,
  { onTick }: RouletteOptions = {},
) => {
  const stage = createStage(container)
  const wheel = createWheel(game)
  stage.scene.add(wheel.group)

  const pointerColor = themeValue('--color-pointer')
  const pointerLight = new THREE.PointLight(pointerColor, 0, 18)
  pointerLight.position.set(0, POINTER_TOP_Y + 0.5, WHEEL_Z)

  const pointerGeometry = new THREE.ConeGeometry(0.2, 0.5, 64)
  const pointerMaterial = new THREE.MeshStandardMaterial({
    color: pointerColor,
    roughness: 0.7,
    metalness: 0.3,
    emissive: pointerColor,
    emissiveIntensity: 0.5,
  })
  const pointer = new THREE.Mesh(pointerGeometry, pointerMaterial)
  pointer.position.set(0, POINTER_TOP_Y, WHEEL_Z)
  pointer.rotation.x = Math.PI
  pointer.scale.set(0, 0, 0)

  stage.scene.add(pointer, pointerLight)

  let pockets = game.ruleset.pockets
  let spinSpeed = IDLE_SPEED
  let isSpinning = false
  let spinTimeline: gsap.core.Timeline | null = null
  let endTimeline: gsap.core.Timeline | null = null
  let highlightCall: gsap.core.Tween | null = null

  const rotateIdle = (_time: number, deltaTime: number) => {
    if (isReducedMotion()) return

    wheel.group.rotation.z -= (spinSpeed * deltaTime) / 1000
  }
  gsap.ticker.add(rotateIdle)

  const counterRotate = () => {
    wheel.arms.rotation.z = -1.4 * wheel.group.rotation.z
  }
  gsap.ticker.add(counterRotate)

  gsap.from(wheel.group.scale, {
    x: 0,
    y: 0,
    z: 0,
    duration: seconds(0.8),
    ease: 'back.out(1.7)',
  })

  const spin = (winningIndex: number) =>
    new Promise<void>((resolve, reject) => {
      if (isSpinning) {
        reject(new Error('the wheel is already spinning'))
        return
      }

      isSpinning = true
      spinSpeed = 0

      endTimeline?.kill()
      highlightCall?.kill()
      wheel.group.scale.setScalar(WHEEL_SCALE)
      pointer.position.y = POINTER_TOP_Y

      const slot = TWO_PI / pockets.length
      const target = winningIndex * slot + slot / 2
      const start = wheel.group.rotation.z

      const turns = Math.ceil((target - start + TWO_PI * FULL_SPINS) / TWO_PI)
      const finalRotation = target - turns * TWO_PI

      let lastRotation = start

      spinTimeline = gsap.timeline()

      spinTimeline.to(stage.camera.position, {
        z: stage.getProfile().SPIN,
        duration: seconds(1.5),
        ease: 'power2',
        onStart: () => {
          gsap.to(pointerLight, {
            intensity: 50,
            duration: seconds(SPIN_DURATION - 1),
          })
        },
      })

      spinTimeline.to(wheel.group.rotation, {
        z: finalRotation,
        duration: seconds(SPIN_DURATION),
        ease: 'power4.out',

        onStart: () => {
          wheel.redraw()

          gsap.to(pointer.scale, {
            x: 1,
            y: 1,
            z: 1,
            duration: seconds(1),
            ease: 'back.out(2)',
          })

          highlightCall = gsap.delayedCall(
            seconds(SPIN_DURATION - HIGHLIGHT_BEFORE_STOP),
            () => wheel.redraw(winningIndex),
          )
        },

        onUpdate: () => {
          const current = wheel.group.rotation.z
          const passed = Math.floor(Math.abs(current) / slot)
          const lastPassed = Math.floor(Math.abs(lastRotation) / slot)

          if (passed !== lastPassed) onTick?.()
          lastRotation = current
        },

        onComplete: () => {
          isSpinning = false
          resolve()

          endTimeline = gsap.timeline({
            onComplete: () => {
              wheel.clearOverlay()
              spinSpeed = IDLE_SPEED
            },
          })

          endTimeline.to(wheel.group.scale, {
            x: WHEEL_SCALE * 1.05,
            y: WHEEL_SCALE * 1.05,
            z: WHEEL_SCALE * 1.05,
            duration: seconds(0.3),
            yoyo: true,
            repeat: 1,
            ease: 'power1.inOut',
          })

          endTimeline.to(
            pointer.position,
            {
              y: POINTER_TOP_Y + 1.9,
              duration: seconds(0.4),
              ease: 'back.in(2)',
            },
            '<',
          )
          endTimeline.to(
            pointer.scale,
            { x: 0, y: 0, z: 0, duration: seconds(0.4), ease: 'back.in(2)' },
            '<',
          )
          endTimeline.to(pointerLight, { intensity: 0, duration: 0.4 }, '<')

          endTimeline.to(stage.camera.position, {
            z: stage.getProfile().REST,
            duration: seconds(1.5),
            ease: 'power2.inOut',
          })
        },
      })
    })

  const setGame = (next: Game) => {
    if (isSpinning) return

    pockets = next.ruleset.pockets
    wheel.setGame(next)
  }

  const dispose = () => {
    gsap.ticker.remove(rotateIdle)
    gsap.ticker.remove(counterRotate)

    spinTimeline?.kill()
    endTimeline?.kill()
    highlightCall?.kill()
    gsap.killTweensOf([
      wheel.group.scale,
      wheel.group.rotation,
      pointer.scale,
      pointer.position,
      pointerLight,
      stage.camera.position,
    ])

    pointerGeometry.dispose()
    pointerMaterial.dispose()
    wheel.dispose()
    stage.dispose()
  }

  return {
    spin,
    setOverlay: wheel.setOverlay,
    setGame,
    dispose,
  }
}

export type Roulette = ReturnType<typeof createRoulette>

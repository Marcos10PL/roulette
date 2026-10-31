import { defineStore } from 'pinia'
import { computed, shallowRef } from 'vue'
import type { Roulette } from '../three/roulette'
import type { WheelOverlay } from '../three/wheel-texture'

export const useWheelStore = defineStore('wheel', () => {
  const roulette = shallowRef<Roulette | null>(null)

  const isReady = computed(() => roulette.value !== null)

  const register = (instance: Roulette | null) => {
    roulette.value = instance
  }

  const spin = (winningIndex: number) => {
    if (!roulette.value) {
      return Promise.reject(new Error('the wheel is not ready'))
    }

    return roulette.value.spin(winningIndex)
  }

  const setOverlay = (overlay: WheelOverlay) =>
    roulette.value?.setOverlay(overlay)

  return { isReady, register, spin, setOverlay }
})

import { defineStore } from 'pinia'
import { ref } from 'vue'
import { SOUNDS } from '../const'
import type { SoundConfig, SoundName } from '../types'

const audio = Object.fromEntries(
  Object.entries(SOUNDS).map(([name, { file, volume }]) => {
    const sound = new Audio(`${import.meta.env.BASE_URL}${file}`)
    sound.volume = volume
    return [name, sound]
  }),
) as Record<SoundName, HTMLAudioElement>

export const useAudioStore = defineStore('audio', () => {
  const muted = ref(false)
  const lastPlayed: Partial<Record<SoundName, number>> = {}

  const toggleMute = () => {
    muted.value = !muted.value
  }

  const play = (name: SoundName) => {
    if (muted.value) return

    // some sounds fire very often
    const { minInterval = 0 }: SoundConfig = SOUNDS[name]
    const now = performance.now()
    if (now - (lastPlayed[name] ?? -Infinity) < minInterval) return
    lastPlayed[name] = now

    const sound = audio[name]
    sound.currentTime = 0

    // play() rejects when the browser blocks autoplay
    sound.play().catch(() => {})
  }

  return { muted, toggleMute, play }
})

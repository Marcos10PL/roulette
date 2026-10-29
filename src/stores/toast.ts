import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { Tone } from '../types'

const DURATION = 3000

type Toast = {
  id: number
  text: string
  tone: Tone
}

export const useToastStore = defineStore('toast', () => {
  const toast = ref<Toast | null>(null)

  let counter = 0
  let timer: ReturnType<typeof setTimeout> | undefined

  const show = (text: string, tone: Tone) => {
    clearTimeout(timer)

    toast.value = { id: ++counter, text, tone }
    timer = setTimeout(() => {
      toast.value = null
    }, DURATION)
  }

  return { toast, show }
})

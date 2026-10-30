import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { PocketColor, Tone } from '../types'

const DURATION = 3000

type ToastContent = {
  tone: Tone
  title: string
  text?: string
  amount?: string
  pocket?: { label: string; color: PocketColor }
}

type Toast = ToastContent & { id: number }

export const useToastStore = defineStore('toast', () => {
  const toast = ref<Toast | null>(null)

  let counter = 0
  let timer: ReturnType<typeof setTimeout> | undefined

  const show = (content: ToastContent) => {
    clearTimeout(timer)

    toast.value = { id: ++counter, ...content }
    timer = setTimeout(() => {
      toast.value = null
    }, DURATION)
  }

  return { toast, show }
})

<script setup lang="ts">
import { fadeIn, fadeOut } from '../animations/effects'
import { useToastStore } from '../stores/toast'
import Toast from './ui/Toast.vue'

const toastStore = useToastStore()

const onEnter = fadeIn({ duration: 0.3, y: -20, ease: 'back.out(1.5)' })
const onLeave = fadeOut({ duration: 0.25, y: -20 })
</script>

<template>
  <div
    class="pointer-events-none fixed inset-x-0 top-28 z-40 flex justify-center px-4"
    role="status"
    aria-live="polite"
  >
    <Transition :css="false" mode="out-in" @enter="onEnter" @leave="onLeave">
      <Toast
        v-if="toastStore.toast"
        :key="toastStore.toast.id"
        :tone="toastStore.toast.tone"
      >
        {{ toastStore.toast.text }}
      </Toast>
    </Transition>
  </div>
</template>

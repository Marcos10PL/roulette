<script setup lang="ts">
import gsap from 'gsap'
import { onBeforeUnmount, onMounted, useTemplateRef } from 'vue'
import { isReducedMotion } from '../../animations/motion'

const { count = 75 } = defineProps<{ count?: number }>()

const stars = Array.from({ length: count }, () => ({
  x: Math.random() * 100,
  y: Math.random() * 100,
  size: 1 + Math.random() * 1.5,
}))

const elements = useTemplateRef<HTMLElement[]>('elements')

let context: gsap.Context | undefined

onMounted(() => {
  if (isReducedMotion()) return

  context = gsap.context(() => {
    for (const element of elements.value ?? []) {
      gsap.fromTo(
        element,
        { opacity: 0.1 },
        {
          opacity: 0.4 + Math.random() * 0.6,
          duration: 1.5 + Math.random() * 3,
          delay: Math.random() * 3,
          repeat: -1,
          yoyo: true,
          ease: 'sine.inOut',
        },
      )
    }
  })
})

onBeforeUnmount(() => context?.revert())
</script>

<template>
  <div
    class="pointer-events-none absolute inset-0 overflow-hidden"
    aria-hidden="true"
  >
    <span
      v-for="(star, index) in stars"
      :key="index"
      ref="elements"
      class="absolute rounded-full bg-white opacity-50"
      :style="{
        left: `${star.x}%`,
        top: `${star.y}%`,
        width: `${star.size}px`,
        height: `${star.size}px`,
      }"
    />
  </div>
</template>

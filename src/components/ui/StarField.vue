<script setup lang="ts">
import { onBeforeUnmount, onMounted, useTemplateRef } from 'vue'
import { twinkleStars } from '../../animations/star-field'

const { count = 75 } = defineProps<{ count?: number }>()

const stars = Array.from({ length: count }, () => ({
  x: Math.random() * 100,
  y: Math.random() * 100,
  size: 1 + Math.random() * 1.5,
}))

const elements = useTemplateRef<HTMLElement[]>('elements')

let stopAnimation: (() => void) | undefined

onMounted(() => {
  stopAnimation = twinkleStars(elements.value ?? [])
})

onBeforeUnmount(() => stopAnimation?.())
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

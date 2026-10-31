<script setup lang="ts">
import type { BadgeSize } from '../../types'

const BADGE_SIZE_CLASSES: Record<BadgeSize, string> = {
  md: 'size-6 text-xs sm:size-7',
  lg: 'size-10 text-base',
} as const

const { size = 'md' } = defineProps<{ color: string; size?: BadgeSize }>()
</script>

<template>
  <span
    class="grid shrink-0 place-items-center rounded-full border-2 border-white/40 font-bold text-white"
    :class="BADGE_SIZE_CLASSES[size]"
    :style="{ background: color }"
  >
    <slot />
  </span>
</template>

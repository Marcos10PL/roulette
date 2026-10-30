<script setup lang="ts">
import type { BadgeSize } from '../../types'
import { BADGE_SIZE_CLASSES } from '../../const/classes'

const { size = 'md' } = defineProps<{ color: string; size?: BadgeSize }>()
</script>

<template>
  <span
    class="grid shrink-0 place-items-center rounded-full border border-white/40 font-bold text-white"
    :class="BADGE_SIZE_CLASSES[size]"
    :style="{ background: color }"
  >
    <slot />
  </span>
</template>

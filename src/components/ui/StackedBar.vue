<script setup lang="ts">
import { vGrow } from '../../directives/animate'
import type { StackedBarSegment } from '../../types'

defineProps<{
  segments: StackedBarSegment[]
  label: string
}>()
</script>

<template>
  <div
    class="flex h-3 overflow-hidden rounded-full border border-zinc-600 bg-zinc-800"
    role="img"
    :aria-label="label"
  >
    <div
      v-for="(segment, index) in segments"
      :key="index"
      v-grow="index * 0.1"
      :style="{ width: `${segment.share * 100}%`, background: segment.color }"
    />
  </div>
</template>

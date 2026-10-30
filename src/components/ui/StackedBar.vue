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
    class="flex h-2 overflow-hidden rounded-full bg-panel-raised sm:h-2.5"
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

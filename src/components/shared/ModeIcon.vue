<script setup lang="ts">
import { CircleDot, SlidersHorizontal, Star } from '@lucide/vue'
import type { Component } from 'vue'
import { MODE_ID } from '../../const'
import type { ModeId } from '../../types'

const MODE_ICONS: Record<ModeId, Component> = {
  [MODE_ID.STANDARD]: CircleDot,
  [MODE_ID.GOLDEN_SECTOR]: Star,
  [MODE_ID.CONTROL]: SlidersHorizontal,
}

defineProps<{ modeId: ModeId }>()
</script>

<template>
  <component :is="MODE_ICONS[modeId]" />
</template>

<script setup lang="ts">
import { POCKET_COLOR_HEX, POCKET_COLOR_LABEL } from '../const'
import type { BadgeSize, PocketColor } from '../types'
import Badge from './ui/Badge.vue'

defineProps<{ label: string; color: PocketColor; size?: BadgeSize }>()
</script>

<template>
  <Badge
    :color="POCKET_COLOR_HEX[color]"
    :size="size"
    :aria-label="`${label}, ${POCKET_COLOR_LABEL[color].toLowerCase()}`"
  >
    {{ label }}
  </Badge>
</template>

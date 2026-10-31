<script setup lang="ts">
import { POCKET_COLOR_LABEL, POCKET_COLOR_TOKEN } from '../const'
import type { BadgeSize, PocketColor } from '../types'
import { cssVar } from '../const/classes'
import Badge from './ui/Badge.vue'

defineProps<{ label: string; color: PocketColor; size?: BadgeSize }>()
</script>

<template>
  <Badge
    :color="cssVar(POCKET_COLOR_TOKEN[color])"
    :size="size"
    :aria-label="`${label}, ${POCKET_COLOR_LABEL[color].toLowerCase()}`"
  >
    {{ label }}
  </Badge>
</template>

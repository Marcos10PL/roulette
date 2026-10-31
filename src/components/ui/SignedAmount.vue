<script setup lang="ts">
import { formatSigned } from '../../utils/format'
import { TONE_TEXT_CLASSES, toneOf } from '../../utils/tone'

defineProps<{ value: number }>()
</script>

<template>
  <span :class="TONE_TEXT_CLASSES[toneOf(value)]">{{
    formatSigned(value)
  }}</span>
</template>

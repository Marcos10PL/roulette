<script setup lang="ts">
import { TONE } from '../../const'
import type { Tone } from '../../types'
import { TONE_TEXT_CLASSES } from '../../const/classes'

const { tone = TONE.NEUTRAL } = defineProps<{
  label: string
  value: string
  tone?: Tone
}>()
</script>

<template>
  <div class="flex flex-col gap-0.5 text-center">
    <span
      class="font-mono text-2xl font-bold sm:text-3xl"
      :class="TONE_TEXT_CLASSES[tone]"
    >
      {{ value }}
    </span>
    <span class="text-xs text-ink-3 sm:text-sm">{{ label }}</span>
  </div>
</template>

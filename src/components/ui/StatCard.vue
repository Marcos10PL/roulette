<script setup lang="ts">
import { TONE } from '../../const'
import type { Tone } from '../../types'
import { TONE_TEXT_CLASSES } from './classes'
import Card from './Card.vue'

const { tone = TONE.NEUTRAL } = defineProps<{
  label: string
  value: string
  tone?: Tone
}>()
</script>

<template>
  <Card>
    <p class="text-xs text-zinc-400">{{ label }}</p>
    <p class="text-lg font-bold" :class="TONE_TEXT_CLASSES[tone]">
      {{ value }}
    </p>
  </Card>
</template>

<script setup lang="ts">
import { TONE } from '../../const'
import type { Tone } from '../../types'
import { TONE_TEXT_CLASSES } from '../../utils/tone'

const TONE_BOX_CLASSES: Record<Tone, string> = {
  [TONE.POSITIVE]: 'border-win/40 from-win/20 shadow-glow-win',
  [TONE.NEGATIVE]: 'border-loss/40 from-loss/15 shadow-glow-loss',
  [TONE.NEUTRAL]: 'border-violet-hi/40 from-violet/25 shadow-glow-info',
} as const

const {
  tone = TONE.NEUTRAL,
  text = '',
  amount = '',
} = defineProps<{
  tone?: Tone
  title: string
  text?: string
  amount?: string
}>()
</script>

<template>
  <div
    class="flex w-full max-w-sm items-center gap-3.5 rounded-2xl border bg-linear-to-r via-panel via-40% to-panel px-4 py-3 text-left"
    :class="TONE_BOX_CLASSES[tone]"
  >
    <slot name="lead" />

    <div class="min-w-0">
      <p
        class="font-display text-xl leading-none font-extrabold tracking-widest text-ink uppercase"
      >
        {{ title }}
      </p>
      <p v-if="text" class="mt-1 text-sm text-ink-2">{{ text }}</p>
    </div>

    <span
      v-if="amount"
      class="ml-auto pl-2 font-mono text-2xl font-bold"
      :class="TONE_TEXT_CLASSES[tone]"
    >
      {{ amount }}
    </span>
  </div>
</template>

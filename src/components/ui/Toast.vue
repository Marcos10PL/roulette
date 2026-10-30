<script setup lang="ts">
import { TONE } from '../../const'
import type { Tone } from '../../types'
import { TONE_BOX_CLASSES, TONE_TEXT_CLASSES } from '../../const/classes'

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

<script setup lang="ts">
import { TONE } from '../../const'
import type { Tone } from '../../types'
import { TONE_BOX_CLASSES } from './classes'

const { tone = TONE.NEUTRAL } = defineProps<{ tone?: Tone }>()
</script>

<template>
  <p
    class="rounded-xl border px-5 py-3 text-center"
    :class="TONE_BOX_CLASSES[tone]"
  >
    <slot />
  </p>
</template>

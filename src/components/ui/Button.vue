<script setup lang="ts">
import { BUTTON_VARIANT } from '../../const'
import type { ButtonVariant } from '../../types'
import { BUTTON_VARIANT_CLASSES } from './classes'

const { variant = BUTTON_VARIANT.GHOST } = defineProps<{
  variant?: ButtonVariant
}>()
</script>

<template>
  <button
    type="button"
    class="flex cursor-pointer items-center justify-center gap-2 rounded-xl border px-4 py-2 text-sm text-white backdrop-blur-sm transition-[background-color,border-color,color,filter] enabled:active:brightness-90 motion-reduce:transition-none focus-ring disabled:cursor-not-allowed disabled:opacity-50"
    :class="BUTTON_VARIANT_CLASSES[variant]"
  >
    <slot />
  </button>
</template>

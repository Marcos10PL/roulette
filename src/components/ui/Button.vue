<script setup lang="ts">
import type { ButtonSize, ButtonVariant } from '../../types'
import {
  BUTTON_SIZE_CLASSES,
  BUTTON_VARIANT_CLASSES,
} from '../../const/classes'

const { variant = 'ghost', size = 'md' } = defineProps<{
  variant?: ButtonVariant
  size?: ButtonSize
}>()
</script>

<template>
  <button
    type="button"
    class="flex cursor-pointer items-center justify-center gap-2 rounded-full border backdrop-blur-sm transition-[background-color,border-color,color,filter] enabled:active:brightness-90 motion-reduce:transition-none focus-ring disabled:cursor-not-allowed disabled:opacity-50"
    :class="[BUTTON_VARIANT_CLASSES[variant], BUTTON_SIZE_CLASSES[size]]"
  >
    <slot />
  </button>
</template>

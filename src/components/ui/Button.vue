<script setup lang="ts">
import type { ButtonSize, ButtonVariant } from '../../types'

const BUTTON_SIZE_CLASSES: Record<ButtonSize, string> = {
  'icon-sm': 'size-8',
  icon: 'size-11',
  md: 'h-11 px-4.5 text-sm',
  lg: 'h-13 px-8 text-xl',
  xl: 'h-13 px-8 text-xl md:h-15 md:px-10 md:text-2xl',
} as const

const BUTTON_VARIANT_CLASSES: Record<ButtonVariant, string> = {
  primary:
    'border-transparent bg-violet text-white font-display font-extrabold tracking-widest uppercase shadow-glow-primary hover:bg-violet-hover',
  ghost:
    'border-line-strong bg-violet/10 text-ink hover:border-violet-hi hover:bg-violet/20',
  quiet:
    'border-violet-hi/15 bg-violet/15 text-ink-2 hover:border-violet-hi/35 hover:bg-violet/25 hover:text-ink',
  danger:
    'border-loss/20 bg-loss/10 text-loss hover:border-loss/40 hover:bg-loss/20',
} as const

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

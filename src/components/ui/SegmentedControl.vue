<script setup lang="ts" generic="T extends string">
import type { SegmentedOption } from '../../types'

const {
  options,
  label,
  disabled = false,
} = defineProps<{
  options: SegmentedOption<T>[]
  label: string
  disabled?: boolean
}>()

const model = defineModel<T>({ required: true })
</script>

<template>
  <div
    class="inline-flex gap-1 rounded-full border border-line bg-ground/60 p-1"
    role="group"
    :aria-label="label"
  >
    <button
      v-for="option in options"
      :key="option.value"
      type="button"
      :disabled="disabled"
      :aria-label="option.ariaLabel"
      :aria-pressed="model === option.value"
      class="h-8 flex-1 cursor-pointer rounded-full px-3.5 text-sm text-ink-3 transition-colors hover:text-ink focus-ring disabled:cursor-not-allowed disabled:opacity-50 aria-pressed:bg-violet aria-pressed:text-white motion-reduce:transition-none"
      @click="model = option.value"
    >
      {{ option.label }}
    </button>
  </div>
</template>

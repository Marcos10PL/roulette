<script setup lang="ts" generic="T extends string">
import type { SegmentedOption } from '../../types'
import Button from './Button.vue'

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
  <div class="flex gap-1" role="group" :aria-label="label">
    <Button
      v-for="option in options"
      :key="option.value"
      :disabled="disabled"
      :aria-label="option.ariaLabel"
      :aria-pressed="model === option.value"
      class="px-3 py-1 text-xs"
      :class="{ 'ring-2 ring-white': model === option.value }"
      @click="model = option.value"
    >
      {{ option.label }}
    </Button>
  </div>
</template>

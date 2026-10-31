<script setup lang="ts">
import Card from './Card.vue'

const {
  active = false,
  disabled = false,
  aside = '',
  note = '',
} = defineProps<{
  title: string
  description: string
  active?: boolean
  disabled?: boolean
  aside?: string
  note?: string
}>()
</script>

<template>
  <Card
    tag="button"
    type="button"
    :active="active"
    :aria-pressed="active"
    :disabled="disabled"
    class="flex w-full cursor-pointer flex-col gap-1 text-left transition-colors focus-ring disabled:cursor-not-allowed disabled:opacity-60"
    :class="active ? 'enabled:hover:bg-violet/30' : 'enabled:hover:bg-white/8'"
  >
    <span class="flex items-baseline justify-between gap-2">
      <span class="flex items-center gap-2">
        <slot name="icon" />
        <span
          class="font-display text-xl font-extrabold tracking-widest uppercase"
        >
          {{ title }}
        </span>
      </span>
      <span v-if="aside" class="font-mono text-base text-gold">
        {{ aside }}
      </span>
    </span>
    <span class="text-sm text-ink-2">{{ description }}</span>
    <span v-if="note" class="text-sm text-loss">{{ note }}</span>
  </Card>
</template>

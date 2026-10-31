<script setup lang="ts">
const SUMMARY_BAR_CLASSES = {
  3: { grid: 'grid-cols-3', item: 'not-first:border-l' },
  4: {
    grid: 'grid-cols-2 gap-y-3 sm:grid-cols-4',
    item: 'even:border-l sm:nth-3:border-l',
  },
} as const

const { items } = defineProps<{
  items: { label: string; value: string; class?: string }[]
}>()

const layout = SUMMARY_BAR_CLASSES[items.length === 4 ? 4 : 3]
</script>

<template>
  <div class="mx-auto grid w-full max-w-140 text-center" :class="layout.grid">
    <div
      v-for="item in items"
      :key="item.label"
      class="flex flex-col gap-0.5 border-violet-hi/15"
      :class="layout.item"
    >
      <span class="text-xs text-ink-3 sm:text-sm">{{ item.label }}</span>
      <strong class="font-mono text-lg sm:text-xl" :class="item.class">
        {{ item.value }}
      </strong>
    </div>
  </div>
</template>

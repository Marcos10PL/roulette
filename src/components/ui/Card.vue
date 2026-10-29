<script setup lang="ts">
const { tag = 'div', active = false } = defineProps<{
  tag?: string
  active?: boolean
}>()
</script>

<template>
  <component
    :is="tag"
    class="rounded-lg border px-3 py-2"
    :class="active ? 'border-yellow-500' : 'border-zinc-700'"
  >
    <slot />
  </component>
</template>

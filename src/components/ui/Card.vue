<script setup lang="ts">
const { tag = 'div', active = false } = defineProps<{
  tag?: string
  active?: boolean
}>()
</script>

<template>
  <component
    :is="tag"
    class="rounded-lg px-3.5 py-3 sm:px-4"
    :class="
      active ? 'bg-violet/20 ring-1 ring-violet ring-inset' : 'bg-white/3'
    "
  >
    <slot />
  </component>
</template>

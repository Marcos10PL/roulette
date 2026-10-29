<script setup lang="ts">
defineProps<{ color: string }>()
</script>

<template>
  <span
    class="grid size-6 shrink-0 place-items-center rounded-full border border-white/40 text-[10px] font-bold text-white sm:size-7 sm:text-xs"
    :style="{ background: color }"
  >
    <slot />
  </span>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { RECENT_RESULTS_COUNT } from '../const'
import { useHistoryStore } from '../stores/history'
import ResultBadge from './ResultBadge.vue'

const history = useHistoryStore()

const recent = computed(() =>
  history.playerRecords.slice(0, RECENT_RESULTS_COUNT),
)
</script>

<template>
  <div
    v-if="recent.length"
    class="pointer-events-none fixed inset-x-0 top-14 z-10 flex flex-col items-center gap-1 px-4"
  >
    <p class="text-xs tracking-widest text-zinc-400 uppercase mb-1">
      {{ RECENT_RESULTS_COUNT }} ostatnich wyników
    </p>

    <TransitionGroup
      tag="ol"
      appear
      class="flex justify-center gap-1"
      aria-label="Ostatnie wyniki"
      enter-from-class="-translate-x-6 opacity-0"
      enter-active-class="transition duration-300 motion-reduce:transition-none"
      leave-active-class="absolute transition duration-200 motion-reduce:transition-none"
      leave-to-class="opacity-0"
      move-class="transition duration-300 motion-reduce:transition-none"
    >
      <li
        v-for="(record, index) in recent"
        :key="record.at"
        :class="{ 'scale-125': index === 0 }"
      >
        <ResultBadge :label="record.label" :color="record.color" />
      </li>
    </TransitionGroup>
  </div>
</template>

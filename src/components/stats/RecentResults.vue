<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { computed } from 'vue'
import { useHistoryStore } from '../../stores/history'
import { useRoundStore } from '../../stores/round'
import ResultBadge from '../shared/ResultBadge.vue'
import SignedAmount from '../ui/SignedAmount.vue'

const RECENT_RESULTS_COUNT = 5

const { playerRecords, stats } = storeToRefs(useHistoryStore())
const { isSpinning } = storeToRefs(useRoundStore())

const recent = computed(() =>
  playerRecords.value.slice(0, RECENT_RESULTS_COUNT),
)
</script>

<template>
  <div
    v-if="recent.length"
    class="pointer-events-none fixed inset-x-0 top-18 z-10 flex flex-col items-center gap-2 px-4 transition-opacity duration-300 sm:top-6 panels:hidden motion-reduce:transition-none"
    :class="isSpinning ? 'opacity-0' : 'opacity-100 delay-1500'"
  >
    <TransitionGroup
      tag="ol"
      appear
      class="flex items-center justify-center gap-1"
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
        class="mx-px"
        :class="{ 'scale-120 mr-1': index === 0 }"
      >
        <ResultBadge :label="record.label" :color="record.color" />
      </li>
    </TransitionGroup>

    <p class="text-xs text-ink-3">
      Rundy
      <strong class="font-mono text-ink">{{ stats.rounds }}</strong>
      · Bilans
      <SignedAmount :value="stats.netTotal" class="font-mono font-bold" />
    </p>
  </div>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { CHIPS } from '../const'
import { cssVar } from '../const/classes'
import { vStagger } from '../directives/animate'
import { useAudioStore } from '../stores/audio'
import { useRoundStore } from '../stores/round'

const roundStore = useRoundStore()
const { availableBalance, selectedChip } = storeToRefs(roundStore)
const { selectChip } = roundStore
const { play } = useAudioStore()

const select = (value: number) => {
  selectChip(value)
  play('MONEY_PICK')
}
</script>

<template>
  <div
    v-stagger="{ scale: 0.6, y: 10, amount: 0.2 }"
    class="flex flex-wrap justify-center gap-2 sm:gap-3"
    role="group"
    aria-label="Wybór żetonu"
  >
    <button
      v-for="chip in CHIPS"
      :key="chip.value"
      type="button"
      :disabled="chip.value > availableBalance"
      :aria-pressed="selectedChip === chip.value"
      class="size-10.5 cursor-pointer rounded-full focus-ring disabled:cursor-not-allowed disabled:opacity-40 sm:size-13"
      @click="select(chip.value)"
    >
      <span
        class="relative grid size-full place-items-center rounded-full transition-[translate,box-shadow] before:absolute before:inset-0.75 before:rounded-full before:border-2 before:border-dashed before:border-white/55 sm:before:inset-1 sm:before:border-3 motion-reduce:transition-none"
        :class="{
          '-translate-y-1 ring-2 ring-cyan ring-offset-2 ring-offset-ground':
            selectedChip === chip.value,
        }"
        :style="{ background: cssVar(chip.token) }"
      >
        <span
          class="relative grid size-6.5 place-items-center rounded-full bg-chip-core font-mono text-xs font-bold text-white sm:size-8 sm:text-xs"
        >
          {{ chip.value }}
        </span>
      </span>
    </button>
  </div>
</template>

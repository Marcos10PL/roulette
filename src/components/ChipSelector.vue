<script setup lang="ts">
import { CHIPS } from '../const'
import { vStagger } from '../directives/animate'
import { useAudioStore } from '../stores/audio'
import { useRoundStore } from '../stores/round'

const roundStore = useRoundStore()
const audio = useAudioStore()

const select = (value: number) => {
  roundStore.selectChip(value)
  audio.play('MONEY_PICK')
}
</script>

<template>
  <div
    v-stagger="{ scale: 0.6, y: 10, amount: 0.2 }"
    class="flex flex-wrap justify-center gap-2"
    role="group"
    aria-label="Wybór żetonu"
  >
    <button
      v-for="chip in CHIPS"
      :key="chip.value"
      type="button"
      :disabled="chip.value > roundStore.availableBalance"
      :aria-pressed="roundStore.selectedChip === chip.value"
      class="size-11 cursor-pointer rounded-full focus-ring disabled:cursor-not-allowed disabled:opacity-40"
      @click="select(chip.value)"
    >
      <span
        class="grid size-full place-items-center rounded-full border-2 border-white/40 text-xs font-bold transition-[scale,box-shadow]"
        :class="{
          'scale-110 ring-2 ring-white': roundStore.selectedChip === chip.value,
        }"
        :style="{
          background: chip.color,
          color: chip.textDark ? '#000' : '#fff',
        }"
      >
        {{ chip.value }}
      </span>
    </button>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { enterFrom, leaveTo } from '../animations/effects'
import { useAudioStore } from '../stores/audio'
import { useRoundStore } from '../stores/round'
import { useSettingsStore } from '../stores/settings'
import { formatChipAmount } from '../utils/format'
import { getTableCells, TABLE_GRID_STYLE } from '../utils/table-layout'

const settings = useSettingsStore()
const roundStore = useRoundStore()
const audio = useAudioStore()

const cells = computed(() => getTableCells(settings.ruleset))

const popIn = enterFrom({ scale: 0 }, { duration: 0.35, ease: 'back.out(3)' })
const shrinkAway = leaveTo({ scale: 0 }, { duration: 0.15 })

const place = (betId: string) => {
  if (roundStore.placeBet(betId)) audio.play('MONEY_PICK')
}
</script>

<template>
  <div class="overflow-x-auto overflow-y-hidden p-1.5">
    <div class="grid min-w-136 gap-px" :style="TABLE_GRID_STYLE">
      <button
        v-for="cell in cells"
        :key="cell.bet.id"
        type="button"
        :disabled="roundStore.isSpinning"
        :style="cell.style"
        :aria-label="cell.ariaLabel"
        class="relative flex cursor-pointer items-center justify-center border border-zinc-700 text-[11px] leading-none font-bold text-white hover:brightness-125 focus-visible:z-10 focus-visible:outline-2 focus-visible:outline-white disabled:cursor-not-allowed sm:text-sm"
        @click="place(cell.bet.id)"
      >
        {{ cell.bet.label }}

        <Transition :css="false" @enter="popIn" @leave="shrinkAway">
          <span
            v-if="roundStore.getBetAmount(cell.bet.id)"
            class="absolute -top-1 -right-1 z-10 grid min-w-5 place-items-center rounded-full border border-white bg-yellow-400 px-1 text-[9px] font-bold text-black"
          >
            {{ formatChipAmount(roundStore.getBetAmount(cell.bet.id)) }}
          </span>
        </Transition>
      </button>
    </div>
  </div>
</template>

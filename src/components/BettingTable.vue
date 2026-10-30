<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { computed } from 'vue'
import { enterFrom, leaveTo } from '../animations/effects'
import { useAudioStore } from '../stores/audio'
import { useRoundStore } from '../stores/round'
import { useSettingsStore } from '../stores/settings'
import { formatChipAmount } from '../utils/format'
import { getTableCells, TABLE_GRID_STYLE } from '../utils/table-layout'

const { ruleset } = storeToRefs(useSettingsStore())
const roundStore = useRoundStore()
const { isSpinning } = storeToRefs(roundStore)
const { placeBet, getBetAmount } = roundStore
const { play } = useAudioStore()

const cells = computed(() => getTableCells(ruleset.value))

const popIn = enterFrom({ scale: 0 }, { duration: 0.35, ease: 'back.out(3)' })
const shrinkAway = leaveTo({ scale: 0 }, { duration: 0.15 })

const place = (betId: string) => {
  if (placeBet(betId)) play('MONEY_PICK')
}
</script>

<template>
  <div class="overflow-x-auto overflow-y-hidden px-1 pt-2 pb-1 sm:p-1.5">
    <div
      class="grid min-w-136 gap-0.75 [--row-number:16px] [--row-outside:30px] sm:[--row-number:20px] sm:[--row-outside:36px]"
      :style="TABLE_GRID_STYLE"
    >
      <button
        v-for="cell in cells"
        :key="cell.bet.id"
        type="button"
        :disabled="isSpinning"
        :style="cell.style"
        :aria-label="cell.ariaLabel"
        class="relative flex cursor-pointer items-center justify-center rounded-md select-none text-xs leading-none font-bold text-white hover:z-10 hover:brightness-125 focus-visible:z-10 focus-visible:outline-2 focus-visible:outline-cyan disabled:cursor-not-allowed sm:text-sm"
        :class="
          cell.bet.color
            ? ''
            : 'font-normal tracking-[-0.09rem] text-ink-2 ring-1 ring-line-strong ring-inset'
        "
        @click="place(cell.bet.id)"
      >
        {{ cell.bet.label }}

        <Transition :css="false" @enter="popIn" @leave="shrinkAway">
          <span
            v-if="getBetAmount(cell.bet.id)"
            class="absolute -top-1.5 -right-1.5 z-50 grid h-5.5 min-w-5.5 place-items-center rounded-full bg-gold px-1 font-mono text-xs font-bold text-gold-ink ring-2 ring-ground"
          >
            {{ formatChipAmount(getBetAmount(cell.bet.id)) }}
          </span>
        </Transition>
      </button>
    </div>
  </div>
</template>

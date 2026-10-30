<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { computed } from 'vue'
import { ODDS } from '../const'
import { usePlayRound } from '../composables/usePlayRound'
import { vStagger } from '../directives/animate'
import { useRoundStore } from '../stores/round'
import { formatMoneyAmount, formatSigned } from '../utils/format'
import Button from './ui/Button.vue'
import Modal from './ui/Modal.vue'
import BettingTable from './BettingTable.vue'
import ChipSelector from './ChipSelector.vue'

const open = defineModel<boolean>({ required: true })

const roundStore = useRoundStore()
const { availableBalance, totalBet, maxWin, canClear, canConfirm } =
  storeToRefs(roundStore)
const { clearBets } = roundStore
const { play } = usePlayRound()

const oddsLegend = `Liczba ${ODDS.NUMBER}:1 · Tuzin / Kolumna ${ODDS.DOZEN_COLUMN}:1 · Pozostałe ${ODDS.EVEN_MONEY}:1`

const summary = computed(() => [
  {
    label: 'Saldo',
    value: formatMoneyAmount(availableBalance.value),
    class: 'text-gold',
  },
  { label: 'Zakład', value: formatMoneyAmount(totalBet.value), class: '' },
  {
    label: 'Maks. zysk',
    value: maxWin.value > 0 ? formatSigned(maxWin.value) : '—',
    class: 'text-win',
  },
])

const spin = () => {
  open.value = false
  play()
}
</script>

<template>
  <Modal v-model="open" title="Pokrycie stołu" size="lg">
    <div class="flex flex-col gap-3 sm:gap-4">
      <div class="mx-auto grid w-full max-w-140 grid-cols-3 text-center">
        <div
          v-for="item in summary"
          :key="item.label"
          class="flex flex-col gap-0.5 nth-2:border-x nth-2:border-violet-hi/15"
        >
          <span class="text-xs text-ink-3 sm:text-sm">{{ item.label }}</span>
          <strong class="font-mono text-lg sm:text-xl" :class="item.class">
            {{ item.value }}
          </strong>
        </div>
      </div>

      <BettingTable
        v-stagger="{ selector: 'button', scale: 0.1, y: 40, from: 'center' }"
      />

      <p class="text-center text-xs text-ink-3 sm:text-xs">
        {{ oddsLegend }}
      </p>

      <ChipSelector />
    </div>

    <template #footer>
      <Button :disabled="!canClear" @click="clearBets"> Wyczyść </Button>
      <Button variant="primary" size="lg" :disabled="!canConfirm" @click="spin">
        Kręć!
      </Button>
    </template>
  </Modal>
</template>

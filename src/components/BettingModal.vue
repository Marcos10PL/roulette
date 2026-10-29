<script setup lang="ts">
import { BUTTON_VARIANT, ODDS } from '../const'
import { usePlayRound } from '../composables/usePlayRound'
import { vStagger } from '../directives/animate'
import { useRoundStore } from '../stores/round'
import { formatMoneyAmount } from '../utils/format'
import Button from './ui/Button.vue'
import Modal from './ui/Modal.vue'
import BettingTable from './BettingTable.vue'
import ChipSelector from './ChipSelector.vue'

const open = defineModel<boolean>({ required: true })

const roundStore = useRoundStore()
const { play } = usePlayRound()

const oddsLegend = `Liczba ${ODDS.NUMBER}:1 · Tuzin / Kolumna ${ODDS.DOZEN_COLUMN}:1 · Pozostałe ${ODDS.EVEN_MONEY}:1`

const spin = () => {
  open.value = false
  play()
}
</script>

<template>
  <Modal v-model="open" title="Pokrycie stołu" wide>
    <div class="mb-3 flex justify-between text-sm">
      <span>
        Saldo:
        <strong class="text-yellow-400">
          {{ formatMoneyAmount(roundStore.availableBalance) }}
        </strong>
      </span>
      <span>
        Zakład:
        <strong>{{ formatMoneyAmount(roundStore.totalBet) }}</strong>
      </span>
    </div>

    <BettingTable
      v-stagger="{ selector: 'button', scale: 0.1, y: 40, from: 'center' }"
    />

    <p class="mt-2 text-center text-xs text-zinc-400">{{ oddsLegend }}</p>

    <ChipSelector class="mt-4" />

    <template #footer>
      <Button :disabled="!roundStore.canClear" @click="roundStore.clearBets">
        Wyczyść
      </Button>
      <Button
        :variant="BUTTON_VARIANT.PRIMARY"
        :disabled="!roundStore.canConfirm"
        @click="spin"
      >
        Kręć!
      </Button>
      <Button @click="open = false">Anuluj</Button>
    </template>
  </Modal>
</template>

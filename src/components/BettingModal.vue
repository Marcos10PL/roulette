<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { computed } from 'vue'
import { BET_KIND } from '../const'
import { usePlayRound } from '../composables/usePlayRound'
import { useRoundSummary } from '../composables/useRoundSummary'
import { vStagger } from '../directives/animate'
import { useRoundStore } from '../stores/round'
import { useSettingsStore } from '../stores/settings'
import Button from './ui/Button.vue'
import Modal from './ui/Modal.vue'
import SummaryBar from './ui/SummaryBar.vue'
import BettingTable from './BettingTable.vue'
import ChipSelector from './ChipSelector.vue'

const open = defineModel<boolean>({ required: true })
const emit = defineEmits<{ boosts: [] }>()

const roundStore = useRoundStore()
const { canClear, canConfirm } = storeToRefs(roundStore)
const { clearBets } = roundStore
const { play } = usePlayRound()

const { mode } = storeToRefs(useSettingsStore())

const { balance, bet, maxWin } = useRoundSummary()
const summary = computed(() => [balance.value, bet.value, maxWin.value])

const confirm = () => {
  open.value = false

  if (mode.value.boosts.length) emit('boosts')
  else play()
}
</script>

<template>
  <Modal v-model="open" title="Pokrycie stołu" size="lg">
    <div class="flex flex-col gap-3 sm:gap-4">
      <SummaryBar :items="summary" />

      <BettingTable
        v-stagger="{ selector: 'button', scale: 0.1, y: 40, from: 'center' }"
      />

      <p class="text-center text-xs text-ink-3 sm:text-xs">
        Liczba {{ mode.odds[BET_KIND.NUMBER] }}:1 ·
        <template v-if="mode.goldenOdds">
          <span class="text-gold">Złoty sektor {{ mode.goldenOdds }}:1</span>
          ·
        </template>
        Tuzin / Kolumna {{ mode.odds[BET_KIND.DOZEN] }}:1 · Pozostałe
        {{ mode.odds[BET_KIND.OUTSIDE] }}:1
      </p>

      <ChipSelector />
    </div>

    <template #footer>
      <Button :disabled="!canClear" @click="clearBets"> Wyczyść </Button>
      <Button
        variant="primary"
        size="lg"
        :disabled="!canConfirm"
        @click="confirm"
      >
        {{ mode.boosts.length ? 'Dalej' : 'Kręć!' }}
      </Button>
    </template>
  </Modal>
</template>

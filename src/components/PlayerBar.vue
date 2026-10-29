<script setup lang="ts">
import {
  Coins,
  History,
  Medal,
  Trash2,
  UserPen,
  Volume2,
  VolumeX,
} from '@lucide/vue'
import { ref, useTemplateRef, watch } from 'vue'
import { flash } from '../animations/effects'
import { BALANCE_FLASH, BUTTON_VARIANT } from '../const'
import { useCountUp } from '../composables/useCountUp'
import { vStagger } from '../directives/animate'
import { useAudioStore } from '../stores/audio'
import { usePlayerStore } from '../stores/player'
import { useRoundStore } from '../stores/round'
import { formatMoneyAmount } from '../utils/format'
import Button from './ui/Button.vue'
import ConfirmModal from './ui/ConfirmModal.vue'
import HistoryModal from './HistoryModal.vue'
import LeaderboardModal from './LeaderboardModal.vue'

const playerStore = usePlayerStore()
const audio = useAudioStore()
const roundStore = useRoundStore()

const leaderboardOpen = ref(false)
const historyOpen = ref(false)
const resetOpen = ref(false)

const shownBalance = useCountUp(() => roundStore.displayedBalance)
const balanceElement = useTemplateRef<HTMLElement>('balanceElement')

watch(
  () => roundStore.displayedBalance,
  (next, previous) => {
    if (balanceElement.value)
      flash(
        balanceElement.value,
        {
          color: next > previous ? BALANCE_FLASH.GAIN : BALANCE_FLASH.LOSS,
          scale: 1.15,
        },
        { color: BALANCE_FLASH.REST, scale: 1 },
        { duration: 0.9 },
      )
  },
)
</script>

<template>
  <header
    v-stagger="{ y: -16 }"
    class="fixed inset-x-0 top-0 z-10 flex items-start justify-between gap-2 p-4 text-white"
  >
    <div class="flex gap-2">
      <Button @click="leaderboardOpen = true">
        <Medal :size="16" />
        TOP
      </Button>
      <Button aria-label="Historia i statystyki" @click="historyOpen = true">
        <History :size="16" />
      </Button>
      <Button
        :aria-label="audio.muted ? 'Włącz dźwięk' : 'Wycisz dźwięk'"
        :aria-pressed="audio.muted"
        @click="audio.toggleMute"
      >
        <VolumeX v-if="audio.muted" :size="16" />
        <Volume2 v-else :size="16" />
      </Button>
    </div>

    <div
      class="flex items-center gap-2 rounded-xl border border-yellow-500 bg-zinc-900/80 px-4 py-2 text-yellow-400"
    >
      <span ref="balanceElement">{{ formatMoneyAmount(shownBalance) }}</span>
      <Coins :size="16" />
    </div>
  </header>

  <div
    v-stagger="{ y: 16 }"
    class="fixed right-4 bottom-4 z-10 flex flex-col gap-2"
  >
    <Button
      :disabled="roundStore.isSpinning"
      aria-label="Zmień gracza"
      title="Zmień gracza"
      @click="playerStore.switchPlayer"
    >
      <UserPen :size="18" />
    </Button>
    <Button
      :variant="BUTTON_VARIANT.DANGER"
      :disabled="roundStore.isSpinning"
      aria-label="Usuń dane i zakończ grę"
      title="Usuń dane i zakończ grę"
      @click="resetOpen = true"
    >
      <Trash2 :size="18" />
    </Button>
  </div>

  <LeaderboardModal v-model="leaderboardOpen" />
  <HistoryModal v-model="historyOpen" />

  <ConfirmModal
    v-model="resetOpen"
    title="Usunąć dane gracza?"
    confirm-label="Usuń"
    danger
    @confirm="playerStore.resetPlayer"
  >
    <p class="text-center text-zinc-300">
      Stracisz saldo i swój wynik w rankingu. Tej operacji nie można cofnąć.
    </p>
  </ConfirmModal>
</template>

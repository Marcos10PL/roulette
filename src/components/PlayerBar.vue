<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { Coins, Trash2, UserPen } from '@lucide/vue'
import { ref, useTemplateRef, watch } from 'vue'
import { flash } from '../animations/effects'
import { BALANCE_FLASH } from '../const'
import { useCountUp } from '../composables/useCountUp'
import { vStagger } from '../directives/animate'
import { usePlayerStore } from '../stores/player'
import { useRoundStore } from '../stores/round'
import { formatMoneyAmount } from '../utils/format'
import { themeValue } from '../const/classes'
import Button from './ui/Button.vue'
import ConfirmModal from './ui/ConfirmModal.vue'

const { switchPlayer, resetPlayer } = usePlayerStore()
const { displayedBalance, isSpinning } = storeToRefs(useRoundStore())

const resetOpen = ref(false)

const shownBalance = useCountUp(() => displayedBalance.value)
const balanceElement = useTemplateRef<HTMLElement>('balanceElement')

watch(displayedBalance, (next, previous) => {
  if (balanceElement.value)
    flash(
      balanceElement.value,
      {
        color: themeValue(
          next > previous ? BALANCE_FLASH.GAIN : BALANCE_FLASH.LOSS,
        ),
        scale: 1.15,
      },
      { color: themeValue(BALANCE_FLASH.REST), scale: 1 },
      { duration: 0.9 },
    )
})
</script>

<template>
  <header
    v-stagger="{ y: -16 }"
    class="fixed inset-x-0 top-0 z-10 flex items-center justify-between p-3 sm:p-6"
  >
    <div class="flex gap-2">
      <Button
        variant="quiet"
        size="icon-sm"
        :disabled="isSpinning"
        aria-label="Zmień gracza"
        title="Zmień gracza"
        @click="switchPlayer"
      >
        <UserPen :size="18" />
      </Button>
      <Button
        variant="danger"
        size="icon-sm"
        :disabled="isSpinning"
        aria-label="Usuń dane i zakończ grę"
        title="Usuń dane i zakończ grę"
        @click="resetOpen = true"
      >
        <Trash2 :size="18" />
      </Button>
    </div>

    <div class="flex items-center gap-2.5">
      <span
        ref="balanceElement"
        class="font-mono text-xl font-bold text-gold tabular-nums sm:text-2xl"
        :aria-label="`Saldo: ${formatMoneyAmount(displayedBalance)} monet`"
      >
        {{ formatMoneyAmount(shownBalance) }}
      </span>
      <span
        class="grid size-10 place-items-center rounded-full bg-gold/12 text-gold"
      >
        <Coins :size="20" />
      </span>
    </div>
  </header>

  <ConfirmModal
    v-model="resetOpen"
    title="Usunąć dane gracza?"
    confirm-label="Usuń"
    danger
    @confirm="resetPlayer"
  >
    <p class="text-center text-ink-2">
      Po tej operacji stracisz swoje saldo i wynik w rankingu. Tego nie można
      cofnąć.
    </p>
  </ConfirmModal>
</template>

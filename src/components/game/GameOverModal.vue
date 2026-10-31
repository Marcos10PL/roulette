<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { START_BALANCE } from '../../const'
import { useRoundStore } from '../../stores/round'
import { formatMoneyAmount } from '../../utils/format'
import Button from '../ui/Button.vue'
import Modal from '../ui/Modal.vue'

const { gameOverOpen } = storeToRefs(useRoundStore())
</script>

<template>
  <Modal v-model="gameOverOpen" title="Koniec gry">
    <p class="text-center text-ink-2">
      Niestety przegrałeś. Nie masz już środków do grania. Twoje konto zostało
      zresetowane do {{ formatMoneyAmount(START_BALANCE) }} monet.
    </p>

    <template #footer>
      <Button @click="gameOverOpen = false">Rozumiem</Button>
    </template>
  </Modal>
</template>

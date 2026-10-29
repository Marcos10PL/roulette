<script setup lang="ts">
import { START_BALANCE } from '../const'
import { useRoundStore } from '../stores/round'
import { formatMoneyAmount } from '../utils/format'
import Modal from './ui/Modal.vue'

const roundStore = useRoundStore()
</script>

<template>
  <Modal v-model="roundStore.gameOverOpen" title="Koniec gry">
    <p class="text-center text-zinc-300">
      Niestety przegrałeś. Nie masz już środków do grania. Twoje konto zostało
      zresetowane do {{ formatMoneyAmount(START_BALANCE) }} monet.
    </p>
  </Modal>
</template>

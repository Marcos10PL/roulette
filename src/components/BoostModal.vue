<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { computed, watch } from 'vue'
import { usePlayRound } from '../composables/usePlayRound'
import { useRoundSummary } from '../composables/useRoundSummary'
import { useRoundStore } from '../stores/round'
import BoostPicker from './BoostPicker.vue'
import Button from './ui/Button.vue'
import Modal from './ui/Modal.vue'
import SummaryBar from './ui/SummaryBar.vue'

const open = defineModel<boolean>({ required: true })
const emit = defineEmits<{ back: [] }>()

const roundStore = useRoundStore()
const { canConfirm } = storeToRefs(roundStore)
const { clearBoosts } = roundStore
const { play } = usePlayRound()

const { balance, bet, bonus, maxWin } = useRoundSummary()
const summary = computed(() => [
  balance.value,
  bet.value,
  bonus.value,
  maxWin.value,
])

watch(open, (isOpen) => {
  if (!isOpen) clearBoosts()
})

const back = () => {
  open.value = false
  emit('back')
}

const spin = () => {
  play()
  open.value = false
}
</script>

<template>
  <Modal v-model="open" title="Bonusy">
    <div class="flex flex-col gap-3 sm:gap-4">
      <SummaryBar :items="summary" />
      <BoostPicker />
    </div>

    <template #footer>
      <Button @click="back"> Wróć do stołu </Button>
      <Button variant="primary" size="lg" :disabled="!canConfirm" @click="spin">
        Kręć!
      </Button>
    </template>
  </Modal>
</template>

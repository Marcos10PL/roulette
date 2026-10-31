<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { LEADERBOARD_SIZE } from '../../const'
import { vStagger } from '../../directives/animate'
import { usePlayerStore } from '../../stores/player'
import { formatMoneyAmount } from '../../utils/format'
import Card from '../ui/Card.vue'
import Modal from '../ui/Modal.vue'

const open = defineModel<boolean>({ required: true })

const playerStore = usePlayerStore()
const { topPlayers } = storeToRefs(playerStore)
const { isYou } = playerStore

const rankColor = (index: number, own: boolean) => {
  if (index === 0) return 'text-gold'
  return own ? 'text-violet-hi' : 'text-ink-3'
}
</script>

<template>
  <Modal v-model="open" :title="`Top ${LEADERBOARD_SIZE} graczy`">
    <ol v-if="topPlayers.length" v-stagger class="flex flex-col gap-1.5">
      <Card
        v-for="(entry, index) in topPlayers"
        :key="entry.name"
        tag="li"
        :active="isYou(entry.name)"
        class="grid grid-cols-[30px_1fr_auto] items-center gap-3 sm:grid-cols-[36px_1fr_auto]"
      >
        <span
          class="font-display text-2xl leading-6 font-extrabold sm:text-3xl sm:leading-7"
          :class="rankColor(index, isYou(entry.name))"
        >
          {{ index + 1 }}
        </span>
        <span class="truncate text-sm sm:text-base">
          {{ entry.name }}
          <span v-if="isYou(entry.name)">(Ty)</span>
        </span>
        <span class="font-mono text-sm font-bold text-gold sm:text-base">
          {{ formatMoneyAmount(entry.best) }}
        </span>
      </Card>
    </ol>
    <p v-else class="text-center text-ink-3">Brak wyników.</p>
  </Modal>
</template>

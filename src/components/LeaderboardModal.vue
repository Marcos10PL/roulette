<script setup lang="ts">
import { LEADERBOARD_SIZE } from '../const'
import { vStagger } from '../directives/animate'
import { usePlayerStore } from '../stores/player'
import { formatMoneyAmount } from '../utils/format'
import Card from './ui/Card.vue'
import Modal from './ui/Modal.vue'

const open = defineModel<boolean>({ required: true })

const playerStore = usePlayerStore()
</script>

<template>
  <Modal v-model="open" :title="`Top ${LEADERBOARD_SIZE} graczy`">
    <ol
      v-if="playerStore.topPlayers.length"
      v-stagger
      class="flex flex-col gap-2"
    >
      <Card
        v-for="(entry, index) in playerStore.topPlayers"
        :key="entry.name"
        tag="li"
        :active="entry.name === playerStore.activeName"
        class="flex items-center justify-between"
      >
        <span>{{ index + 1 }}. {{ entry.name }}</span>
        <span>{{ formatMoneyAmount(entry.best) }}</span>
      </Card>
    </ol>
    <p v-else class="text-center text-zinc-400">Brak wyników.</p>
  </Modal>
</template>

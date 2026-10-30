<script setup lang="ts">
import { ref } from 'vue'
import BettingModal from './BettingModal.vue'
import GameControls from './GameControls.vue'
import GameOverModal from './GameOverModal.vue'
import HistoryModal from './HistoryModal.vue'
import LeaderboardModal from './LeaderboardModal.vue'
import PlayerBar from './PlayerBar.vue'
import RecentResults from './RecentResults.vue'
import RouletteScene from './RouletteScene.vue'
import RoundsPanel from './RoundsPanel.vue'
import SessionPanel from './SessionPanel.vue'
import ToastNotice from './ToastNotice.vue'
import StarField from './ui/StarField.vue'

const bettingOpen = ref(false)
const leaderboardOpen = ref(false)
const historyOpen = ref(false)
</script>

<template>
  <div class="max-w-xl">
    <div class="fixed inset-0 -z-20 overflow-hidden" aria-hidden="true">
      <div class="sky" />
      <StarField />
    </div>

    <RouletteScene />
    <PlayerBar />
    <RecentResults />
    <SessionPanel />
    <RoundsPanel @history="historyOpen = true" />

    <GameControls
      @bet="bettingOpen = true"
      @ranking="leaderboardOpen = true"
      @history="historyOpen = true"
    />

    <BettingModal v-model="bettingOpen" />
    <LeaderboardModal v-model="leaderboardOpen" />
    <HistoryModal v-model="historyOpen" />
    <GameOverModal />
    <ToastNotice />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import BettingModal from './betting/BettingModal.vue'
import BoostModal from './betting/BoostModal.vue'
import GameControls from './game/GameControls.vue'
import GameOverModal from './game/GameOverModal.vue'
import HistoryModal from './stats/HistoryModal.vue'
import LeaderboardModal from './stats/LeaderboardModal.vue'
import ModeModal from './settings/ModeModal.vue'
import PlayerBar from './game/PlayerBar.vue'
import RecentResults from './stats/RecentResults.vue'
import RouletteScene from './game/RouletteScene.vue'
import RoundsPanel from './stats/RoundsPanel.vue'
import SessionPanel from './stats/SessionPanel.vue'
import ToastNotice from './game/ToastNotice.vue'
import StarField from './ui/StarField.vue'

const bettingOpen = ref(false)
const boostsOpen = ref(false)
const leaderboardOpen = ref(false)
const historyOpen = ref(false)
const modeOpen = ref(false)
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
      @mode="modeOpen = true"
    />

    <BettingModal v-model="bettingOpen" @boosts="boostsOpen = true" />
    <BoostModal v-model="boostsOpen" @back="bettingOpen = true" />
    <LeaderboardModal v-model="leaderboardOpen" />
    <HistoryModal v-model="historyOpen" />
    <ModeModal v-model="modeOpen" />
    <GameOverModal />
    <ToastNotice />
  </div>
</template>

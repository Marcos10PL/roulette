<script setup lang="ts">
import { ref } from 'vue'
import {
  enterFrom,
  leaveTo,
  withoutPulse,
  withPulse,
} from '../animations/effects'
import { BUTTON_VARIANT } from '../const'
import { useRoundStore } from '../stores/round'
import Button from './ui/Button.vue'
import BettingModal from './BettingModal.vue'
import GameOverModal from './GameOverModal.vue'
import PlayerBar from './PlayerBar.vue'
import RecentResults from './RecentResults.vue'
import RouletteScene from './RouletteScene.vue'
import RulesetSwitch from './RulesetSwitch.vue'
import ToastNotice from './ToastNotice.vue'

const roundStore = useRoundStore()

const GLOW = { boxShadow: '0 0 28px rgba(220, 38, 38, 0.7)' }

const onSpinButtonEnter = withPulse(
  enterFrom(
    { opacity: 0, y: 20, scale: 0.8 },
    { duration: 0.5, delay: 0.3, ease: 'back.out(1.7)' },
  ),
  GLOW,
)
const onSpinButtonLeave = withoutPulse(
  leaveTo({ opacity: 0, y: 10, scale: 0.9 }, { duration: 0.25 }),
  GLOW,
)

const bettingOpen = ref(false)
</script>

<template>
  <div>
    <RouletteScene />
    <PlayerBar />
    <RecentResults />
    <RulesetSwitch />

    <Transition
      :css="false"
      appear
      @enter="onSpinButtonEnter"
      @leave="onSpinButtonLeave"
    >
      <Button
        v-show="!roundStore.isSpinning"
        :variant="BUTTON_VARIANT.PRIMARY"
        class="fixed bottom-6 left-1/2 z-10 -translate-x-1/2 px-8 py-3 text-lg"
        @click="bettingOpen = true"
      >
        Graj!
      </Button>
    </Transition>

    <BettingModal v-model="bettingOpen" />
    <GameOverModal />
    <ToastNotice />
  </div>
</template>

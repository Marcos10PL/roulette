<script setup lang="ts">
import { fadeIn, fadeOut } from './animations/effects'
import GameScreen from './components/GameScreen.vue'
import StartScreen from './components/StartScreen.vue'
import { usePlayerStore } from './stores/player'

const playerStore = usePlayerStore()

const onEnter = fadeIn({ duration: 0.4 })
const onLeave = fadeOut({ duration: 0.3 })
</script>

<template>
  <Transition
    :css="false"
    mode="out-in"
    appear
    @enter="onEnter"
    @leave="onLeave"
  >
    <StartScreen v-if="!playerStore.player" key="start" />
    <GameScreen v-else key="game" />
  </Transition>
</template>

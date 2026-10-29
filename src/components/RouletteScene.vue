<script setup lang="ts">
import { onBeforeUnmount, onMounted, useTemplateRef, watch } from 'vue'
import { useAudioStore } from '../stores/audio'
import { useSettingsStore } from '../stores/settings'
import { useWheelStore } from '../stores/wheel'
import { createRoulette, type Roulette } from '../three/roulette'

const container = useTemplateRef<HTMLDivElement>('container')
const settings = useSettingsStore()
const audio = useAudioStore()
const wheel = useWheelStore()

let roulette: Roulette | null = null

onMounted(() => {
  if (!container.value) return

  roulette = createRoulette(container.value, settings.ruleset, {
    onTick: () => audio.play('TICK'),
  })
  wheel.register(roulette)
})

watch(
  () => settings.ruleset,
  (ruleset) => roulette?.setRuleset(ruleset),
)

onBeforeUnmount(() => {
  wheel.register(null)
  roulette?.dispose()
  roulette = null
})
</script>

<template>
  <div ref="container" class="fixed inset-0 -z-10" />
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { onBeforeUnmount, onMounted, useTemplateRef, watch } from 'vue'
import { useAudioStore } from '../stores/audio'
import { useSettingsStore } from '../stores/settings'
import { useWheelStore } from '../stores/wheel'
import { createRoulette, type Roulette } from '../three/roulette'

const container = useTemplateRef<HTMLDivElement>('container')
const { ruleset } = storeToRefs(useSettingsStore())
const { play } = useAudioStore()
const { register } = useWheelStore()

let roulette: Roulette | null = null

onMounted(() => {
  if (!container.value) return

  roulette = createRoulette(container.value, ruleset.value, {
    onTick: () => play('TICK'),
  })
  register(roulette)
})

watch(ruleset, (next) => roulette?.setRuleset(next))

onBeforeUnmount(() => {
  register(null)
  roulette?.dispose()
  roulette = null
})
</script>

<template>
  <div ref="container" class="fixed inset-0 -z-10" />
</template>

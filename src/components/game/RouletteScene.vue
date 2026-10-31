<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { onBeforeUnmount, onMounted, ref, useTemplateRef, watch } from 'vue'
import { useAudioStore } from '../../stores/audio'
import { useSettingsStore } from '../../stores/settings'
import { useWheelStore } from '../../stores/wheel'
import { createRoulette, type Roulette } from '../../three/roulette'

const container = useTemplateRef<HTMLDivElement>('container')
const { game } = storeToRefs(useSettingsStore())
const { play } = useAudioStore()
const { register } = useWheelStore()

const failed = ref(false)
let roulette: Roulette | null = null

onMounted(() => {
  if (!container.value) return

  try {
    roulette = createRoulette(container.value, game.value, {
      onTick: () => play('TICK'),
    })
  } catch {
    failed.value = true
    return
  }

  register(roulette)
})

watch(game, (next) => roulette?.setGame(next))

onBeforeUnmount(() => {
  register(null)
  roulette?.dispose()
  roulette = null
})
</script>

<template>
  <div ref="container" class="fixed inset-0 -z-10">
    <p
      v-if="failed"
      role="alert"
      class="grid h-full place-items-center px-8 text-center text-ink-2"
    >
      Nie udało się uruchomić koła.
    </p>
  </div>
</template>

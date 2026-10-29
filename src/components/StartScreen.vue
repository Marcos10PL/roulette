<script setup lang="ts">
import { ArrowRight, Coins, Star } from '@lucide/vue'
import { onBeforeUnmount, onMounted, ref, useTemplateRef } from 'vue'
import { playStartScreen } from '../animations/start-screen'
import { BUTTON_VARIANT, START_BALANCE, TONE } from '../const'
import { vStagger } from '../directives/animate'
import { usePlayerStore } from '../stores/player'
import { useToastStore } from '../stores/toast'
import { formatMoneyAmount } from '../utils/format'
import Button from './ui/Button.vue'
import Input from './ui/Input.vue'

const LOGO = 'RULETKA'

const playerStore = usePlayerStore()
const toast = useToastStore()

const letters = useTemplateRef<HTMLElement[]>('letters')
const lineLeft = useTemplateRef<HTMLElement>('lineLeft')
const lineRight = useTemplateRef<HTMLElement>('lineRight')
const star = useTemplateRef<HTMLElement>('star')
const coinIcon = useTemplateRef<HTMLElement>('coinIcon')
const name = ref('')

let stopAnimation: (() => void) | undefined

onMounted(() => {
  if (!lineLeft.value || !lineRight.value || !star.value || !coinIcon.value) {
    return
  }

  stopAnimation = playStartScreen({
    letters: letters.value ?? [],
    lines: [lineLeft.value, lineRight.value],
    star: star.value,
    coinIcon: coinIcon.value,
  })
})

onBeforeUnmount(() => stopAnimation?.())

const submit = () => {
  const trimmed = name.value.trim()
  if (!trimmed) return

  const known = playerStore.players.length
  const { name: playerName } = playerStore.createPlayer(trimmed)

  const isNew = playerStore.players.length > known
  toast.show(
    isNew ? `Witaj, ${playerName}!` : `Witaj ponownie, ${playerName}!`,
    TONE.NEUTRAL,
  )
}
</script>

<template>
  <main class="grid min-h-screen place-items-center bg-black p-4 text-white">
    <div class="w-full max-w-sm text-center">
      <div class="flex items-center justify-center gap-3">
        <span
          ref="lineLeft"
          class="h-px w-16 bg-linear-to-r from-transparent to-red-500"
        />
        <span ref="star" class="inline-flex">
          <Star :size="20" class="text-red-500" />
        </span>
        <span
          ref="lineRight"
          class="h-px w-16 bg-linear-to-l from-transparent to-red-500"
        />
      </div>

      <h1
        class="mt-3 text-5xl font-bold tracking-widest text-red-500 uppercase"
        :aria-label="LOGO"
      >
        <span
          v-for="(letter, index) in LOGO"
          :key="index"
          ref="letters"
          aria-hidden="true"
          class="inline-block"
        >
          {{ letter }}
        </span>
      </h1>

      <div v-stagger="{ y: 20, amount: 0.5, delay: 1.8 }">
        <form class="mt-10 flex flex-col gap-3" @submit.prevent="submit">
          <label for="player-name" class="text-sm tracking-wider uppercase">
            Wpisz swoje imię, aby wejść do gry
          </label>

          <div class="flex gap-2">
            <Input
              id="player-name"
              v-model="name"
              autofocus
              maxlength="20"
              required
              autocomplete="given-name"
              placeholder="Podaj swoje imię..."
              class="flex-1"
            />
            <Button
              type="submit"
              :variant="BUTTON_VARIANT.PRIMARY"
              aria-label="Wejdź do gry"
            >
              <ArrowRight :size="18" />
            </Button>
          </div>
        </form>

        <p class="mt-6 flex items-center justify-center gap-2 text-yellow-400">
          <span ref="coinIcon" class="inline-flex">
            <Coins :size="16" />
          </span>
          Na start otrzymujesz {{ formatMoneyAmount(START_BALANCE) }} monet
        </p>
      </div>
    </div>
  </main>
</template>

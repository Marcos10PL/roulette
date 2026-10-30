<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { ArrowRight, Coins, Star } from '@lucide/vue'
import { onBeforeUnmount, onMounted, ref, useTemplateRef } from 'vue'
import { playStartScreen } from '../animations/start-screen'
import { START_BALANCE, TONE } from '../const'
import { vStagger } from '../directives/animate'
import { usePlayerStore } from '../stores/player'
import { useToastStore } from '../stores/toast'
import { formatMoneyAmount } from '../utils/format'
import Button from './ui/Button.vue'
import Input from './ui/Input.vue'
import StarField from './ui/StarField.vue'

const LOGO = 'RULETKA'

const playerStore = usePlayerStore()
const { players } = storeToRefs(playerStore)
const { createPlayer } = playerStore
const { show } = useToastStore()

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

  const known = players.value.length
  createPlayer(trimmed)

  const isNew = players.value.length > known
  show({
    tone: TONE.NEUTRAL,
    title: isNew ? 'Witaj!' : 'Witaj ponownie!',
    text: 'Życzymy powodzenia w grze!',
  })
}
</script>

<template>
  <main
    class="relative grid min-h-screen place-items-center overflow-hidden bg-ground p-4 text-ink"
  >
    <div class="sky" />
    <StarField />

    <div class="relative w-full max-w-md text-center">
      <div class="flex flex-col items-center gap-3.5">
        <div class="flex items-center gap-3 text-violet-glow drop-shadow-neon">
          <span
            ref="lineLeft"
            class="h-0.5 w-16 rounded-full bg-linear-to-r from-transparent to-violet-hi"
          />
          <span ref="star" class="inline-flex">
            <Star :size="20" />
          </span>
          <span
            ref="lineRight"
            class="h-0.5 w-16 rounded-full bg-linear-to-l from-transparent to-violet-hi"
          />
        </div>

        <h1
          class="neon-text font-display text-7xl leading-none font-extrabold tracking-widest uppercase sm:text-8xl"
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
      </div>

      <div v-stagger="{ y: 20, amount: 0.5, delay: 1.8 }" class="mt-8 sm:mt-10">
        <form class="flex flex-col gap-3" @submit.prevent="submit">
          <Input
            id="player-name"
            v-model="name"
            autofocus
            maxlength="20"
            required
            autocomplete="given-name"
            placeholder="Podaj swoje imię..."
          />
          <Button
            :disabled="!name.trim()"
            type="submit"
            variant="primary"
            size="lg"
            class="glow"
          >
            Wejdź do gry
            <ArrowRight :size="20" />
          </Button>
        </form>

        <p
          class="mt-6 flex items-center justify-center gap-2 text-sm text-ink-2"
        >
          <span ref="coinIcon" class="inline-flex text-gold">
            <Coins :size="18" />
          </span>
          Na start otrzymujesz
          <strong class="font-mono text-gold">
            {{ formatMoneyAmount(START_BALANCE) }}
          </strong>
          monet
        </p>
      </div>
    </div>
  </main>
</template>

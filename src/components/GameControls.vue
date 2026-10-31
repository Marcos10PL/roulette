<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { History, Medal, Volume2, VolumeX } from '@lucide/vue'
import {
  enterFrom,
  leaveTo,
  withoutPulse,
  withPulse,
} from '../animations/effects'
import { vStagger } from '../directives/animate'
import { useAudioStore } from '../stores/audio'
import { useRoundStore } from '../stores/round'
import { useSettingsStore } from '../stores/settings'
import { themeValue } from '../utils/theme'
import Button from './ui/Button.vue'
import ModeIcon from './ModeIcon.vue'
import RulesetSwitch from './RulesetSwitch.vue'

const emit = defineEmits<{ bet: []; ranking: []; history: []; mode: [] }>()

const { isSpinning } = storeToRefs(useRoundStore())
const { mode } = storeToRefs(useSettingsStore())
const audio = useAudioStore()
const { muted } = storeToRefs(audio)
const { toggleMute } = audio

const phone = window.matchMedia('(max-width: 639px)')
const isPhone = ref(phone.matches)
const updatePhone = () => (isPhone.value = phone.matches)

onMounted(() => phone.addEventListener('change', updatePhone))
onBeforeUnmount(() => phone.removeEventListener('change', updatePhone))

const showSpinButton = computed(() => isPhone.value || !isSpinning.value)

const GLOW = { boxShadow: themeValue('--shadow-glow-pulse') }

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
</script>

<template>
  <footer
    class="fixed inset-x-3 bottom-4 z-10 flex flex-col gap-3.5 sm:inset-x-6 sm:bottom-6 sm:grid sm:grid-cols-[1fr_auto_1fr] sm:items-end"
  >
    <div class="flex items-center gap-2 sm:contents">
      <RulesetSwitch
        class="min-w-0 flex-1 sm:col-start-1 sm:row-start-2 sm:flex-none sm:justify-self-start"
      />
    </div>

    <div class="flex items-center gap-2 sm:contents">
      <div
        v-stagger="{ y: 16 }"
        class="flex gap-2 sm:col-start-3 sm:row-start-2 sm:justify-self-end"
      >
        <Button
          variant="quiet"
          aria-label="Ranking"
          class="max-sm:w-11 max-sm:px-0"
          @click="emit('ranking')"
        >
          <Medal :size="16" />
          <span class="hidden sm:inline">Ranking</span>
        </Button>
        <Button
          variant="quiet"
          size="icon"
          :aria-label="muted ? 'Włącz dźwięk' : 'Wycisz dźwięk'"
          :aria-pressed="muted"
          @click="toggleMute"
        >
          <VolumeX v-if="muted" :size="16" />
          <Volume2 v-else :size="16" />
        </Button>
        <Button
          variant="quiet"
          size="icon"
          class="panels:hidden"
          aria-label="Historia i statystyki"
          @click="emit('history')"
        >
          <History :size="16" />
        </Button>
      </div>

      <Button
        variant="ghost"
        :disabled="isSpinning"
        :aria-label="`Tryb gry: ${mode.name}`"
        class="max-sm:w-11 max-sm:px-0 sm:col-start-2 sm:row-start-2 sm:justify-self-center"
        @click="emit('mode')"
      >
        <ModeIcon :mode-id="mode.id" :size="16" />
        <span class="hidden sm:inline">{{ mode.name }}</span>
      </Button>

      <Transition
        :css="false"
        appear
        @enter="onSpinButtonEnter"
        @leave="onSpinButtonLeave"
      >
        <Button
          v-show="showSpinButton"
          :disabled="isSpinning"
          variant="primary"
          size="xl"
          class="flex-1 sm:col-start-2 sm:row-start-1 sm:flex-none"
          @click="emit('bet')"
        >
          Graj!
        </Button>
      </Transition>
    </div>
  </footer>
</template>

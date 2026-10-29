<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { computed } from 'vue'
import {
  HISTORY_LIST_SIZE,
  POCKET_COLOR,
  POCKET_COLOR_HEX,
  POCKET_COLOR_LABEL,
  ROUND_OUTCOME,
  TONE,
} from '../const'
import { vStagger } from '../directives/animate'
import { useHistoryStore } from '../stores/history'
import type { RoundOutcome } from '../types'
import {
  formatDateTime,
  formatMoneyAmount,
  formatPercent,
  formatSigned,
} from '../utils/format'
import { toneOf } from '../utils/tone'
import ResultBadge from './ResultBadge.vue'
import Modal from './ui/Modal.vue'
import SectionTitle from './ui/SectionTitle.vue'
import { TONE_TEXT_CLASSES } from './ui/classes'
import StackedBar from './ui/StackedBar.vue'
import StatCard from './ui/StatCard.vue'

const open = defineModel<boolean>({ required: true })

const history = useHistoryStore()

const { stats } = storeToRefs(history)
const recentRounds = computed(() =>
  history.playerRecords.slice(0, HISTORY_LIST_SIZE),
)

const OUTCOME_LABELS: Record<RoundOutcome, string> = {
  [ROUND_OUTCOME.WIN]: 'Wygrana',
  [ROUND_OUTCOME.LOSE]: 'Przegrana',
  [ROUND_OUTCOME.PUSH]: 'Remis',
}

const COLORS = Object.values(POCKET_COLOR)

const summary = computed(() => [
  { label: 'Rundy', value: String(stats.value.rounds), tone: TONE.NEUTRAL },
  {
    label: 'Wygrane',
    value: `${stats.value.outcomes[ROUND_OUTCOME.WIN]} (${formatPercent(stats.value.winRate)})`,
    tone: TONE.NEUTRAL,
  },
  {
    label: 'Przegrane',
    value: String(stats.value.outcomes[ROUND_OUTCOME.LOSE]),
    tone: TONE.NEUTRAL,
  },
  {
    label: 'Bilans',
    value: formatSigned(stats.value.netTotal),
    tone: toneOf(stats.value.netTotal),
  },
  {
    label: 'Największa wygrana',
    value: formatMoneyAmount(stats.value.biggestWin),
    tone: TONE.POSITIVE,
  },
  {
    label: 'Największa przegrana',
    value: formatMoneyAmount(stats.value.biggestLoss),
    tone: TONE.NEGATIVE,
  },
])

const colorSegments = computed(() =>
  COLORS.map((color) => ({
    share: stats.value.colors[color].share,
    color: POCKET_COLOR_HEX[color],
  })),
)

const colorsLabel = computed(() =>
  COLORS.map(
    (color) =>
      `${POCKET_COLOR_LABEL[color]} ${formatPercent(stats.value.colors[color].share)}`,
  ).join(', '),
)
</script>

<template>
  <Modal v-model="open" title="Historia i statystyki" wide>
    <p v-if="!stats.rounds" class="py-8 text-center text-zinc-400">
      Nie rozegrałeś jeszcze żadnej rundy. Zagraj, a tu pojawią się Twoje
      wyniki.
    </p>

    <div v-else class="flex flex-col gap-5">
      <div v-stagger class="grid grid-cols-2 gap-2 sm:grid-cols-3">
        <StatCard
          v-for="item in summary"
          :key="item.label"
          :label="item.label"
          :value="item.value"
          :tone="item.tone"
        />
      </div>

      <section>
        <SectionTitle>Kolory wyników</SectionTitle>
        <StackedBar :segments="colorSegments" :label="colorsLabel" />
        <ul class="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-sm">
          <li
            v-for="color in COLORS"
            :key="color"
            class="flex items-center gap-2"
          >
            <span
              class="size-3 rounded-full"
              :style="{ background: POCKET_COLOR_HEX[color] }"
            />
            {{ POCKET_COLOR_LABEL[color] }}: {{ stats.colors[color].count }} ({{
              formatPercent(stats.colors[color].share)
            }})
          </li>
        </ul>
      </section>

      <section>
        <SectionTitle>Najczęstsze liczby</SectionTitle>
        <ul v-stagger="{ scale: 0.3 }" class="flex flex-wrap gap-3">
          <li
            v-for="hot in stats.hotNumbers"
            :key="hot.label"
            class="flex items-center gap-2 text-sm"
          >
            <ResultBadge :label="hot.label" :color="hot.color" />
            ×{{ hot.count }}
          </li>
        </ul>
      </section>

      <section>
        <SectionTitle>Ostatnie rundy</SectionTitle>
        <ul v-stagger="{ amount: 0.5 }" class="flex flex-col gap-1">
          <li
            v-for="record in recentRounds"
            :key="record.at"
            class="flex items-center gap-3 rounded-lg border border-zinc-800 px-3 py-1.5 text-sm"
          >
            <ResultBadge :label="record.label" :color="record.color" />
            <span class="w-20">{{ OUTCOME_LABELS[record.outcome] }}</span>
            <span class="flex-1 text-zinc-400">
              stawka {{ formatMoneyAmount(record.staked) }}
            </span>
            <span
              class="font-bold"
              :class="TONE_TEXT_CLASSES[toneOf(record.net)]"
            >
              {{ formatSigned(record.net) }}
            </span>
            <span class="hidden text-xs text-zinc-500 sm:block">
              {{ formatDateTime(record.at) }}
            </span>
          </li>
        </ul>
      </section>
    </div>
  </Modal>
</template>

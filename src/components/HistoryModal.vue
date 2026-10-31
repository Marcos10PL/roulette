<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { computed } from 'vue'
import {
  HISTORY_LIST_SIZE,
  POCKET_COLOR,
  POCKET_COLOR_BAR_TOKEN,
  POCKET_COLOR_LABEL,
  ROUND_OUTCOME,
  ROUND_OUTCOME_LABEL,
  TONE,
} from '../const'
import { vStagger } from '../directives/animate'
import { useHistoryStore } from '../stores/history'
import { formatMoneyAmount, formatPercent, formatSigned } from '../utils/format'
import { cssVar } from '../utils/theme'
import { toneOf, toneTextClass } from '../utils/tone'
import ResultBadge from './ResultBadge.vue'
import Modal from './ui/Modal.vue'
import StackedBar from './ui/StackedBar.vue'
import StatCard from './ui/StatCard.vue'

const open = defineModel<boolean>({ required: true })

const { stats, playerRecords } = storeToRefs(useHistoryStore())
const recentRounds = computed(() =>
  playerRecords.value.slice(0, HISTORY_LIST_SIZE),
)

const COLORS = Object.values(POCKET_COLOR)

const summary = computed(() => [
  { label: 'Rundy', value: String(stats.value.rounds), tone: TONE.NEUTRAL },
  {
    label: 'Wygrane',
    value: `${stats.value.outcomes[ROUND_OUTCOME.WIN]} (${formatPercent(stats.value.winRate)})`,
    tone: TONE.POSITIVE,
  },
  {
    label: 'Przegrane',
    value: String(stats.value.outcomes[ROUND_OUTCOME.LOSE]),
    tone: TONE.NEGATIVE,
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
    color: cssVar(POCKET_COLOR_BAR_TOKEN[color]),
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
  <Modal v-model="open" title="Historia i statystyki" size="md">
    <p v-if="!stats.rounds" class="py-8 text-center text-ink-3">
      Tutaj pojawią się Twoje statystyki i historia rund.
    </p>

    <div v-else class="flex flex-col gap-5 sm:gap-7">
      <div
        v-stagger
        class="grid grid-cols-2 gap-y-3.5 sm:grid-cols-3 sm:gap-y-5"
      >
        <StatCard
          v-for="item in summary"
          :key="item.label"
          :label="item.label"
          :value="item.value"
          :tone="item.tone"
        />
      </div>

      <div class="flex flex-col gap-2 sm:gap-2.5">
        <StackedBar :segments="colorSegments" :label="colorsLabel" />
        <div
          class="flex justify-between text-xs text-ink-2 sm:text-sm"
          aria-hidden="true"
        >
          <span v-for="color in COLORS" :key="color">
            {{ POCKET_COLOR_LABEL[color] }}
            <strong class="font-mono text-ink">
              {{ stats.colors[color].count }}
            </strong>
          </span>
        </div>
      </div>

      <ul
        v-stagger="{ scale: 0.3 }"
        class="flex flex-wrap items-center justify-center gap-x-2.5 gap-y-2 sm:gap-x-3.5"
      >
        <li
          v-for="hot in stats.hotNumbers"
          :key="hot.label"
          class="inline-flex items-center gap-1 sm:gap-1.5"
        >
          <ResultBadge :label="hot.label" :color="hot.color" />
          <span class="font-mono text-sm text-ink-3 sm:text-sm">
            ×{{ hot.count }}
          </span>
        </li>
      </ul>

      <ol v-stagger="{ amount: 0.5 }" aria-label="Ostatnie rundy">
        <li
          v-for="record in recentRounds"
          :key="record.at"
          class="grid grid-cols-[auto_1fr_auto] items-center gap-2.5 border-t border-violet-hi/15 py-2 text-sm sm:gap-3.5 sm:py-2.5 sm:text-sm"
        >
          <ResultBadge :label="record.label" :color="record.color" />
          <span>
            {{ ROUND_OUTCOME_LABEL[record.outcome] }}
            <span class="text-ink-3">
              · <span class="max-sm:hidden">stawka </span>
              {{ formatMoneyAmount(record.staked) }}
            </span>
          </span>
          <span
            class="w-11 text-right font-mono font-bold sm:w-14"
            :class="toneTextClass(record.net)"
          >
            {{ formatSigned(record.net) }}
          </span>
        </li>
      </ol>
    </div>
  </Modal>
</template>

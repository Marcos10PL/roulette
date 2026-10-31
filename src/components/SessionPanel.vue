<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { computed } from 'vue'
import {
  POCKET_COLOR,
  POCKET_COLOR_BAR_TOKEN,
  POCKET_COLOR_LABEL,
} from '../const'
import { vStagger } from '../directives/animate'
import { useHistoryStore } from '../stores/history'
import { formatPercent, formatSigned } from '../utils/format'
import { cssVar } from '../utils/theme'
import { toneTextClass } from '../utils/tone'
import ResultBadge from './ResultBadge.vue'
import SectionTitle from './ui/SectionTitle.vue'
import StackedBar from './ui/StackedBar.vue'

const { stats } = storeToRefs(useHistoryStore())

const COLORS = Object.values(POCKET_COLOR)

const colors = computed(() =>
  COLORS.map((color) => ({
    color: cssVar(POCKET_COLOR_BAR_TOKEN[color]),
    share: stats.value.colors[color].share,
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
  <aside
    class="fixed top-1/2 left-10 z-10 hidden w-60 -translate-y-1/2 panels:block"
  >
    <div v-stagger class="flex flex-col gap-5">
      <SectionTitle>Twoja sesja</SectionTitle>

      <p v-if="!stats.rounds" class="text-sm text-ink-3">
        Tu pojawią się statystyki Twojej sesji.
      </p>

      <template v-else>
        <div class="grid grid-cols-2 gap-3">
          <div>
            <p class="font-mono text-xs tracking-widest text-ink-3 uppercase">
              Rundy
            </p>
            <p class="font-mono text-3xl font-bold">{{ stats.rounds }}</p>
          </div>
          <div>
            <p class="font-mono text-xs tracking-widest text-ink-3 uppercase">
              Bilans
            </p>
            <p
              class="font-mono text-3xl font-bold"
              :class="toneTextClass(stats.netTotal)"
            >
              {{ formatSigned(stats.netTotal) }}
            </p>
          </div>
        </div>

        <div class="flex flex-col gap-2">
          <p class="font-mono text-xs tracking-widest text-ink-3 uppercase">
            Kolory
          </p>
          <StackedBar :segments="colors" :label="colorsLabel" />
          <div
            class="flex justify-between text-xs text-ink-2"
            aria-hidden="true"
          >
            <span
              v-for="item in colors"
              :key="item.color"
              class="inline-flex items-center gap-1.5"
            >
              <i
                class="size-2 rounded-sm"
                :style="{ background: item.color }"
              />
              {{ formatPercent(item.share) }}
            </span>
          </div>
        </div>

        <div class="flex flex-col gap-2">
          <p class="font-mono text-xs tracking-widest text-ink-3 uppercase">
            Najczęstsze
          </p>
          <div class="flex gap-1.5">
            <ResultBadge
              v-for="number in stats.hotNumbers"
              :key="number.label"
              :label="number.label"
              :color="number.color"
              :title="`${number.count}×`"
            />
          </div>
        </div>
      </template>
    </div>
  </aside>
</template>

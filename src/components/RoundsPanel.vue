<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { computed } from 'vue'
import { HISTORY_LIST_SIZE, ROUND_OUTCOME_LABEL } from '../const'
import { vStagger } from '../directives/animate'
import { useHistoryStore } from '../stores/history'
import { formatSigned } from '../utils/format'
import { toneTextClass } from '../utils/tone'
import ResultBadge from './ResultBadge.vue'
import Button from './ui/Button.vue'
import SectionTitle from './ui/SectionTitle.vue'

const emit = defineEmits<{ history: [] }>()

const { playerRecords } = storeToRefs(useHistoryStore())

const rounds = computed(() => playerRecords.value.slice(0, HISTORY_LIST_SIZE))
</script>

<template>
  <aside
    class="fixed top-1/2 right-10 z-10 hidden w-60 -translate-y-1/2 panels:block"
  >
    <div class="flex flex-col gap-3.5">
      <SectionTitle>Ostatnie rundy</SectionTitle>

      <p v-if="!rounds.length" class="text-sm text-ink-3">
        Tu pojawią się wyniki Twoich rund.
      </p>

      <ol v-else v-stagger class="flex flex-col">
        <li
          v-for="record in rounds"
          :key="record.at"
          class="grid grid-cols-[auto_1fr_auto] items-center gap-3 border-b border-violet-hi/15 py-2"
        >
          <ResultBadge :label="record.label" :color="record.color" />
          <span class="text-sm text-ink-2">
            {{ ROUND_OUTCOME_LABEL[record.outcome] }}
          </span>
          <span class="font-mono font-bold" :class="toneTextClass(record.net)">
            {{ formatSigned(record.net) }}
          </span>
        </li>
      </ol>

      <Button variant="ghost" @click="emit('history')">Cała historia</Button>
    </div>
  </aside>
</template>

import { defineStore } from 'pinia'
import { computed, ref, watch } from 'vue'
import { HISTORY_LIMIT } from '../const'
import type { SpinRecord } from '../types'
import { computeStats } from '../utils/stats'
import { usePlayerStore } from './player'

export const useHistoryStore = defineStore(
  'history',
  () => {
    const playerStore = usePlayerStore()

    const records = ref<SpinRecord[]>([])

    const playerRecords = computed(() =>
      records.value
        .filter((record) => record.player === playerStore.activeName)
        .reverse(),
    )

    const stats = computed(() => computeStats(playerRecords.value))

    const add = (record: SpinRecord) => {
      records.value.push(record)

      const own = records.value.filter((r) => r.player === record.player)
      if (own.length > HISTORY_LIMIT) {
        records.value.splice(records.value.indexOf(own[0]), 1)
      }
    }

    watch(
      () => playerStore.players.map((player) => player.name),
      (names) => {
        records.value = records.value.filter((r) => names.includes(r.player))
      },
    )

    return { records, playerRecords, stats, add }
  },
  { persist: { key: 'roulette-history', pick: ['records'] } },
)

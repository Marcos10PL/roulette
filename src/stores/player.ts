import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { START_BALANCE } from '../const'
import type { Player } from '../types'

export const usePlayerStore = defineStore(
  'player',
  () => {
    const players = ref<Player[]>([])
    const activeName = ref<string | null>(null)

    const player = computed(
      () => players.value.find((p) => p.name === activeName.value) ?? null,
    )

    const leaderboard = computed(() =>
      [...players.value].sort((a, b) => b.best - a.best),
    )

    const createPlayer = (name: string) => {
      let profile = players.value.find(
        (p) => p.name.toLowerCase() === name.toLowerCase(),
      )

      if (!profile) {
        players.value.push({
          name,
          balance: START_BALANCE,
          best: START_BALANCE,
        })
        profile = players.value[players.value.length - 1]
      }

      activeName.value = profile.name
      return profile
    }

    const updateBalance = (balance: number) => {
      if (!player.value) return

      player.value.balance = balance
      player.value.best = Math.max(player.value.best, balance)
    }

    const resetPlayer = () => {
      players.value = players.value.filter((p) => p.name !== activeName.value)
      activeName.value = null
    }

    const switchPlayer = () => {
      activeName.value = null
    }

    return {
      players,
      activeName,
      player,
      leaderboard,

      createPlayer,
      updateBalance,
      resetPlayer,
      switchPlayer,
    }
  },
  { persist: { key: 'roulette-profiles', pick: ['players', 'activeName'] } },
)

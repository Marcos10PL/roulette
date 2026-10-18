import { defineStore } from 'pinia'
import { computed, ref, watch } from 'vue'
import { CHIPS, ROUND_OUTCOME, START_BALANCE } from '../const'
import { calculateWinnings } from '../utils/bets'
import { getRuleset } from '../utils/rulesets'
import type { ActiveRound, RoundOutcome, RoundResult } from '../types'
import { usePlayerStore } from './player'
import { useSettingsStore } from './settings'

export const useRoundStore = defineStore('round', () => {
  const playerStore = usePlayerStore()
  const settings = useSettingsStore()

  const bets = ref<Record<string, number>>({})
  const selectedChip = ref<number>(CHIPS[0].value)
  const isSpinning = ref(false)
  const activeRound = ref<ActiveRound | null>(null)

  const totalBet = computed(() =>
    Object.values(bets.value).reduce((sum, amount) => sum + amount, 0),
  )
  const balance = computed(() => playerStore.player?.balance ?? 0)
  const availableBalance = computed(() =>
    isSpinning.value ? balance.value : balance.value - totalBet.value,
  )
  const canConfirm = computed(
    () =>
      !isSpinning.value &&
      totalBet.value > 0 &&
      totalBet.value <= balance.value,
  )
  const canClear = computed(() => !isSpinning.value && totalBet.value > 0)

  // bets are tied to a ruleset
  watch(
    () => settings.rulesetId,
    () => {
      if (!isSpinning.value) bets.value = {}
    },
  )

  const getBetAmount = (betId: string) => bets.value[betId] ?? 0

  const selectChip = (value: number) => (selectedChip.value = value)

  const placeBet = (betId: string) => {
    if (isSpinning.value || !playerStore.player) return false
    if (totalBet.value + selectedChip.value > balance.value) return false

    bets.value[betId] = getBetAmount(betId) + selectedChip.value
    return true
  }

  const clearBets = () => {
    if (isSpinning.value) return false

    bets.value = {}
    return true
  }

  const startRound = () => {
    if (isSpinning.value || !playerStore.player) return null
    if (!canConfirm.value) return null

    isSpinning.value = true
    activeRound.value = {
      rulesetId: settings.rulesetId,
      placedBets: { ...bets.value },
      totalStaked: totalBet.value,
      balanceAfterStake: balance.value - totalBet.value,
    }

    playerStore.updateBalance(activeRound.value.balanceAfterStake)

    return activeRound.value
  }

  const finishRound = (winNumber: number): RoundResult | null => {
    const round = activeRound.value
    if (!round) {
      isSpinning.value = false
      return null
    }

    const totalWon = calculateWinnings(
      round.placedBets,
      winNumber,
      getRuleset(round.rulesetId),
    )
    const net = totalWon - round.totalStaked
    const outcome: RoundOutcome =
      net > 0
        ? ROUND_OUTCOME.WIN
        : net < 0
          ? ROUND_OUTCOME.LOSE
          : ROUND_OUTCOME.PUSH

    const newBalance = round.balanceAfterStake + totalWon
    const bankrupt = newBalance <= 0
    const finalBalance = bankrupt ? START_BALANCE : newBalance

    playerStore.updateBalance(finalBalance)

    bets.value = {}
    activeRound.value = null
    isSpinning.value = false

    return {
      winNumber,
      totalStaked: round.totalStaked,
      totalWon,
      net,
      outcome,
      balance: finalBalance,
      bankrupt,
    }
  }

  return {
    bets,
    selectedChip,
    isSpinning,
    activeRound,
    totalBet,
    balance,
    availableBalance,
    canConfirm,
    canClear,

    getBetAmount,
    selectChip,
    placeBet,
    clearBets,
    startRound,
    finishRound,
  }
})

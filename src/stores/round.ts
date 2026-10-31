import { defineStore } from 'pinia'
import { computed, ref, shallowRef, watch } from 'vue'
import { CHIPS, ROUND_OUTCOME, START_BALANCE } from '../const'
import { bestPayout, calculateWinnings, summarizeBets } from '../utils/bets'
import { randomHalfStart } from '../utils/boosts'
import type { ActiveRound, Pocket, RoundOutcome, RoundResult } from '../types'
import { useBoostSelection } from '../composables/useBoostSelection'
import { useHistoryStore } from './history'
import { usePlayerStore } from './player'
import { useSettingsStore } from './settings'

export const useRoundStore = defineStore('round', () => {
  const playerStore = usePlayerStore()
  const settings = useSettingsStore()
  const history = useHistoryStore()

  const bets = ref<Record<string, number>>({})
  const selectedChip = ref<number>(CHIPS[0].value)
  const isSpinning = ref(false)
  const gameOverOpen = ref(false)
  const activeRound = shallowRef<ActiveRound | null>(null)

  const slip = computed(() => summarizeBets(settings.game, bets.value))
  const totalBet = computed(() => slip.value.total)
  const { activeBoosts, boostCost, canAddBoost, toggleBoost, clearBoosts } =
    useBoostSelection({ slip, isSpinning })
  const totalOutlay = computed(() => totalBet.value + boostCost.value)
  const availableBalance = computed(
    () => playerStore.balance - totalOutlay.value,
  )
  const displayedBalance = computed(
    () => playerStore.balance - (activeRound.value?.totalStaked ?? 0),
  )
  const maxWin = computed(() =>
    totalBet.value
      ? bestPayout(settings.game, slip.value) - totalOutlay.value
      : 0,
  )
  const canConfirm = computed(
    () =>
      !isSpinning.value &&
      totalBet.value > 0 &&
      totalOutlay.value <= playerStore.balance,
  )
  const canClear = computed(() => !isSpinning.value && totalBet.value > 0)

  watch(
    () => settings.rulesetId,
    () => {
      if (!isSpinning.value) bets.value = {}
    },
  )

  watch(availableBalance, (available) => {
    if (selectedChip.value <= available) return

    const affordable = CHIPS.filter((chip) => chip.value <= available).at(-1)
    if (affordable) selectedChip.value = affordable.value
  })

  const getBetAmount = (betId: string) => bets.value[betId] ?? 0

  const selectChip = (value: number) => (selectedChip.value = value)

  const placeBet = (betId: string) => {
    if (isSpinning.value || !playerStore.player) return false
    if (totalBet.value + selectedChip.value > playerStore.balance) return false

    bets.value[betId] = getBetAmount(betId) + selectedChip.value
    return true
  }

  const clearBets = () => {
    if (!isSpinning.value) bets.value = {}
  }

  const startRound = () => {
    if (!canConfirm.value || !playerStore.player) return null

    isSpinning.value = true
    activeRound.value = {
      game: settings.game,
      slip: slip.value,
      boosts: [...activeBoosts.value],
      halfStart: randomHalfStart(settings.game.ruleset),
      totalStaked: totalOutlay.value,
    }

    return activeRound.value
  }

  const finishRound = (pocket: Pocket): RoundResult | null => {
    const round = activeRound.value
    if (!round) {
      isSpinning.value = false
      return null
    }

    const totalWon = calculateWinnings(round.game, round.slip, pocket.id)
    const net = totalWon - round.totalStaked
    const outcome: RoundOutcome =
      net > 0
        ? ROUND_OUTCOME.WIN
        : net < 0
          ? ROUND_OUTCOME.LOSE
          : ROUND_OUTCOME.PUSH

    const newBalance = playerStore.balance + net
    const bankrupt = newBalance <= 0

    playerStore.updateBalance(bankrupt ? START_BALANCE : newBalance)
    if (bankrupt) gameOverOpen.value = true

    if (playerStore.activeName) {
      history.add({
        player: playerStore.activeName,
        rulesetId: round.game.ruleset.id,
        modeId: round.game.mode.id,
        pocketId: pocket.id,
        label: pocket.label,
        color: pocket.color,
        staked: round.totalStaked,
        won: totalWon,
        net,
        outcome,
        at: Date.now(),
      })
    }

    bets.value = {}
    clearBoosts()
    activeRound.value = null
    isSpinning.value = false

    return { net, outcome }
  }

  return {
    bets,
    selectedChip,
    isSpinning,
    gameOverOpen,
    slip,
    totalBet,
    activeBoosts,
    boostCost,
    availableBalance,
    displayedBalance,
    maxWin,
    canConfirm,
    canClear,

    getBetAmount,
    selectChip,
    placeBet,
    canAddBoost,
    toggleBoost,
    clearBoosts,
    clearBets,
    startRound,
    finishRound,
  }
})

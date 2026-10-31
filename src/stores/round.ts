import { defineStore } from 'pinia'
import { computed, ref, watch } from 'vue'
import { CHIPS, ROUND_OUTCOME, START_BALANCE } from '../const'
import { bestPayout, calculateWinnings } from '../utils/bets'
import { boostsCost, isBoostUsable, randomHalfStart } from '../utils/boosts'
import { getRuleset } from '../utils/rulesets'
import type {
  ActiveRound,
  BoostId,
  Pocket,
  RoundOutcome,
  RoundResult,
} from '../types'
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
  const activeRound = ref<ActiveRound | null>(null)
  const chosenBoosts = ref<BoostId[]>([])

  const totalBet = computed(() =>
    Object.values(bets.value).reduce((sum, amount) => sum + amount, 0),
  )
  const activeBoosts = computed(() =>
    chosenBoosts.value.filter(
      (id) =>
        settings.mode.boosts.includes(id) &&
        isBoostUsable(id, bets.value, settings.ruleset),
    ),
  )
  const boostCost = computed(() =>
    boostsCost(activeBoosts.value, bets.value, settings.ruleset),
  )
  const totalOutlay = computed(() => totalBet.value + boostCost.value)
  const availableBalance = computed(
    () => playerStore.balance - totalOutlay.value,
  )
  const displayedBalance = computed(
    () => playerStore.balance - (activeRound.value?.totalStaked ?? 0),
  )
  const maxWin = computed(() =>
    totalBet.value
      ? bestPayout(bets.value, settings.ruleset, settings.modeId) -
        totalOutlay.value
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

  watch(
    () => settings.modeId,
    () => (chosenBoosts.value = []),
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

  const canAddBoost = (id: BoostId) =>
    isBoostUsable(id, bets.value, settings.ruleset) &&
    totalOutlay.value + boostsCost([id], bets.value, settings.ruleset) <=
      playerStore.balance

  const toggleBoost = (id: BoostId) => {
    if (isSpinning.value) return

    if (chosenBoosts.value.includes(id)) {
      chosenBoosts.value = chosenBoosts.value.filter((chosen) => chosen !== id)
    } else if (canAddBoost(id)) chosenBoosts.value.push(id)
  }

  const clearBoosts = () => (chosenBoosts.value = [])

  const clearBets = () => {
    if (!isSpinning.value) bets.value = {}
  }

  const startRound = () => {
    if (!canConfirm.value || !playerStore.player) return null

    isSpinning.value = true
    activeRound.value = {
      rulesetId: settings.rulesetId,
      modeId: settings.modeId,
      placedBets: { ...bets.value },
      boosts: [...activeBoosts.value],
      halfStart: randomHalfStart(settings.ruleset),
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

    const totalWon = calculateWinnings(
      round.placedBets,
      pocket.id,
      getRuleset(round.rulesetId),
      round.modeId,
    )
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
        rulesetId: round.rulesetId,
        modeId: round.modeId,
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
    chosenBoosts.value = []
    activeRound.value = null
    isSpinning.value = false

    return { net, outcome }
  }

  return {
    bets,
    selectedChip,
    isSpinning,
    gameOverOpen,
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

import { storeToRefs } from 'pinia'
import { computed } from 'vue'
import { useRoundStore } from '../stores/round'
import { formatMoneyAmount, formatSigned } from '../utils/format'

export const useRoundSummary = () => {
  const { availableBalance, totalBet, boostCost, maxWin } =
    storeToRefs(useRoundStore())

  return {
    balance: computed(() => ({
      label: 'Saldo',
      value: formatMoneyAmount(availableBalance.value),
      class: 'text-gold',
    })),
    bet: computed(() => ({
      label: 'Zakład',
      value: formatMoneyAmount(totalBet.value),
    })),
    bonus: computed(() => ({
      label: 'Bonusy',
      value: formatMoneyAmount(boostCost.value),
    })),
    maxWin: computed(() => ({
      label: 'Maks. zysk',
      value: maxWin.value > 0 ? formatSigned(maxWin.value) : '—',
      class: 'text-win',
    })),
  }
}

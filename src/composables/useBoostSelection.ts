import { computed, ref, watch, type Ref } from 'vue'
import { usePlayerStore } from '../stores/player'
import { useSettingsStore } from '../stores/settings'
import type { BoostId, Slip } from '../types'
import { boostsCost, isBoostUsable } from '../utils/boosts'

type BoostSelectionInputs = {
  slip: Ref<Slip>
  isSpinning: Ref<boolean>
}

export const useBoostSelection = ({
  slip,
  isSpinning,
}: BoostSelectionInputs) => {
  const playerStore = usePlayerStore()
  const settings = useSettingsStore()

  const chosenBoosts = ref<BoostId[]>([])

  const activeBoosts = computed(() =>
    chosenBoosts.value.filter(
      (id) =>
        settings.game.mode.boosts.includes(id) && isBoostUsable(id, slip.value),
    ),
  )
  const boostCost = computed(() => boostsCost(activeBoosts.value, slip.value))

  watch(
    () => settings.modeId,
    () => (chosenBoosts.value = []),
  )

  const canAddBoost = (id: BoostId) =>
    isBoostUsable(id, slip.value) &&
    slip.value.total + boostCost.value + boostsCost([id], slip.value) <=
      playerStore.balance

  const toggleBoost = (id: BoostId) => {
    if (isSpinning.value) return

    if (chosenBoosts.value.includes(id)) {
      chosenBoosts.value = chosenBoosts.value.filter((chosen) => chosen !== id)
    } else if (canAddBoost(id)) chosenBoosts.value.push(id)
  }

  const clearBoosts = () => (chosenBoosts.value = [])

  return { activeBoosts, boostCost, canAddBoost, toggleBoost, clearBoosts }
}

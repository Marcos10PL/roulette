<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { computed } from 'vue'
import { BOOST_BLOCK, BOOSTS } from '../const'
import { useRoundStore } from '../stores/round'
import { useSettingsStore } from '../stores/settings'
import { boostBlock, boostCost, isBoostUsable } from '../utils/boosts'
import { formatMoneyAmount } from '../utils/format'
import OptionCard from './ui/OptionCard.vue'
import type { BoostBlock, BoostId } from '../types/index.ts'

const BOOST_BLOCK_LABEL = {
  [BOOST_BLOCK.NO_NUMBER]: 'Wymaga zakładu na jeden numer.',
  [BOOST_BLOCK.ZERO_BET]: 'Niedostępny - zakład zawiera zero.',
} as const satisfies Record<BoostBlock, string>

const roundStore = useRoundStore()
const { bets, activeBoosts } = storeToRefs(roundStore)
const { canAddBoost, toggleBoost } = roundStore

const { mode, ruleset } = storeToRefs(useSettingsStore())

const reasonFor = (id: BoostId) => {
  const block = boostBlock(id, bets.value, ruleset.value)
  if (block) return BOOST_BLOCK_LABEL[block]

  return !activeBoosts.value.includes(id) && !canAddBoost(id)
    ? 'Za mało monet.'
    : null
}

const rows = computed(() =>
  BOOSTS.filter((boost) => mode.value.boosts.includes(boost.id)).map(
    (boost) => {
      const reason = reasonFor(boost.id)

      return {
        boost,
        reason,
        aside: isBoostUsable(boost.id, bets.value, ruleset.value)
          ? formatMoneyAmount(boostCost(boost.id, bets.value, ruleset.value))
          : '—',
      }
    },
  ),
)
</script>

<template>
  <div class="flex flex-col gap-2">
    <OptionCard
      v-for="{ boost, reason, aside } in rows"
      :key="boost.id"
      :title="boost.name"
      :description="boost.description"
      :aside="aside"
      :note="reason ?? ''"
      :active="activeBoosts.includes(boost.id)"
      :disabled="reason !== null"
      @click="toggleBoost(boost.id)"
    />
  </div>
</template>

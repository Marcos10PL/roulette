<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { vStagger } from '../directives/animate'
import { useRoundStore } from '../stores/round'
import { useSettingsStore } from '../stores/settings'
import { RULESETS } from '../utils/rulesets'
import SegmentedControl from './ui/SegmentedControl.vue'

const { rulesetId } = storeToRefs(useSettingsStore())
const { isSpinning } = storeToRefs(useRoundStore())

const options = RULESETS.map((ruleset) => ({
  value: ruleset.id,
  label: ruleset.shortName,
  ariaLabel: ruleset.name,
}))
</script>

<template>
  <SegmentedControl
    v-model="rulesetId"
    v-stagger="{ y: 16 }"
    :options="options"
    label="Rodzaj ruletki"
    :disabled="isSpinning"
  />
</template>

<script setup lang="ts">
import { vStagger } from '../directives/animate'
import { useRoundStore } from '../stores/round'
import { useSettingsStore } from '../stores/settings'
import { RULESETS } from '../utils/rulesets'
import SegmentedControl from './ui/SegmentedControl.vue'

const settings = useSettingsStore()
const roundStore = useRoundStore()

const options = RULESETS.map((ruleset) => ({
  value: ruleset.id,
  label: ruleset.shortName,
  ariaLabel: ruleset.name,
}))
</script>

<template>
  <SegmentedControl
    v-model="settings.rulesetId"
    v-stagger="{ y: 16 }"
    :options="options"
    label="Rodzaj ruletki"
    :disabled="roundStore.isSpinning"
    class="fixed bottom-4 left-4 z-10 flex-col"
  />
</template>

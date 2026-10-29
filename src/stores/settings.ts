import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { RULESET_ID } from '../const'
import type { RulesetId } from '../types'
import { getRuleset } from '../utils/rulesets'

export const useSettingsStore = defineStore(
  'settings',
  () => {
    const rulesetId = ref<RulesetId>(RULESET_ID.EUROPEAN)
    const ruleset = computed(() => getRuleset(rulesetId.value))

    return { rulesetId, ruleset }
  },
  { persist: { key: 'roulette-settings', pick: ['rulesetId'] } },
)

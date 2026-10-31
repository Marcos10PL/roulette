import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { MODE_ID, RULESET_ID } from '../const'
import type { ModeId, RulesetId } from '../types'
import { getMode, goldenPocketIds } from '../utils/modes'
import { getRuleset } from '../utils/rulesets'

export const useSettingsStore = defineStore(
  'settings',
  () => {
    const rulesetId = ref<RulesetId>(RULESET_ID.EUROPEAN)
    const ruleset = computed(() => getRuleset(rulesetId.value))

    const modeId = ref<ModeId>(MODE_ID.STANDARD)
    const mode = computed(() => getMode(modeId.value))

    const goldPocketIds = computed(() =>
      goldenPocketIds(ruleset.value, modeId.value),
    )

    return { rulesetId, ruleset, modeId, mode, goldPocketIds }
  },
  { persist: { key: 'roulette-settings', pick: ['rulesetId', 'modeId'] } },
)

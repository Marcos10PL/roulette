import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { MODE_ID, RULESET_ID } from '../const'
import type { ModeId, RulesetId } from '../types'
import { createGame } from '../utils/game'

export const useSettingsStore = defineStore(
  'settings',
  () => {
    const rulesetId = ref<RulesetId>(RULESET_ID.EUROPEAN)
    const modeId = ref<ModeId>(MODE_ID.STANDARD)

    const game = computed(() => createGame(rulesetId.value, modeId.value))

    return { rulesetId, modeId, game }
  },
  { persist: { key: 'roulette-settings', pick: ['rulesetId', 'modeId'] } },
)

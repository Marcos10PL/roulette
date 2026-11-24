import {
  BET_KIND,
  GOLDEN_POCKETS,
  GOLDEN_SECTOR,
  MODE_ID,
  MODES,
} from '../const'
import type { BetDefinition, Game, Mode, ModeId, RulesetId } from '../types'
import { getRuleset } from './rulesets'

export const getMode = (id: ModeId): Mode =>
  MODES.find((mode) => mode.id === id) ?? MODES[0]

export const createGame = (rulesetId: RulesetId, modeId: ModeId): Game => {
  const ruleset = getRuleset(rulesetId)
  const mode = getMode(modeId)

  // golden numbers
  const goldenIds = new Set<number>(
    mode.id === MODE_ID.GOLDEN_SECTOR ? GOLDEN_POCKETS[ruleset.id] : [],
  )

  // golden weight (w)
  // (6 * w) / (6 * w + 31) = 3%
  // w = 3% * 31 / ((1 - 3%) * 6)
  const others = ruleset.pockets.length - goldenIds.size
  const goldenWeight = goldenIds.size
    ? (GOLDEN_SECTOR.CHANCE * others) /
      ((1 - GOLDEN_SECTOR.CHANCE) * goldenIds.size)
    : 1

  const isGolden = (bet: BetDefinition) =>
    bet.kind === BET_KIND.NUMBER && goldenIds.has(bet.value ?? -1)

  return {
    ruleset,
    mode,
    goldenIds,
    weights: ruleset.pockets.map((pocket) =>
      goldenIds.has(pocket.id) ? goldenWeight : 1,
    ),
    // odds for each bet
    odds: Object.fromEntries(
      ruleset.bets.map((bet) => [
        bet.id,
        mode.goldenOdds && isGolden(bet)
          ? mode.goldenOdds
          : mode.odds[bet.kind],
      ]),
    ),
    // map of bets by id for quick lookup
    betsById: new Map(ruleset.bets.map((bet) => [bet.id, bet] as const)),
  }
}

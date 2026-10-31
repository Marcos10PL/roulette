import {
  BET_KIND,
  GOLDEN_POCKETS,
  GOLDEN_SECTOR,
  MODE_ID,
  MODES,
} from '../const'
import type {
  BetDefinition,
  BoostContext,
  Mode,
  ModeId,
  Ruleset,
} from '../types'
import { applyBoosts } from './boosts'

export const getMode = (id: ModeId): Mode =>
  MODES.find((mode) => mode.id === id) ?? MODES[0]

export const goldenPocketIds = (ruleset: Ruleset, modeId: ModeId): number[] =>
  modeId === MODE_ID.GOLDEN_SECTOR ? [...GOLDEN_POCKETS[ruleset.id]] : []

const modeWeights = (ruleset: Ruleset, modeId: ModeId) => {
  const golden = goldenPocketIds(ruleset, modeId)
  if (!golden.length) return ruleset.pockets.map(() => 1)

  const others = ruleset.pockets.length - golden.length
  const goldenWeight =
    (GOLDEN_SECTOR.CHANCE * others) /
    ((1 - GOLDEN_SECTOR.CHANCE) * golden.length)

  return ruleset.pockets.map((pocket) =>
    golden.includes(pocket.id) ? goldenWeight : 1,
  )
}

export const pocketWeights = (
  ruleset: Ruleset,
  modeId: ModeId,
  context: BoostContext,
) => applyBoosts(modeWeights(ruleset, modeId), ruleset, context)

export const isGoldenBet = (
  bet: BetDefinition,
  ruleset: Ruleset,
  modeId: ModeId,
) =>
  bet.kind === BET_KIND.NUMBER &&
  goldenPocketIds(ruleset, modeId).includes(bet.value ?? -1)

export const oddsFor = (
  bet: BetDefinition,
  ruleset: Ruleset,
  modeId: ModeId,
) => {
  const { odds, goldenOdds } = getMode(modeId)

  return goldenOdds && isGoldenBet(bet, ruleset, modeId)
    ? goldenOdds
    : odds[bet.kind]
}

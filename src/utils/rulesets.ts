import {
  DOUBLE_ZERO,
  POCKET_COLOR,
  RED_NUMBERS,
  RULESET_DEFINITIONS,
  RULESET_ID,
} from '../const'
import type { Pocket, Ruleset, RulesetId } from '../types'
import { buildBets } from './bets'

const buildPockets = (wheel: number[]): Pocket[] =>
  wheel.map((id) => {
    const isZero = id === 0 || id === DOUBLE_ZERO

    return {
      id,
      label: id === DOUBLE_ZERO ? '00' : String(id),
      color: isZero
        ? POCKET_COLOR.GREEN
        : RED_NUMBERS.includes(id)
          ? POCKET_COLOR.RED
          : POCKET_COLOR.BLACK,
    }
  })

const createRuleset = (id: RulesetId): Ruleset => {
  const { name, shortName, wheel } = RULESET_DEFINITIONS[id]
  const pockets = buildPockets(wheel)
  return { id, name, shortName, pockets, bets: buildBets(pockets) }
}

const RULESET_BY_ID: Record<RulesetId, Ruleset> = {
  [RULESET_ID.EUROPEAN]: createRuleset(RULESET_ID.EUROPEAN),
  [RULESET_ID.AMERICAN]: createRuleset(RULESET_ID.AMERICAN),
}

export const RULESETS = Object.values(RULESET_BY_ID)

export const getRuleset = (id: RulesetId) =>
  RULESET_BY_ID[id] ?? RULESET_BY_ID[RULESET_ID.EUROPEAN]

export const drawWinningIndex = (weights: number[]) => {
  let roll = Math.random() * weights.reduce((sum, weight) => sum + weight, 0)

  for (const [index, weight] of weights.entries()) {
    roll -= weight
    if (roll < 0) return index
  }

  return weights.length - 1
}

import {
  BET_IDS,
  BOOST_BLOCK,
  BOOST_ID,
  BOOSTS,
  BET_KIND,
  MAGNET,
  POCKET_COLOR,
} from '../const'
import type { BoostBlock, BoostContext, BoostId, Ruleset } from '../types'

type PlacedBets = Record<string, number>

const getBoost = (id: BoostId) =>
  BOOSTS.find((boost) => boost.id === id) ?? BOOSTS[0]

const numberBets = (placedBets: PlacedBets, ruleset: Ruleset) =>
  ruleset.bets.filter(
    (bet) =>
      bet.kind === BET_KIND.NUMBER &&
      bet.value !== undefined &&
      (placedBets[bet.id] ?? 0) > 0,
  )

export const magnetTarget = (placedBets: PlacedBets, ruleset: Ruleset) => {
  const numbers = numberBets(placedBets, ruleset)
  if (numbers.length !== 1) return null

  return { id: numbers[0].value as number, amount: placedBets[numbers[0].id] }
}

const total = (placedBets: PlacedBets) =>
  Object.values(placedBets).reduce((sum, amount) => sum + amount, 0)

const betsOnZero = (placedBets: PlacedBets, ruleset: Ruleset) =>
  ruleset.pockets.some(
    (pocket) =>
      pocket.color === POCKET_COLOR.GREEN &&
      (placedBets[`${BET_IDS.NUMBER}${pocket.id}`] ?? 0) > 0,
  )

const costBase = (id: BoostId, placedBets: PlacedBets, ruleset: Ruleset) => {
  if (id === BOOST_ID.MAGNET) {
    return magnetTarget(placedBets, ruleset)?.amount ?? 0
  }

  if (id === BOOST_ID.ZERO_BLOCK && betsOnZero(placedBets, ruleset)) return 0

  return total(placedBets)
}

export const boostBlock = (
  id: BoostId,
  placedBets: PlacedBets,
  ruleset: Ruleset,
): BoostBlock | null => {
  if (id === BOOST_ID.MAGNET) {
    return magnetTarget(placedBets, ruleset) ? null : BOOST_BLOCK.NO_NUMBER
  }

  if (id === BOOST_ID.ZERO_BLOCK && betsOnZero(placedBets, ruleset)) {
    return BOOST_BLOCK.ZERO_BET
  }

  return null
}

export const isBoostUsable = (
  id: BoostId,
  placedBets: PlacedBets,
  ruleset: Ruleset,
) =>
  boostBlock(id, placedBets, ruleset) === null &&
  costBase(id, placedBets, ruleset) > 0

export const boostCost = (
  id: BoostId,
  placedBets: PlacedBets,
  ruleset: Ruleset,
) =>
  Math.ceil(
    (getBoost(id).pricePercent * costBase(id, placedBets, ruleset)) / 100,
  )

export const boostsCost = (
  ids: BoostId[],
  placedBets: PlacedBets,
  ruleset: Ruleset,
) => ids.reduce((sum, id) => sum + boostCost(id, placedBets, ruleset), 0)

export const randomHalfStart = (ruleset: Ruleset) =>
  Math.floor(Math.random() * ruleset.pockets.length)

export const applyBoosts = (
  weights: number[],
  ruleset: Ruleset,
  { boosts, placedBets, halfStart }: BoostContext,
) => {
  const result = [...weights]
  const count = ruleset.pockets.length
  const half = Math.ceil(count / 2)

  const magnet = boosts.includes(BOOST_ID.MAGNET)
    ? magnetTarget(placedBets, ruleset)
    : null
  const blocksZero = boosts.includes(BOOST_ID.ZERO_BLOCK)
  const halvesWheel = boosts.includes(BOOST_ID.HALF_WHEEL)

  for (const [index, pocket] of ruleset.pockets.entries()) {
    if (pocket.id === magnet?.id) result[index] *= MAGNET.WEIGHT
    if (blocksZero && pocket.color === POCKET_COLOR.GREEN) result[index] = 0
    if (halvesWheel && (index - halfStart + count) % count >= half) {
      result[index] = 0
    }
  }

  return result
}

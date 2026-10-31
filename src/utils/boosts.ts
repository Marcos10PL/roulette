import { BOOST_BLOCK, BOOST_ID, BOOSTS, MAGNET, POCKET_COLOR } from '../const'
import type {
  BoostBlock,
  BoostContext,
  BoostId,
  Game,
  Ruleset,
  Slip,
} from '../types'

const getBoost = (id: BoostId) =>
  BOOSTS.find((boost) => boost.id === id) ?? BOOSTS[0]

export const magnetTarget = (slip: Slip) =>
  slip.numbers.length === 1 ? slip.numbers[0] : null

const costBase = (id: BoostId, slip: Slip) => {
  if (id === BOOST_ID.MAGNET) return magnetTarget(slip)?.amount ?? 0
  if (id === BOOST_ID.ZERO_BLOCK && slip.onZero) return 0

  return slip.total
}

export const boostBlock = (id: BoostId, slip: Slip): BoostBlock | null => {
  if (id === BOOST_ID.MAGNET) {
    return magnetTarget(slip) ? null : BOOST_BLOCK.NO_NUMBER
  }

  if (id === BOOST_ID.ZERO_BLOCK && slip.onZero) return BOOST_BLOCK.ZERO_BET

  return null
}

export const isBoostUsable = (id: BoostId, slip: Slip) =>
  boostBlock(id, slip) === null && costBase(id, slip) > 0

export const boostCost = (id: BoostId, slip: Slip) =>
  Math.ceil((getBoost(id).pricePercent * costBase(id, slip)) / 100)

export const boostsCost = (ids: BoostId[], slip: Slip) =>
  ids.reduce((sum, id) => sum + boostCost(id, slip), 0)

export const randomHalfStart = (ruleset: Ruleset) =>
  Math.floor(Math.random() * ruleset.pockets.length)

export const applyBoosts = (
  { ruleset, weights }: Game,
  { boosts, slip, halfStart }: BoostContext,
) => {
  const result = [...weights]
  const count = ruleset.pockets.length
  const half = Math.ceil(count / 2)

  const magnet = boosts.includes(BOOST_ID.MAGNET) ? magnetTarget(slip) : null
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

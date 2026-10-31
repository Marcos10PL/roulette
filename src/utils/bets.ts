import { BET_IDS, BET_KIND, POCKET_COLOR, POCKET_COLOR_LABEL } from '../const'
import type { BetDefinition, ModeId, Pocket, Ruleset } from '../types'
import { oddsFor } from './modes'

const isRegular = (nr: number) => nr >= 1 && nr <= 36

// columns are numbered 1-3; column 3 holds the multiples of 3
const columnBets: BetDefinition[] = [1, 2, 3].map((column) => ({
  id: `${BET_IDS.COLUMN}${column}`,
  label: '2 do 1',
  kind: BET_KIND.COLUMN,
  value: column,
  wins: (winNumber) => isRegular(winNumber) && winNumber % 3 === column % 3,
}))

const dozenBets: BetDefinition[] = [1, 2, 3].map((dozen) => ({
  id: `${BET_IDS.DOZEN}${dozen}`,
  label: `${dozen}. 12`,
  kind: BET_KIND.DOZEN,
  value: dozen,
  wins: (winNumber) =>
    winNumber >= (dozen - 1) * 12 + 1 && winNumber <= dozen * 12,
}))

export const buildBets = (pockets: Pocket[]): BetDefinition[] => {
  const hasColor = (color: Pocket['color']) => (winNumber: number) =>
    pockets.some((p) => p.id === winNumber && p.color === color)

  const numberBets: BetDefinition[] = [...pockets]
    .sort((a, b) => a.id - b.id)
    .map(({ id, label, color }) => ({
      id: `${BET_IDS.NUMBER}${id}`,
      label,
      kind: BET_KIND.NUMBER,
      value: id,
      color,
      wins: (winNumber) => winNumber === id,
    }))

  const outsideBets: BetDefinition[] = [
    {
      id: BET_IDS.LOW,
      label: '1 - 18',
      kind: BET_KIND.OUTSIDE,
      wins: (winNumber) => winNumber >= 1 && winNumber <= 18,
    },
    {
      id: BET_IDS.EVEN,
      label: 'Parzyste',
      kind: BET_KIND.OUTSIDE,
      wins: (winNumber) => isRegular(winNumber) && winNumber % 2 === 0,
    },
    {
      id: BET_IDS.RED,
      label: POCKET_COLOR_LABEL[POCKET_COLOR.RED],
      kind: BET_KIND.OUTSIDE,
      color: POCKET_COLOR.RED,
      wins: hasColor(POCKET_COLOR.RED),
    },
    {
      id: BET_IDS.BLACK,
      label: POCKET_COLOR_LABEL[POCKET_COLOR.BLACK],
      kind: BET_KIND.OUTSIDE,
      color: POCKET_COLOR.BLACK,
      wins: hasColor(POCKET_COLOR.BLACK),
    },
    {
      id: BET_IDS.ODD,
      label: 'Nieparzyste',
      kind: BET_KIND.OUTSIDE,
      wins: (winNumber) => isRegular(winNumber) && winNumber % 2 === 1,
    },
    {
      id: BET_IDS.HIGH,
      label: '19 - 36',
      kind: BET_KIND.OUTSIDE,
      wins: (winNumber) => winNumber >= 19 && winNumber <= 36,
    },
  ]

  return [...numberBets, ...columnBets, ...dozenBets, ...outsideBets]
}

const getBet = (ruleset: Ruleset, betId: string) =>
  ruleset.bets.find((bet) => bet.id === betId)

export const calculateWinnings = (
  placedBets: Record<string, number>,
  winNumber: number,
  ruleset: Ruleset,
  modeId: ModeId,
) => {
  let totalWon = 0

  for (const [betId, amount] of Object.entries(placedBets)) {
    const bet = getBet(ruleset, betId)
    if (bet?.wins(winNumber)) {
      totalWon += amount * (oddsFor(bet, ruleset, modeId) + 1)
    }
  }

  return totalWon
}

export const coveredPocketIds = (
  placedBets: Record<string, number>,
  ruleset: Ruleset,
) => {
  const bets = ruleset.bets.filter((bet) => (placedBets[bet.id] ?? 0) > 0)

  return ruleset.pockets
    .filter((pocket) => bets.some((bet) => bet.wins(pocket.id)))
    .map((pocket) => pocket.id)
}

export const bestPayout = (
  placedBets: Record<string, number>,
  ruleset: Ruleset,
  modeId: ModeId,
) =>
  Math.max(
    0,
    ...ruleset.pockets.map((pocket) =>
      calculateWinnings(placedBets, pocket.id, ruleset, modeId),
    ),
  )

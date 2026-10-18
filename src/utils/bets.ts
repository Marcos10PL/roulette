import { BET_IDS, BET_KIND, ODDS, POCKET_COLOR } from '../const'
import type { BetDefinition, Pocket, Ruleset } from '../types'

const isRegular = (nr: number) => nr >= 1 && nr <= 36

// columns are numbered 1-3; column 3 holds the multiples of 3
const columnBets: BetDefinition[] = [1, 2, 3].map((column) => ({
  id: `${BET_IDS.COLUMN}${column}`,
  label: '2 do 1',
  kind: BET_KIND.COLUMN,
  odds: ODDS.DOZEN_COLUMN,
  wins: (winNumber) => isRegular(winNumber) && winNumber % 3 === column % 3,
}))

const dozenBets: BetDefinition[] = [1, 2, 3].map((dozen) => ({
  id: `${BET_IDS.DOZEN}${dozen}`,
  label: `${dozen}. 12`,
  kind: BET_KIND.DOZEN,
  odds: ODDS.DOZEN_COLUMN,
  wins: (winNumber) =>
    winNumber >= (dozen - 1) * 12 + 1 && winNumber <= dozen * 12,
}))

export const buildBets = (pockets: Pocket[]): BetDefinition[] => {
  const hasColor = (color: Pocket['color']) => (winNumber: number) =>
    pockets.some((p) => p.id === winNumber && p.color === color)

  const numberBets: BetDefinition[] = [...pockets]
    .sort((a, b) => a.id - b.id)
    .map(({ id, label }) => ({
      id: `${BET_IDS.NUMBER}${id}`,
      label,
      kind: BET_KIND.NUMBER,
      odds: ODDS.NUMBER,
      wins: (winNumber) => winNumber === id,
    }))

  const outsideBets: BetDefinition[] = [
    {
      id: BET_IDS.LOW,
      label: '1 - 18',
      kind: BET_KIND.OUTSIDE,
      odds: ODDS.EVEN_MONEY,
      wins: (winNumber) => winNumber >= 1 && winNumber <= 18,
    },
    {
      id: BET_IDS.EVEN,
      label: 'Parzyste',
      kind: BET_KIND.OUTSIDE,
      odds: ODDS.EVEN_MONEY,
      wins: (winNumber) => isRegular(winNumber) && winNumber % 2 === 0,
    },
    {
      id: BET_IDS.RED,
      label: 'Czerwone',
      kind: BET_KIND.OUTSIDE,
      odds: ODDS.EVEN_MONEY,
      wins: hasColor(POCKET_COLOR.RED),
    },
    {
      id: BET_IDS.BLACK,
      label: 'Czarne',
      kind: BET_KIND.OUTSIDE,
      odds: ODDS.EVEN_MONEY,
      wins: hasColor(POCKET_COLOR.BLACK),
    },
    {
      id: BET_IDS.ODD,
      label: 'Nieparzyste',
      kind: BET_KIND.OUTSIDE,
      odds: ODDS.EVEN_MONEY,
      wins: (winNumber) => isRegular(winNumber) && winNumber % 2 === 1,
    },
    {
      id: BET_IDS.HIGH,
      label: '19 - 36',
      kind: BET_KIND.OUTSIDE,
      odds: ODDS.EVEN_MONEY,
      wins: (winNumber) => winNumber >= 19 && winNumber <= 36,
    },
  ]

  return [...numberBets, ...columnBets, ...dozenBets, ...outsideBets]
}

export const getBet = (ruleset: Ruleset, betId: string) =>
  ruleset.bets.find((bet) => bet.id === betId)

export const calculateWinnings = (
  placedBets: Record<string, number>,
  winNumber: number,
  ruleset: Ruleset,
) => {
  let totalWon = 0

  for (const [betId, amount] of Object.entries(placedBets)) {
    const bet = getBet(ruleset, betId)
    if (bet?.wins(winNumber)) totalWon += amount * (bet.odds + 1)
  }

  return totalWon
}

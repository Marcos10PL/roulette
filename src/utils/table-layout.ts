import { BET_IDS, BET_KIND, DOUBLE_ZERO, POCKET_COLOR_TOKEN } from '../const'
import { cssVar } from './theme'
import { isGoldenBet, oddsFor } from './modes'
import type {
  BetDefinition,
  BetKind,
  CellPlacement,
  ModeId,
  Ruleset,
  TableCell,
} from '../types'

const TABLE_COLUMNS = 14
const SUB_ROWS = 2
const NUMBER_ROWS = 3
const NUMBER_GRID_ROWS = NUMBER_ROWS * SUB_ROWS
const DOZEN_GRID_ROW = NUMBER_GRID_ROWS + 1
const OUTSIDE_GRID_ROW = NUMBER_GRID_ROWS + 2
const TABLE_ROWS = OUTSIDE_GRID_ROW

export const TABLE_GRID_STYLE = {
  gridTemplateColumns: `repeat(${TABLE_COLUMNS}, minmax(0, 1fr))`,
  gridTemplateRows: `repeat(${NUMBER_GRID_ROWS}, var(--row-number)) repeat(${TABLE_ROWS - NUMBER_GRID_ROWS}, var(--row-outside))`,
}

const OUTSIDE_ORDER: string[] = [
  BET_IDS.LOW,
  BET_IDS.EVEN,
  BET_IDS.RED,
  BET_IDS.BLACK,
  BET_IDS.ODD,
  BET_IDS.HIGH,
]

const rowOf = (n: number) => (n % 3 === 0 ? 0 : 3 - (n % 3))
const rowSpan = (row: number) => `${row * SUB_ROWS + 1} / span ${SUB_ROWS}`

const PLACEMENT: Record<
  BetKind,
  (bet: BetDefinition, hasDoubleZero: boolean) => CellPlacement
> = {
  [BET_KIND.NUMBER]: (bet, hasDoubleZero) => {
    const n = bet.value ?? 0

    if (n === 0) {
      const span = hasDoubleZero ? NUMBER_GRID_ROWS / 2 : NUMBER_GRID_ROWS
      return { gridColumn: '1', gridRow: `1 / span ${span}` }
    }
    if (n === DOUBLE_ZERO) {
      const half = NUMBER_GRID_ROWS / 2
      return { gridColumn: '1', gridRow: `${half + 1} / span ${half}` }
    }

    return {
      gridColumn: String(2 + Math.floor((n - 1) / 3)),
      gridRow: rowSpan(rowOf(n)),
    }
  },

  [BET_KIND.COLUMN]: (bet) => ({
    gridColumn: String(TABLE_COLUMNS),
    gridRow: rowSpan(rowOf(bet.value ?? 0)),
  }),

  [BET_KIND.DOZEN]: (bet) => ({
    gridColumn: `${2 + ((bet.value ?? 1) - 1) * 4} / span 4`,
    gridRow: String(DOZEN_GRID_ROW),
  }),

  [BET_KIND.OUTSIDE]: (bet) => ({
    gridColumn: `${2 + OUTSIDE_ORDER.indexOf(bet.id) * 2} / span 2`,
    gridRow: String(OUTSIDE_GRID_ROW),
  }),
}

export const getTableCells = (
  ruleset: Ruleset,
  modeId: ModeId,
): TableCell[] => {
  const hasDoubleZero = ruleset.pockets.some(
    (pocket) => pocket.id === DOUBLE_ZERO,
  )

  return ruleset.bets.map((bet) => ({
    bet,
    gold: isGoldenBet(bet, ruleset, modeId),
    style: {
      ...PLACEMENT[bet.kind](bet, hasDoubleZero),
      ...(bet.color
        ? { background: cssVar(POCKET_COLOR_TOKEN[bet.color]) }
        : {}),
    },
    ariaLabel: `${bet.label}, wypłata ${oddsFor(bet, ruleset, modeId)}:1`,
  }))
}

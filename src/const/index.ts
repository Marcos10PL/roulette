import type { PocketColor, RulesetId, SoundConfig } from '../types'

export const POCKET_COLOR = {
  RED: 'red',
  BLACK: 'black',
  GREEN: 'green',
} as const

export const POCKET_COLOR_TOKEN = {
  [POCKET_COLOR.RED]: '--color-pocket-red',
  [POCKET_COLOR.BLACK]: '--color-pocket-black',
  [POCKET_COLOR.GREEN]: '--color-pocket-green',
} as const satisfies Record<PocketColor, string>

export const POCKET_COLOR_BAR_TOKEN = {
  [POCKET_COLOR.RED]: '--color-pocket-red',
  [POCKET_COLOR.BLACK]: '--color-pocket-black-bar',
  [POCKET_COLOR.GREEN]: '--color-pocket-green',
} as const satisfies Record<PocketColor, string>

export const POCKET_COLOR_LABEL = {
  [POCKET_COLOR.RED]: 'Czerwone',
  [POCKET_COLOR.BLACK]: 'Czarne',
  [POCKET_COLOR.GREEN]: 'Zero',
} as const satisfies Record<PocketColor, string>

export const BET_KIND = {
  NUMBER: 'number',
  COLUMN: 'column',
  DOZEN: 'dozen',
  OUTSIDE: 'outside',
} as const

export const ROUND_OUTCOME = {
  WIN: 'win',
  LOSE: 'lose',
  PUSH: 'push',
} as const

export const ROUND_OUTCOME_LABEL = {
  [ROUND_OUTCOME.WIN]: 'Wygrana',
  [ROUND_OUTCOME.LOSE]: 'Przegrana',
  [ROUND_OUTCOME.PUSH]: 'Remis',
} as const

export const START_BALANCE = 1000

export const CHIPS = [
  { value: 1, token: '--color-chip-1' },
  { value: 5, token: '--color-chip-5' },
  { value: 10, token: '--color-chip-10' },
  { value: 50, token: '--color-chip-50' },
  { value: 100, token: '--color-chip-100' },
  { value: 500, token: '--color-chip-500' },
] as const

export const SOUNDS = {
  TICK: { file: 'click.mp3', volume: 0.2, minInterval: 150 },
  WIN: { file: 'win.mp3', volume: 0.3 },
  LOSE: { file: 'lose.mp3', volume: 0.3 },
  DRAW: { file: 'draw.mp3', volume: 0.3 },
  MONEY_PICK: { file: 'money-pick.mp3', volume: 0.3 },
  BELL_RING: { file: 'bell-ring.mp3', volume: 0.3 },
} as const satisfies Record<string, SoundConfig>

export const BET_IDS = {
  NUMBER: 'number-',
  RED: 'red',
  BLACK: 'black',
  EVEN: 'even',
  ODD: 'odd',
  LOW: '1-18',
  HIGH: '19-36',
  DOZEN: 'dozen-',
  COLUMN: 'column-',
} as const

// payout ratios, 35 means 35:1
export const ODDS = {
  NUMBER: 35,
  DOZEN_COLUMN: 2,
  EVEN_MONEY: 1,
} as const

// id of the "00" pocket on the American wheel
export const DOUBLE_ZERO = 37

// pockets in the order they appear on the wheel
const EUROPEAN_WHEEL = [
  0, 32, 15, 19, 4, 21, 2, 25, 17, 34, 6, 27, 13, 36, 11, 30, 8, 23, 10, 5, 24,
  16, 33, 1, 20, 14, 31, 9, 22, 18, 29, 7, 28, 12, 35, 3, 26,
]
const AMERICAN_WHEEL = [
  0,
  28,
  9,
  26,
  30,
  11,
  7,
  20,
  32,
  17,
  5,
  22,
  34,
  15,
  3,
  24,
  36,
  13,
  1,
  DOUBLE_ZERO,
  27,
  10,
  25,
  29,
  12,
  8,
  19,
  31,
  18,
  6,
  21,
  33,
  16,
  4,
  23,
  35,
  14,
  2,
]

export const RED_NUMBERS = [
  1, 3, 5, 7, 9, 12, 14, 16, 18, 19, 21, 23, 25, 27, 30, 32, 34, 36,
]

export const RULESET_ID = {
  EUROPEAN: 'european',
  AMERICAN: 'american',
} as const

export const RULESET_DEFINITIONS = {
  [RULESET_ID.EUROPEAN]: {
    name: 'Ruletka europejska',
    shortName: 'Europejska',
    wheel: EUROPEAN_WHEEL,
  },
  [RULESET_ID.AMERICAN]: {
    name: 'Ruletka amerykańska',
    shortName: 'Amerykańska',
    wheel: AMERICAN_WHEEL,
  },
} as const satisfies Record<
  RulesetId,
  { name: string; shortName: string; wheel: number[] }
>

export const LEADERBOARD_SIZE = 5

// rounds kept per player
export const HISTORY_LIMIT = 200

export const RECENT_RESULTS_COUNT = 5
export const HISTORY_LIST_SIZE = 5
export const HOT_NUMBERS_COUNT = 5

export const TONE = {
  POSITIVE: 'positive',
  NEGATIVE: 'negative',
  NEUTRAL: 'neutral',
} as const

export const LOCALE = 'pl-PL'

export const BALANCE_FLASH = {
  GAIN: '--color-win',
  LOSS: '--color-loss',
  REST: '--color-gold',
} as const

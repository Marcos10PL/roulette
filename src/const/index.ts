import type { Boost, Mode, PocketColor, RulesetId, SoundConfig } from '../types'

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

export const POCKET_COLOR_BRIGHT_TOKEN = {
  [POCKET_COLOR.RED]: '--color-pocket-red-bright',
  [POCKET_COLOR.BLACK]: '--color-pocket-black-bright',
  [POCKET_COLOR.GREEN]: '--color-pocket-green',
} as const satisfies Record<PocketColor, string>

export const POCKET_COLOR_BAR_TOKEN = {
  [POCKET_COLOR.RED]: '--color-pocket-red',
  [POCKET_COLOR.BLACK]: '--color-pocket-black-bright',
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

export const MODE_ID = {
  STANDARD: 'standard',
  GOLDEN_SECTOR: 'golden-sector',
  CONTROL: 'control',
} as const

export const BOOST_ID = {
  MAGNET: 'magnet',
  ZERO_BLOCK: 'zero-block',
  HALF_WHEEL: 'half-wheel',
} as const

export const BOOST_BLOCK = {
  NO_NUMBER: 'no-number',
  ZERO_BET: 'zero-bet',
} as const

export const MAGNET = {
  WEIGHT: 1.5,
} as const

const BOOSTS_PRICE_PERCENT = {
  [BOOST_ID.MAGNET]: 50,
  [BOOST_ID.ZERO_BLOCK]: 7,
  [BOOST_ID.HALF_WHEEL]: 2,
} as const

export const BOOSTS = [
  {
    id: BOOST_ID.MAGNET,
    name: 'Magnes',
    description: `Szansa na postawiony numer wzrasta ${String(MAGNET.WEIGHT).replace('.', ',')}-krotnie. Cena to około ${BOOSTS_PRICE_PERCENT[BOOST_ID.MAGNET]}% postawionej stawki.`,
    pricePercent: BOOSTS_PRICE_PERCENT[BOOST_ID.MAGNET],
  },
  {
    id: BOOST_ID.ZERO_BLOCK,
    name: 'Blokada zer',
    description: `Pola z zerami nie mogą wypaść w tej rundzie. Cena to około ${BOOSTS_PRICE_PERCENT[BOOST_ID.ZERO_BLOCK]}% postawionej stawki.`,
    pricePercent: BOOSTS_PRICE_PERCENT[BOOST_ID.ZERO_BLOCK],
  },
  {
    id: BOOST_ID.HALF_WHEEL,
    name: 'Połowa koła',
    description: `Losowa połowa koła zostaje wyłączona z gry. Cena to około ${BOOSTS_PRICE_PERCENT[BOOST_ID.HALF_WHEEL]}% postawionej stawki.`,
    pricePercent: BOOSTS_PRICE_PERCENT[BOOST_ID.HALF_WHEEL],
  },
] as const satisfies readonly Boost[]

export const GOLDEN_SECTOR = {
  CHANCE: 0.03,
} as const

export const GOLDEN_POCKETS = {
  [RULESET_ID.EUROPEAN]: [35, 3, 26, 32, 15, 19],
  [RULESET_ID.AMERICAN]: [35, 14, 2, 28, 9, 26],
} as const satisfies Record<RulesetId, number[]>

export const MODES = [
  {
    id: MODE_ID.STANDARD,
    name: 'Standardowy',
    description: 'Klasyczna ruletka, każde pole ma taką samą szansę.',
    odds: {
      [BET_KIND.NUMBER]: 35,
      [BET_KIND.COLUMN]: 2,
      [BET_KIND.DOZEN]: 2,
      [BET_KIND.OUTSIDE]: 1,
    },
    goldenOdds: null,
    boosts: [],
  },
  {
    id: MODE_ID.GOLDEN_SECTOR,
    name: 'Złoty sektor',
    description:
      'Sześć złotych pól wokół zera. Razem wypadają w około 3% losowań, a nagroda za ich trafienie jest znacznie wyższa. Pomniejszona zostaje natomiast wygrana za trafienie zwykłych pól.',
    odds: {
      [BET_KIND.NUMBER]: 30,
      [BET_KIND.COLUMN]: 2,
      [BET_KIND.DOZEN]: 2,
      [BET_KIND.OUTSIDE]: 1,
    },
    goldenOdds: 195,
    boosts: [],
  },
  {
    id: MODE_ID.CONTROL,
    name: 'Kontrola',
    description:
      'Daje możliwość wykupu bonusów przed losowaniem, które zmieniają szanse. Każdy działa przez jedną rundę.',
    odds: {
      [BET_KIND.NUMBER]: 35,
      [BET_KIND.COLUMN]: 2,
      [BET_KIND.DOZEN]: 2,
      [BET_KIND.OUTSIDE]: 1,
    },
    goldenOdds: null,
    boosts: [BOOST_ID.MAGNET, BOOST_ID.ZERO_BLOCK, BOOST_ID.HALF_WHEEL],
  },
] as const satisfies readonly Mode[]

export const LEADERBOARD_SIZE = 5

export const HISTORY_LIMIT = 200

export const HISTORY_LIST_SIZE = 5

export const TONE = {
  POSITIVE: 'positive',
  NEGATIVE: 'negative',
  NEUTRAL: 'neutral',
} as const

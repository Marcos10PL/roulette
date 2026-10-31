import type {
  BET_KIND,
  POCKET_COLOR,
  ROUND_OUTCOME,
  RULESET_ID,
  SOUNDS,
  TONE,
  MODE_ID,
  BOOST_BLOCK,
  BOOST_ID,
} from '../const'

export type SoundName = keyof typeof SOUNDS
export type RoundOutcome = (typeof ROUND_OUTCOME)[keyof typeof ROUND_OUTCOME]
export type BetKind = (typeof BET_KIND)[keyof typeof BET_KIND]
export type PocketColor = (typeof POCKET_COLOR)[keyof typeof POCKET_COLOR]
export type RulesetId = (typeof RULESET_ID)[keyof typeof RULESET_ID]
export type ModeId = (typeof MODE_ID)[keyof typeof MODE_ID]
export type BoostBlock = (typeof BOOST_BLOCK)[keyof typeof BOOST_BLOCK]
export type BoostId = (typeof BOOST_ID)[keyof typeof BOOST_ID]
export type ModalSize = 'sm' | 'md' | 'lg'
export type BadgeSize = 'md' | 'lg'
export type ButtonVariant = 'primary' | 'ghost' | 'quiet' | 'danger'
export type ButtonSize = 'icon-sm' | 'icon' | 'md' | 'lg' | 'xl'

export type Tone = (typeof TONE)[keyof typeof TONE]

export type SegmentedOption<T extends string = string> = {
  value: T
  label: string
  ariaLabel?: string
}

export type StackedBarSegment = {
  share: number
  color: string
}

export type Player = {
  name: string
  balance: number
  best: number
}

export type ActiveRound = {
  rulesetId: RulesetId
  modeId: ModeId
  placedBets: Record<string, number>
  boosts: BoostId[]
  halfStart: number
  totalStaked: number
}

export type BoostContext = Pick<
  ActiveRound,
  'boosts' | 'placedBets' | 'halfStart'
>

export type RoundResult = {
  net: number
  outcome: RoundOutcome
}

export type SoundConfig = {
  file: string
  volume: number
  minInterval?: number
}

export type BetDefinition = {
  id: string
  label: string
  kind: BetKind
  value?: number
  color?: PocketColor
  wins: (winNumber: number) => boolean
}

export type Pocket = {
  id: number
  label: string
  color: PocketColor
}

export type Ruleset = {
  id: RulesetId
  name: string
  shortName: string
  pockets: Pocket[]
  bets: BetDefinition[]
}

export type CellPlacement = {
  gridColumn: string
  gridRow: string
}

export type Mode = {
  id: ModeId
  name: string
  description: string
  odds: Record<BetKind, number>
  goldenOdds: number | null
  boosts: readonly BoostId[]
}

export type Boost = {
  id: BoostId
  name: string
  description: string
  pricePercent: number
}

export type TableCell = {
  bet: BetDefinition
  gold: boolean
  style: Record<string, string>
  ariaLabel: string
}

export type SpinRecord = {
  player: string
  rulesetId: RulesetId
  modeId: ModeId
  pocketId: number
  label: string
  color: PocketColor
  staked: number
  won: number
  net: number
  outcome: RoundOutcome
  at: number
}

export type Stats = {
  rounds: number
  outcomes: Record<RoundOutcome, number>
  winRate: number
  netTotal: number
  biggestWin: number
  biggestLoss: number
  colors: Record<PocketColor, { count: number; share: number }>
  hotNumbers: { label: string; color: PocketColor; count: number }[]
}

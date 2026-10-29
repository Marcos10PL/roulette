import type {
  BET_KIND,
  BUTTON_VARIANT,
  POCKET_COLOR,
  ROUND_OUTCOME,
  RULESET_ID,
  SOUNDS,
  TONE,
} from '../const'

export type SoundName = keyof typeof SOUNDS
export type RoundOutcome = (typeof ROUND_OUTCOME)[keyof typeof ROUND_OUTCOME]
export type BetKind = (typeof BET_KIND)[keyof typeof BET_KIND]
export type PocketColor = (typeof POCKET_COLOR)[keyof typeof POCKET_COLOR]
export type RulesetId = (typeof RULESET_ID)[keyof typeof RULESET_ID]
export type ButtonVariant = (typeof BUTTON_VARIANT)[keyof typeof BUTTON_VARIANT]

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
  placedBets: Record<string, number>
  totalStaked: number
}

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
  odds: number
  value?: number
  color: PocketColor
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

export type TableCell = {
  bet: BetDefinition
  style: Record<string, string>
  ariaLabel: string
}

export type SpinRecord = {
  player: string
  rulesetId: RulesetId
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

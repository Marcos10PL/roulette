import type {
  BET_KIND,
  POCKET_COLOR,
  ROUND_OUTCOME,
  RULESET_ID,
  SOUNDS,
} from '../const'

export type SoundName = keyof typeof SOUNDS
export type RoundOutcome = (typeof ROUND_OUTCOME)[keyof typeof ROUND_OUTCOME]
export type BetKind = (typeof BET_KIND)[keyof typeof BET_KIND]
export type PocketColor = (typeof POCKET_COLOR)[keyof typeof POCKET_COLOR]
export type RulesetId = (typeof RULESET_ID)[keyof typeof RULESET_ID]

export type Player = {
  name: string
  balance: number
  best: number
}

export type ActiveRound = {
  rulesetId: RulesetId
  placedBets: Record<string, number>
  totalStaked: number
  balanceAfterStake: number
}

export type RoundResult = {
  winNumber: number
  totalStaked: number
  totalWon: number
  net: number
  outcome: RoundOutcome
  balance: number
  bankrupt: boolean
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
  pockets: Pocket[]
  bets: BetDefinition[]
}

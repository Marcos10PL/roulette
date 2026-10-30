import { storeToRefs } from 'pinia'
import confetti from '@hiseb/confetti'
import { ROUND_OUTCOME, ROUND_OUTCOME_LABEL } from '../const'
import { useAudioStore } from '../stores/audio'
import { useRoundStore } from '../stores/round'
import { useToastStore } from '../stores/toast'
import { useWheelStore } from '../stores/wheel'
import type { RoundOutcome, SoundName } from '../types'
import { formatSigned } from '../utils/format'
import { toneOf } from '../utils/tone'
import { drawWinningIndex, getRuleset } from '../utils/rulesets'

const SOUNDS_BY_OUTCOME: Record<RoundOutcome, SoundName> = {
  [ROUND_OUTCOME.WIN]: 'WIN',
  [ROUND_OUTCOME.LOSE]: 'LOSE',
  [ROUND_OUTCOME.PUSH]: 'DRAW',
}

export const usePlayRound = () => {
  const { startRound, finishRound } = useRoundStore()
  const { play: playSound } = useAudioStore()
  const { show } = useToastStore()
  const wheelStore = useWheelStore()
  const { isReady } = storeToRefs(wheelStore)
  const { spin } = wheelStore

  const play = async () => {
    if (!isReady.value) return

    const round = startRound()
    if (!round) return

    playSound('BELL_RING')

    const ruleset = getRuleset(round.rulesetId)
    const index = drawWinningIndex(ruleset)
    await spin(index)

    const pocket = ruleset.pockets[index]
    const result = finishRound(pocket)
    if (!result) return

    const label = ROUND_OUTCOME_LABEL[result.outcome]
    show({
      tone: toneOf(result.net),
      title: result.outcome === ROUND_OUTCOME.WIN ? `${label}!` : label,
      amount: formatSigned(result.net),
      pocket: { label: pocket.label, color: pocket.color },
    })
    playSound(SOUNDS_BY_OUTCOME[result.outcome])

    if (result.outcome === ROUND_OUTCOME.WIN) {
      confetti({
        position: { x: window.innerWidth / 2, y: window.innerHeight / 2 },
        count: 200,
      })
    }
  }

  return { play }
}

import confetti from '@hiseb/confetti'
import { ROUND_OUTCOME } from '../const'
import { useAudioStore } from '../stores/audio'
import { useRoundStore } from '../stores/round'
import { useToastStore } from '../stores/toast'
import { useWheelStore } from '../stores/wheel'
import type { RoundOutcome, SoundName } from '../types'
import { formatMoneyAmount } from '../utils/format'
import { toneOf } from '../utils/tone'
import { drawWinningIndex, getRuleset } from '../utils/rulesets'

const MESSAGES: Record<RoundOutcome, (net: number) => string> = {
  [ROUND_OUTCOME.WIN]: (net) => `Wygrałeś ${formatMoneyAmount(net)}!`,
  [ROUND_OUTCOME.LOSE]: (net) =>
    `Niestety, przegrałeś ${formatMoneyAmount(Math.abs(net))}.`,
  [ROUND_OUTCOME.PUSH]: () => 'Remis! Nic nie straciłeś, nic nie wygrałeś.',
}

const SOUNDS_BY_OUTCOME: Record<RoundOutcome, SoundName> = {
  [ROUND_OUTCOME.WIN]: 'WIN',
  [ROUND_OUTCOME.LOSE]: 'LOSE',
  [ROUND_OUTCOME.PUSH]: 'DRAW',
}

export const usePlayRound = () => {
  const roundStore = useRoundStore()
  const audio = useAudioStore()
  const toast = useToastStore()
  const wheel = useWheelStore()

  const play = async () => {
    if (!wheel.isReady) return

    const round = roundStore.startRound()
    if (!round) return

    audio.play('BELL_RING')

    const ruleset = getRuleset(round.rulesetId)
    const index = drawWinningIndex(ruleset)
    await wheel.spin(index)

    const pocket = ruleset.pockets[index]
    const result = roundStore.finishRound(pocket)
    if (!result) return

    toast.show(
      `Wypadło ${pocket.label}. ${MESSAGES[result.outcome](result.net)}`,
      toneOf(result.net),
    )
    audio.play(SOUNDS_BY_OUTCOME[result.outcome])

    if (result.outcome === ROUND_OUTCOME.WIN) {
      confetti({
        position: { x: window.innerWidth / 2, y: window.innerHeight / 2 },
        count: 200,
      })
    }
  }

  return { play }
}

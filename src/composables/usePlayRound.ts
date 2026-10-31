import { storeToRefs } from 'pinia'
import confetti from '@hiseb/confetti'
import { seconds } from '../animations/motion'
import { BOOST_ID, MODE_ID, ROUND_OUTCOME, ROUND_OUTCOME_LABEL } from '../const'
import { useAudioStore } from '../stores/audio'
import { useRoundStore } from '../stores/round'
import { useToastStore } from '../stores/toast'
import { useWheelStore } from '../stores/wheel'
import type { RoundOutcome, SoundName } from '../types'
import { formatSigned } from '../utils/format'
import { toneOf } from '../utils/tone'
import { coveredPocketIds } from '../utils/bets'
import { applyBoosts, magnetTarget } from '../utils/boosts'
import { getMode } from '../utils/game'
import { drawWinningIndex } from '../utils/rulesets'

const SOUNDS_BY_OUTCOME: Record<RoundOutcome, SoundName> = {
  [ROUND_OUTCOME.WIN]: 'WIN',
  [ROUND_OUTCOME.LOSE]: 'LOSE',
  [ROUND_OUTCOME.PUSH]: 'DRAW',
}

const DIM_PAUSE = 1

const pause = (duration: number) =>
  new Promise((resolve) => setTimeout(resolve, seconds(duration) * 1000))

export const usePlayRound = () => {
  const { startRound, finishRound } = useRoundStore()
  const { play: playSound } = useAudioStore()
  const { show } = useToastStore()
  const wheelStore = useWheelStore()
  const { isReady } = storeToRefs(wheelStore)
  const { spin, setOverlay } = wheelStore

  const play = async () => {
    if (!isReady.value) return

    const round = startRound()
    if (!round) return

    playSound('BELL_RING')

    const { game } = round
    const { ruleset } = game
    const weights = applyBoosts(game, round)
    const blocked = new Set(
      ruleset.pockets
        .filter((_, index) => weights[index] === 0)
        .map((pocket) => pocket.id),
    )
    const magnet = round.boosts.includes(BOOST_ID.MAGNET)
      ? magnetTarget(round.slip)
      : null
    setOverlay({
      dimmedIds: blocked,
      markedIds: new Set(
        coveredPocketIds(game, round.slip).filter((id) => !blocked.has(id)),
      ),
      framedIds: new Set(magnet ? [magnet.id] : []),
    })
    if (blocked.size) await pause(DIM_PAUSE)

    const index = drawWinningIndex(weights)
    await spin(index)

    const pocket = ruleset.pockets[index]
    const result = finishRound(pocket)
    if (!result) return

    const label = ROUND_OUTCOME_LABEL[result.outcome]
    const isGolden = game.goldenIds.has(pocket.id)
    show({
      tone: toneOf(result.net),
      title: isGolden
        ? `${getMode(MODE_ID.GOLDEN_SECTOR).name}!`
        : result.outcome === ROUND_OUTCOME.WIN
          ? `${label}!`
          : label,
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

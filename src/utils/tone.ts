import { TONE } from '../const'
import type { Tone } from '../types'

export const toneOf = (amount: number): Tone => {
  if (amount > 0) return TONE.POSITIVE
  if (amount < 0) return TONE.NEGATIVE
  return TONE.NEUTRAL
}

export const TONE_TEXT_CLASSES: Record<Tone, string> = {
  [TONE.POSITIVE]: 'text-win',
  [TONE.NEGATIVE]: 'text-loss',
  [TONE.NEUTRAL]: '',
}

export const toneTextClass = (amount: number) =>
  TONE_TEXT_CLASSES[toneOf(amount)]

import { TONE } from '../const'
import type { Tone } from '../types'

export const toneOf = (amount: number): Tone => {
  if (amount > 0) return TONE.POSITIVE
  if (amount < 0) return TONE.NEGATIVE
  return TONE.NEUTRAL
}

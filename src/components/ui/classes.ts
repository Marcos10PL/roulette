import { BUTTON_VARIANT, TONE } from '../../const'
import type { ButtonVariant, Tone } from '../../types'

export const BUTTON_VARIANT_CLASSES: Record<ButtonVariant, string> = {
  [BUTTON_VARIANT.PRIMARY]: 'border-transparent bg-red-600 hover:bg-red-500',
  [BUTTON_VARIANT.GHOST]: 'border-zinc-700 bg-zinc-900/80 hover:bg-zinc-800',
  [BUTTON_VARIANT.DANGER]:
    'border-red-900 bg-zinc-900/80 text-red-400 hover:bg-red-950',
}

export const TONE_TEXT_CLASSES: Record<Tone, string> = {
  [TONE.POSITIVE]: 'text-green-400',
  [TONE.NEGATIVE]: 'text-red-400',
  [TONE.NEUTRAL]: '',
}

export const TONE_BOX_CLASSES: Record<Tone, string> = {
  [TONE.POSITIVE]: 'border-green-500 bg-green-950 text-green-200',
  [TONE.NEGATIVE]: 'border-red-500 bg-red-950 text-red-200',
  [TONE.NEUTRAL]: 'border-zinc-500 bg-zinc-900 text-zinc-200',
}

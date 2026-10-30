import type {
  BadgeSize,
  ButtonSize,
  ButtonVariant,
  ModalSize,
  Tone,
} from '../types'
import { TONE } from '.'

export const MODAL_SIZE_CLASSES: Record<ModalSize, string> = {
  sm: 'max-w-120',
  md: 'max-w-180',
  lg: 'max-w-220',
}

export const BUTTON_SIZE_CLASSES: Record<ButtonSize, string> = {
  'icon-sm': 'size-8',
  icon: 'size-11',
  md: 'h-11 px-4.5 text-sm',
  lg: 'h-13 px-8 text-xl',
  xl: 'h-13 px-8 text-xl md:h-15 md:px-10 md:text-2xl',
}

export const BUTTON_VARIANT_CLASSES: Record<ButtonVariant, string> = {
  primary:
    'border-transparent bg-violet text-white font-display font-extrabold tracking-widest uppercase shadow-glow-primary hover:bg-violet-hover',
  ghost:
    'border-line-strong bg-violet/10 text-ink hover:border-violet-hi hover:bg-violet/20',
  quiet:
    'border-violet-hi/15 bg-violet/15 text-ink-2 hover:border-violet-hi/35 hover:bg-violet/25 hover:text-ink',
  danger:
    'border-loss/20 bg-loss/10 text-loss hover:border-loss/40 hover:bg-loss/20',
}

export const TONE_TEXT_CLASSES: Record<Tone, string> = {
  [TONE.POSITIVE]: 'text-win',
  [TONE.NEGATIVE]: 'text-loss',
  [TONE.NEUTRAL]: '',
}

export const TONE_BOX_CLASSES: Record<Tone, string> = {
  [TONE.POSITIVE]: 'border-win/40 from-win/20 shadow-glow-win',
  [TONE.NEGATIVE]: 'border-loss/40 from-loss/15 shadow-glow-loss',
  [TONE.NEUTRAL]: 'border-violet-hi/40 from-violet/25 shadow-glow-info',
}

export const BADGE_SIZE_CLASSES: Record<BadgeSize, string> = {
  md: 'size-6 text-xs sm:size-7',
  lg: 'size-10 text-base',
}

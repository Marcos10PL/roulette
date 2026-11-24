import gsap from 'gsap'
import { fadeOut } from './effects'
import { seconds } from './motion'

const fadeOutOverlay = fadeOut({ duration: 0.2 })

export const enterModal = (
  overlay: Element,
  card: HTMLElement | null,
  done: () => void,
) => {
  gsap.fromTo(
    overlay,
    { opacity: 0 },
    { opacity: 1, duration: seconds(0.2), onComplete: done },
  )
  gsap.fromTo(
    card,
    { scale: 0.9, y: 20 },
    { scale: 1, y: 0, duration: seconds(0.3), ease: 'back.out(1.4)' },
  )
}

export const leaveModal = (overlay: Element, done: () => void) => {
  gsap.set(overlay, { pointerEvents: 'none' })
  fadeOutOverlay(overlay, done)
}

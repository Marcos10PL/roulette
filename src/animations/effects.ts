import gsap from 'gsap'
import { isReducedMotion, seconds } from './motion'

type Hook = (el: Element, done: () => void) => void
type Timing = { duration: number; ease?: string; delay?: number }
type FadeOptions = { duration: number; y?: number; ease?: string }

const fadeValues = (y?: number): gsap.TweenVars => ({
  opacity: 0,
  ...(y ? { y } : {}),
})

export const enterFrom =
  (from: gsap.TweenVars, { duration, ease, delay = 0 }: Timing): Hook =>
  (el, done) => {
    gsap.set(el, { clearProps: Object.keys(from).join(',') })

    gsap.from(el, {
      ...from,
      duration: seconds(duration),
      delay: seconds(delay),
      ease,
      clearProps: Object.keys(from).join(','),
      onComplete: done,
    })
  }

export const leaveTo =
  (to: gsap.TweenVars, { duration, ease }: Timing): Hook =>
  (el, done) => {
    gsap.to(el, { ...to, duration: seconds(duration), ease, onComplete: done })
  }

export const fadeIn = ({ duration, y, ease }: FadeOptions) =>
  enterFrom(fadeValues(y), { duration, ease })

export const fadeOut = ({ duration, y }: FadeOptions) =>
  leaveTo(fadeValues(y), { duration })

export const startPulse = (
  el: gsap.TweenTarget,
  to: gsap.TweenVars,
  duration = 1.2,
) => {
  if (isReducedMotion()) return

  gsap.to(el, { ...to, duration, repeat: -1, yoyo: true, ease: 'sine.inOut' })
}

export const stopPulse = (el: Element, to: gsap.TweenVars) => {
  const properties = Object.keys(to).join(',')

  gsap.killTweensOf(el, properties)
  gsap.set(el, { clearProps: properties })
}

export const withPulse =
  (enter: Hook, to: gsap.TweenVars): Hook =>
  (el, done) =>
    enter(el, () => {
      done()
      startPulse(el, to)
    })

export const withoutPulse =
  (leave: Hook, to: gsap.TweenVars): Hook =>
  (el, done) => {
    stopPulse(el, to)
    leave(el, done)
  }

export const flash = (
  el: Element,
  from: gsap.TweenVars,
  to: gsap.TweenVars,
  { duration, ease = 'power2.out' }: Timing,
) => {
  gsap.fromTo(el, from, {
    ...to,
    duration: seconds(duration),
    ease,
    clearProps: Object.keys(to).join(','),
  })
}

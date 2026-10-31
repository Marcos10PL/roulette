import gsap from 'gsap'
import { themeValue } from '../utils/theme'
import { startPulse } from './effects'
import { isReducedMotion, seconds } from './motion'

type Parts = {
  letters: HTMLElement[]
  lines: HTMLElement[]
  star: HTMLElement
  coinIcon: HTMLElement
}

export const playStartScreen = ({ letters, lines, star, coinIcon }: Parts) => {
  const context = gsap.context(() => {
    gsap
      .timeline()
      .from(letters, {
        opacity: 0,
        y: 50,
        rotationX: 90,
        duration: seconds(0.8),
        stagger: seconds(0.1),
        ease: 'back.out(2)',
      })
      .from(
        lines,
        {
          opacity: 0,
          scaleX: 0,
          duration: seconds(1),
          ease: 'back.out(1.7)',
        },
        '-=0.4',
      )
      .from(
        star,
        {
          opacity: 0,
          scale: 0,
          y: -20,
          rotation: 360,
          duration: seconds(0.8),
          ease: 'back.out(1.7)',
        },
        '-=0.6',
      )

    // glowing letters
    gsap.set(letters, { filter: themeValue('--glow-logo-rest') })
    startPulse(letters, { filter: themeValue('--glow-logo-peak') }, 1.5)

    if (isReducedMotion()) return

    // the star blinks now and then
    gsap
      .timeline({ repeat: -1, repeatDelay: 5, delay: 2 })
      .to(star, { opacity: 0, duration: 0.1 })
      .to(star, { opacity: 1, duration: 0.1 })
      .to(star, { opacity: 0, duration: 0.1 })
      .to(star, { opacity: 1, duration: 0.1 })

    // the coins turn around from time to time
    gsap.to(coinIcon, {
      rotate: 360,
      duration: 1.5,
      ease: 'linear',
      repeat: -1,
      repeatDelay: 4,
      delay: 3,
    })
  })

  return () => context.revert()
}

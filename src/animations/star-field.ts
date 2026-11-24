import gsap from 'gsap'
import { isReducedMotion } from './motion'

export const twinkleStars = (stars: HTMLElement[]) => {
  if (isReducedMotion()) return () => {}

  const context = gsap.context(() => {
    for (const star of stars) {
      gsap.fromTo(
        star,
        { opacity: 0.1 },
        {
          opacity: 0.4 + Math.random() * 0.6,
          duration: 1.5 + Math.random() * 3,
          delay: Math.random() * 3,
          repeat: -1,
          yoyo: true,
          ease: 'sine.inOut',
        },
      )
    }
  })

  return () => context.revert()
}

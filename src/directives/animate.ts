import gsap from 'gsap'
import type { Directive } from 'vue'
import { seconds } from '../animations/motion'

type StaggerOptions = {
  selector?: string
  y?: number
  scale?: number
  amount?: number
  delay?: number
  from?: 'start' | 'center' | 'end' | 'edges' | 'random'
}

export const vStagger: Directive<HTMLElement, StaggerOptions | undefined> = {
  mounted: (el, { value = {} }) => {
    const {
      selector,
      y = 12,
      scale = 1,
      amount = 0.3,
      delay = 0,
      from = 'start',
    } = value

    gsap.from(selector ? el.querySelectorAll(selector) : el.children, {
      opacity: 0,
      y,
      scale,
      duration: seconds(0.35),
      delay: seconds(delay),
      ease: 'power2.out',
      stagger: { amount: seconds(amount), from },
      clearProps: 'opacity,transform',
    })
  },
}

export const vGrow: Directive<HTMLElement, number | undefined> = {
  mounted: (el, { value = 0 }) => {
    gsap.from(el, {
      scaleX: 0,
      transformOrigin: 'left center',
      duration: seconds(0.7),
      delay: seconds(value),
      ease: 'power2.out',
      clearProps: 'transform',
    })
  },
}

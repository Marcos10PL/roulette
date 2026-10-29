import gsap from 'gsap'
import { onBeforeUnmount, ref, watch } from 'vue'
import { seconds } from '../animations/motion'

const DURATION = 0.45

export const useCountUp = (source: () => number) => {
  const displayed = ref(source())
  const counter = { value: displayed.value }

  watch(source, (next) => {
    gsap.killTweensOf(counter)

    gsap.to(counter, {
      value: next,
      duration: seconds(DURATION),
      ease: 'power2.out',
      onUpdate: () => {
        displayed.value = Math.round(counter.value)
      },
    })
  })

  onBeforeUnmount(() => gsap.killTweensOf(counter))

  return displayed
}

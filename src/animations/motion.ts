const REDUCED_MOTION_QUERY = '(prefers-reduced-motion: reduce)'
const REDUCED_DURATION = 0.01

export const isReducedMotion = () =>
  window.matchMedia(REDUCED_MOTION_QUERY).matches

export const seconds = (value: number) =>
  isReducedMotion() ? REDUCED_DURATION : value

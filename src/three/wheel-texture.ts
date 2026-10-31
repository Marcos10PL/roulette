import { POCKET_COLOR_TOKEN } from '../const'
import type { Pocket } from '../types'
import { themeValue } from '../const/classes'

const SIZE = 1024
const TWO_PI = Math.PI * 2

export const drawWheel = (
  canvas: HTMLCanvasElement,
  pockets: Pocket[],
  highlightIndex = -1,
) => {
  const ctx = canvas.getContext('2d')
  if (!ctx) throw new Error('failed to create canvas context')

  // resizing reallocates the canvas, so it only happens the first time
  if (canvas.width === SIZE) {
    ctx.clearRect(0, 0, SIZE, SIZE)
  } else {
    canvas.width = SIZE
    canvas.height = SIZE
  }

  const cx = SIZE / 2
  const cy = SIZE / 2
  const R = SIZE * 0.54

  const divider = themeValue('--color-wheel-divider')
  const highlight = themeValue('--color-pocket-highlight')
  const stud = themeValue('--color-wheel-stud')

  // pocket segments
  const N = pockets.length
  const slice = TWO_PI / N
  const segOuter = R * 0.88
  const segInner = R * 0.5

  for (let i = 0; i < N; i++) {
    const a0 = i * slice - Math.PI / 2
    const a1 = a0 + slice

    ctx.beginPath()
    ctx.arc(cx, cy, segOuter, a0, a1)
    ctx.arc(cx, cy, segInner, a1, a0, true)
    ctx.closePath()

    ctx.fillStyle = themeValue(POCKET_COLOR_TOKEN[pockets[i].color])
    ctx.fill()

    ctx.beginPath()
    ctx.moveTo(cx + Math.cos(a0) * segInner, cy + Math.sin(a0) * segInner)
    ctx.lineTo(cx + Math.cos(a0) * segOuter, cy + Math.sin(a0) * segOuter)
    ctx.strokeStyle = divider
    ctx.lineWidth = 2
    ctx.stroke()
  }

  // pocket labels
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  const fontSize = R * 0.055

  for (let i = 0; i < N; i++) {
    const mid = i * slice - Math.PI / 2 + slice / 2
    const tr = (segOuter + segInner) / 2
    const isWinner = i === highlightIndex

    ctx.save()
    ctx.translate(cx + Math.cos(mid) * tr, cy + Math.sin(mid) * tr)
    ctx.rotate(mid + Math.PI / 2)
    ctx.font = `bold ${isWinner ? fontSize * 1.2 : fontSize}px Arial`
    ctx.shadowColor = isWinner ? highlight : 'rgba(0,0,0,0.95)'
    ctx.shadowBlur = isWinner ? 8 : 5
    ctx.fillStyle = '#fff'
    ctx.fillText(pockets[i].label, 0, 0)
    ctx.restore()
  }

  // separators between segments
  for (let i = 0; i < N; i++) {
    const a = i * slice - Math.PI / 2
    const dr = segOuter + R * 0.001
    const dSize = R * 0.015

    ctx.save()
    ctx.translate(cx + Math.cos(a) * dr, cy + Math.sin(a) * dr)
    ctx.rotate(a)
    ctx.shadowColor = 'rgba(0,0,0,0.4)'
    ctx.shadowBlur = 2
    ctx.beginPath()
    ctx.moveTo(0, -dSize)
    ctx.lineTo(dSize * 0.55, 0)
    ctx.lineTo(0, dSize)
    ctx.lineTo(-dSize * 0.55, 0)
    ctx.closePath()
    ctx.fillStyle = stud
    ctx.fill()
    ctx.restore()
  }

  // inner field
  const innerGrad = ctx.createRadialGradient(cx, cy, R * 0.22, cx, cy, R * 0.58)
  innerGrad.addColorStop(0, themeValue('--color-wheel-field-top'))
  innerGrad.addColorStop(0.5, themeValue('--color-wheel-field-mid'))
  innerGrad.addColorStop(1, themeValue('--color-wheel-field-edge'))
  ctx.beginPath()
  ctx.arc(cx, cy, R * 0.48, 0, TWO_PI)
  ctx.fillStyle = innerGrad
  ctx.fill()

  // two rings
  ctx.strokeStyle = themeValue('--color-wheel-ring')
  ctx.lineWidth = R * 0.01

  ctx.beginPath()
  ctx.arc(cx, cy, R * 0.28, 0, TWO_PI)
  ctx.stroke()

  ctx.beginPath()
  ctx.arc(cx, cy, R * 0.15, 0, TWO_PI)
  ctx.stroke()
}

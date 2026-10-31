import { POCKET_COLOR_BRIGHT_TOKEN, POCKET_COLOR_TOKEN } from '../const'
import type { Pocket } from '../types'
import { themeValue } from '../utils/theme'

const SIZE = 1024
const TWO_PI = Math.PI * 2

// lucide coins icon drawn on a 24 x 24 grid
const COIN_ICON = {
  grid: 24,
  paths: [
    'M13.744 17.736a6 6 0 1 1-7.48-7.48',
    'M15 6h1v4',
    'm6.134 14.768.866-.5 2 3.464',
  ],
  circle: { x: 16, y: 8, radius: 6 },
}

export type WheelOverlay = {
  dimmedIds?: ReadonlySet<number>
  markedIds?: ReadonlySet<number>
  framedIds?: ReadonlySet<number>
}

type WheelOptions = WheelOverlay & {
  highlightIndex?: number
  goldIds?: ReadonlySet<number>
}

export const drawWheel = (
  canvas: HTMLCanvasElement,
  pockets: Pocket[],
  {
    highlightIndex = -1,
    goldIds = new Set<number>(),
    dimmedIds = new Set<number>(),
    markedIds = new Set<number>(),
    framedIds = new Set<number>(),
  }: WheelOptions = {},
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

  const dividerColor = themeValue('--color-wheel-divider')
  const highlightColor = themeValue('--color-pocket-highlight')
  const studColor = themeValue('--color-wheel-stud')
  const dimColor = themeValue('--color-wheel-dim')
  const goldColor = themeValue('--color-pocket-gold')
  const coinColor = themeValue('--color-gold')
  const fieldTopColor = themeValue('--color-wheel-field-top')
  const fieldMidColor = themeValue('--color-wheel-field-mid')
  const fieldEdgeColor = themeValue('--color-wheel-field-edge')
  const ringColor = themeValue('--color-wheel-ring')

  const N = pockets.length
  const slice = TWO_PI / N
  const segOuter = R * 0.88
  const segInner = R * 0.5

  const isBoundaryDimmed = (i: number) =>
    dimmedIds.has(pockets[(i + N - 1) % N].id) && dimmedIds.has(pockets[i].id)

  // pocket segments
  for (let i = 0; i < N; i++) {
    const a0 = i * slice - Math.PI / 2
    const a1 = a0 + slice

    ctx.beginPath()
    ctx.arc(cx, cy, segOuter, a0, a1)
    ctx.arc(cx, cy, segInner, a1, a0, true)
    ctx.closePath()

    ctx.fillStyle = themeValue(
      (goldIds.has(pockets[i].id)
        ? POCKET_COLOR_BRIGHT_TOKEN
        : POCKET_COLOR_TOKEN)[pockets[i].color],
    )
    ctx.fill()

    if (dimmedIds.has(pockets[i].id)) {
      ctx.fillStyle = dimColor
      ctx.fill()
    }

    ctx.save()
    ctx.globalAlpha = isBoundaryDimmed(i) ? 0.2 : 1
    ctx.beginPath()
    ctx.moveTo(cx + Math.cos(a0) * segInner, cy + Math.sin(a0) * segInner)
    ctx.lineTo(cx + Math.cos(a0) * segOuter, cy + Math.sin(a0) * segOuter)
    ctx.strokeStyle = dividerColor
    ctx.lineWidth = 2
    ctx.stroke()
    ctx.restore()
  }

  // gold highlight ring
  const framed = new Set([...goldIds, ...framedIds])

  for (let i = 0; i < N; i++) {
    if (!framed.has(pockets[i].id)) continue
    if (i > 0 && framed.has(pockets[i - 1].id)) continue

    let end = i
    while (end + 1 < N && framed.has(pockets[end + 1].id)) end++

    const from = i * slice - Math.PI / 2
    const to = (end + 1) * slice - Math.PI / 2

    ctx.save()
    ctx.beginPath()
    ctx.arc(cx, cy, segOuter, from, to)
    ctx.arc(cx, cy, segInner, to, from, true)
    ctx.closePath()
    ctx.clip()
    ctx.strokeStyle = goldColor
    ctx.lineWidth = 7
    ctx.stroke()
    ctx.restore()
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
    ctx.globalAlpha = dimmedIds.has(pockets[i].id) ? 0.35 : 1
    ctx.font = `bold ${isWinner ? fontSize * 1.2 : fontSize}px Arial`
    ctx.shadowColor = isWinner ? highlightColor : 'rgba(0,0,0,0.95)'
    ctx.shadowBlur = isWinner ? 8 : 5
    ctx.fillStyle = '#fff'
    ctx.fillText(pockets[i].label, 0, 0)
    ctx.restore()
  }

  // coin marks on the pockets that win one of the placed bets
  const coinSize = R * 0.04
  const coinRadius = segOuter - coinSize
  const coinScale = coinSize / COIN_ICON.grid

  const coinPath = new Path2D()
  for (const path of COIN_ICON.paths) coinPath.addPath(new Path2D(path))
  coinPath.moveTo(
    COIN_ICON.circle.x + COIN_ICON.circle.radius,
    COIN_ICON.circle.y,
  )
  coinPath.arc(
    COIN_ICON.circle.x,
    COIN_ICON.circle.y,
    COIN_ICON.circle.radius,
    0,
    TWO_PI,
  )

  for (let i = 0; i < N; i++) {
    if (!markedIds.has(pockets[i].id)) continue

    const mid = i * slice - Math.PI / 2 + slice / 2

    ctx.save()
    ctx.translate(
      cx + Math.cos(mid) * coinRadius,
      cy + Math.sin(mid) * coinRadius,
    )
    ctx.rotate(mid + Math.PI / 2)
    ctx.scale(coinScale, coinScale)
    ctx.translate(-COIN_ICON.grid / 2, -COIN_ICON.grid / 2)
    ctx.strokeStyle = coinColor
    ctx.lineWidth = 2.2
    ctx.lineCap = 'round'
    ctx.lineJoin = 'round'
    ctx.shadowColor = 'rgba(0,0,0,0.8)'
    ctx.shadowBlur = 4
    ctx.stroke(coinPath)
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
    ctx.fillStyle = studColor
    ctx.fill()

    if (isBoundaryDimmed(i)) {
      ctx.fillStyle = dimColor
      ctx.fill()
    }

    ctx.restore()
  }

  // inner field
  const innerGrad = ctx.createRadialGradient(cx, cy, R * 0.22, cx, cy, R * 0.58)
  innerGrad.addColorStop(0, fieldTopColor)
  innerGrad.addColorStop(0.5, fieldMidColor)
  innerGrad.addColorStop(1, fieldEdgeColor)
  ctx.beginPath()
  ctx.arc(cx, cy, R * 0.48, 0, TWO_PI)
  ctx.fillStyle = innerGrad
  ctx.fill()

  // two rings
  ctx.strokeStyle = ringColor
  ctx.lineWidth = R * 0.01

  ctx.beginPath()
  ctx.arc(cx, cy, R * 0.28, 0, TWO_PI)
  ctx.stroke()

  ctx.beginPath()
  ctx.arc(cx, cy, R * 0.15, 0, TWO_PI)
  ctx.stroke()
}

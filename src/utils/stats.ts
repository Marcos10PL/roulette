import { POCKET_COLOR, ROUND_OUTCOME } from '../const'
import type { PocketColor, SpinRecord, Stats } from '../types'

const HOT_NUMBERS_COUNT = 5

const countersFor = <T extends string>(values: Record<string, T>) =>
  Object.fromEntries(
    Object.values(values).map((value) => [value, 0]),
  ) as Record<T, number>

export const computeStats = (records: SpinRecord[]): Stats => {
  const outcomes = countersFor(ROUND_OUTCOME)
  const colorCounts = countersFor(POCKET_COLOR)
  const numbers = new Map<
    string,
    { label: string; color: PocketColor; count: number }
  >()

  let netTotal = 0
  let biggestWin = 0
  let biggestLoss = 0

  for (const record of records) {
    outcomes[record.outcome]++
    colorCounts[record.color]++

    const entry = numbers.get(record.label) ?? {
      label: record.label,
      color: record.color,
      count: 0,
    }
    entry.count++
    numbers.set(record.label, entry)

    netTotal += record.net
    biggestWin = Math.max(biggestWin, record.net)
    biggestLoss = Math.max(biggestLoss, -record.net)
  }

  const share = (count: number) => (records.length ? count / records.length : 0)

  const hotNumbers = [...numbers.values()]
    .sort(
      (a, b) =>
        b.count - a.count ||
        a.label.localeCompare(b.label, undefined, { numeric: true }),
    )
    .slice(0, HOT_NUMBERS_COUNT)

  const colors = Object.fromEntries(
    Object.entries(colorCounts).map(([color, count]) => [
      color,
      { count, share: share(count) },
    ]),
  ) as Stats['colors']

  return {
    rounds: records.length,
    outcomes,
    winRate: share(outcomes[ROUND_OUTCOME.WIN]),
    netTotal,
    biggestWin,
    biggestLoss,
    colors,
    hotNumbers,
  }
}

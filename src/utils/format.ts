import { LOCALE } from '../const'

export const formatChipAmount = (amount: number) => {
  return amount >= 1000
    ? `${(amount / 1000).toFixed(amount % 1000 === 0 ? 0 : 1)}k`
    : String(amount)
}

export const formatMoneyAmount = (amount: number) => {
  return amount.toLocaleString(LOCALE)
}

export const formatSigned = (amount: number) =>
  amount > 0 ? `+${formatMoneyAmount(amount)}` : formatMoneyAmount(amount)

export const formatPercent = (share: number) => `${Math.round(share * 100)}%`

export const formatDateTime = (timestamp: number) =>
  new Date(timestamp).toLocaleString(LOCALE, {
    day: '2-digit',
    month: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  })

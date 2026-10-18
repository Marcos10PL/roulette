export const formatChipAmount = (amount: number) => {
  return amount >= 1000
    ? `${(amount / 1000).toFixed(amount % 1000 === 0 ? 0 : 1)}k`
    : String(amount)
}

export const formatMoneyAmount = (amount: number) => {
  return amount.toLocaleString('pl-PL')
}

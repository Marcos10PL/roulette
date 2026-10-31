export const cssVar = (token: string) => `var(${token})`

export const themeValue = (token: string) =>
  getComputedStyle(document.documentElement).getPropertyValue(token).trim()

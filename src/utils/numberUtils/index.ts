/**
 * 12 -> 1
 * 123 -> 10
 * 1234 -> 100
 */
export const calc10PerStep = (value?: number): number => {
  const v = Math.abs(value ?? 0)
  const digits = String(Math.floor(v / 10)).length
  return Math.pow(10, digits - 1)
}

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

/**
 * 指定の小数点以下桁数の精度で（指定桁で四捨五入）して、カンマ区切り数値を返す
 *
 * toLocaleStringFixed(1.1, 2) => "1.1"
 * toLocaleStringFixed(10.19, 2) => "10.2"
 * toLocaleStringFixed(10_000.123456789, 4) => "10,000.1235"
 */
export const toLocaleStringFixed = (v: number, scale = 0): string => {
  return v.toLocaleString(undefined, {
    maximumFractionDigits: scale,
    minimumFractionDigits: scale,
  })
}

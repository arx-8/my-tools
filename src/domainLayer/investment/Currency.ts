import { LabeledValue } from "src/types/utils"

/**
 * この App で使える通貨
 */
export const currencies = ["JPY", "USD"] as const

export type Currency = typeof currencies[number]

export const currencyLabelMap: Record<Currency, string> = {
  JPY: "￥",
  USD: "＄",
}

export const currenciesLabeled: LabeledValue<Currency>[] = currencies.map(
  (v) => ({
    label: currencyLabelMap[v],
    value: v,
  })
)

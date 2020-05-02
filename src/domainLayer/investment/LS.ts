import { LabeledValue } from "src/types/utils"

export const lsValues = ["L", "S"] as const

export type LS = typeof lsValues[number]

export const lsLabelMap: Record<LS, string> = {
  L: "買",
  S: "売",
}

export const lsValuesLabeled: LabeledValue<LS>[] = lsValues.map((v) => ({
  label: lsLabelMap[v],
  value: v,
}))

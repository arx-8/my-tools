import { createContext, useContext } from "react"
import { Provider } from "src/components/helpers/LeverageCalculatorContext/Provider"
import { JPY, Money } from "src/domainLayer/investment/Money"
import { CastAny } from "src/types/utils"
import { Brand } from "utility-types"

export type CalculatorRecordId = Brand<string, "CalculatorRecordId">

export type SortBy = {
  direction: "asc" | "desc"
  /** 今のところ他の列や複合でソートすることはない */
  target: "targetUnitPrice"
}

/**
 * 各計算機
 */
export type CalculatorRecord = {
  _id: CalculatorRecordId
  /** 価格比較用の価格 */
  comparePrices: number[]
  /** 価格比較の並び順 */
  comparePricesSortBy?: SortBy
  /** L or S */
  isLong: boolean
  /** レコード名 */
  name: string
  /** 発注数 */
  orderQuantity: number
  /** 対象単価 */
  targetUnitPrice: Money
}

type Value = {
  accountBalance: JPY
  addRecord: () => void
  fetchUsdJpy: () => Promise<void>
  isFetchingUsdJpy: boolean
  records: CalculatorRecord[]
  removeRecordById: (id: CalculatorRecordId) => void
  setAccountBalanceValue: (next: number) => void
  setRecordById: (
    id: CalculatorRecordId,
    producer: (draft: CalculatorRecord) => void
  ) => void
  setUsdJpy: (next: number) => void
  usdJpy: number
}

export const LeverageCalculatorContext = createContext<Value>(
  undefined as CastAny
)

export const useLeverageCalculator = (): Value =>
  useContext(LeverageCalculatorContext)

export const LeverageCalculatorProvider = Provider

import { createContext, useContext } from "react"
import { Provider } from "src/components/helpers/LeverageCalculatorContext/Provider"
import { JPY } from "src/domainLayer/investment/Money"
import { Order } from "src/domainLayer/investment/Order"
import { CastAny } from "src/types/utils"
import { SortDirection } from "src/utils/arrayUtils"
import { Brand } from "utility-types"

export type CalculatorRecordId = Brand<string, "CalculatorRecordId">

export type SortBy = {
  direction: SortDirection
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
  /**
   * 発注。
   * ナンピン計画のために配列。
   * 型で表現し切れていないが、必ず 1 要素以上あり、全ての currency が同じである。
   */
  orders: Order[]
  /**
   * 想定目標価格比較選択。
   * comparePrices が Array なので number 型 (= Array index)。
   * 複数の目標は選択できないため、単数。
   * 価格比較が空配列許可だがこの値は存在したままでも問題ないため、no-undefinedable
   */
  selectedComparePriceIndex: number
}

type Value = {
  accountBalance: JPY
  addRecord: () => void
  /**
   * 全合計証拠金残高
   */
  allTotalAccountBalanceWithTotalProfitOrLoss: number
  /**
   * 全注文合計レバレッジ
   */
  allTotalLeverage: number
  /**
   * 全合計価格比較損益
   */
  allTotalProfitOrLoss: number
  fetchUsdJpy: () => Promise<void>
  isFetchingUsdJpy: boolean
  records: CalculatorRecord[]
  removeRecordById: (id: CalculatorRecordId) => void
  resetRecordById: (id: CalculatorRecordId) => void
  setAccountBalanceValue: (next: number) => void
  setRecordById: (
    id: CalculatorRecordId
  ) => (producer: (draft: CalculatorRecord) => void) => void
  setUsdJpy: (next: number) => void
  usdJpy: number
}

export const LeverageCalculatorContext = createContext<Value>(
  undefined as CastAny
)

export const useLeverageCalculator = (): Value =>
  useContext(LeverageCalculatorContext)

export const LeverageCalculatorProvider = Provider

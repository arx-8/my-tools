import { createContext, useContext } from "react"
import { Provider } from "src/components/helpers/LeverageCalculatorContext/Provider"
import { Currency } from "src/domainLayer/investment/Currency"
import { Money } from "src/domainLayer/investment/Money"
import { CastAny } from "src/types/utils"
import { Brand } from "utility-types"

export type CalculatorRecordId = Brand<string, "CalculatorRecordId">

/**
 * 各計算機
 */
export type CalculatorRecord = {
  _id: CalculatorRecordId
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
  accountBalance: Money
  addRecord: () => void
  fetchUsdJpy: () => Promise<void>
  isFetchingUsdJpy: boolean
  records: CalculatorRecord[]
  removeRecordById: (id: CalculatorRecordId) => void
  setAccountBalanceCurrency: (next: Currency) => void
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

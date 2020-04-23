import produce from "immer"
import React, { useState } from "react"
import { useQuery } from "react-query"
import { useLocalStorage } from "react-use"
import {
  CalculatorRecord,
  CalculatorRecordId,
  LeverageCalculatorContext,
} from "src/components/helpers/LeverageCalculatorContext"
import { fetchLatest } from "src/dataLayer/exchangeRatesApi"
import {
  Money,
  setMoneyCurrency,
  setMoneyValue,
} from "src/domainLayer/investment/Money"
import { CastAny } from "src/types/utils"
import { ulid } from "ulid"

type Props = {
  children: React.ReactChild | React.ReactChild[]
}

const getDefaultRecord = (
  overwrite?: Partial<CalculatorRecord>
): CalculatorRecord => {
  return {
    _id: createCalculatorRecordId(),
    comparePrices: [0],
    isLong: true,
    name: "untitled",
    orderQuantity: 1,
    targetUnitPrice: {
      asUsd: 0,
      currency: "USD" as const,
    },
    ...overwrite,
  }
}

export const Provider: React.FC<Props> = ({ children }) => {
  // 証拠金残高
  const [accountBalance, setAccountBalance] = useLocalStorage<Money>(
    "useLeverageCalculator.accountBalance",
    {
      asJpy: 100_000,
      currency: "JPY",
    }
  )

  // usdJpy
  const [usdJpy, setUsdJpy] = useState<number>(100)

  // usdJpy 自動入力
  const { isFetching: isFetchingUsdJpy, refetch: refetchUsdJpy } = useQuery(
    "fetchLatestRates",
    () =>
      fetchLatest({
        base: "USD",
        symbols: ["JPY"],
      }),
    {
      cacheTime: 1 * 60 * 1_000,
    }
  )

  const [records, setRecords] = useLocalStorage<CalculatorRecord[]>(
    "useLeverageCalculator.records",
    [getDefaultRecord()]
  )

  return (
    <LeverageCalculatorContext.Provider
      value={{
        accountBalance,
        addRecord: () => {
          setRecords((prev) =>
            produce(prev, (draft) => {
              draft.push(
                getDefaultRecord({
                  name: `untitled ${prev.length + 1}`,
                })
              )
            })
          )
        },
        fetchUsdJpy: async () => {
          const resp = await refetchUsdJpy({ force: true })
          setUsdJpy(resp.rates.JPY)
        },
        isFetchingUsdJpy,
        records,
        removeRecordById: (id) => {
          setRecords((prev) =>
            prev.filter((r) => {
              return r._id !== id
            })
          )
        },
        setAccountBalanceCurrency: (currency) => {
          setAccountBalance((prev) => setMoneyCurrency(prev, currency))
        },
        setAccountBalanceValue: (value) => {
          setAccountBalance((prev) => setMoneyValue(prev, value))
        },
        setRecordById: (id, producer) => {
          setRecords((prev) =>
            produce(prev, (draft) => {
              const target = draft.find((r) => r._id === id)
              if (target == null) {
                throw new Error("Logic Failure!")
              }
              producer(target)
            })
          )
        },
        setUsdJpy,
        usdJpy,
      }}
    >
      {children}
    </LeverageCalculatorContext.Provider>
  )
}

const createCalculatorRecordId = (): CalculatorRecordId => {
  return ulid() as CastAny
}

import produce from "immer"
import React, { useEffect, useState } from "react"
import { useQuery } from "react-query"
import { useLocalStorage } from "react-use"
import {
  CalculatorRecord,
  CalculatorRecordId,
  LeverageCalculatorContext,
} from "src/components/helpers/LeverageCalculatorContext"
import { fetchLatest } from "src/dataLayer/exchangeRatesApi"
import { JPY } from "src/domainLayer/investment/Money"
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
    comparePricesSortBy: undefined,
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
  // 実装を簡単にするため、一旦 JPY 固定
  const [accountBalance, setAccountBalance] = useLocalStorage<JPY>(
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

  useEffect(() => {
    ;(async () => {
      const resp = await refetchUsdJpy({ force: true })
      setUsdJpy(resp.rates.JPY)
    })()
    // 初回 render のみでよい
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

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
        setAccountBalanceValue: (value) => {
          setAccountBalance((prev) => {
            return produce(prev, (draft) => {
              draft.asJpy = value
            })
          })
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

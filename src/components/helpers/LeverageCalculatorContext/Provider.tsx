import produce from "immer"
import React, { useEffect, useState } from "react"
import { useLocalStorage } from "react-use"
import {
  CalculatorRecord,
  CalculatorRecordId,
  LeverageCalculatorContext,
} from "src/components/helpers/LeverageCalculatorContext"
import { useFetch } from "src/components/helpers/useFetch"
import { APP_VER } from "src/constants/app"
import { fetchLatest } from "src/dataLayer/exchangeRatesApi"
import { JPY } from "src/domainLayer/investment/Money"
import { CastAny } from "src/types/utils"
import { ulid } from "ulid"

type Props = {
  children: React.ReactChild | React.ReactChild[]
}

const createCalculatorRecordId = (): CalculatorRecordId => {
  return ulid() as CastAny
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
    orders: [
      {
        orderQuantity: 1,
        targetUnitPrice: {
          asJpy: 0,
          currency: "JPY" as const,
        },
      },
    ],
    ...overwrite,
  }
}

export const Provider: React.FC<Props> = ({ children }) => {
  // 証拠金残高
  // 実装を簡単にするため、一旦 JPY 固定
  const [accountBalance, setAccountBalance] = useLocalStorage<JPY>(
    `${APP_VER}/useLeverageCalculator.accountBalance`,
    {
      asJpy: 100_000,
      currency: "JPY",
    }
  )

  // usdJpy
  const [usdJpy, setUsdJpy] = useState<number>(100)

  // usdJpy 自動入力
  const { isFetching: isFetchingUsdJpy, execFetch: fetchUsdJpy } = useFetch({
    cacheTime: 1 * 60 * 1_000,
    fetcher: () =>
      fetchLatest({
        base: "USD",
        symbols: ["JPY"],
      }),
  })

  const [records, setRecords] = useLocalStorage<CalculatorRecord[]>(
    `${APP_VER}/useLeverageCalculator.records`,
    [getDefaultRecord()]
  )

  useEffect(() => {
    ;(async () => {
      const resp = await fetchUsdJpy()
      if (resp) {
        setUsdJpy(resp.rates.JPY)
      }
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
          const resp = await fetchUsdJpy()
          if (resp) {
            setUsdJpy(resp.rates.JPY)
          }
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

/** @jsx jsx */
import { css, jsx } from "@emotion/core"
import {
  CircularProgress,
  FormControlLabel,
  Paper,
  Radio,
} from "@material-ui/core"
import Table from "@material-ui/core/Table"
import TableBody from "@material-ui/core/TableBody"
import TableCell from "@material-ui/core/TableCell"
import TableContainer from "@material-ui/core/TableContainer"
import TableRow from "@material-ui/core/TableRow"
import React, { useEffect, useMemo, useState } from "react"
import { useQuery } from "react-query"
import { useLocalStorage } from "react-use"
import { ButtonGA } from "src/components/atoms/ButtonGA"
import { FastNumberField } from "src/components/atoms/FastNumberField"
import { LabeledRow } from "src/components/molecules/LabeledRow"
import { LabeledRowWithRadios } from "src/components/molecules/LabeledRowWithRadios"
import { ComparePricesRow } from "src/components/pages/LeverageCalculator/ComparePricesRow"
import { Layout } from "src/components/templates/Layout"
import { fetchLatest } from "src/dataLayer/exchangeRatesApi"
import { LabeledValue } from "src/types/utils"
import { calc10PerStep } from "src/utils/numberUtils"

export type AvailableCurrency = "JPY" | "USD"

const availableCurrencies: LabeledValue<AvailableCurrency>[] = [
  {
    label: "￥",
    value: "JPY",
  },
  {
    label: "＄",
    value: "USD",
  },
]

type LS = "L" | "S"

const lsValues: LabeledValue<LS>[] = [
  {
    label: "買",
    value: "L",
  },
  {
    label: "売",
    value: "S",
  },
]

type Props = {
  children?: never
}

export const LeverageCalculator: React.FC<Props> = () => {
  // 証拠金残高
  const [accountBalance, setAccountBalance] = useLocalStorage<number>(
    "LeverageCalculator.accountBalance",
    100_000
  )
  const [accountBalanceCurrency, setAccountBalanceCurrency] = useLocalStorage<
    AvailableCurrency
  >("LeverageCalculator.accountBalanceCurrency", "JPY")

  // usdJpy
  const [usdJpy, setUsdJpy] = useState<number>(100)

  // 対象単価
  const [targetUnitPrice, setTargetUnitPrice] = useLocalStorage<number>(
    "LeverageCalculator.targetUnitPrice",
    0
  )
  const [targetUnitPriceCurrency, setTargetUnitPriceCurrency] = useLocalStorage<
    AvailableCurrency
  >("LeverageCalculator.targetUnitPriceCurrency", "JPY")

  // 発注数
  const [orderQuantity, setOrderQuantity] = useLocalStorage<number>(
    "LeverageCalculator.orderQuantity",
    0
  )

  // 売買
  const [lOrS, setLOrS] = useLocalStorage<LS>(
    "LeverageCalculator.lsForMinusLine",
    "L"
  )

  // レバレッジ
  // 全て JPY に寄せてから計算する
  const currentLeverage = useMemo(() => {
    const targetUnitPriceAsJpy =
      targetUnitPriceCurrency === "JPY"
        ? targetUnitPrice
        : targetUnitPrice * usdJpy
    const accountBalanceAsJpy =
      accountBalanceCurrency === "JPY"
        ? accountBalance
        : accountBalance * usdJpy
    return (targetUnitPriceAsJpy * orderQuantity) / accountBalanceAsJpy
  }, [
    accountBalance,
    accountBalanceCurrency,
    orderQuantity,
    targetUnitPrice,
    targetUnitPriceCurrency,
    usdJpy,
  ])

  // usdJpy 自動入力
  const { data, isFetching, refetch } = useQuery(
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
  useEffect(() => {
    if (data != null) {
      setUsdJpy(data.rates.JPY)
    }
  }, [data])

  return (
    <Layout>
      <TableContainer component={Paper}>
        <Table css={tableCss} size="small">
          <TableBody>
            <LabeledRowWithRadios
              checked={accountBalanceCurrency}
              label="証拠金残高"
              onCheckRadio={setAccountBalanceCurrency}
              radioValues={availableCurrencies}
            >
              <FastNumberField
                arrowInputStep={calc10PerStep(accountBalance)}
                onChangeValue={(v) => setAccountBalance(v ?? 0)}
                value={accountBalance}
              />
            </LabeledRowWithRadios>
            <TableRow>
              <TableCell css={col1}>USD/JPY</TableCell>
              <TableCell css={col2}>
                <FastNumberField
                  arrowInputStep={calc10PerStep(usdJpy)}
                  onChangeValue={(v) => setUsdJpy(v ?? 0)}
                  value={usdJpy}
                />
              </TableCell>
              <TableCell css={col3}>
                {isFetching ? (
                  <CircularProgress size={24} />
                ) : (
                  <ButtonGA
                    color="primary"
                    gaData={{
                      dataEventAction: "refetch usdJpy",
                      dataEventCategory: "LeverageCalculator",
                      dataOn: "click",
                    }}
                    onClick={() => refetch({ force: true })}
                    size="small"
                    variant="contained"
                  >
                    更新
                  </ButtonGA>
                )}
              </TableCell>
            </TableRow>
            <LabeledRowWithRadios
              checked={targetUnitPriceCurrency}
              label="対象単価"
              onCheckRadio={setTargetUnitPriceCurrency}
              radioValues={availableCurrencies}
            >
              <FastNumberField
                arrowInputStep={calc10PerStep(targetUnitPrice)}
                onChangeValue={(v) => setTargetUnitPrice(v ?? 0)}
                value={targetUnitPrice}
              />
            </LabeledRowWithRadios>
            <LabeledRow label="発注数">
              <FastNumberField
                arrowInputStep={calc10PerStep(orderQuantity)}
                onChangeValue={(v) => setOrderQuantity(v ?? 0)}
                value={orderQuantity}
              />
            </LabeledRow>
            <LabeledRow label="売買">
              <div css={radios}>
                {lsValues.map((v) => {
                  return (
                    <FormControlLabel
                      checked={v.value === lOrS}
                      control={<Radio color="primary" />}
                      key={v.value}
                      label={v.label}
                      onClick={() => setLOrS(v.value)}
                    />
                  )
                })}
              </div>
            </LabeledRow>
            <LabeledRow label="発注価格">
              <FastNumberField
                disabled
                onChangeValue={() => /** NOP */ undefined}
                value={targetUnitPrice * orderQuantity}
              />
            </LabeledRow>
            <LabeledRow label="レバレッジ">
              <FastNumberField
                disabled
                onChangeValue={() => /** NOP */ undefined}
                value={currentLeverage}
              />
            </LabeledRow>
          </TableBody>
        </Table>

        {/* 上の table の cell と同じ幅だとレイアウトの都合が悪いため、分ける */}
        <Table css={tableCss} size="small">
          <TableBody>
            <ComparePricesRow
              isLong={lOrS === "L"}
              label="価格比較"
              orderQuantity={orderQuantity}
              targetUnitPrice={targetUnitPrice}
              targetUnitPriceCurrency={targetUnitPriceCurrency}
              usdJpy={usdJpy}
            />
          </TableBody>
        </Table>
      </TableContainer>
    </Layout>
  )
}

const tableCss = css`
  max-width: 800px;
  table-layout: fixed;

  & td {
    border-bottom: 1px solid rgba(160, 160, 160, 1);
  }
`

const col1 = css`
  width: 88px;
`

const col2 = css`
  width: 128px;
`

const col3 = css`
  width: 88px;
`

const radios = css`
  display: flex;
`

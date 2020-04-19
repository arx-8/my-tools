/** @jsx jsx */
import { css, jsx } from "@emotion/core"
import { green, red } from "@material-ui/core/colors"
import Table from "@material-ui/core/Table"
import TableBody from "@material-ui/core/TableBody"
import TableCell from "@material-ui/core/TableCell"
import TableHead from "@material-ui/core/TableHead"
import TableRow from "@material-ui/core/TableRow"
import ClearIcon from "@material-ui/icons/Clear"
import produce from "immer"
import React, { useCallback } from "react"
import { useLocalStorage } from "react-use"
import { ButtonGA } from "src/components/atoms/ButtonGA"
import { FastNumberField } from "src/components/atoms/FastNumberField"
import { IconButtonGA } from "src/components/atoms/IconButtonGA"
import { AvailableCurrency } from "src/components/pages/LeverageCalculator"
import { monospaceFont } from "src/components/styles/styles"
import { calc10PerStep } from "src/utils/numberUtils"

type Props = {
  children?: never
  isLong: boolean
  label: string
  orderQuantity: number
  targetUnitPrice: number
  targetUnitPriceCurrency: AvailableCurrency
  usdJpy: number
}

export const ComparePricesRow: React.FC<Props> = ({
  isLong,
  label,
  orderQuantity,
  targetUnitPrice,
  targetUnitPriceCurrency,
  usdJpy,
}) => {
  const [prices, setPrices] = useLocalStorage<number[]>(
    "ComparePrices.prices",
    [0]
  )

  const onInsertOrUpdatePrices = (price?: number, index?: number): void => {
    setPrices((prev) => {
      return produce(prev, (draft) => {
        if (index == null) {
          draft.push(price ?? targetUnitPrice)
        } else {
          draft[index] = price ?? 0
        }
      })
    })
  }

  const calcProfitOrLossAsJpy = useCallback(
    (comparePrice: number): number => {
      const targetUnitPriceAsJpy =
        targetUnitPriceCurrency === "JPY"
          ? targetUnitPrice
          : targetUnitPrice * usdJpy
      const comparePriceAsJpy =
        targetUnitPriceCurrency === "JPY" ? comparePrice : comparePrice * usdJpy
      return isLong
        ? (comparePriceAsJpy - targetUnitPriceAsJpy) * orderQuantity
        : (targetUnitPriceAsJpy - comparePriceAsJpy) * orderQuantity
    },
    [isLong, orderQuantity, targetUnitPrice, targetUnitPriceCurrency, usdJpy]
  )

  return (
    <TableRow>
      <TableCell css={parentCol1}>{label}</TableCell>
      <TableCell>
        <ButtonGA
          gaData={{
            dataEventAction: "add compare price",
            dataEventCategory: "LeverageCalculator",
            dataOn: "click",
          }}
          onClick={() => onInsertOrUpdatePrices()}
          size="small"
          variant="contained"
        >
          追加
        </ButtonGA>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell css={col1}>対象単価</TableCell>
              <TableCell css={col2}>損益 (JPY)</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {prices.map((p, index) => {
              return (
                // eslint-disable-next-line react/no-array-index-key
                <TableRow key={index}>
                  {/* 対象単価 */}
                  <TableCell>
                    <FastNumberField
                      arrowInputStep={calc10PerStep(p)}
                      onChangeValue={(v) => {
                        onInsertOrUpdatePrices(v, index)
                      }}
                      value={p}
                    />
                  </TableCell>

                  {/* 損益 */}
                  <TableCell>
                    <ProfitOrLoss value={calcProfitOrLossAsJpy(p)} />
                  </TableCell>

                  {/* 操作 */}
                  <TableCell>
                    <IconButtonGA
                      disabled={prices.length <= 1}
                      gaData={{
                        dataEventAction: "delete compare price",
                        dataEventCategory: "LeverageCalculator",
                        dataOn: "click",
                      }}
                      onClick={() => {
                        setPrices((prev) => {
                          return prev.filter((_, prevI) => prevI !== index)
                        })
                      }}
                    >
                      <ClearIcon />
                    </IconButtonGA>
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </TableCell>
    </TableRow>
  )
}

const parentCol1 = css`
  width: 88px;
`

const col1 = css`
  width: 128px;
`

const col2 = css`
  width: 128px;
`

type InnerProps = {
  value: number
}

const ProfitOrLoss: React.FC<InnerProps> = ({ value }) => {
  return value < 0 ? (
    <span css={[monospaceFont, loss]}>{value.toLocaleString()}</span>
  ) : (
    <span css={[monospaceFont, profit]}>+{value.toLocaleString()}</span>
  )
}

const loss = css`
  color: ${red["800"]};
`

const profit = css`
  color: ${green["800"]};
`

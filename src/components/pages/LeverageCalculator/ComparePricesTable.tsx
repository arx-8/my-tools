/** @jsx jsx */
import { css, jsx } from "@emotion/core"
import { TableSortLabel } from "@material-ui/core"
import Table from "@material-ui/core/Table"
import TableBody from "@material-ui/core/TableBody"
import TableCell from "@material-ui/core/TableCell"
import TableHead from "@material-ui/core/TableHead"
import TableRow from "@material-ui/core/TableRow"
import ClearIcon from "@material-ui/icons/Clear"
import React from "react"
import { ButtonGA } from "src/components/atoms/ButtonGA"
import { FastNumberField } from "src/components/atoms/FastNumberField"
import { IconButtonGA } from "src/components/atoms/IconButtonGA"
import { PriceOrLoss, ProfitOrLoss } from "src/components/atoms/ProfitOrLoss"
import { useLeverageCalculator } from "src/components/helpers/LeverageCalculatorContext"
import {
  calcAccountBalanceWithProfitOrLoss,
  calcProfitOrLossAsJpy,
  getMoneyValue,
} from "src/domainLayer/investment/Money"
import { sortBy } from "src/utils/arrayUtils"
import { calc10PerStep } from "src/utils/numberUtils"

type Props = {
  children?: never
  recordIndex: number
}

export const ComparePricesTable: React.FC<Props> = ({ recordIndex }) => {
  const {
    accountBalance,
    records,
    setRecordById,
    usdJpy,
  } = useLeverageCalculator()

  const {
    _id,
    comparePrices,
    comparePricesSortBy,
    isLong,
    orderQuantity,
    targetUnitPrice,
  } = records[recordIndex]

  const toggleComparePricesSortBy = (): void => {
    setRecordById(_id, (draft) => {
      if (draft.comparePricesSortBy == null) {
        draft.comparePricesSortBy = {
          direction: "asc",
          target: "targetUnitPrice",
        }
        draft.comparePrices = sortBy(draft.comparePrices, "asc")
      } else {
        const nextDir =
          draft.comparePricesSortBy.direction === "asc" ? "desc" : "asc"
        draft.comparePricesSortBy = {
          direction: nextDir,
          target: draft.comparePricesSortBy.target,
        }
        draft.comparePrices = sortBy(draft.comparePrices, nextDir)
      }
    })
  }

  return (
    <Table size="small">
      <TableBody>
        <TableRow>
          <TableCell css={parentCol1}>価格比較</TableCell>
          <TableCell>
            <ButtonGA
              gaData={{
                dataEventAction: "add compare price",
                dataEventCategory: "LeverageCalculator",
                dataOn: "click",
              }}
              onClick={() =>
                setRecordById(_id, (draft) => {
                  // デフォルト値は、入力値の基準になるよう、対象単価と同値とする
                  draft.comparePrices.push(getMoneyValue(targetUnitPrice))
                })
              }
              size="small"
              variant="contained"
            >
              追加
            </ButtonGA>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell css={col1}>
                    <TableSortLabel
                      active={comparePricesSortBy?.target === "targetUnitPrice"}
                      direction={comparePricesSortBy?.direction}
                      onClick={toggleComparePricesSortBy}
                    >
                      対象単価 ({targetUnitPrice.currency})
                    </TableSortLabel>
                  </TableCell>
                  <TableCell css={col2}>損益 (JPY)</TableCell>
                  <TableCell css={col3}>証拠金残高 (JPY)</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {comparePrices.map((p, index) => {
                  return (
                    // eslint-disable-next-line react/no-array-index-key
                    <TableRow key={index}>
                      {/* 対象単価 */}
                      <TableCell>
                        <FastNumberField
                          arrowInputStep={calc10PerStep(p)}
                          onChangeValue={(v) => {
                            setRecordById(_id, (draft) => {
                              draft.comparePrices[index] = v ?? 0
                            })
                          }}
                          value={p}
                        />
                      </TableCell>

                      {/* 損益 */}
                      <TableCell>
                        <ProfitOrLoss
                          value={getMoneyValue(
                            calcProfitOrLossAsJpy(
                              p,
                              targetUnitPrice,
                              orderQuantity,
                              isLong,
                              usdJpy
                            )
                          )}
                        />
                      </TableCell>

                      {/* 証拠金残高 */}
                      <TableCell>
                        <PriceOrLoss
                          value={getMoneyValue(
                            calcAccountBalanceWithProfitOrLoss(
                              accountBalance,
                              calcProfitOrLossAsJpy(
                                p,
                                targetUnitPrice,
                                orderQuantity,
                                isLong,
                                usdJpy
                              )
                            )
                          )}
                        />
                      </TableCell>

                      {/* 操作 */}
                      <TableCell>
                        <IconButtonGA
                          disabled={comparePrices.length <= 1}
                          gaData={{
                            dataEventAction: "delete compare price",
                            dataEventCategory: "LeverageCalculator",
                            dataOn: "click",
                          }}
                          onClick={() => {
                            setRecordById(_id, (draft) => {
                              draft.comparePrices = draft.comparePrices.filter(
                                (_, draftIdx) => draftIdx !== index
                              )
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
      </TableBody>
    </Table>
  )
}

const parentCol1 = css`
  width: 88px;
`

const col1 = css`
  width: 144px;
`

const col2 = css`
  width: 112px;
`

const col3 = css`
  width: 112px;
`
